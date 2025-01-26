import { Component, createEffect, JSX, Show } from 'solid-js';
import { createSignal } from "solid-js";
import ModalVue, { PopupVue } from './ModalVue';
import { Buttons } from "./Buttons";
import * as Handlebars from 'handlebars';
import { InputRenderer, InputRenderProps } from './InputRenderer';
import { ICoreForm } from '../core/ICoreForm';
import { Box } from '../core/Box';
import { JSONValue } from '../core/Utils';

export interface IRenderOptions {
  filter?: (input: InputRenderProps) => boolean;
  readonly: boolean;
}

export type OnValueChanged = { pagesChanged?: boolean };

interface FormBodyProps extends IFormProps {
  header?: JSX.Element;
  footer?: JSX.Element;
  pageNo?: number
}

const FormBody: Component<FormBodyProps> = (props) => {
  const [getRootBox, setRootBox] = createSignal<Box>();

  createEffect(() => {
    setRootBox(Box.enBox(null, props.form.name, props.form.dataType, null));
  })


  let currentJSONString: string = "";

  createEffect(() => {
    const propJSONString = JSON.stringify(props.value);
    if (propJSONString === currentJSONString) return;

    currentJSONString = propJSONString;
    const newBox = Box.enBox(null, props.form.name, props.form.dataType, props.value);
    //Box.paginate(newBox, props.form.dataType);
    setRootBox(newBox);
  });

  function onValueChanged(options: OnValueChanged) {
    const rootBox = getRootBox();
    if (!rootBox) return;
    const jsonValue = Box.unBox(rootBox);
    currentJSONString = JSON.stringify(jsonValue)
    props.setValue(jsonValue);

    if (options?.pagesChanged) {
      //Box.paginate(rootBox, props.form.dataType);
    }
  }

  const options: IRenderOptions = {
    readonly: false,
    filter: (inputProps) => {
      const pageNo = props.pageNo;
      if (!pageNo) return true;
      const inputPageNo = inputProps.box?.pageNo.getValue();
      return !inputPageNo || inputPageNo.startPage <= pageNo && pageNo <= inputPageNo.endPage;
    }
  };

  return (
    <div class="container">
      {props.header}
      <InputRenderer
        label={props.form.dataType.label ?? props.form.name}
        level={1}
        box={getRootBox() as any}
        onValueChanged={onValueChanged}
        options={options}
      />
      {props.footer}
    </div>
  );
};

interface IModalFormProps extends IFormProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const ModalFormVue: Component<IModalFormProps> = (props) => {
  const [getPageNo, setPageNo] = createSignal(1);

  let onClose = () => { props.setIsOpen(false) }

  return (
    <ModalVue isOpen={props.isOpen} onClose={onClose} title={props.form.name}
      buttons={[
        { text: "<", action: () => { setPageNo(getPageNo() - 1) }, class: "" },
        { text: String(getPageNo()), action: () => { }, class: "" },
        { text: ">", action: () => { setPageNo(getPageNo() + 1) }, class: "" },
        { text: "Close", action: () => onClose(), class: "btn-primary" }]}>
      <FormBody
        {...props}
        pageNo={getPageNo()}
      />
    </ModalVue>);

}

interface IPopupFormProps extends IFormProps {
  title?: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const PopupFormVue: Component<IPopupFormProps> = (props) => {
  const [getPageNo, setPageNo] = createSignal(1);

  let onClose = () => { props.setIsOpen(false) }

  return (
    <PopupVue isOpen={props.isOpen} onClose={onClose} title={props.title}>
      <FormBody
        {...props}
        pageNo={getPageNo()}
      />
    </PopupVue>);

}

export function formatTemplateString(templateString: string, data: Record<string, any>): HTMLElement {
  try {
    const compiledTemplate = Handlebars.compile(templateString);
    const result = compiledTemplate(data);

    const tempSpan = document.createElement('span');
    tempSpan.innerHTML = result;

    if (templateString.startsWith('<') && tempSpan.childElementCount == 1) {
      return tempSpan.firstElementChild as HTMLElement;
    } else {
      return tempSpan
    }
  }
  catch (e: unknown) {
    const errorSpan = document.createElement('span');
    errorSpan.innerText = String(e);
    return errorSpan;
  }
}

interface IFormProps {
  form: ICoreForm,
  value: JSONValue,
  setValue: (v: JSONValue) => void,
}

export const FormVue: Component<IFormProps> = (props) => {
  const [getPageNo, setPageNo] = createSignal(1);
  return (
    <main>
      <FormBody
        {...props}
        pageNo={getPageNo()}
        header=<h1>{props.form.name}</h1>
        footer={<Buttons buttons={[
          { text: "<", action: () => { setPageNo(getPageNo() - 1) }, class: "" },
          { text: String(getPageNo()), action: () => { }, class: "" },
          { text: ">", action: () => { setPageNo(getPageNo() + 1) }, class: "" }]} />
        }
      />
    </main >
  );

}
