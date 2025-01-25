import { Component, createMemo, createSignal, Show } from 'solid-js';
import { IRenderOptions, OnValueChanged } from './FormVue';
import { getUniqueId } from '../core/Utils';
import { InputBottom, InputTop } from './InputRenderer';
import { Box } from '../core/Box';

export type DateInputProps = {
  box: Box;
  onValueChanged: (options: OnValueChanged) => void;
  label: string;
  options: IRenderOptions;
};

export interface IJSONDate {
  type: 'date' | 'time' | 'datetime',
  value: string;
}

export const DateInputVue: Component<DateInputProps> = (props) => {
  let id = getUniqueId(`num_${props.label}`);
  const [isFocused, setIsFocused] = createSignal(false);
  const suffix = (props.box.getType().view as any)?.suffix;

  const locale = Intl.DateTimeFormat().resolvedOptions().locale; // Détecte la locale
  const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: 'short' }).format(new Date());
  console.log(`Votre format : ${dateFormat}`); // Exemple : "dd/mm/yyyy hh:mm"

  const inputType = createMemo(() => {
    let result: string;
    if (!isFocused()) result = "string";
    else switch (props.box.getType().type as any) {
      case "date":
        result = "date";
        break;
      case "time":
        result = "time";
        break;
      case "datetime":
        result = "datetime-local"
        break;
    }
    console.log("inputType", result)
    return result;
  })

  const inputValue = createMemo(() => {
    let value = props.box.getJSONValue() as any as (IJSONDate | null)
    let result: string;
    //🇫🇷
    let dt: Date | null = (!value && typeof value.value != "string") ? null : new Date(Date.parse(value.value))
    if (!(dt instanceof Date) || isNaN(dt.getTime())) {
      result = ""
    } else {
      switch (props.box.getType().type as string) {
        case "time":
          result = dt.toISOString().split("T")[1];
          break;
        case "datetime":
          result = dt.toISOString();
          break;
        case "date":
        default:
          result = dt.toISOString().split("T")[0];

      }
    }
    console.log("inputValue", result)
    return result;
  })

  return (
    <>
      <InputTop {...props} />
      <div class="input-group mb-3">
        <div class="form-floating">
          <input
            type={inputType()}
            id={id}
            class="form-control number-input"
            value={inputValue()}
            readOnly={props.options.readonly || !isFocused()}
            placeholder={"" /* bootstrap won't show it when form-floating is set.  */}
            onFocus={(e) => {
              if (!isFocused()) {
                setIsFocused(true);
                //   setTimeout(() => { (e.target as HTMLInputElement)?.select?.() });
              }
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.box.validate();
            }}
            onInput={(e) => {
              if (isFocused()) {
                let dateValue = e.currentTarget.valueAsDate;
                props.box.setValue({ type: 'date', value: dateValue == null ? null : dateValue.toISOString() });
                props.onValueChanged({});

              }
            }}
          />
          <label for={id} class="form-label">{props.label}</label>
        </div>
        <Show when={suffix}>
          <span class="input-group-text" id="basic-addon2">{suffix}</span>
        </Show>
      </div>
      <InputBottom {...props} />
    </>
  );
};
