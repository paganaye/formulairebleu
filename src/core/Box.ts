import { FormEngine } from "./FormEngine";
import { IArrayType, IBooleanType, IConstType, IFormType, InferDataType, INumberType, IObjectType, IStringType, ITemplatedType, IVariantType } from "./IForm";
import { ISetValueOptions, JSONObject, JSONValue, Observer, Observable, Variable, JSONArray } from "./tiny-jsx";
import { ErrorString } from "./Validation";

type ChildChangedEvent = { box: Box, pageChanged: boolean };

// A box contains 
//  - a form field type
//  - its JSON value
//  - validation errors
//  - page and line number
//  - children boxes (when the box is an object, an array or a Variant)
export abstract class Box<TFormType extends IFormType = any, U extends JSONValue = any> extends Observable<U> {
  readonly uniqueId: number = Box.getUniqueId();
  readonly type: Exclude<TFormType, ITemplatedType>
  readonly errors = new Variable<ErrorString[]>("boxErrors", []);
  readonly pageNo = new Variable<IPageNo>("boxPageNo", { startPage: 0, startLine: 0, endPage: 0, endLine: 0 });

  #childChangedObservers?: Set<Observer<ChildChangedEvent>>;

  constructor(readonly engine: FormEngine, readonly parent: Box | null, readonly name: string, type: TFormType) {
    super()
    let templateType = engine.templates && engine.templates[type.type];
    this.type = (templateType ?? type) as any;
  }


  abstract getValue(): U;


  abstract setValue(value: JSONValue | undefined, options: IBoxSetValueOptions): void;


  //abstract convert(value: JSONValue): U | null;

  //abstract sanitize()

  static lastBoxId: number = 0;
  static getUniqueId(): number {
    return ++(Box.lastBoxId);
  }

  addChildChangedObserver(observer: Observer<ChildChangedEvent>, immediate: boolean = false) {
    (this.#childChangedObservers || (this.#childChangedObservers = new Set())).add(observer);
    if (immediate) observer({ box: this, pageChanged: false });
  }

  notifyChildChanged(box: Box, pageChanged: boolean) {
    if (this.#childChangedObservers) {
      this.#childChangedObservers.forEach(observer => observer({ box, pageChanged }));
    }
    if (this.parent) {
      this.parent.notifyChildChanged(box, pageChanged);
    }
  }

  clearErrors() {
    this.errors.setValue([])
  }

  validate(value: any): void {
    const errors: ErrorString[] = [];
    this.engine.validate(this as any, value, this.type.validations, errors);
    this.errors.setValue(errors);
  }

  static enBox(engine: FormEngine, parent: Box | null, name: string, type: IFormType, value: JSONValue): Box {
    let newBox: Box;
    type = engine.getActualType(type)
    switch (type.type) {
      case 'number':
        newBox = new NumberBox(engine, parent, name, type as INumberType);
        if (value == undefined) value = (type as INumberType).defaultValue;
        break;
      case 'boolean':
        newBox = new BooleanBox(engine, parent, name, type as IBooleanType);
        if (value == undefined) value = (type as IBooleanType).defaultValue;
        break;
      case 'object':
        newBox = new ObjectBox(engine, parent, name, type as IObjectType);
        break;
      case 'array':
        newBox = new ArrayBox(engine, parent, name, type as IArrayType);
        break;
      case 'variant':
        newBox = new VariantBox(engine, parent, name, type as IVariantType);
        break;
      case 'string':
      case 'date':
      case 'time':
      case 'datetime':
        newBox = new StringBox(engine, parent, name, type as any);
        if (value == undefined) value = (type as IStringType).defaultValue;
        break;
      case 'const':
        newBox = new ConstBox(engine, parent, name, type as IConstType);
        break;
      default:
        throw new Error("Cannot box " + type.type)
    }
    newBox.setValue(value == undefined ? null : value, { notify: true, validate: true });
    return newBox;
  }



  paginate() {
    if (this.parent) this.parent.paginate();
    else this.engine.paginate(this);
  }

  static unBox<Q extends IFormType = any>(box: Box<Q>): InferDataType<Q> {
    return box.getValue();
  }

  getDefaultValue(): U {
    return this.engine.getTypeDefaultValue(this.type) as U;
  }
}

export interface IBoxSetValueOptions extends ISetValueOptions {
  validate: boolean
}


export class StringBox extends Box<IStringType> {
  private value: string | null;

  getValue() {
    return this.value;
  }

  setValue(newValue: JSONValue | undefined, options: IBoxSetValueOptions = { notify: true, validate: true }): void {
    if (!newValue || typeof newValue != 'string') newValue = null;
    if (newValue === this.value) return;
    this.value = newValue as string | null;
    this.notifyObservers(this.value)
    this.notifyChildChanged(this, false);
  }
}

export class ConstBox extends Box<IConstType> {
  getValue() {
    return this.type.value;
  }

  setValue(newValue: JSONValue | undefined, options: IBoxSetValueOptions = { notify: true, validate: true }): void {
    //ignored
  }
}

export class NumberBox extends Box<INumberType> {
  private value: number | null;

  getValue() {
    return this.value;
  }

  setValue(newValue: JSONValue | undefined, options: IBoxSetValueOptions): void {
    if (newValue == null || typeof newValue != 'number' || isNaN(this.value)) newValue = null;
    if (newValue === this.value) return;
    this.value = newValue as number | null;
    this.notifyObservers(this.value)
    this.notifyChildChanged(this, false);
  }

}

export class BooleanBox extends Box<IBooleanType> {
  private value: boolean | null;

  getValue() {
    return this.value;
  }

  setValue(newValue: JSONValue | undefined, options: IBoxSetValueOptions): void {
    if (newValue == null || typeof newValue != 'boolean') newValue = null;
    if (newValue === this.value) return;
    this.value = newValue as boolean | null;
    this.notifyObservers(this.value)
    this.notifyChildChanged(this, false);
  }
}

export class ObjectBox extends Box<IObjectType> {
  readonly value: JSONObject = {};
  readonly members: Box[];

  constructor(engine: FormEngine, parent: Box | null, name: string, type: IObjectType) {
    super(engine, parent, name, type);
    this.members = (type.membersTypes ?? []).map(t => {
      //let value = this._value;
      let memberBox = Box.enBox(engine, this, t.key, t, this.value?.[t.key])
      memberBox.addObserver(() => {
        let memberValue = memberBox.getValue();
        this.value[t.key] = memberValue;
        super.notifyChildChanged(this, false)
      })
      this.value[t.key] = memberBox.getValue();
      return memberBox;
    });
  }

  getValue() {
    return this.value;
  }

  setValue(value: JSONValue | undefined, options?: IBoxSetValueOptions): void {
    if (value && typeof value == 'object') {
      for (let member of this.members) {
        let childValue = value[member.type.key];
        member.setValue(childValue, { notify: true, validate: true })
      }
    }
  }

  getMembers() { return this.members; }
}

export class ArrayBox extends Box<IArrayType> {
  readonly value: JSONArray = [];
  readonly entryBoxes: Variable<Box<IArrayType['entryType']>[]> = new Variable<Box[]>("arrayBoxEntryBoxes", this.getDefaultValue());

  constructor(engine: FormEngine, parent: Box | null, name: string, type: IArrayType, value?: JSONValue[]) {
    super(engine, parent, name, type);
  }

  getValue(): JSONValue[] {
    let boxes = this.entryBoxes;
    return boxes ? boxes.getValue().map(entry => entry.getValue()) : [];
  }

  setValue(value: JSONValue | undefined, options?: IBoxSetValueOptions): void {
    if (!Array.isArray(value)) value = [];
    this.value.length = 0;
    this.value.push(...value);
    let newEntryBoxes = value.map((v, i) => Box.enBox(this.engine, this, `${this.name}#${i}`, this.type.entryType, v));
    this.entryBoxes.setValue(newEntryBoxes)
    this.notifyObservers(value)
    this.notifyChildChanged(this, true);
  }
}

export class ConstValue extends Observable {
  getValue() {
    return
  }
  setValue(newValue: any): void {
    console.error("We are setting ConstValue to ", newValue)
  }
  addObserver(_observer: Observer<any>): void { }
}

export class VariantBox extends Box<IVariantType> {
  private _value: any = this.type.flat ? null : { type: undefined, value: undefined };
  typeKey: Variable<string>;
  variantInnerBox: Variable<Box<IVariantType>>;

  constructor(engine: FormEngine, parent: Box | null, name: string, type: IVariantType, value?: JSONValue) {
    super(engine, parent, name, type);
    this.typeKey = new Variable<string>("variantKey", undefined)
    this.variantInnerBox = new Variable<Box<IVariantType>>("variantInnerBox");
    this.typeKey.addObserver((newKey) => {
      let found = this.type.variants.find(v => v.key === newKey) ?? this.type.variants[0];
      let defaultValue = found ? engine.getTypeDefaultValue(found) : undefined;
      let newBox = Box.enBox(this.engine, this, this.name, found, defaultValue);
      this.variantInnerBox.setValue(newBox);
      newBox.addObserver(() => {
        let key = this.typeKey.getValue();
        let value = newBox.getValue();
        if (!this.type.flat) {
          value = { type: key, value }
        } else if (this.type.determinant && key && value && typeof value === "object") {
          value[this.type.determinant] = key;
        }
        this.setValue(value, { notify: true, validate: false })
      }, true)
    }, true)
  }

  getValue() {
    return this._value;
  }

  setValue(value: JSONValue | undefined, options: IBoxSetValueOptions): void {
    let valueType: string;
    let valueValue: any;
    if (this.type.flat) {
      let type = Array.isArray(value) ? 'array' : value == null ? 'null' : typeof value


      let newKey = null;
      for (let t of this.type.variants) {        
        if (t.type === type) {
          if (type != 'object' || !this.type.determinant || value[this.type.determinant] == t.key) {
            newKey = t.key;
            break;
          }
        }
      }

      let currentKey = this.typeKey.getValue();
      if (newKey && (newKey != currentKey || value != this._value)) {
        this.typeKey.setValue(newKey);
        (this.variantInnerBox.getValue() as Box).setValue(value, { notify: true, validate: false });
        this._value = value;
        if (this.type.determinant) value[this.type.determinant] = newKey;
        this.notifyObservers(value)
      }

    } else {
      if (value && typeof value === 'object' && "type" in value) {
        valueType = (value as any).type;
        valueValue = (value as any).value;
      } else value = {}

      if (valueType != this._value.type || valueValue != this._value.value) {
        this.typeKey.setValue(valueType)
        this._value.type = valueType;
        (this.variantInnerBox.getValue() as Box).setValue(valueValue, { notify: true, validate: false });
        this._value.value = this.variantInnerBox.getValue().getValue();
        this.notifyObservers(value)
      }
    }
    this.notifyChildChanged(this, true);
  }

  getDefaultValue() {
    return { key: this.type.variants[0].key, value: Box.enBox(this.engine, null, this.name, this.type.variants[0], undefined).getDefaultValue() } as any;
  }


  getVariants() {
    return this.type.variants;
  }

  notifyChildChanged(box: Box, pageChanged: boolean) {
    super.notifyChildChanged(box, pageChanged);
  }
}

export interface IPageNo {
  startPage: number;
  startLine: number;
  endPage: number;
  endLine: number;
}

