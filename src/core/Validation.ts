
export type Validation = StringValidation |
  BooleanValidation |
  NumberValidation |
  ObjectValidation |
  ArrayValidation;

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

export type DateValidation =
  | MandatoryValidation;

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
