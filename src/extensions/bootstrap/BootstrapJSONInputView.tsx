import { Component, formulaireBleuJSXFactory, formulaireBleuJSXFragmentFactory } from "../../core/jsx";
import { getUniqueId } from "../../core/Utils";
import { Box } from "../../core/Box";
import { OnValueChanged } from '../../core/FormEngine';
import { BootstrapEngine } from './BootstrapEngine';
//import { InputBottom, InputTop } from './BootstrapInputRenderer';

export type JSONInputProps = {
  box: Box;
  onValueChanged: (onValueChanged: OnValueChanged) => void;
  label: string;
  engine: BootstrapEngine;
};

// unfinished

export const BootstrapJSONView: Component<JSONInputProps> = (props) => {
  let id = getUniqueId(`json_${props.label}`);
  return (
    <>
      {/* <InputTop {...props} /> */}
      <div class="form-floating">
        <input
          type="text"
          id={id}
          class="form-control"
          value={(props.box.getJSONValue() || "") as any}
          readOnly={props.engine.isReadonly}
          placeholder=""
          onInput={(e) => {
            let newValue = String(e.currentTarget.value);
            props.box.setValue(newValue);
            props.onValueChanged({});
          }} />
        <label for={id} class="form-label">{props.label}</label>
      </div>
      {/* <InputBottom {...props} /> */}
    </>
  );
};
