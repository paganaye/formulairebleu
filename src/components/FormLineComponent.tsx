import { Component, ErrorBoundary, Show, createMemo, lazy } from 'solid-js';
import { FormLineTemplate } from '../core/FormTemplate';
import { Dynamic } from 'solid-js/web';
import UnknownFormLineComponent from './UnknownFormLineComponent';
// import { navigateToPage } from '../App';
// import { twMerge } from 'tailwind-merge';
// FormNumberComponent

const components: Record<string, any> = {
  number: lazy(() => import("./FormNumberComponent")),
  array: lazy(() => import("./FormArrayComponent")),
  text: lazy(() => import("./FormTextComponent")),
  select: lazy(() => import("./FormSelectComponent"))
}



interface IFormLineProps {
  template: FormLineTemplate;
  value: any;
  setValue: (value: any) => void;
  onPropertyChanged: (key: string, value: any) => void;
}



const FormLineComponent: Component<IFormLineProps> = (props) => {
  const dynamicComponent = createMemo(() => {
    return components[props.template.type] ?? UnknownFormLineComponent
  })

  return (
    <div>
      <Show when={props.template} fallback={<p>FormLine sans modèle</p>}>
        {/* <p>we are in formline type:{props.template.type} value:{JSON.stringify(props.value)}</p>  */}
        <ErrorBoundary fallback={(error, reset) => <p>{error}</p>}>
          <Dynamic component={dynamicComponent()}
            template={props.template}
            value={props.value}
            setValue={(v) => props.setValue(v)}
            onPropertyChanged={(k: string, v: any) => props.onPropertyChanged(k, v)} />
        </ErrorBoundary>
      </Show>
    </div>
  );
};

export default FormLineComponent;