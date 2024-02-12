import { Component, For, JSX, Show, createMemo, createSignal } from 'solid-js';
import { FormSection, FormTemplate, SectionLine } from '../core/FormTemplate';
import FormLineComponent from './FormLineComponent';
import { template } from 'solid-js/web';
// import { navigateToPage } from '../App';
// import { twMerge } from 'tailwind-merge';

interface IFormSectionProps {
  //   class?: string;
  //   startIcon?: any;
  //   onClick?: (event: MouseEvent) => void;
  //   disabled?: boolean;
  //   children: JSX.Element;
  template: FormSection
  value: any;
  setValue: (v: any) => void
  onPropertyChanged: (key: string, value: any) => void;
}

const FormSectionComponent: Component<IFormSectionProps> = (props) => {
  function getValue(line: SectionLine) {
    let value = props.value;
    if (props.template.key) value = value[props.template.key];
    if ('key' in line) return value[line.key]
    else return value;
  }
  function setValue(templateLine: SectionLine, newValue: any) {
    let key = templateLine.key;
    let value = props.value;
    let ownKey = props.template.key;

    if (ownKey) {
      let ownValue = value[ownKey];
      ownValue[key] = newValue;
      props.onPropertyChanged(ownKey + "." + key, newValue);
    } else {
      value[key] = newValue;
      props.onPropertyChanged(key, newValue);
    }
  }
  function onPropertyChanged(k: string, v: any) {
    let key = props.template.key;
    if (key) { k = key + "." + k };
    props.onPropertyChanged(k, v);
  }
  return (
    <div>
      <Show when={props.template} fallback={<p>FormSection sans modèle</p>}>
        <For each={props.template.lines}>{(line, i) =>
          <FormLineComponent template={line} value={getValue(line)} setValue={(a) => setValue(line, a)}
            onPropertyChanged={onPropertyChanged} />
        }</For>
      </Show>
    </div>
  );
};

export default FormSectionComponent;