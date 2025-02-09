import { Value, computed, formulaireBleuJSX, formulaireBleuJSXFragment } from "../../core/tiny-jsx";
import { getUniqueId } from "../../core/Utils";
import { Box } from "../../core/Box";
import { BootstrapEngine } from "./BootstrapEngine";

export type StringInputProps = {
  box: Box;
  label: string;
  engine: BootstrapEngine;
};

let masks: Record<string, RegExp> = {
  "9": /[0-9]/,
  "a": /[a-zA-Z]/,
  "*": /./,
};

const applyMask = (value: string, mask: string, pos: number): { newValue: string; newPos: number } => {
  let maskedValue = "";
  let maskIndex = 0;
  let valueIndex = 0;
  let incrementPos = false;

  while (maskIndex < mask.length) {
    let maskChar = mask[maskIndex];
    let valueChar = value[valueIndex];
    let regex = masks[maskChar];

    if (regex) {
      if (valueChar && regex.test(valueChar)) {
        maskedValue += valueChar;
        maskIndex += 1;
        valueIndex += 1;
      } else {
        valueIndex += 1;
      }
    } else {
      maskedValue += maskChar;
      maskIndex += 1;
      if (valueChar == maskChar) valueIndex += 1;
      else if (maskIndex <= pos + 1) incrementPos = true;
    }

    if (valueChar === undefined) break;
  }

  return { newValue: maskedValue, newPos: pos + (incrementPos ? 1 : 0) };
};

export function BootstrapStringView(props: StringInputProps) {
  let id = getUniqueId(`txt_${props.label}`);
  const isFocused = new Value(false);
  let mask: string | undefined = (props.box.type.view as any)?.mask;

  return (
    <>
      <div class="form-floating">
        <input
          type={computed({ isFocused }, (p) => (p.isFocused ? "text" : "string"))}
          id={id}
          class="form-control"
          value={isFocused.getValue() ? (props.box.getValue() || "") : props.box.getValue()}
          readOnly={computed({ isFocused }, (p) => props.engine.isReadonly || !p.isFocused)}
          placeholder={""}
          required={props.box.type.mandatory}
          onFocus={(e) => {
            if (!isFocused.getValue()) {
              isFocused.setValue(true);
              // setTimeout(() => {
              //   (e.target as HTMLInputElement)?.select?.();
              // });
            }
          }}
          onBlur={(e) => {
            isFocused.setValue(false);
            props.box.validate();
          }}
          onInput={(e) => {
            if (isFocused.getValue()) {
              let inputElt = e.currentTarget;
              let previousValue = props.box.getValue() as string;
              let newValue = inputElt.value;
              let pos = inputElt.selectionStart ?? newValue.length;
              let maskResult = mask ? applyMask(newValue, mask, pos) : undefined;

              if (maskResult) {
                let maskResultValue = maskResult.newValue;
                if (maskResultValue !== newValue) {
                  if (maskResultValue === previousValue && newValue.length < previousValue.length) {
                  } else {
                    inputElt.value = maskResultValue;
                    setTimeout(() => (inputElt.selectionStart = inputElt.selectionEnd = maskResult.newPos));
                    newValue = maskResultValue;
                  }
                }
              }

              props.box.setValue(newValue);
            }
          }}
        />
        <label for={id} class="form-label">
          {props.label}
        </label>
      </div>
    </>
  );
};
