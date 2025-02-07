import { countDecimals } from "./Utils";
import { IValidationRule } from "./Validation";


export const validationRules: Record<string, (v: any, validation: IValidationRule<any>, arg1: any, addError: (msg: string) => void) => void> = {
  minValue: (v, validation, arg1, addError) => {
    if (v !== null && Number(v) < arg1) addError(validation.message ?? "$name should be at least $arg1.");
  },
  maxValue: (v, validation, arg1, addError) => {
    if (v !== null && Number(v) > arg1) addError(validation.message ?? "$name should be at most $arg1.");
  },
  maxDecimals: (v, validation, arg1, addError) => {
    if (v && countDecimals(v) > arg1) {
      const message = arg1 === 0
        ? "$name should not have any decimals."
        : "$name should not have more than $arg1 decimals.";
      addError(validation.message ?? message);
    }
  },
  stringLengthMin: (v, validation, arg1, addError) => {
    if (v !== null && String(v).length < arg1) addError(validation.message ?? "$name should be at least $arg1 characters long.");
  },
  stringLengthMax: (v, validation, arg1, addError) => {
    if (v !== null && String(v).length > arg1) addError(validation.message ?? "$name should be at most $arg1 characters long.");
  },
  arrayLengthMin: (v, validation, arg1, addError) => {
    if (!v || (v as any).length < arg1) addError(validation.message ?? "$name should have at least $arg1 entries.");
  },
  arrayLengthMax: (v, validation, arg1, addError) => {
    if (v && (v as any).length > arg1) addError(validation.message ?? "$name should have at most $arg1 entries.");
  },
  mandatory: (v, validation, arg1, addError) => {
    if (v === null || v === "" || v === undefined) addError(validation.message ?? "$name is mandatory.");
  },
  objectNotEmpty: (v, validation, arg1, addError) => {
    if (!v || typeof v !== 'object' || Object.keys(v).length === 0) {
      addError(validation.message ?? "$name should not be empty.");
    }
  },
  regex: (v, validation, arg1, addError) => {
    if (!v || !String(v).match(RegExp(String(arg1)))) {
      addError(validation.message ?? "$name does not have the valid format ($arg1).");
    }
  },
  uniqueKey: (v, validation, arg1, addError) => {
    // TODO: Implement this validation
  }
};
