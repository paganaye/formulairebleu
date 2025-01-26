import { Component, createEffect, JSX, Show, Accessor } from 'solid-js';
import { createSignal } from "solid-js";
import ModalVue, { PopupVue } from './ModalVue';
import { Buttons } from "./Buttons";
import * as Handlebars from 'handlebars';
import { InputRenderer, InputRenderProps } from './InputRenderer';
import { ICoreForm, IFormType } from '../core/ICoreForm';
import { Box, FormContext, Value } from '../core/Box';
import { JSONValue } from '../core/Utils';
import { ArrayInput } from './ArrayInput';
import { BooleanInput } from './BooleanInput';
import { DateInputVue } from './DateInputVue';
import { NumberInput } from './NumberInput';
import { ObjectInput } from './ObjectInput';
import { SelectionListInput } from './SelectionListInput';
import { StringInput } from './StringInput';
import { VariantInput } from './VariantInput';
import { ErrorVue } from './ErrorsVue';
import { Pager } from './Pager';

export class BootstrapContext extends FormContext {
  constructor(templates: Record<string, IFormType>) {
    super(templates);
  }

  getRenderer(type: IFormType): Component<any> {
    let actualType = this.getActualType(type);
    let typeRenderers: Record<string, Component<any>> = {
      'string': StringInput,
      'boolean': BooleanInput,
      'number': NumberInput,
      'array': ArrayInput,
      'object': ObjectInput,
      'variant': VariantInput,
      'selectionList': SelectionListInput,
      'date': DateInputVue,
      'time': DateInputVue,
      'datetime': DateInputVue
    };
    let result = typeRenderers[actualType.view?.type ?? 'undefined'] ?? typeRenderers[actualType.type ?? 'undefined'];
    if (!result) {
      return () => <ErrorVue error={`Form type is unknown ${JSON.stringify(actualType.type || null)}`} />
    }
    return result;

  }

  isBoxVisible(box: Box): boolean {
    let currentPage = this.pageNo.getValue();
    if (currentPage == 0) return true;
    let boxPage = box.pageNo.getValue();
    return boxPage.startPage <= currentPage && currentPage <= boxPage.endPage
  }

}

export type OnValueChanged = { pagesChanged?: boolean };

interface FormBodyProps extends IFormProps {
  context: BootstrapContext;
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
    props.context.paginate(newBox);

  });

  function onValueChanged(onValueChanged: OnValueChanged) {
    const rootBox = getRootBox();
    if (!rootBox) return;
    const jsonValue = Box.unBox(rootBox);
    currentJSONString = JSON.stringify(jsonValue)
    props.setValue(jsonValue);

    if (onValueChanged?.pagesChanged) {
      props.context.paginate(rootBox);
    }
  }


  return (
    <div class="container" >
      {props.header}
      < InputRenderer
        label={props.form.dataType.label ?? props.form.name}
        level={1}
        box={getRootBox() as any}
        onValueChanged={onValueChanged}
        context={props.context}
      />
      {props.footer}
    </div >
  );
};

interface IModalFormProps extends IFormProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const ModalFormVue: Component<IModalFormProps> = (props) => {

  const context = new BootstrapContext(props.form.templates);
  const pageNo = new Value(0);

  let onClose = () => { props.setIsOpen(false) }

  return (
    <ModalVue isOpen={props.isOpen} onClose={onClose} title={props.form.name}
      buttons={[
        { text: "<", action: () => { pageNo.setValue(pageNo.getValue() - 1) }, class: "" },
        { text: String(pageNo.getValue()), action: () => { }, class: "" },
        { text: ">", action: () => { pageNo.setValue(pageNo.getValue() + 1) }, class: "" },
        { text: "Close", action: () => onClose(), class: "btn-primary" }]}>
      <FormBody
        {...props}
        context={context}
      />
    </ModalVue>);

}

interface IPopupFormProps extends IFormProps {
  title?: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const PopupFormVue: Component<IPopupFormProps> = (props) => {
  const pageNo = new Value(0);
  const context = new BootstrapContext(props.form.templates);
  let onClose = () => { props.setIsOpen(false) }

  return (
    <PopupVue isOpen={props.isOpen} onClose={onClose} title={props.title}>
      <FormBody
        {...props}
        context={context}
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

export const BootstrapFormVue: Component<IFormProps> = (props) => {
  const context = new BootstrapContext(props.form.templates);
  let pageNo = context.pageNo;
  return (
    <main>
      <FormBody
        context={context}
        {...props}
        header=<h1>{props.form.name}</h1>
        footer={<>
          <Pager pageCount={context.pageCount.getValue()} onPageSelected={p => pageNo.setValue(p)} selectedPage={pageNo.getValue()} />
        </>
        }
      />
    </main >
  );

}
