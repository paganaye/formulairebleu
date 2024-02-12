import { Component, For, JSX, Show, createMemo, createSignal } from 'solid-js';
import { FormSection, FormTemplate } from '../core/FormTemplate';
import FormSectionComponent from './FormSectionComponent';
// import { navigateToPage } from '../App';
// import { twMerge } from 'tailwind-merge';

interface IFormPageProps {
  //   class?: string;
  //   startIcon?: any;
  //   onClick?: (event: MouseEvent) => void;
  //   disabled?: boolean;
  //   children: JSX.Element;
  template: FormSection[]
  value: any;
  setValue: (v: any) => void
  onPropertyChanged: (key: string, value: any) => void;
}

const FormPageComponent: Component<IFormPageProps> = (props) => {

  function onPropertyChanged(k: string, v: any) {
    props.onPropertyChanged(k, v);
  }

  return (
    <div>
      <Show when={props.template} fallback={<p>FormPage sans modèle</p>}>
        <For each={props.template}>{(section, i) =>
          <FormSectionComponent template={section} value={props.value} setValue={(v) => props.setValue(v)}
            onPropertyChanged={onPropertyChanged} />
        }</For>
      </Show>
    </div>
  );
};

export default FormPageComponent;