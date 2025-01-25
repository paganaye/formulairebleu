import { IQuery } from "./IQuery";
import { JSONValue } from "./Utils";
import { ArrayValidation, BooleanValidation, DateValidation, NumberValidation, StringValidation, Validation } from "./Validation";

export interface ICoreForm<TFormEngine extends IFormViewEngine = IFormViewEngine> {
  version: '1';
  name: string;
  dataType: IFormType<TFormEngine>;
}

export interface IView {
  type: string;
}


export type IFormViewEngine = {
  array?: IView;
  boolean?: IView;
  const?: IView;
  date?: IView;
  number: IView;
  object?: IView;
  string: IView;
  variant?: IView;
  void?: IView;
  singleSelection?: IView;
  multipleSelection?: IView;
  knownObject?: IView
};


type TypeToView<TFormEngine extends IFormViewEngine, TType extends PrimitiveType> =
  TType extends 'array' ? TFormEngine['array']
  : TType extends 'boolean' ? TFormEngine['boolean']
  : TType extends 'const' ? TFormEngine['const']
  : TType extends 'date' ? TFormEngine['date']
  : TType extends 'number' ? TFormEngine['number']
  : TType extends 'object' ? TFormEngine['object']
  : TType extends 'string' ? TFormEngine['string']
  : TType extends 'variant' ? TFormEngine['variant']
  : TType extends 'void' ? TFormEngine['void']
  : never;

export type IFormType<TFormEngine extends IFormViewEngine = IFormViewEngine> =
  | IArrayType<TFormEngine>
  | IBooleanType<TFormEngine>
  | IConstType<TFormEngine>
  | IDateType<TFormEngine>
  | INumberType<TFormEngine>
  | IObjectType<TFormEngine>
  | IStringType<TFormEngine>
  | IVariantType<TFormEngine>
  | IVoidType<TFormEngine>
  | IKnownType<TFormEngine>;

interface DataTypeBase<TPrimitiveType extends PrimitiveType> {
  type: TPrimitiveType;
  label?: string;
  help?: string;
  mandatory?: boolean;
  readonly?: boolean;
  visibility?: IQuery;
  validations?: Validation[];
  templateString?: string;
  pageBreak?: boolean;
  selectionList?: ISelectionList
}

export interface IStringType<TFormEngine extends IFormViewEngine = IFormViewEngine> extends DataTypeBase<'string'> {
  defaultValue?: string;
  view?: TypeToView<TFormEngine, 'string'>;
  validations?: StringValidation[];
}

export interface INumberType<TFormEngine extends IFormViewEngine = IFormViewEngine> extends DataTypeBase<'number'> {
  minValue?: number;
  maxValue?: number;
  decimals?: number;
  defaultValue?: number;
  view?: TFormEngine['number'];
  validations?: NumberValidation[];
}

export interface IObjectType<TFormEngine extends IFormViewEngine = IFormViewEngine> extends DataTypeBase<'object'> {
  membersTypes: IObjectMemberType[];
  view?: TFormEngine['object'];
}


export interface IKnownType<TFormEngine extends IFormViewEngine = IFormViewEngine> extends DataTypeBase<KnownObject> {
  view?: TFormEngine['knownObject'];
}

export const DATE_OBJECT = Symbol("DATE_OBJECT")

export interface DateObject {
  type: typeof DATE_OBJECT;
  value: string | null;
}

export interface IDateType<TFormEngine extends IFormViewEngine = IFormViewEngine> extends DataTypeBase<'date'> {
  defaultValue?: string;
  view?: TFormEngine['date'];
  validations?: DateValidation[];
}

export interface IBooleanType<TFormEngine extends IFormViewEngine = IFormViewEngine> extends DataTypeBase<'boolean'> {
  defaultValue?: boolean;
  view?: TFormEngine['boolean'];
  validations?: BooleanValidation[];
}


export interface IVariantType<TFormEngine extends IFormViewEngine = IFormViewEngine> extends DataTypeBase<'variant'> {
  variants: IVariantMemberType[];
  view?: TFormEngine['variant'];
  defaultValue?: 'void';
}

export type IVariantMemberType<TKind extends string = string, TType extends IFormType = IFormType> = { key: TKind, label?: string } & TType;

export interface IArrayType<TFormEngine extends IFormViewEngine = IFormViewEngine> extends DataTypeBase<'array'> {
  entryType: IFormType<TFormEngine>;
  view?: TFormEngine['array'];
  primaryKeys?: string[];
  validations?: ArrayValidation[];
}

export interface IVoidType<TFormEngine extends IFormViewEngine = IFormViewEngine> extends DataTypeBase<'void'> {
  view?: TFormEngine['void'];
}


export type IObjectMemberType = IKeyedMemberType | IConstType;
export type IKeyedMemberType<TKey extends string = string, TType extends IFormType<IFormViewEngine> = IFormType<IFormViewEngine>> = { key: TKey } & TType;

export interface IConstType<TFormEngine extends IFormViewEngine = IFormViewEngine> extends DataTypeBase<'const'> {
  value: string;
  key?: undefined;
  view?: TFormEngine['const'];
}


export type PrimitiveType =
  | 'array'
  | 'boolean'
  | 'const'
  | 'number'
  | 'object'
  | 'string'
  | 'variant'
  | 'void'
  | KnownObject;

export type KnownObject =
  | 'date'
  | 'time'
  | 'datetime';


export type ISelectionEntry = {
  value: JSONValue;
  label?: string;
}

export type ISelectionList = {
  multiple?: boolean;
  entries: ISelectionEntry[] | IDynamicSelection;
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


