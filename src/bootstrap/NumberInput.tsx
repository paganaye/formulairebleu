import { Component, createSignal, Show } from 'solid-js';
import { IRenderOptions, OnValueChanged } from './FormVue';
import { getUniqueId } from '../core/Utils';
import { InputBottom, InputTop } from './InputRenderer';
import { Styles } from '../core/Styles';
import { Box } from '../core/Box';
import { JSONValue } from '../core/Utils';

export type NumberInputProps = {
  box: Box;
  onValueChanged: (options: OnValueChanged) => void;
  label: string;
  options: IRenderOptions;
};

Styles.add('input.number-input', {
  textAlign: "right",
});

Styles.add('input.number-input[type="string"]', {
  paddingRight: '27px !important' // add the width of the up-down number input when it's hidden
});

export const NumberInput: Component<NumberInputProps> = (props) => {
  let id = getUniqueId(`num_${props.label}`);
  const [isFocused, setIsFocused] = createSignal(false);
  const suffix = (props.box.getType().view as any)?.suffix;
  const formatNumber = (value: JSONValue): string => {
    let num: number | null;
    switch (typeof value) {
      case 'number':
        num = value;
        break;
      default:
        num = parseNumber(String(value));
        break;
    }
    if (num == null) return ''
    return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: (props.box.getType() as any).decimals ?? 0 }).format(num);
  };

  const parseNumber = (value: string): number | null => {
    let parsed = parseFloat(value.replace(/,/g, ""));
    return isNaN(parsed) ? null : parsed;
  };

  return (
    <>
      <InputTop {...props} />
      <div class="input-group mb-3">
        <div class="form-floating">
          <input
            type={isFocused() ? "number" : "string"}
            id={id}
            class="form-control number-input"
            value={
              isFocused()
                ? (props.box.getJSONValue() ?? '') as any
                : formatNumber(props.box.getJSONValue())
            }
            readOnly={props.options.readonly || !isFocused()}
            placeholder={"" /* bootstrap won't show it when form-floating is set.  */}
            onFocus={(e) => {
              if (!isFocused()) {
                setIsFocused(true);
                setTimeout(() => { (e.target as HTMLInputElement)?.select?.() });
              }
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.box.validate();
            }}
            onInput={(e) => {
              if (isFocused()) {
                let rawValue = e.currentTarget.value;
                let parsedValue = parseNumber(rawValue);
                props.box.setValue(parsedValue);
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
