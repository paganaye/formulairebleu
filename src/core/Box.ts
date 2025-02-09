import { IArrayType, IBooleanType, IFormType, InferDataType, INumberType, IObjectType, IStringType, IVariantMemberType, IVariantType } from "./IForm";
import { computed, IValue, JSONObject, JSONValue, Observer, Value } from "./tiny-jsx";

type PageChanged = { repaginate?: boolean };

export abstract class Box<TFormType extends IFormType = IFormType, U = InferDataType<TFormType>> extends Value<U> {
  readonly uniqueId: number = Box.getUniqueId();
  readonly errors = new Value<ErrorString[]>([]);
  readonly pageNo = new Value<IPageNo>(undefined as any);
  #observers?: Set<Observer<any>>;
  // value: IValue<TFormType> = new Value<TFormType>(undefined)

  constructor(readonly parent: Box | null, readonly name: string, readonly type: TFormType) {
    super(undefined)
  }

  static lastBoxId: number = 0;
  static getUniqueId(): number {
    return ++(Box.lastBoxId);
  }

  //abstract getValue(): U;
  //abstract setValue(value: U, validate?: boolean): void;
  abstract getDefaultValue(): U;

  addObserver(observer: Observer<U>) {
    (this.#observers || (this.#observers = new Set())).add(observer);
  }

  notifyChildChanged(options: PageChanged = {}) {
    if (this.#observers) {
      let value = this.getValue();
      this.#observers.forEach(observer => observer(value));
    }
    this.parent?.notifyChildChanged(options);
  }

  validate(): void {
    const errors: ErrorString[] = [];
    const value = this.getValue();

    if (this.type.mandatory && !this.type.validations?.some(v => v.type === 'mandatory')) {
      this.type.validations?.push({ type: 'mandatory', message: `${this.name} is mandatory` } as any);
    }

    for (const validation of this.type.validations || []) {
      if (validation.type === 'mandatory' && (value == null || value === '')) {
        errors.push(validation.message || `${this.name} is required.`);
      }
    }

    this.errors.setValue(errors);
  }

  static enBox<TFormType extends IFormType = IFormType>(parent: Box | null, name: string, type: TFormType, value: JSONValue): Box {
    switch (type.type) {
      case 'number':
        return new NumberBox(parent, name, type, value);
      case 'boolean':
        return new BooleanBox(parent, name, type, value);
      case 'object':
        return new ObjectBox(parent, name, type as IObjectType, value as JSONObject);
      case 'array':
        return new ArrayBox(parent, name, type as IArrayType, value as JSONValue[]);
      case 'variant':
        return new VariantBox(parent, name, type as IVariantType, value);
      case 'string':
      default:
        return new StringBox(parent, name, type as any, value);
    }
  }

  static unBox<Q extends IFormType = IFormType>(box: Box<Q>): InferDataType<Q> {
    return box.getValue();
  }
}

export class StringBox extends Box<IStringType> {

  constructor(parent: Box | null, name: string, type: IStringType, value?: JSONValue) {
    super(parent, name, type);
    super.setValue(value == null ? this.getDefaultValue() : String(value));
  }



  setValue(value: JSONValue | undefined): void {
    super.setValue(value == null ? this.getDefaultValue() : String(value));
    this.validate();
    this.notifyChildChanged()
  }

  getDefaultValue() {
    return this.type.defaultValue ?? "";
  }
}

export class NumberBox extends Box<INumberType> {
  private $innerValue: IValue<number | null>;

  constructor(parent: Box | null, name: string, type: INumberType, value?: JSONValue) {
    super(parent, name, type);
    this.$innerValue = new Value<number | null>(value == null ? this.getDefaultValue() : Number(value));
  }

  getValue(): number | null {
    return this.$innerValue.getValue();
  }

  setValue(value: JSONValue | undefined): void {
    super.setValue(value == null ? this.getDefaultValue() : Number(value));
    this.validate();
    this.notifyChildChanged();
  }

  getDefaultValue() {
    return this.type.defaultValue ?? null;
  }
}

export class BooleanBox extends Box<IBooleanType> {
  private $innerValue: IValue<boolean>;

  constructor(parent: Box | null, name: string, type: IBooleanType, value?: JSONValue) {
    super(parent, name, type);
    this.$innerValue = new Value<boolean>(value == null ? this.getDefaultValue() : Boolean(value));
  }

  getValue(): boolean {
    return this.$innerValue.getValue();
  }

  setValue(value: JSONValue | undefined): void {
    this.$innerValue.setValue(value == null ? this.getDefaultValue() : Boolean(value));
    this.validate();
    this.notifyChildChanged();
  }

  getDefaultValue() {
    return this.type.defaultValue ?? false;
  }
}

export class ObjectBox extends Box<IObjectType> {
  readonly members: Box[];

  constructor(parent: Box | null, name: string, type: IObjectType, value?: JSONObject) {
    super(parent, name, type);
    this.members = type.membersTypes.map(t => Box.enBox(this, t.key, t, value?.[t.key] ?? this.getDefaultValue()[t.key]));
  }

  getValue(): JSONObject {
    return Object.fromEntries(this.members.map(member => [member.name, member.getValue()]));
  }

  setValue(value: JSONValue | undefined): void {
    if (typeof value === 'object' && value !== null) {
      this.members.forEach(member => member.setValue(value[member.name]));
      this.notifyChildChanged();
    }
    this.validate();
    super.notifyChildChanged()
  }

  getDefaultValue() {
    const defaultValues: JSONObject = {};
    this.type.membersTypes.forEach((t) => {
      if (t.type !== 'const') defaultValues[t.key] = Box.enBox(null, t.key, t, undefined).getDefaultValue();
    });
    return defaultValues;
  }

  getMembers() { return this.members; }

}

export class ArrayBox extends Box<IArrayType> {
  readonly $entryBoxes: IValue<Box<IArrayType['entryType']>[]> = new Value<Box[]>(this.getDefaultValue());

  constructor(parent: Box | null, name: string, type: IArrayType, value?: JSONValue[]) {
    super(parent, name, type);
    if (value !== undefined) super.setValue(value)
  }

  getValue(): JSONValue[] {
    return this.$entryBoxes.getValue().map(entry => entry.getValue());
  }

  setValue(value: JSONValue | undefined): void {
    if (Array.isArray(value)) {
      this.$entryBoxes.setValue(value.map((v, i) => Box.enBox(this, `${this.name}#${i}`, this.type.entryType, v)));
    }
    this.validate();
    this.notifyChildChanged({ repaginate: true });
  }

  getDefaultValue() {
    return [];
  }

}

export class VariantBox extends Box<IVariantType> {
  readonly key = new Value<string>(undefined);

  variantBox: IValue<Box>;

  constructor(parent: Box | null, name: string, type: IVariantType, value?: JSONValue) {
    super(parent, name, type);
    super.setValue(value as any);
    this.variantBox = computed({ key: this.key }, p => {
      let found = this.type.variants.find(v => v.key === this.key.getValue());
      if (!found) return undefined;
      return Box.enBox(this, this.name, found, this.getDefaultValue().value);
    });
    this.key.addObserver((_) => this.notifyChildChanged({ repaginate: true }))
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
    this.notifyChildChanged({ repaginate: true });
  }

  getDefaultValue() {
    return { key: this.type.variants[0].key, value: Box.enBox(null, this.name, this.type.variants[0], undefined).getDefaultValue() } as any;
  }

  getInnerVariant() { return this.variantBox; }

  getVariants() {
    return this.type.variants;
  }

}


// Supporting types
export interface IPageNo {
  startPage: number;
  startLine: number;
  endPage: number;
  endLine: number;
}

// export type BoxInnerArray = { type: IArrayType; entries: Box[] };
// export type BoxInnerObject = { type: IObjectType; members: Box[] };
// export type BoxInnerVariant = { type: IVariantType, key: string, value: Box; };
// export type BoxInnerValue = null
//   | number
//   | string
//   | boolean
//   | BoxInnerArray
//   | BoxInnerObject
//   | BoxInnerVariant;

type ErrorString = string;

// export function getDefaultValue(type: IFormType): JSONValue {
//   switch (type.type) {
//     case 'boolean':
//       return type.defaultValue ?? null;
//     case 'string':
//       return type.defaultValue ?? "";
//     case 'number':
//       return type.defaultValue ?? null;
//     case 'array':
//       return [];
//     case 'object':
//       const memberValues: JSONObject = {};
//       type.membersTypes.forEach((t) => {
//         if (t.type != 'const') memberValues[t.key] = getDefaultValue(t);
//       });
//       return memberValues;
//   }
//   return null;
// }
