import { IQuery } from "./IQuery";
import { JSONValue } from "./Utils";
import { ArrayValidation, BooleanValidation, DateValidation, NumberValidation, StringValidation, Validation } from "./Validation";

export namespace formulairebleu {
  export interface IForm {
    version: '1';
    name: string;
    templates?: Record<string, IFormType>;
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
  export type IFormType = OneOf<FormPrimitives>['type'];

  export interface TypeBase<PrimType extends PrimitiveType> {
    label?: string;
    help?: string;
    mandatory?: boolean;
    readonly?: boolean;
    visibility?: IQuery;
    validations?: Validation[];
    templateString?: string;
    pageBreak?: boolean;
    selectionList?: ISelectionList
    view?: OneOf<GetFormViews<PrimType>>
  }


  export interface IArrayType extends TypeBase<'array'> {
    type: 'array';
    entryType: IFormType;
    primaryKeys?: string[];
    validations?: ArrayValidation[];
  }

  export interface IArrayViews {
  }

  export interface IBooleanType extends TypeBase<'boolean'> {
    type: 'boolean';
    defaultValue?: boolean;
    validations?: BooleanValidation[];
  }

  export interface IBooleanViews {
  }

  export interface IConstType extends TypeBase<'const'> {
    type: 'const';
    value: JSONValue;
    key?: undefined;
  }

  export interface IConstViews {
  }

  export interface IDateType extends TypeBase<'date'> {
    type: 'date';
  }

  export interface IDateViews {
  }

  export interface IDateTimeType extends TypeBase<'datetime'> {
    type: 'datetime';
  }

  export interface IDateTimeViews {
  }

  export interface INumberType extends TypeBase<'number'> {
    type: 'number',
    minValue?: number;
    maxValue?: number;
    decimals?: number;
    defaultValue?: number;
    validations?: NumberValidation[];
    view?: OneOf<INumberViews>
  }

  export interface INumberViews {
  }

  export interface IObjectType extends TypeBase<'object'> {
    type: 'object';
    membersTypes: IObjectMemberType[];
  }

  export interface IObjectViews {
  }

  export interface IStringType extends TypeBase<'string'> {
    type: 'string';
    defaultValue?: string;
    validations?: StringValidation[];
  }

  export interface IStringViews {
  }

  export interface ITimeType extends TypeBase<'time'> {
    type: 'time';
  }

  export interface ITimeViews {
  }


  export interface IVariantType extends TypeBase<'variant'> {
    type: 'variant';
    variants: IVariantMemberType[];
    defaultValue?: 'void';
  }

  export interface IVariantViews {
  }


  export interface IVoidType extends TypeBase<'void'> {
    type: 'void';
  }

  export interface IVoidViews {
  }

  // Tes autres types restent inchangés

  // export type PrimitiveType =
  //   | 'array'
  //   | 'boolean'
  //   | 'const'
  //   //    | 'date'
  //   //    | 'datetime'
  //   | 'number'
  //   | 'object'
  //   | 'string'
  //   | 'struct'
  //   //    | 'time'
  //   | 'variant'
  //   | 'void';


  // export interface DateObject {
  //   type: 'date' | 'time' | 'datetime';
  //   value: string | null;
  // }

  export type IVariantMemberType<TKind extends string = string, TType extends IFormType = IFormType> = { key: TKind, label?: string } & TType;

  export type IObjectMemberType = IKeyedMemberType | IConstType;
  export type IKeyedMemberType<TKey extends string = string, TType extends IFormType = IFormType> = {
    key: TKey
  } & TType;

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

  export type InferDataType<T extends IFormType> =
    T extends IForm ? InferDataType<T['dataType']>
    : T extends IBooleanType ? boolean
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
    M extends IKeyedMemberType<any, infer SubT>
    ? InferDataType<SubT>
    : never
  };

  type InferVariantMember<V extends IVariantMemberType> =
    V extends IVariantMemberType<infer K, infer FT>
    ? { key: K; data: InferDataType<FT> }
    : never;

  export type InferFormType<T extends IForm> = InferDataType<T['dataType']>

}