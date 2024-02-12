import { Component, Match, Show, Switch } from 'solid-js';
import { FormTextTemplate } from '../core/FormTemplate';
import LabelComponent from './LabelComponent';
import { SolidQuill } from './SolidQuill';
import { Quill } from "quill";
import "quill/dist/quill.snow.css";

interface IFormTextProps {
  //   class?: string;
  //   startIcon?: any;
  //   onClick?: (event: MouseEvent) => void;
  //   disabled?: boolean;
  //   children: JSX.Element;
  template: FormTextTemplate
  value: any;
  setValue: (value: any) => void
}

const FormTextComponent: Component<IFormTextProps> = (props) => {
  let q: Quill;


  function onValueChange(e: Event) {
    const target = e.target as HTMLInputElement;
    props.setValue(target.value)
  }

  function onQuillTextChange(e: Event) {
    props.setValue(q.getContents());
  }

  function setQ(v: Quill) {
    q = v;
    q.setContents(props.value);
  }

  return (
    <div>
      <Show when={props.template} fallback={<p>FormText sans modèle</p>}>
        {/* <p>we are in form line {props.template.type} type:{props.template.key} value:{JSON.stringify(props.value)}</p> */}
        <Switch fallback={<p>Invalid view-as for FormText</p>}>
          <Match when={props.template.viewAs === 'multiline'}>
            <LabelComponent label={props.template.label} useLabelTag={false}>
              <textarea placeholder="Type here" class="input input-bordered w-full max-w-xs min-h-16" value={props.value ?? ''}
                onInput={onValueChange} />
            </LabelComponent>
          </Match>
          <Match when={props.template.viewAs === 'richtext'}>
            <SolidQuill ref={setQ} onTextChange={onQuillTextChange} />
          </Match>
          <Match when={true /*default*/}>
            <LabelComponent label={props.template.label} useLabelTag={true}>
              <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" value={props.value ?? ''}
                onInput={onValueChange} />
            </LabelComponent>
          </Match>
        </Switch>
      </Show>
    </div>
  );
};

export default FormTextComponent;