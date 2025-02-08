import { formulaireBleuJSX, formulaireBleuJSXFragment, JSONValue, JSXSource, Observer, Value } from "../../core/tiny-jsx";
import ModalView, { PopupView } from './BootstrapModalView';
import { IForm } from "../../core/IForm";
import { Box } from "../../core/Box";
import { Pager } from './BootstrapPagerView';
import { FormEngine, IFormProps, OnValueChanged } from '../../core/FormEngine';
import { BootstrapEngine } from './BootstrapEngine';



interface FormBodyProps {
  engine: BootstrapEngine;
  form: IForm,
  $value: Value<JSONValue>,
  onValueChanged: (v) => void,
  header?: JSXSource;
  footer?: JSXSource;
}

const FormBody = (props: FormBodyProps) => {
  const rootBox = Box.enBox(null, props.form.name, props.form.dataType, props.$value.getValue());

  rootBox.addObserver((v) => {
    props.$value.setValue(v);
    if (v.repaginate) {
      props.engine.paginate(rootBox);
    }
  })
  // createEffect(() => {
  //   rootBox.setValue(Box.enBox(null, props.form.name, props.form.dataType, null));
  // })

  let currentJSONString: string = "";

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


  return (
    <div class="container" >
      {props.header}
      {props.engine.InputRenderer({
        engine: props.engine,
        label: props.form.dataType.label ?? props.form.name,
        level: 1,
        box: rootBox,
      })}
      {props.footer}
    </div >
  );
};

interface IModalFormProps extends IFormProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const ModalFormView = (props: IModalFormProps) => {

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

export const PopupFormView = (props: IPopupFormProps) => {
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

export function formatTemplateString(templateString: string, data: Record<string, any>): HTMLElement {
  try {
    // const compiledTemplate = Handlebars.compile(templateString);
    // const result = compiledTemplate(data);

    // const tempSpan = document.createElement('span');
    // tempSpan.innerHTML = result;

    // if (templateString.startsWith('<') && tempSpan.childElementCount == 1) {
    //   return tempSpan.firstElementChild as HTMLElement;
    // } else {
    //   return tempSpan
    // }
  }
  catch (e: unknown) {
    const errorSpan = document.createElement('span');
    errorSpan.innerText = String(e);
    return errorSpan;
  }
}

export const BootstrapFormView = (props: ({ engine: FormEngine } & IFormProps)) => {
  let pageNo = props.engine.pageNo;

  return (
    <main>
      <FormBody
        engine={props.engine as any}
        form={props.form}
        $value={props.$value}
        onValueChanged={props.onValueChanged}
        header=<h1>{props.form.name}</h1>
        footer=<>
          <Pager pageCount={props.engine.pageCount} selectedPage={pageNo} />
        </>
      />
    </main >
  );
}
