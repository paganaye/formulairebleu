import { FormEngine } from "./FormEngine";
import { IArrayType, IBooleanType, IFormType, IKeyValue, InferDataType, INumberType, IObjectType, IStringType, ITemplatedType, IVariantMemberType, IVariantType } from "./IForm";
import { computed, ISetValueOptions, IValue, JSONObject, JSONValue, Observer, Value } from "./tiny-jsx";
import { ErrorString } from "./Validation";

type ChildChangedEvent = { box: Box, pageChanged: boolean };

// A box contains 
//  - a form field type
//  - its JSON value
//  - validation errors
//  - page and line number
//  - children boxes (when the box is an object, an array or a Variant)
export abstract class Box<TFormType extends IFormType = any, U extends JSONValue = any> extends Value<U> {
  readonly uniqueId: number = Box.getUniqueId();
  readonly type: Exclude<TFormType, ITemplatedType>
  readonly errors = new Value<ErrorString[]>("boxErrors", []);
  readonly pageNo = new Value<IPageNo>("boxPageNo", { startPage: 0, startLine: 0, endPage: 0, endLine: 0 });
  #childChangedObservers?: Set<Observer<ChildChangedEvent>>;

  constructor(readonly engine: FormEngine, readonly parent: Box | null, readonly name: string, type: TFormType) {
    super("box", undefined)
    let templateType = engine.templates && engine.templates[type.type];
    this.type = (templateType ?? type) as any;
  }

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

  validate(value: JSONValue): void {
    const errors: ErrorString[] = [];
    this.engine.validate(this as any, value, this.type.validations, errors);
    this.errors.setValue(errors);
  }

  static enBox(engine: FormEngine, parent: Box | null, name: string, type: IFormType, value: JSONValue): Box {
    type = engine.getActualType(type)
    switch (type.type) {
      case 'number':
        return new NumberBox(engine, parent, name, type as INumberType, value);
      case 'boolean':
        return new BooleanBox(engine, parent, name, type as IBooleanType, value);
      case 'object':
        return new ObjectBox(engine, parent, name, type as IObjectType, value as JSONObject);
      case 'array':
        return new ArrayBox(engine, parent, name, type as IArrayType, value as JSONValue[]);
      case 'variant':
        return new VariantBox(engine, parent, name, type as IVariantType, value);
      case 'string':
      default:
        return new StringBox(engine, parent, name, type as any, value);
    }
  }
  paginate() {
    if (this.parent) this.parent.paginate();
    else this.engine.paginate(this);
  }



  setValue(value: JSONValue, options?: IBoxSetValueOptions) {
    super.setValue(value as U, options)
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

  constructor(engine: FormEngine, parent: Box | null, name: string, type: IStringType, value?: JSONValue) {
    super(engine, parent, name, type);
    super.setValue(value == null ? this.getDefaultValue() : String(value));
  }

  setValue(value: JSONValue | undefined, options: IBoxSetValueOptions = { notify: true, validate: true }): void {
    if (options.validate) this.validate(value)
    super.setValue(value == null ? this.getDefaultValue() : String(value), options);
    this.notifyChildChanged(this, false);
  }
}

export class NumberBox extends Box<INumberType> {

  constructor(engine: FormEngine, parent: Box | null, name: string, type: INumberType, value?: JSONValue) {
    super(engine, parent, name, type);
    super.setValue(value == null ? this.getDefaultValue() : Number(value));
  }

  setValue(value: JSONValue | undefined, options?: IBoxSetValueOptions): void {
    super.setValue(value == null ? this.getDefaultValue() : Number(value), options);
  }
}

export class BooleanBox extends Box<IBooleanType> {

  constructor(engine: FormEngine, parent: Box | null, name: string, type: IBooleanType, value?: JSONValue) {
    super(engine, parent, name, type);
    super.setValue(value == null ? this.getDefaultValue() : Boolean(value));
  }

  setValue(value: JSONValue | undefined, options?: IBoxSetValueOptions): void {
    super.setValue(value == null ? this.getDefaultValue() : Boolean(value), options);
  }
}

export class ObjectBox extends Box<IObjectType> {
  readonly members: Box[];

  constructor(engine: FormEngine, parent: Box | null, name: string, type: IObjectType, value?: JSONObject) {
    super(engine, parent, name, type);
    this.members = type.membersTypes.map(t => Box.enBox(engine, this, t.key, t, value?.[t.key] ?? this.getDefaultValue()[t.key]));
  }

  getValue(): JSONObject {
    return Object.fromEntries(this.members.map(member => [member.name, member.getValue()]));
  }

  setValue(value: JSONValue | undefined): void {
    if (typeof value === 'object' && value !== null) {
      this.members.forEach(member => member.setValue(value[member.name]));
    }
    this.validate(value);
    super.notifyChildChanged(this, true)
  }

  getMembers() { return this.members; }
}

export class ArrayBox extends Box<IArrayType> {
  readonly entryBoxes: IValue<Box<IArrayType['entryType']>[]> = new Value<Box[]>("arrayBoxEntryBoxes", this.getDefaultValue());

  constructor(engine: FormEngine, parent: Box | null, name: string, type: IArrayType, value?: JSONValue[]) {
    super(engine, parent, name, type);
    if (value !== undefined) this.setValue(value)
  }

  getValue(): JSONValue[] {
    return this.entryBoxes.getValue().map(entry => entry.getValue());
  }

  setValue(value: JSONValue | undefined): void {
    if (Array.isArray(value)) {
      let newEntryBoxes = value.map((v, i) => Box.enBox(this.engine, this, `${this.name}#${i}`, this.type.entryType, v));
      this.entryBoxes.setValue(newEntryBoxes);
    }
    this.validate(value);
    this.notifyChildChanged(this, true);
  }
}

export class ConstValue extends Value {
  setValue(newValue: any): void {
    console.error("We are setting ConstValue to ", newValue)
  }
  addObserver(observer: Observer<any>): void { }
}

const nullValue = new ConstValue("null", null);

export class VariantBox extends Box<IVariantType> {
  key: Value<string>;
  variantInnerBox: Value<Box<IVariantType>>;

  constructor(engine: FormEngine, parent: Box | null, name: string, type: IVariantType, value?: JSONValue) {
    super(engine, parent, name, type);
    this.key = new Value<string>("variantKey", (value as any).key)
    this.variantInnerBox = new Value<Box<IVariantType>>("variantInnerBox");
    this.setValue(value as any);
    this.key.addObserver((newKey) => {
      this.setValue({ key: newKey, value: undefined })
    })
  }


  getValue() {
    let variantBox = this.variantInnerBox.getValue();
    let result = variantBox ? variantBox.getValue() : null;
    return result;
  }

  setValue(value: JSONValue | undefined, options?: IBoxSetValueOptions): void {

    if (value && typeof value === 'object' && "key" in value) {
      let valueKey = (value as any).key;
      let valueValue = (value as any).value;
      let found = this.type.variants.find(v => v.key === valueKey);
      if (found) {
        this.key.setValue(valueKey);
        this.variantInnerBox.setValue(Box.enBox(this.engine, this, this.name, found, valueValue ?? this.getDefaultValue().value));
        super.setValue({ key: valueKey, value: this.variantInnerBox.getValue() } as any, options)
        return
      }
    }
    if (this.key.getValue()) {
      this.key.setValue(undefined);
      this.variantInnerBox.setValue(this.engine.nullBox);
    }
    super.setValue(value, options);
  }

  getDefaultValue() {
    return { key: this.type.variants[0].key, value: Box.enBox(this.engine, null, this.name, this.type.variants[0], undefined).getDefaultValue() } as any;
  }

  getInnerVariant() { return this.variantInnerBox; }

  getVariants() {
    return this.type.variants;
  }

}

export interface IPageNo {
  startPage: number;
  startLine: number;
  endPage: number;
  endLine: number;
}

