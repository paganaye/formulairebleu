import { Component, For, JSX, Show, createMemo, createSignal } from 'solid-js';
import { FormSection, FormTemplate, FormLineTemplate, FormNumberTemplate } from '../core/FormTemplate';
// import { navigateToPage } from '../App';
// import { twMerge } from 'tailwind-merge';

interface UnknownFormLineProps {
  //   class?: string;
  //   startIcon?: any;
  //   onClick?: (event: MouseEvent) => void;
  //   disabled?: boolean;
  //   children: JSX.Element;
  template: FormLineTemplate
}

const UnknownFormLineComponent: Component<UnknownFormLineProps> = (props) => {

  return (
    <div>
      <Show when={props.template} fallback={<p>UnknownFormLine without template</p>}>
        <p>Unknown formLine {JSON.stringify(props.template)}</p>
      </Show>
    </div>
  );
};

export default UnknownFormLineComponent;