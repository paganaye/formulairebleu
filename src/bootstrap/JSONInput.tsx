import { Component } from 'solid-js';
import { BootstrapContext, OnValueChanged } from './BootstrapFormVue';
import { getUniqueId } from '../core/Utils';
import { Box } from '../core/Box';
import { InputBottom, InputTop } from './InputRenderer';

export type JSONInputProps = {
  box: Box;
  onValueChanged: (onValueChanged: OnValueChanged) => void;
  label: string;
  context: BootstrapContext;
};

// unfinished

export const JSONInput: Component<JSONInputProps> = (props) => {
  let id = getUniqueId(`json_${props.label}`);
  return (
    <>
      <InputTop {...props} />
      <div class="form-floating">
        <input
          type="text"
          id={id}
          class="form-control"
          value={(props.box.getJSONValue() || "") as any}
          readOnly={props.context.isReadonly}
          placeholder=""
          onInput={(e) => {
            let newValue = String(e.currentTarget.value);
            props.box.setValue(newValue);
            props.onValueChanged({});
          }} />
        <label for={id} class="form-label">{props.label}</label>
      </div>
      <InputBottom {...props} />
    </>
  );
};
