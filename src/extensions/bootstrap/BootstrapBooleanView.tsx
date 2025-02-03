
import { formulaireBleuJSX, formulaireBleuJSXFragment } from "../../core/tiny-jsx";
import { getUniqueId } from "../../core/Utils";
import { Styles } from "../../core/Styles";
import { Box } from "../../core/Box";
import { BootstrapEngine } from './BootstrapEngine';
import { IFormType } from "../../core/IForm";

export interface IBootstapSwitchType {
  type: 'switch'
}

export type BooleanInputProps = {
  box: Box;
  label: string;
  engine: BootstrapEngine;
};

Styles.add(".form-control.for-checkbox.form-switch", {
  "padding-left": "50px"
});

Styles.add(".form-control.for-checkbox:focus-within", {
  "border-color": "var(--bs-primary)", // Utilise la couleur principale Bootstrap
  "box-shadow": "0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25)" // Utilise la couleur primaire avec transparence
});

Styles.add(".form-control.for-checkbox > .form-check-input:focus", {
  "box-shadow": "unset" // Désactive l'ombre de l'input
});

Styles.add(".form-check-input:indeterminate", {
  "background-position-x": "center",
  "background-color": "var(--bs-warning) !important",
  "border-color": "var(--bs-warning)  !important"
});


export const BootstrapBooleanView = (props: BooleanInputProps) => {
  let typeView: IFormType = props.box.getType();
  // je suis obligé de mettre as any ici
  const isSwitch = (() => ((typeView as any)?.view?.type === "switch"));
  let id = getUniqueId(`bool_${props.label}`);
  let inputRef: HTMLInputElement;
  function setInputRef(ref: HTMLInputElement) {
    inputRef = ref;
    inputRef.indeterminate = props.box.getJSONValue() === null;
  }
  return (<>
    {/* <InputTop {...props} /> */}
    <div class={`d-flex flex-column form-control for-checkbox position-relative ${isSwitch() ? "form-switch" : ""}`}
      onMouseDown={(e) => {
        e.preventDefault();
        inputRef?.focus();
      }}>
      <div class="d-flex flex-row">
        <input
          tabindex="0"
          type="checkbox"
          ref={setInputRef}
          class="form-check-input"
          id={id}
          checked={props.box.getJSONValue() === true} // Assurez que seules les valeurs `true` cochent le champ
          readOnly={props.engine.isReadonly}
          onBlur={(e) => props.box.validate()}
          onChange={(e) => {
            // Bascule entre true et false (l’état indeterminate est géré séparément)
            const newValue = e.currentTarget.checked;
            props.box.setValue(newValue);
          }} />
        <label class="form-check-label ms-2 flex-grow-1" x-onMouseDown={(e: any) => {
          e.preventDefault();
          inputRef?.focus();
        }}
        >{props.label}</label>
      </div>
      {/* <InputBottom {...props} /> */}
    </div>
  </>) as any;
};
