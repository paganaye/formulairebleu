export type ErrorString = string;

export interface ArrayValidations {
  mandatory?: true | { message?: string };
  minLength?: number | { value: number, message?: string };
  maxLength?: number | { value: number, message?: string };
}

export interface BooleanValidations {
  mandatory?: true | { message?: string };
}


export interface ConstValidations {
  mandatory?: true | { message?: string };
}

export interface DateValidations {
  mandatory?: true | { message?: string };
  minDate?: string | { value: string, message?: string };
  maxDate?: string | { value: string, message?: string };
}

export interface DatetimeValidations {
  mandatory?: true | { message?: string };
  minDate?: string | { value: string, message?: string };
  maxDate?: string | { value: string, message?: string };
  minTime?: string | { value: string, message?: string };
  maxTime?: string | { value: string, message?: string };
}

export interface NumberValidations {
  mandatory?: true | { message?: string };
  minValue?: number | { value: number, message?: string };
  maxValue?: number | { value: number, message?: string };
  maxDecimals?: number | { value: number, message?: string };
}

export interface ObjectValidations {
  mandatory: true | { message?: string };
}

export interface StringValidations {
  mandatory?: true | { message?: string };
  minLength?: number | { value: number, message?: string };
  maxLength?: number | { value: number, message?: string };
  regex?: string | { regex: string, message?: string } | { regex: string, message?: string }[];
}

export interface TimeValidations {
  mandatory?: true | { message?: string };
  minTime?: string | { value: string, message?: string };
  maxTime?: string | { value: string, message?: string };
}

export interface VariantValidations {
  mandatory?: true | { message?: string };
}

export interface VoidValidations {
  mandatory?: true | { message?: string };
}

export type ValidationRules =
  | ArrayValidations
  | BooleanValidations
  | ConstValidations
  | DateValidations
  | DatetimeValidations
  | NumberValidations
  | ObjectValidations
  | StringValidations
  | TimeValidations
  | VariantValidations
  | VoidValidations;
