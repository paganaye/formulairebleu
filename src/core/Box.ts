import { FormEngine } from "./FormEngine";
import { IArrayType, IBooleanType, IFormType, InferDataType, INumberType, IObjectType, IStringType, IVariantMemberType, IVariantType } from "./IForm";
import { computed, IValue, JSONObject, JSONValue, Observer, Value } from "./tiny-jsx";
import { ErrorString } from "./Validation";

type ChildChangedEvent = { box: Box };

export abstract class Box<TFormType extends IFormType = IFormType, U = InferDataType<TFormType>> extends Value<U> {
  readonly uniqueId: number = Box.getUniqueId();
  readonly errors = new Value<ErrorString[]>([]);
  readonly pageNo = new Value<IPageNo>({ startPage: 0, startLine: 0, endPage: 0, endLine: 0 });
  #childChangedObservers?: Set<Observer<ChildChangedEvent>>;
  // value: IValue<TFormType> = new Value<TFormType>(undefined)

  constructor(readonly engine: FormEngine, readonly parent: Box | null, readonly name: string, readonly type: TFormType) {
    super(undefined)
  }

  static lastBoxId: number = 0;
  static getUniqueId(): number {
    return ++(Box.lastBoxId);
  }

  abstract getDefaultValue(): U;

  addChildChangedObserver(observer: Observer<ChildChangedEvent>) {
    (this.#childChangedObservers || (this.#childChangedObservers = new Set())).add(observer);
  }

  notifyChildChanged(box: Box) {
    if (this.#childChangedObservers) {
      this.#childChangedObservers.forEach(observer => observer({ box }));
    }
    this.parent?.notifyChildChanged(box);
  }

  validate(): void {
    const errors: ErrorString[] = [];
    this.engine.validate(this as any, this.type.validations, errors);
    this.errors.setValue(errors);
  }

  static enBox<TFormType extends IFormType = IFormType>(engine: FormEngine, parent: Box | null, name: string, type: TFormType, value: JSONValue): Box {
    switch (type.type) {
      case 'number':
        return new NumberBox(engine, parent, name, type, value);
      case 'boolean':
        return new BooleanBox(engine, parent, name, type, value);
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

  static unBox<Q extends IFormType = IFormType>(box: Box<Q>): InferDataType<Q> {
    return box.getValue();
  }
}

export class StringBox extends Box<IStringType> {

  constructor(engine: FormEngine, parent: Box | null, name: string, type: IStringType, value?: JSONValue) {
    super(engine, parent, name, type);
    super.setValue(value == null ? this.getDefaultValue() : String(value));
  }

  setValue(value: JSONValue | undefined): void {
    super.setValue(value == null ? this.getDefaultValue() : String(value));
    this.validate();
    this.notifyChildChanged(this)
  }

  getDefaultValue() {
    return this.type.defaultValue ?? "";
  }
}

export class NumberBox extends Box<INumberType> {

  constructor(engine: FormEngine, parent: Box | null, name: string, type: INumberType, value?: JSONValue) {
    super(engine, parent, name, type);
    super.setValue(value == null ? this.getDefaultValue() : Number(value));
  }

  setValue(value: JSONValue | undefined): void {
    super.setValue(value == null ? this.getDefaultValue() : Number(value));
    this.validate();
    this.notifyChildChanged(this);
  }

  getDefaultValue() {
    return this.type.defaultValue ?? null;
  }
}

export class BooleanBox extends Box<IBooleanType> {

  constructor(engine: FormEngine, parent: Box | null, name: string, type: IBooleanType, value?: JSONValue) {
    super(engine, parent, name, type);
    super.setValue(value == null ? this.getDefaultValue() : Boolean(value));
  }

  setValue(value: JSONValue | undefined): void {
    super.setValue(value == null ? this.getDefaultValue() : Boolean(value));
    this.validate();
    this.notifyChildChanged(this);
  }

  getDefaultValue() {
    return this.type.defaultValue ?? false;
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
    this.validate();
    super.notifyChildChanged(this)
  }

  getDefaultValue() {
    const defaultValues: JSONObject = {};
    this.type.membersTypes.forEach((t) => {
      if (t.type !== 'const') defaultValues[t.key] = Box.enBox(this.engine, null, t.key, t, undefined).getDefaultValue();
    });
    return defaultValues;
  }

  getMembers() { return this.members; }

}

export class ArrayBox extends Box<IArrayType> {
  readonly $entryBoxes: IValue<Box<IArrayType['entryType']>[]> = new Value<Box[]>(this.getDefaultValue());

  constructor(engine: FormEngine, parent: Box | null, name: string, type: IArrayType, value?: JSONValue[]) {
    super(engine, parent, name, type);
    if (value !== undefined) this.setValue(value)
  }

  getValue(): JSONValue[] {
    return this.$entryBoxes.getValue().map(entry => entry.getValue());
  }

  setValue(value: JSONValue | undefined): void {
    if (Array.isArray(value)) {
      this.$entryBoxes.setValue(value.map((v, i) => Box.enBox(this.engine, this, `${this.name}#${i}`, this.type.entryType, v)));
    }
    this.validate();
    this.notifyChildChanged(this);
  }

  getDefaultValue() {
    return [];
  }

}

export class VariantBox extends Box<IVariantType> {
  readonly key = new Value<string>(undefined);
  variantBox: IValue<Box>;

  constructor(engine: FormEngine, parent: Box | null, name: string, type: IVariantType, value?: JSONValue) {
    super(engine, parent, name, type);
    super.setValue(value as any);
    this.variantBox = computed({ key: this.key }, p => {
      let found = this.type.variants.find(v => v.key === this.key.getValue());
      if (!found) return undefined;
      return Box.enBox(engine, this, this.name, found, this.getDefaultValue().value);
    });
    this.key.addObserver((_) => this.notifyChildChanged(this))
  }

  getValue() {
    let variantBox = this.variantBox.getValue();
    let result = { key: this.key.getValue(), value: variantBox?.getValue() as any };
    return result;
  }

  setValue(value: JSONValue | undefined): void {
    if (value && typeof value === 'object' && "key" in value) {
      this.key.setValue(String(value.key));
      let valueValue = (value as any).value;
      // if (valueValue !== undefined) this.variantBox.setValue(valueValue);
    } else {
      this.key.setValue(this.getDefaultValue().key);
    }
    this.notifyChildChanged(this);
  }

  getDefaultValue() {
    return { key: this.type.variants[0].key, value: Box.enBox(this.engine, null, this.name, this.type.variants[0], undefined).getDefaultValue() } as any;
  }

  getInnerVariant() { return this.variantBox; }

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

