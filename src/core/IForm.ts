import { IQuery } from "./IQuery";
import { JSONValue } from "./tiny-jsx";
import { ArrayValidations, BooleanValidations, ConstValidations, DatetimeValidations, DateValidations, NumberValidations, ObjectValidations, StringValidations, TimeValidations, VariantValidations, VoidValidations } from "./Validation";

export interface IForm {
  version: '1';
  name: string;
  templates?: Record<TemplateName, IFormType>;
  dataType: IFormType;
}

export interface IView {
  type: string;
}

export interface FormPrimitives {
  array: { type: IArrayType, views: IArrayViews };
  boolean: { type: IBooleanType, views: IBooleanViews };
  const: { type: IConstType, views: IConstViews };
  date: { type: IDateType, views: IDateTimeViews };
  datetime: { type: IDateTimeType, views: IDateTimeViews };
  number: { type: INumberType, views: INumberViews };
  object: { type: IObjectType, views: IObjectViews };
  string: { type: IStringType, views: IStringViews };
  time: { type: ITimeType, views: IDateTimeViews };
  variant: { type: IVariantType, views: IVariantViews };
  void: { type: IVoidType, views: IVoidViews };
}

type PrimitiveType = keyof FormPrimitives;
type OneOf<T> = T[keyof T];

export type GetFormViews<T extends PrimitiveType = any> = FormPrimitives[T]['views']
export type GetFormType<T extends PrimitiveType = any> = FormPrimitives[T]['type']
export type IFormType = IStringType | INumberType | IBooleanType | IObjectType | IArrayType | IConstType | IDateType | IDateTimeType | ITimeType | IVariantType | IVoidType | ITemplatedType | INullType;

interface TypeBase {
  label?: string;
  help?: string;
  mandatory?: boolean;
  readonly?: boolean;
  visibility?: IQuery;
  templateString?: string;
  pageBreak?: boolean;
  optional?: boolean
}

export type TemplateName = `${Uppercase<string>}${string}`;

export interface ITemplatedType {
  type: TemplateName;
  view?: undefined;
  label?: undefined;
}

export interface IArrayType extends TypeBase {
  type: 'array';
  entryType: IFormType;
  primaryKeys?: string[];
  view?: OneOf<IArrayViews>
  validations?: ArrayValidations;
}


export interface IArrayViews {
}

export interface IBooleanType extends TypeBase {
  type: 'boolean';
  defaultValue?: boolean;
  view?: OneOf<IBooleanViews>
  validations?: BooleanValidations;
}

export interface IBooleanViews {
  selectionList: { type: 'select', selectionList: ISelectionList<boolean> }
}

export interface IConstType extends TypeBase {
  type: 'const';
  value: JSONValue;
  key?: undefined;
  view?: OneOf<IConstViews>
  validations?: ConstValidations;
}

export interface IConstViews {
}

export interface IDateType extends TypeBase {
  type: 'date';
  view?: OneOf<IDateViews>
  validations?: DateValidations;
}

export interface IDateViews {
}

export interface IDateTimeType extends TypeBase {
  type: 'datetime';
  view?: OneOf<IDateTimeViews>
  validations?: DatetimeValidations;
}

export interface IDateTimeViews {
}

export interface INumberType extends TypeBase {
  type: 'number',
  minValue?: number;
  maxValue?: number;
  decimals?: number;
  defaultValue?: number;
  view?: OneOf<INumberViews>
  validations?: NumberValidations;
}

export interface INumberViews {
  selectionList: { type: 'select', selectionList: ISelectionList<number> }
}

export interface IObjectType extends TypeBase {
  type: 'object';
  membersTypes: IObjectMemberType[];
  view?: OneOf<IObjectViews>
  validations?: ObjectValidations;
}

export interface IObjectViews {
  default: { type: 'flow' }
}

export interface IStringType extends TypeBase {
  type: 'string';
  defaultValue?: string;
  view?: OneOf<IStringViews>
  validations?: StringValidations;
}

export interface IStringViews {
  selectionList: { type: 'select', selectionList: ISelectionList<string> }
  default: { type: 'string' }
}

export interface ITimeType extends TypeBase {
  type: 'time';
  view?: OneOf<ITimeViews>
  validations?: TimeValidations;
}

export interface ITimeViews {
}


export interface IKeyValue<TKey extends string, T> {
  key: TKey;
  value: T
}

export interface IVariantType extends TypeBase {
  type: 'variant';
  defaultValue?: 'void';
  view?: OneOf<IVariantViews>
  validations?: VariantValidations;
  variants: IVariantMemberType[];
  determinant?: string;
  flat?: boolean;
  // booleanType?: IBooleanType;
  // stringType?: IStringType;
  // numberType?: IBooleanType;
  // arrayType?: IArrayType;
}

export type IVariantMemberType<TKind extends string = string, TType extends IObjectType = any> = { key: TKind, label?: string } & TType;




export interface IVariantViews {
}

export interface INullType extends TypeBase {
  type: 'null';
  view?: OneOf<INullViews>
  validations?: undefined;
}

export interface INullViews {
}

export interface IVoidType extends TypeBase {
  type: 'void';
  view?: OneOf<IVoidViews>
  validations?: VoidValidations;
}

export interface IVoidViews {
}


export type IObjectMemberType = IKeyedMemberType | IConstType;
export type IKeyedMemberType<TType extends IFormType = any> = {
  key: string
} & TType;

export type ISelectionEntry<T extends JSONValue = string> = {
  value: JSONValue;
  label?: string;
}

export type ISelectionList<T extends JSONValue> = {
  multiple?: boolean;
  entries: ISelectionEntry<T>[] | IDynamicSelection;
};

export interface IDynamicSelection {
  type: 'dynamic-selection';
  path: string;
  columns?: ISelectionColumn[];
}

export interface ISelectionColumn {
  key: string;
  label?: string;
  width?: number;
}


export type InferDataType<T extends IFormType> =
  T extends IBooleanType ? boolean
  : T extends INumberType ? number
  : T extends IStringType ? string
  : T extends IConstType ? T['value']
  : T extends IDateType | IDateTimeType | ITimeType ? string
  : T extends IArrayType ? InferDataType<T['entryType']>[]
  : T extends IObjectType ? InferObjectMember<T['membersTypes']>
  : T extends IVariantType ? InferVariantMember<T['variants'][number]>
  : T extends IVoidType ? undefined
  : never;

type InferObjectMember<T extends IObjectMemberType[]> = {
  [M in T[number]as M extends IKeyedMemberType<infer K> ? K : never]:
  M extends IKeyedMemberType<infer SubT>
  ? InferDataType<SubT>
  : never
};

type InferVariantMember<V extends IVariantMemberType> =
  V extends IVariantMemberType<infer K, infer FT>
  ? IKeyValue<K, InferDataType<FT>>
  : never;

export type InferFormType<T extends IForm> = InferDataType<T['dataType']>

