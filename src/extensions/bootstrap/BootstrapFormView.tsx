import { Component, createEffect, JSX } from 'solid-js';
import { createSignal } from "solid-js";
import ModalView, { PopupView } from './BootstrapModalView';
import * as Handlebars from 'handlebars';
import { formulairebleu } from "../../core/IForm";
type IForm = formulairebleu.IForm;
type IFormType = formulairebleu.IFormType;
import { Box } from "../../core/Box";
import { JSONValue } from "../../core/Utils";
import { Pager } from './BootstrapPagerView';
import { FormEngine, IFormProps, OnValueChanged } from '../../core/FormEngine';
import { BootstrapEngine } from './BootstrapEngine';



interface FormBodyProps {
  engine: BootstrapEngine;
  form: IForm,
  value: JSONValue,
  setValue: (v: JSONValue) => void,
  header?: JSX.Element;
  footer?: JSX.Element;
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
    setRootBox(newBox);
    props.engine.paginate(newBox);

  });

  function onValueChanged(onValueChanged: OnValueChanged) {
    const rootBox = getRootBox();
    if (!rootBox) return;
    const jsonValue = Box.unBox(rootBox);
    currentJSONString = JSON.stringify(jsonValue)
    props.setValue(jsonValue);
    if (onValueChanged?.pagesChanged) {
      props.engine.paginate(rootBox);
    }
  }


  return (
    <div class="container" >
      {props.header}
      {props.engine.InputRenderer({
        engine: props.engine,
        label: props.form.dataType.label ?? props.form.name,
        level: 1,
        box: getRootBox(),
        onValueChanged: onValueChanged
      })}
      {props.footer}
    </div >
  );
};

interface IModalFormProps extends IFormProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const ModalFormView: Component<IModalFormProps> = (props) => {

  const context = new BootstrapEngine(props.form.templates);
  const pageNo = context.pageNo;

  let onClose = () => { props.setIsOpen(false) }

  return (
    <ModalView isOpen={props.isOpen} onClose={onClose} title={props.form.name}
      buttons={[
        { text: "<", action: () => { pageNo.setValue(pageNo.getValue() - 1) }, class: "" },
        { text: String(pageNo.getValue()), action: () => { }, class: "" },
        { text: ">", action: () => { pageNo.setValue(pageNo.getValue() + 1) }, class: "" },
        { text: "Close", action: () => onClose(), class: "btn-primary" }]}>
      <FormBody
        {...props}
        engine={context}
      />
    </ModalView>);

}

interface IPopupFormProps extends IFormProps {
  title?: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const PopupFormView: Component<IPopupFormProps> = (props) => {
  const context = new BootstrapEngine(props.form.templates);
  let onClose = () => { props.setIsOpen(false) }

  return (
    <PopupView isOpen={props.isOpen} onClose={onClose} title={props.title}>
      <FormBody
        {...props}
        engine={context}
      />
    </PopupView>);

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

export const BootstrapFormView: Component<{ engine: FormEngine } & IFormProps> = (props) => {
  let pageNo = props.engine.pageNo;

  return (
    <main>
      <FormBody
        engine={props.engine}
        form={props.form}
        value={props.value}
        setValue={props.setValue}
        header=<h1>{props.form.name}</h1>
        footer={<>
          <Pager pageCount={props.engine.pageCount.getValue()} onPageSelected={p => pageNo.setValue(p)} selectedPage={pageNo.getValue()} />
        </>
        }
      />
    </main >
  );
}
