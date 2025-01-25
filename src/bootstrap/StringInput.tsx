import { Component, createEffect } from 'solid-js';
import { IRenderOptions, OnValueChanged } from './FormVue';
import { getUniqueId } from '../core/Utils';
import { InputBottom, InputTop } from './InputRenderer';
import { Box } from '../core/Box';

export type StringInputProps = {
  box: Box;
  onValueChanged: (options: OnValueChanged) => void;
  label: string;
  options: IRenderOptions;
};

let masks: Record<string, RegExp> = {
  "9": /[0-9]/,
  "a": /[a-zA-Z]/,
  '*': /./
}

const applyMask = (value: string, mask: string, pos: number): { newValue: string, newPos: number } => {
  let maskedValue = "";
  let maskIndex = 0;
  let valueIndex = 0;
  let incrementPos: boolean = false;
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
        // discard invalid character
        valueIndex += 1;
      }
    } else {
      maskedValue += maskChar;
      maskIndex += 1;
      if (valueChar == maskChar) valueIndex += 1;
      else if (maskIndex <= pos + 1) incrementPos = true;
    }
    if (valueChar == undefined) break;
  }
  return { newValue: maskedValue, newPos: pos + (incrementPos ? 1 : 0) };
};


export const StringInput: Component<StringInputProps> = (props) => {
  let id = getUniqueId(`txt_${props.label}`);
  let mask: string | undefined;

  createEffect(() => {
    // let view = props.box.getType().view ?? { type: 'textbox' };
    // mask = view.type == 'masked-textbox' ? view.mask : undefined;
  })


  return (
    <>
      <InputTop {...props as any} />
      <div class="form-floating">
        <input
          type="text"
          id={id}
          class="form-control"
          value={(props.box.getJSONValue() || "") as any}
          readOnly={props.options.readonly}
          placeholder={"" /*placeholder is required for form-floating to work*/}
          required={props.box.getType().mandatory}
          onInput={(e) => {
            let inputElt = e.currentTarget;
            let previousValue = props.box.getJSONValue() as string;
            let newValue = inputElt.value;
            let pos = inputElt.selectionStart ?? newValue.length;
            let maskResult = mask ? applyMask(newValue, mask, pos) : undefined;
            if (maskResult) {
              let maskResultValue = maskResult.newValue;
              if (maskResultValue != newValue) {
                if (maskResultValue == previousValue && newValue.length < previousValue.length) {
                  // the mask is preventing us from backspacing or deleting. So we ignore it
                } else {
                  inputElt.value = maskResultValue;
                  setTimeout(() => inputElt.selectionStart = inputElt.selectionEnd = maskResult.newPos)
                  newValue = maskResultValue;
                }
              }
            }
            props.box.setValue(newValue);
            props.onValueChanged({});
          }}
          onBlur={(_) => {
            props.box.validate();
          }}
        />
        <label for={id} class="form-label">{props.label}</label>
      </div>
      <InputBottom {...props as any} />
    </>
  );
};
