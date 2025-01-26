import { IArrayType, IObjectType, IFormType, IFormViewEngine, IVariantType, IVariantMemberType, IObjectMemberType, IBooleanType, IConstType, IDateType, INumberType, IStringType, IVoidType, IKeyedMemberType } from './ICoreForm';
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

export class FormContext {
  templates: Record<string, IFormType>;
  isReadonly: boolean = false;
  readonly pageNo = new Value(0);
  readonly pageCount = new Value(1);

  constructor(templates: Record<string, IFormType>) {
    this.templates = templates;
  }

  getActualType(type: IFormType): IFormType {
    let viewType = type?.view?.type;
    let templateType: IFormType | undefined;
    if (viewType) templateType = this.templates[viewType];
    if (!templateType) {
      let typeType = type?.type;
      templateType = this.templates[typeType];
    }
    return templateType ?? type;
  }

  paginate(rootBox: Box) {
    let pageNo = 1;
    let lineNo = 0

    let recurse = (box: Box) => {
      let originalType = box.getType();
      let actualType = this.getActualType(originalType)
      if (originalType.pageBreak || actualType.pageBreak) {
        pageNo += 1;
        lineNo = 0;
      }
      lineNo += 1;
      let startPage = pageNo;
      let startLine = lineNo;

      let typeType = actualType.type;
      switch (typeType) {
        case 'array':
          let entries = box.getEntries()
          for (let e of entries) {
            recurse(e)
          }
          break;
        case 'object':
          let members = box.getMembers()
          for (let m of members) {
            recurse(m)
          }
          break;
        case 'variant':
          let variant = box.getInnerVariant();
          recurse(variant.value)
          break;
        case 'boolean':
        case 'const':
        case 'date':
        case 'datetime':
        case 'number':
        case 'string':
        case 'time':
          break;
        case 'void':
          break;
        default: {
          //
        }
      }
      box.pageNo.setValue({
        startPage,
        startLine,
        endPage: pageNo,
        endLine: lineNo
      })
    }

    recurse(rootBox)
    this.pageCount.setValue(pageNo);
  }


}


export class Box {
  readonly uniqueId: number;
  public pageNo = new Value<IPageNo>(undefined);
  private _innerValue: Value<BoxInnerValue>;
  private _type: Value<IFormType>;
  private _errors: Value<ErrorString[]>;

  constructor(
    readonly parent: Box | null,
    readonly name: string,
    type: IFormType,
    value: JSONValue | Value<BoxInnerValue>
  ) {
    this.uniqueId = Box.getUniqueId();
    this._type = new Value(type);
    this._errors = new Value<ErrorString[]>([]);
    if (value instanceof Value) {
      this._innerValue = value;
    } else {
      this._innerValue = new Value<BoxInnerValue>(null);
      this.setJSONValue(value, false);
    }
  }

  errors() {
    return this._errors.getValue();
  }

  static lastBoxId: number = 0;

  static getUniqueId(): number {
    Box.lastBoxId += 1;
    return Box.lastBoxId;
  }


  getType() {
    return this._type.getValue()
  }

  setType(type: IFormType) {
    this._type.setValue(type);
  }

  setValue(value: JSONValue) {
    this.setJSONValue(value as JSONValue, true);
  }

  setJSONValue(value: JSONValue | undefined, validate: boolean): void {
    const type = this._type.getValue();
    let innerValue: BoxInnerValue;
    if (value === undefined && "defaultValue" in type) {
      value = type.defaultValue;
    }

    let newBoxes = (membersTypes: IObjectMemberType[]) => {
      let members: Box[] = [];
      const valueObj = value && typeof value === 'object' && !Array.isArray(value) ? value : undefined;
      for (const memberType of membersTypes) {
        if ('key' in memberType) {
          const memberValue = valueObj?.[memberType.key as any];
          members.push(Box.enBox(this as any, memberType.key as any, memberType, memberValue) as any);
        }
      }
      return members;
    }

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
      case 'const':
        innerValue = null;
        break;
      case 'object':
        {
          const members = newBoxes(type.membersTypes);
          innerValue = { type, members };
          break;
        }

      case 'variant':
        {
          const variants = type.variants;
          let variantKey = (value && typeof value === 'object' && "key" in value) ? value.key : undefined;
          let variantType = variants.find(v => v.key === variantKey);
          if (!variantType) {
            value = null;
            variantType = variants[0] ?? { key: 'empty', type: 'void' };
          }
          innerValue = {
            type: type,
            key: String(variantKey),
            value: Box.enBox(this, this.name, variantType!, value)
          }
          break;
        }
      case 'void':
        return

      default:
        // case 'date':
        {
          innerValue = value as any;
          break;
        }
    }

    this._innerValue.setValue(innerValue);
    if (validate) this.validate();


  }

  getMembers(): Box[] {
    let value = this._innerValue.getValue();
    //let result: JSONValue;
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

  setVariantKey(key: string) {
    let type = this._type.getValue() as unknown as IVariantType;
    if (type.type === "variant") {
      let variantType = type.variants.find(t => t.key == key);
      if (variantType) {
        this._innerValue.setValue({
          type: type,
          key,
          value: Box.enBox(this, this.name, variantType, undefined)
        });
      }
    }
  }

  getInnerVariant(): BoxInnerVariant | undefined {
    if (this._type.getValue().type === "variant") {
      let value = this._innerValue.getValue();
      return (value as any as BoxInnerVariant);
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
      return (innerValue as BoxInnerArray).entries.map(entry => entry.getJSONValue());
    }
    return innerValue as JSONValue;
  }

  getEntries(): any[] {
    let value = this._innerValue.getValue();
    if (value && typeof value === 'object' && value.type.type === 'array') {
      return (value as BoxInnerArray).entries;
    }
    return [];
  }

  setEntries(type: IArrayType, boxes: Box[]): void {
    this._innerValue.setValue({ type, entries: boxes } as any);
  }

  static enBox<TFormEngine extends IFormViewEngine>(
    parent: Box | null,
    name: string,
    type: IFormType<TFormEngine>,
    value: any
  ): Box {
    return new Box(parent, name, type, value);
  }
  public static unBox(value: Box): JSONValue {
    let val = value.getJSONValue();
    return val;
  }

}

// Supporting types
export interface IPageNo {
  startPage: number;
  startLine: number;
  endPage: number;
  endLine: number;
}

export type BoxInnerArray = { type: IArrayType; entries: Box[] };
export type BoxInnerObject = { type: IObjectType; members: Box[] };
export type BoxInnerVariant = { type: IVariantType, key: string, value: Box; };
export type BoxInnerValue = null
  | number
  | string
  | boolean
  | BoxInnerArray
  | BoxInnerObject
  | BoxInnerVariant;

type ErrorString = string;

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
