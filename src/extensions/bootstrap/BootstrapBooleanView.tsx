import { computed, formulaireBleuJSX, formulaireBleuJSXFragment, Variable } from "../../core/tiny-jsx";
import { getUniqueId } from "../../core/Utils";
import { Styles } from "../../core/Styles";
import { Box } from "../../core/Box";
import { BootstrapEngine } from "./BootstrapEngine";
import { IFormType } from "../../core/IForm";
import { Observable } from "../../core/tiny-jsx";

export interface IBootstapSwitchType {
  type: "switch";
}

export type BooleanInputProps = {
  box: Box;
  label: string;
  engine: BootstrapEngine;
};

Styles.add(".form-control.for-checkbox.form-switch", {
  "padding-left": "50px",
});

Styles.add(".form-control.for-checkbox:focus-within", {
  "border-color": "var(--bs-primary)",
  "box-shadow": "0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25)",
});

Styles.add(".form-control.for-checkbox > .form-check-input:focus", {
  "box-shadow": "unset",
});

Styles.add(".form-check-input:indeterminate", {
  "background-position-x": "center",
  "background-color": "var(--bs-warning) !important",
  "border-color": "var(--bs-warning)  !important",
});

export function BootstrapBooleanView(props: BooleanInputProps) {
  let typeView: IFormType = props.box.type;
  const isSwitch = (() => (typeView?.view?.type === "switch"));
  const isPopup = (() => (typeView?.view?.type === "popup") || (typeView.view as any)?.popup);
  let id = getUniqueId(`bool_${props.label}`);
  let inputRef: HTMLInputElement;
  function setInputRef(ref: HTMLInputElement) {
    inputRef = ref;
    inputRef.indeterminate = props.box.getValue() === null;
  }

  function renderAsPopupButton() {
    let popupVisible = new Variable("popupButtonPopupVisible", false);
    let { PopupButton, Span } = props.engine;

    return (
      <>
        <div class="row">
          <div class="col-auto">
            <PopupButton visible={popupVisible}>{renderAsBooleanBox}</PopupButton>
          </div>
          <div class="col">{Span(props.box)}</div>
        </div>
      </>
    );
  }

  function renderAsBooleanBox() {
    return (
      <>
        <props.engine.InputTop {...props} />
        <div
          class={`d-flex flex-column form-control for-checkbox position-relative ${isSwitch() ? "form-switch" : ""}`}
          onMouseDown={(e) => {
            e.preventDefault();
            inputRef?.focus();
          }}
        >
          <div class="d-flex flex-row">
            <input
              tabindex="0"
              type="checkbox"
              ref={setInputRef}
              class="form-check-input"
              id={id}
              checked={computed("bool", { value: props.box }, (p) => {
                return p.value === true
              })}
              readOnly={props.engine.isReadonly}
              onBlur={(e: Event) => onInputChanged(e)}
              onChange={(e: Event) => {
                onInputChanged(e);
              }}
            />
            <label
              class="form-check-label ms-2 flex-grow-1"
              x-onMouseDown={(e: any) => {
                e.preventDefault();
                inputRef?.focus();
              }}
            >
              {props.label}
            </label>
          </div>
          <props.engine.InputBottom {...props} />
        </div>
      </>
    );
  }

  if (isPopup()) {
    return renderAsPopupButton();
  } else {
    return renderAsBooleanBox();
  }

  function onInputChanged(e: Event) {
    const newValue = (e.currentTarget as HTMLInputElement).checked;
    props.box.setValue(newValue, { notify: true, validate: true });
  }
}
