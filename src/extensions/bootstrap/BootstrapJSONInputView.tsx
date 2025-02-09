import { JsxComponent, formulaireBleuJSX, formulaireBleuJSXFragment } from "../../core/tiny-jsx";
import { getUniqueId } from "../../core/Utils";
import { Box } from "../../core/Box";
import { BootstrapEngine } from './BootstrapEngine';
//import { InputBottom, InputTop } from './BootstrapInputRenderer';

export type JSONInputProps = {
  box: Box;
  label: string;
  engine: BootstrapEngine;
};

// unfinished

export function BootstrapJSONView(props: JSONInputProps) {
  let id = getUniqueId(`json_${props.label}`);
  return (
    <>
      {/* <InputTop {...props} /> */}
      <div class="form-floating">
        <input
          type="text"
          id={id}
          class="form-control"
          value={(props.box.getValue() || "") as any}
          readOnly={props.engine.isReadonly}
          placeholder=""
          onInput={(e) => {
            let newValue = String(e.currentTarget.value);
            props.box.setValue(newValue);
          }} />
        <label for={id} class="form-label">{props.label}</label>
      </div>
      {/* <InputBottom {...props} /> */}
    </>
  );
};
