import { Component, createEffect, createMemo, createSignal, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { Box } from '../core/Box';
import { OnValueChanged, BootstrapContext, formatTemplateString } from './BootstrapFormVue';
import { ErrorsVue, ErrorVue } from './ErrorsVue';
import { IFormType, IKeyedMemberType } from '../core/ICoreForm';

export interface InputRenderProps {
  label: string | undefined;
  level: number;
  box?: Box;
  onValueChanged: (onValueChanged: OnValueChanged) => void;
  context: BootstrapContext;
}


export const InputRenderer: Component<InputRenderProps> = (props) => {
  let [inputComponent, setInputComponent] = createSignal<Component<any>>();

  function inferComponentFromType(type: IFormType): Component<any> {
    let result: Component<any>;
    result = props.context.getRenderer(type)
    return result;
  }

  createEffect(() => {
    setInputComponent(() => inferComponentFromType(props.box?.getType() as any));
  })

  const isVisible = createMemo(() => {
    return props.context.isBoxVisible(props.box);
  })

  return <>
    <pre>{JSON.stringify(props.box?.pageNo?.getValue())}</pre>
    <Show when={isVisible()} fallback={(<ErrorVue error={`${props.label} box is null`} />)}>
      <Dynamic component={inputComponent()} {...props} />
    </Show>
  </>;

};

type InputTopProps = {
  box: Box;
  context: BootstrapContext;
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
  context: BootstrapContext;
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
