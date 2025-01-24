import { Component, createEffect, createMemo, createSignal, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { ArrayInput } from './ArrayInput';
import { BooleanInput } from './BooleanInput';
import { NumberInput } from './NumberInput';
import { ObjectInput } from './ObjectInput';
import { SelectionListInput } from './SelectionListInput';
import { StringInput } from './StringInput';
import { Box } from '../core/Box';
import { OnValueChanged, IRenderOptions, formatTemplateString } from './FormVue';
import { ErrorsVue, ErrorVue } from './ErrorsVue';
import { VariantInput } from './VariantInput';
import { IFormType, IKeyedMemberType } from '../core/ICoreForm';

export interface InputRenderProps {
  label: string | undefined;
  box?: Box;
  onValueChanged: (options: OnValueChanged) => void;
  options: IRenderOptions;
}


export const InputRenderer: Component<InputRenderProps> = (props) => {
  let isVisible = undefined;
  let [inputComponent, setInputComponent] = createSignal<Component<any>>();

  function inferComponentFromType(type: IFormType): Component<any> {
    let result: Component<any>;
    const inputComponents: Record<string, Component<any>> = {
      'string': StringInput,
      'boolean': BooleanInput,
      'number': NumberInput,
      'array': ArrayInput,
      'object': ObjectInput,
      'variant': VariantInput,
      'selectionList': SelectionListInput,
    };
    result = inputComponents[type?.view?.type ?? 'undefined'] ?? inputComponents[type?.type ?? 'undefined'];
    if (!result && 'selectionList' in type) {
      return () => <ErrorVue error={`${props.label} type is un ${JSON.stringify(type?.selectionList ?? null)}`} />
    }
    return result;
  }

  createEffect(() => {
    setInputComponent(() => inferComponentFromType(props.box?.getType() as any));
  })

  if (props.options.filter) {
    isVisible = props.options.filter(props);
  }

  return <>
    <Show when={props.box} fallback={(<ErrorVue error={`${props.label} box is null`} />)}>
      <Dynamic component={inputComponent()} {...props} />
    </Show>
  </>;

};

type InputTopProps = {
  box: Box;
  options: IRenderOptions;
};

export const InputTop: Component<InputTopProps> = (props) => {
  return <>
    <Show when={props.box.getType().help}>
      <div class="form-label text-body-tertiary"><small>{props.box.getType().help}</small></div>
    </Show>
  </>
}

type InputBottomProps = {
  box: Box;
  options: IRenderOptions;
};

export const InputBottom: Component<InputBottomProps> = (props) => {
  let errors = createMemo(() => props.box.errors());
  return <>
    <ErrorsVue errors={errors()} />
    {/* <Show when={props.options.filter?.(props as any)}>
        <Show fallback={<pre>Page {props.box.getStartPageNo()}:{props.box.getStartLineNo()}...{props.box.getEndPageNo()}:{props.box.getEndLineNo()} </pre>} when={props.box.getStartPageNo() == props.box.getEndPageNo() && props.box.getStartLineNo() == props.box.getEndLineNo()}>
        <pre>Page {props.box.getStartPageNo()}:{props.box.getStartLineNo()}</pre>
        <pre>filter:{JSON.stringify(props.options.filter?.(props as any))}</pre>
      </Show>
    </Show > */}
  </>
}

type TitleProps = {
  parentType: IFormType;
  type: IFormType;
  box: Box;
  index: number
};

export const Title: Component<TitleProps> = (props) => {
  let title: string | HTMLElement;
  let parentType = (props.parentType as IKeyedMemberType).key ?? "Item";
  if (props.type.templateString) {
    title = formatTemplateString(props.type.templateString, Box.unBox(props.box) as any);
  } else {
    title = parentType + " " + String(props.index + 1)
  }
  
  return (
    <>
      {title}
    </>
  );
};
