import { IArrayType, IObjectType, IBooleanType, INumberType, IStringType, IConstType, IFormType, IFormEngine, IVariantType, IVariantMemberType } from './ICoreForm';
import { Accessor, Setter, createSignal } from 'solid-js';
import { JSONObject, JSONValue } from './Utils';

export class Value<T = any> {
  readonly getValue: Accessor<T>;
  private readonly _setValue: Setter<T>;

  constructor(value: T) {
    [this.getValue, this._setValue] = createSignal<T>(value);
  }

  setValue(value: T) {
    this._setValue(value as any);
  }
}


export class Box<TInputType extends IFormType<TFormEngine> = IFormType, TFormEngine extends IFormEngine = IFormEngine, TJSONValue extends JSONValue | void = any> {
  readonly uniqueId: number;
  public pageNo = new Value<PageNo>({} as any);
  private _innerValue: Value<BoxInnerType<TFormEngine>>;
  private _type: Value<TInputType>;
  private _errors: Value<ErrorString[]>;

  constructor(
    readonly parent: Box<TInputType, TFormEngine> | null,
    readonly name: string,
    type: TInputType,
    value: JSONValue | Value<BoxInnerType<TFormEngine>>
  ) {
    this.uniqueId = Box.getUniqueId();
    this._type = new Value(type);
    this._errors = new Value<ErrorString[]>([]);
    if (value instanceof Value) {
      this._innerValue = value;
    } else {
      this._innerValue = new Value<BoxInnerType<TFormEngine>>(null);
      this.setJSONValue(value, false);
    }
  }

  errors() {
    return this._errors.getValue();
  }

  static getUniqueId(): number {
    return Math.floor(Math.random() * 1_000_000);
  }


  getType() {
    return this._type.getValue()
  }

  setType(type: TInputType) {
    this._type.setValue(type);
  }

  setValue(value: TJSONValue) {
    this.setJSONValue(value as JSONValue, true);
  }

  setJSONValue(value: JSONValue, validate: boolean): void {
    const type = this._type.getValue();
    let innerValue: BoxInnerType<TFormEngine>;

    switch (type.type) {
      case 'number':
        innerValue = value == null ? null : Number(value);
        if (typeof innerValue === 'number' && isNaN(innerValue)) innerValue = null;
        break;
      case 'boolean':
        innerValue = value == null ? null : Boolean(value);
        break;
      case 'string':
        innerValue = value == null ? '' : String(value);
        break;
      case 'array': {
        const entries = Array.isArray(value)
          ? value.map((v, i) => Box.enBox(this, `${this.name}#${i + 1}`, type.entryType, v))
          : [];
        innerValue = { type, entries };
        break;
      }
      case 'object': {
        const members: Box<any, TFormEngine>[] = [];
        const valueObj = value && typeof value === 'object' && !Array.isArray(value) ? value : undefined;
        for (const memberType of type.membersTypes) {
          if ('key' in memberType) {
            const memberValue = valueObj?.[memberType.key as any] ?? null;
            members.push(Box.enBox(this as any, memberType.key as any, memberType, memberValue) as any);
          }
        }
        innerValue = { type, members };
        break;
      }
      case 'const':
        innerValue = null;
        break;
      default:
        throw new Error(`Unsupported type: ${(type as any).type}`);
    }

    this._innerValue.setValue(innerValue);
    if (validate) this.validate();
  }

  getMembers(): Box[] {
    let value = this._innerValue.getValue();
    let result: JSONValue;
    if (value && typeof value === 'object' && value.type.type === 'object') {
      return (value as BoxInnerObject).members;
    }
    return [];
  }

  getVariants(): IVariantMemberType[] {
    let type = this._type.getValue() as unknown as IVariantType;
    if (type.type === "variant") {
      return type.variants;
    } else return [];
  }

  getInnerVariant(): BoxInnerVariant | undefined {
    if (this._type.getValue().type === "variant") {
      let value = this._innerValue.getValue();
      return (value as any as BoxInnerVariant) ;
    } else return undefined;
  }

  validate(): void {
    const type = this._type.getValue();
    const errors: ErrorString[] = [];
    const value = this.getJSONValue();

    // Add mandatory validation if not explicitly defined
    if (type.mandatory && !type.validations?.find(v => v.type === 'mandatory')) {
      type.validations?.push({ type: 'mandatory', message: `${this.name} is mandatory`, arg1: undefined } as any);
    }

    // Run all validations
    for (const validation of type.validations || []) {
      // Example validation logic
      if (validation.type === 'mandatory' && (value == null || value === '')) {
        errors.push(validation.message || `${this.name} is required.`);
      }
    }

    this._errors.setValue(errors);
  }

  getJSONValue(): JSONValue {
    const innerValue = this._innerValue.getValue();
    if (typeof innerValue === 'object' && innerValue?.type.type === 'array') {
      return (innerValue as BoxInnerArray<TFormEngine>).entries.map(entry => entry.getJSONValue());
    }
    return innerValue as JSONValue;
  }

  getEntries(): any[] {
    let value = this._innerValue.getValue();
    let result: JSONValue;
    if (value && typeof value === 'object' && value.type.type === 'array') {
      return (value as BoxInnerArray).entries;
    }
    return [];
  }

  setEntries(type: IArrayType, boxes: Box[]): void {
    this._innerValue.setValue({ type, entries: boxes } as any);
  }

  static enBox<TFormEngine extends IFormEngine>(
    parent: Box<any, TFormEngine> | null,
    name: string,
    type: IFormType<TFormEngine>,
    value: any
  ): Box<any, TFormEngine> {
    return new Box(parent, name, type, value);
  }
  public static unBox(value: Box): JSONValue {
    let val = value.getJSONValue();
    return val;
  }
}


// Supporting types
export type PageNo = {
  startPage: number;
  startLine: number;
  endPage: number;
  endLine: number;
};

export type BoxInnerArray<TFormEngine extends IFormEngine = IFormEngine> = { type: IArrayType<TFormEngine>; entries: Box<any, TFormEngine>[] };
export type BoxInnerObject<TFormEngine extends IFormEngine = IFormEngine> = { type: IObjectType<TFormEngine>; members: Box<any, TFormEngine>[] };
export type BoxInnerVariant = { type: IVariantType, member: IVariantMemberType, value: Box; };
export type BoxInnerType<TFormEngine extends IFormEngine = IFormEngine> =
  | null
  | number
  | string
  | boolean
  | BoxInnerArray<TFormEngine>
  | BoxInnerObject<TFormEngine>;

type ErrorString = string;

export type BooleanBox = Box<IBooleanType, IFormEngine, boolean | null>
export type NumberBox = Box<INumberType, IFormEngine, number | null>
export type StringBox = Box<IStringType, IFormEngine, string>
export type ArrayBox<T extends JSONValue = JSONValue> = Box<IArrayType, IFormEngine, T[]>
export type ObjectBox<T extends JSONObject = JSONObject> = Box<IObjectType, IFormEngine, T>
export type VariantBox<T extends JSONValue = JSONValue> = Box<any, IFormEngine, T>
export type ConstBox = Box<IConstType, IFormEngine, void>

export function getDefaultValue(type: IFormType): JSONValue {
  switch (type.type) {
    case 'boolean':
      return type.defaultValue ?? null;
    case 'string':
      return type.defaultValue ?? "";
    case 'number':
      return type.defaultValue ?? null;
    case 'array':
      return [];
    case 'object':
      const memberValues: JSONObject = {};
      type.membersTypes.forEach((t) => {
        if (t.type != 'const') memberValues[t.key] = getDefaultValue(t);
      });
      return memberValues;
  }
  return null;
}
