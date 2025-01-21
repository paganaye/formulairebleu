export interface ICoreForm<TFormEngine extends IFormEngine = IFormEngine> {
  version: '1';
  name: string;
  dataType: IFormType<TFormEngine>;
}

export interface IViewAs {
  type: string;
}

export type IFormEngine = {
  string: IViewAs;
  number: IViewAs;
  boolean?: IViewAs;
  object?: IViewAs;
  array?: IViewAs;
  variant?: IViewAs;
  const?: IViewAs;
  void?: IViewAs;
  singleSelection?: IViewAs;
  multipleSelection?: IViewAs;
};

export type IFormType<TFormEngine extends IFormEngine = IFormEngine> =
  | IStringType<TFormEngine>
  | INumberType<TFormEngine>
  | IBooleanType<TFormEngine>
  | IObjectType<TFormEngine>
  | IArrayType<TFormEngine>
  | IConstType<TFormEngine>
  | IVariantType<TFormEngine>;

interface DataTypeBase<TTypeString extends InputBaseTypeString> {
  type: TTypeString; // discriminant
  label?: string;
  help?: string;
  mandatory?: boolean;
  readonly?: boolean;
  visibility?: IQuery;
  validations?: Validation[];
  templateString?: string;
  pageBreak?: boolean;
}

export interface IStringType<TFormEngine extends IFormEngine = IFormEngine> extends DataTypeBase<'string'> {
  defaultValue?: string;
  viewAs?: TFormEngine['string'];
  validations?: StringValidation[];
}

export interface INumberType<TFormEngine extends IFormEngine = IFormEngine> extends DataTypeBase<'number'> {
  minValue?: number;
  maxValue?: number;
  decimals?: number;
  defaultValue?: number;
  viewAs?: TFormEngine['number'];
  validations?: NumberValidation[];
}

export interface IBooleanType<TFormEngine extends IFormEngine = IFormEngine> extends DataTypeBase<'boolean'> {
  defaultValue?: boolean;
  viewAs?: TFormEngine['boolean'];
  validations?: BooleanValidation[];
}

export interface IObjectType<TFormEngine extends IFormEngine = IFormEngine> extends DataTypeBase<'object'> {
  membersTypes: IObjectMemberType[];
  viewAs?: TFormEngine['object'];
}

export interface IVariantType<TFormEngine extends IFormEngine = IFormEngine> extends DataTypeBase<'variant'> {
  variants: IVariantMemberType[];
  viewAs?: TFormEngine['variant'];
  defaultValue?: 'void';
}

export type IVariantMemberType<TKey extends string = string, TType extends IFormType = IFormType> = { key: TKey, label?: string } & TType;

export interface IArrayType<TFormEngine extends IFormEngine = IFormEngine> extends DataTypeBase<'array'> {
  entryType: IFormType<TFormEngine>;
  viewAs?: TFormEngine['array'];
  primaryKeys?: string[];
  validations?: ArrayValidation[];
}

export type IObjectMemberType = IKeyedMemberType | IConstType;
export type IKeyedMemberType<TKey extends string = string, TType extends IFormType<IFormEngine> = IFormType<IFormEngine>> = { key: TKey } & TType;

export interface IConstType<TFormEngine extends IFormEngine = IFormEngine> extends DataTypeBase<'const'> {
  value: string;
  key?: undefined;
  viewAs?: TFormEngine['const'];
}

export type Validation =
  | StringValidation
  | BooleanValidation
  | NumberValidation
  | ObjectValidation
  | ArrayValidation;

export type StringValidation =
  | StringLengthMinValidation
  | StringLengthMaxValidation
  | RegexValidation
  | MandatoryValidation;
export type BooleanValidation = MandatoryValidation;
export type NumberValidation =
  | MandatoryValidation
  | MinValueValidation
  | MaxValueValidation
  | MaxDecimalsValidation;
export type ObjectValidation = ObjectEmptyValidation;
export type ArrayValidation =
  | ArrayLengthMinValidation
  | ArrayLengthMaxValidation
  | UniqueKeyValidation;

export interface IValidationRule<TRule extends string, TArg = any> {
  type: TRule;
  arg?: TArg;
  message?: string;
}

export type StringLengthMinValidation = IValidationRule<'stringLengthMin', number>;
export type StringLengthMaxValidation = IValidationRule<'stringLengthMax', number>;
export type ArrayLengthMinValidation = IValidationRule<'arrayLengthMin', number>;
export type ArrayLengthMaxValidation = IValidationRule<'arrayLengthMax', number>;
export type RegexValidation = IValidationRule<'regex', string>;
export type MandatoryValidation = IValidationRule<'mandatory', undefined>;
export type MinValueValidation = IValidationRule<'minValue', number>;
export type MaxValueValidation = IValidationRule<'maxValue', number>;
export type MaxDecimalsValidation = IValidationRule<'maxDecimals', number>;
export type ObjectEmptyValidation = IValidationRule<'objectNotEmpty'>;
export type UniqueKeyValidation = IValidationRule<'uniqueKey', string>;

export type InputBaseTypeString =
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'
  | 'variant'
  | 'const'
  | 'void';

export type IQuery = UnaryOperator | BinaryOperator | FieldValue | MemberOperator | ConstValue;

export type UnaryOperator = {
  type: 'unary';
  operator: '+' | '-' | '!';
  operand1: IQuery;
};

export type BinaryOperator = {
  type: 'binary';
  operator:
  | '+'
  | '-'
  | '*'
  | '/'
  | '<'
  | '>'
  | '<='
  | '>='
  | '=='
  | '!='
  | '&&'
  | '||'
  | '.'
  | '??';
  operand1: IQuery;
  operand2: IQuery;
};

export type FieldValue = {
  type: 'field';
  field: string;
};

export type MemberOperator = {
  type: 'member';
  member: string;
};

export type ConstValue = {
  type: 'const';
  data: string;
  encoding?: 'utf8' | 'base64' | 'json';
  viewAs?: 'text' | 'html' | 'image' | 'file' | 'object';
};

export type ISelectionEntry = {
  key: string;
  label?: string;
};

export type ISelectionList = ISingleSelectionList | IMultipleSelectionList;

export type ISingleSelectionList = {
  multiple: false;
  entries: ISelectionEntry[];
  viewAs?: IViewAs;
};

export type IMultipleSelectionList = {
  multiple: true;
  entries: ISelectionEntry[];
  viewAs?: IViewAs;
};
