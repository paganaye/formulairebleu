import { Component, createMemo } from 'solid-js';
import { IRenderOptions, OnValueChanged } from './FormVue';
import { getUniqueId } from '../core/Utils';
import { Styles } from '../core/Styles';
import { InputBottom, InputTop } from './InputRenderer';
import { Box } from '../core/Box';

export type BooleanInputProps = {
  box: Box;
  onValueChanged: (options: OnValueChanged) => void;
  label: string;
  options: IRenderOptions;
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


export const BooleanInput: Component<BooleanInputProps> = (props) => {
  const isSwitch = createMemo(() => (props.box.getType().viewAs?.type === "switch"));
  let id = getUniqueId(`bool_${props.label}`);
  let inputRef: HTMLInputElement;
  function setInputRef(ref: HTMLInputElement) {
    inputRef = ref;
    inputRef.indeterminate = props.box.getJSONValue() === null;
  }
  return (
    <div class={`d-flex flex-column form-control for-checkbox position-relative ${isSwitch() ? "form-switch" : ""}`}
      onMouseDown={(e) => {
        e.preventDefault();
        inputRef?.focus();
      }}>
      <InputTop {...props} />
      <div class="d-flex flex-row">
        <input
          tabindex="0"
          type="checkbox"
          ref={setInputRef}
          class="form-check-input"
          id={id}
          checked={props.box.getJSONValue() === true} // Assurez que seules les valeurs `true` cochent le champ
          readOnly={props.options.readonly}
          onBlur={(e) => props.box.validate()}
          onChange={(e) => {
            // Bascule entre true et false (l’état indeterminate est géré séparément)
            const newValue = e.currentTarget.checked;
            props.box.setValue(newValue);
            props.onValueChanged({});
          }} />
        <label class="form-check-label ms-2 flex-grow-1" x-onMouseDown={(e: any) => {
          e.preventDefault();
          inputRef?.focus();
        }}
        >{props.label}</label>
      </div>
      <InputBottom {...props} />
    </div>
  );
};
