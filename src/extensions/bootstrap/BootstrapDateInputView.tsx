import { Show, formulaireBleuJSX, formulaireBleuJSXFragment, Value, computed } from "../../core/tiny-jsx";
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

export function DateInputView(props: DateInputProps) {
  let id = getUniqueId(`date_${props.label}`);
  const isFocused = new Value(false);
  const suffix = (props.box.type.view as any)?.suffix;


  const inputType = computed({ isFocused }, (p) => {
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

  function formatDate() {
    let value = props.box.getValue() as any;
    let dt = new Date(Date.parse(value));
    if (!isValidDate(dt)) return "";

    switch (value.type) {
      case "time": return dt.toISOString().split("T")[1].substring(0, 8); // hh:mm:ss
      case "datetime": return dt.toISOString().slice(0, 16); // yyyy-MM-ddThh:mm
      case "date":
      default: return dt.toISOString().split("T")[0]; // yyyy-MM-dd
    }
  };


  return (
    <>
      <div class="input-group mb-3">
        <div class="form-floating">
          <input
            type={inputType}
            id={id}
            class="form-control"
            value={formatDate()}
            readOnly={computed({ isFocused }, (p) => props.engine.isReadonly || !p.isFocused)}
            placeholder=""
            onFocus={(e: Event) => {
              isFocused.setValue(true)
              setTimeout(() => { let inp = (e.target as HTMLInputElement); if (inp) { inp.value = props.box.getValue().toString(); inp.select(); } });
            }}
            onBlur={(e: Event) => {
              isFocused.setValue(false);
              setTimeout(() => { let inp = (e.target as HTMLInputElement); if (inp) inp.value = formatDate() });
              props.box.validate();
            }}
            onInput={(e) => {
              if (isFocused.getValue()) {
                let dateValue = e.currentTarget.valueAsDate;
                if (isValidDate(dateValue)) {
                  props.box.setValue({ type: props.box.type.type, value: dateValue?.toISOString() || "" });
                }
              }
            }}
          />
          <label for={id} class="form-label">{props.label}</label>
        </div>
        <Show when={suffix}>
          <span class="input-group-text" id="basic-addon2">{suffix}</span>
        </Show>
      </div>
    </>
  );
};
