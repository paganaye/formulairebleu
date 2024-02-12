import { Component, For, JSX, Show, createMemo, createSignal } from 'solid-js';
import { FormSection, FormTemplate, FormLineTemplate, FormNumberTemplate } from '../core/FormTemplate';
import { template } from 'solid-js/web';
import LabelComponent from './LabelComponent';
// import { navigateToPage } from '../App';
// import { twMerge } from 'tailwind-merge';

interface IFormNumberProps {
  //   class?: string;
  //   startIcon?: any;
  //   onClick?: (event: MouseEvent) => void;
  //   disabled?: boolean;
  //   children: JSX.Element;
  template: FormNumberTemplate
  value: any;
  setValue: (value: any) => void
}

const FormNumberComponent: Component<IFormNumberProps> = (props) => {
  function onValueInput(e: Event) {
    const target = e.target as HTMLInputElement;
    props.setValue(target.valueAsNumber)
  }
  return (
    <div>
      <Show when={props.template} fallback={<p>FormNumber sans modèle</p>}>
        {/* <p>we are in form line {props.template.type} type:{props.template.key} value:{JSON.stringify(props.value)}</p> */}
        <LabelComponent label={props.template.label} useLabelTag={true}>
          <input type="number" placeholder="Type here" class="input input-bordered w-full max-w-xs"
            value={props.value === undefined ? '' : props.value}
            onInput={onValueInput}
          />
        </LabelComponent>
      </Show>
    </div>
  );
};

export default FormNumberComponent;