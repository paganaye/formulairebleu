import { Show, formulaireBleuJSX, formulaireBleuJSXFragment, Observable, computed, Variable } from "../../core/tiny-jsx";
import { getUniqueId } from "../../core/Utils";
import { Box } from "../../core/Box";
import { BootstrapEngine } from './BootstrapEngine';

export type DateInputProps = {
  box: Box;
  label: string;
  engine: BootstrapEngine;
};

export interface IJSONDate {
  type: 'date' | 'time' | 'datetime';
  value: string;
}

export function BootstrapDateView(props: DateInputProps) {
  let id = getUniqueId(`date_${props.label}`);
  const isFocused = new Variable("bootstrapDateIsFocused", false);
  const suffix = (props.box.type.view as any)?.suffix;


  const inputType = computed("BootstrapDateView.inputType", { isFocused }, (p) => {
    if (!p.isFocused) return "string";
    switch (props.box.type.type as string) {
      case "time": return "time";
      case "datetime": return "datetime-local";
      case "date":
      default: return "date";
    }
  });

  function isValidDate(dt: Date | undefined): boolean {
    const maxDate = new Date("9999-12-31T23:59:59"); // Limite maximale
    return dt instanceof Date && !isNaN(dt.getTime()) && dt <= maxDate;
  }

  function formattedDate() {
    let value = props.box.getValue() as string;
    let type = props.box.type.type;
    let dt = new Date(Date.parse(type === 'time' ? ('1970-01-01T' + value) : value));
    return (isValidDate(dt)) ? formatDate(dt) : "";
  }

  function formatDate(dt: Date) {
    let type = props.box.type.type;
    switch (type) {
      case "time": return dt.toISOString().split("T")[1].substring(0, 8); // hh:mm:ss
      case "datetime": return dt.toISOString().slice(0, 16); // yyyy-MM-ddThh:mm
      case "date":
      default: return dt.toISOString().split("T")[0]; // yyyy-MM-dd
    }
  };

  return (
    <>
      {props.engine.InputTop(props)}
      <div class="input-group mb-3">
        <div class="form-floating">
          <input
            type={inputType}
            id={id}
            class="form-control"
            value={computed("box", { box: props.box }, (p) => formattedDate())}
            readOnly={computed("BootstrapDateView.readonly", { isFocused }, (p) => props.engine.isReadonly || !p.isFocused)}
            placeholder=""
            onFocus={(e: Event) => {
              isFocused.setValue(true)
              setTimeout(() => { let inp = (e.target as HTMLInputElement); if (inp) { inp.value = String(props.box.getValue()); inp.select(); } });
            }}
            onBlur={(e: Event) => {
              isFocused.setValue(false);
              setTimeout(() => { let inp = (e.target as HTMLInputElement); if (inp) inp.value = formattedDate() });
              onInputChanged(e);
            }}
            onInput={(e: InputEvent) => {
              if (isFocused.getValue()) onInputChanged(e);
            }}
          />
          <label for={id} class="form-label">{props.label}</label>
        </div>
        <Show when={suffix}>
          <span class="input-group-text" id="basic-addon2">{suffix}</span>
        </Show>
      </div>
      {props.engine.InputBottom(props)}
    </>);
  function onInputChanged(e: Event) {
    let elt = e.currentTarget as HTMLInputElement;
    let dateValue = elt.valueAsDate ?? new Date(elt.value);
    if (isValidDate(dateValue)) {
      props.box.setValue(formatDate(dateValue), { notify: true, validate: true });
    } else if (elt.value == '') {
      props.box.setValue(null, { notify: true, validate: true });

    }
  }

};
