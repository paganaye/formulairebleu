import { formulaireBleuJSX, formulaireBleuJSXFragment, IValue, JSONValue, JSXSource, Observer, Value } from "../../core/tiny-jsx";
import { ModalView, PopupView } from './BootstrapModalView';
import { IForm } from "../../core/IForm";
import { Box } from "../../core/Box";
import { Pager } from './BootstrapPagerView';
import { FormEngine, IFormProps, OnValueChanged } from '../../core/FormEngine';
import { BootstrapEngine } from './BootstrapEngine';



interface FormBodyProps {
  engine: BootstrapEngine;
  form: IForm,
  value: IValue<JSONValue>,
  onValueChanged: (v) => void,
  header?: JSXSource;
  footer?: JSXSource;
}

const FormBody = (props: FormBodyProps) => {
  props.value.addObserver((v) => {
    rootBox.setValue(v);
  })
  const rootBox = Box.enBox(props.engine, null, props.form.name, props.form.dataType, props.value.getValue());
  //setTimeout(() => {
  // });
  if (rootBox.type.templates) props.engine.templates
  rootBox.addChildChangedObserver((e) => {
    let v = rootBox.getValue();
    props.value.setValue(v);
    props.engine.paginate(rootBox);
  })

  // createEffect(() => {
  //   rootBox.setValue(Box.enBox(null, props.form.name, props.form.dataType, null));
  // })


  // createEffect(() => {
  //   const propJSONString = JSON.stringify(props.value);
  //   if (propJSONString === currentJSONString) return;

  //   currentJSONString = propJSONString;
  //   const newBox = Box.enBox(null, props.form.name, props.form.dataType, props.value);
  //   rootBox.setValue(newBox);
  //   props.engine.paginate(newBox);

  // });

  // function onValueChanged(onValueChanged: OnValueChanged) {
  //   if (!rootBox) return;
  //   const jsonValue = Box.unBox(rootBox);
  //   currentJSONString = JSON.stringify(jsonValue)
  //   props.value.setValue(jsonValue);
  //   if (onValueChanged?.pagesChanged) {
  //     props.engine.paginate(rootBox);
  //   }
  // }
  let result = <div class="container" >
    {props.header}
    {props.engine.InputRenderer({
      engine: props.engine,
      label: props.form.dataType.label ?? props.form.name,
      level: 1,
      box: rootBox,
    })}
    {props.footer}
  </div >

  props.engine.paginate(rootBox)

  return result;
};

interface IModalFormProps extends IFormProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export function ModalFormView(props: IModalFormProps) {

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
      {/* <FormBody
        {...props}
        engine={context}
      /> */}
    </ModalView>);

}

interface IPopupFormProps extends IFormProps {
  title?: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export function PopupFormView(props: IPopupFormProps) {
  const context = new BootstrapEngine(props.form.templates);
  let onClose = () => { props.setIsOpen(false) }

  return (
    <PopupView isOpen={props.isOpen} onClose={onClose} title={props.title}>
      {/* <FormBody
        {...props}
        engine={context}
      /> */}
    </PopupView>);

}

export function formatTemplateString(templateString: string, data: Box): HTMLElement {
  // try {
  //   // const compiledTemplate = Handlebars.compile(templateString);
  //   // const result = compiledTemplate(data);

  //   // const tempSpan = document.createElement('span');
  //   // tempSpan.innerHTML = result;

  //   // if (templateString.startsWith('<') && tempSpan.childElementCount == 1) {
  //   //   return tempSpan.firstElementChild as HTMLElement;
  //   // } else {
  //   //   return tempSpan
  //   // }
  // }
  // catch (e: unknown) {
  //   const errorSpan = document.createElement('span');
  //   errorSpan.innerText = String(e);
  //   return errorSpan;
  // }
  return <p>TODO</p>;
}

export function BootstrapFormView(props: ({ engine: FormEngine } & IFormProps)) {
  let pageNo = props.engine.pageNo;

  return (
    <main>
      <FormBody
        engine={props.engine as any}
        form={props.form}
        value={props.value}
        onValueChanged={props.onValueChanged}
        header=<h1>{props.form.name}</h1>
        footer=<>
          {/* <Pager pageCount={props.engine.pageCount} selectedPage={pageNo} /> */}
        </>
      />
    </main >
  );
}
