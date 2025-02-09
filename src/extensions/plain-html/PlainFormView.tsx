// import { Component, createEffect, createSignal, JSX } from "../../core/jsx";
// import { JSONValue } from '../../core/Utils';
// // import { createSignal } from "../../core/jsx";
// // import ModalView, { PopupView } from './BootstrapModalView';
// // import * as Handlebars from 'handlebars';
// // import { InputRenderer } from './BootstrapInputRenderer';
// import { formulairebleu } from "../../core/IForm";
// import { IFormProps } from '../../core/FormEngine';
// type IForm = formulairebleu.IForm;
// type IFormType = formulairebleu.IFormType;
// // import { Box, FormContext } from "../../core/Box";
// // import { JSONValue } from "../../core/Utils";
// // import { BootstrapArrayView } from './BootstrapArrayView';
// // import { BootstrapBooleanView } from './BootstrapBooleanView';
// // import { DateInputView } from './BootstrapDateInputView';
// // import { BootstrapNumberView } from './BootstrapNumberView';
// // import { BootstrapObjectView } from './BootstrapObjectView';
// // import { BootstrapSelectionListView } from './BootstrapSelectionListView';
// // import { BootstrapStringView } from './BootstrapStringView';
// // import { BootstrapVariantView } from './BootstrapVariantView';
// // import { ErrorView } from './BootstrapErrorsView';
// // import { Pager } from './BootstrapPagerView';
// // import { VoidView } from './BootstrapVoidView';

// // export class BootstrapEngine extends FormContext {
// //   constructor(templates: Record<string, IFormType>) {
// //     super(templates);
// //   }

// //   getRenderer(type: IFormType): Component<any> {
// //     let actualType = this.getActualType(type);
// //     let typeRenderers: Record<string, Component<any>> = {
// //       'string': BootstrapStringView,
// //       'boolean': BootstrapBooleanView,
// //       'number': BootstrapNumberView,
// //       'array': BootstrapArrayView,
// //       'object': BootstrapObjectView,
// //       'variant': BootstrapVariantView,
// //       'selectionList': BootstrapSelectionListView,
// //       'date': DateInputView,
// //       'time': DateInputView,
// //       'datetime': DateInputView,
// //       'void': VoidView
// //     };
// //     let result = typeRenderers[actualType.view?.type ?? 'undefined'] ?? typeRenderers[actualType.type ?? 'undefined'];
// //     if (!result) {
// //       return () => <ErrorView error={`Form type is unknown ${JSON.stringify(actualType.type || null)}`} />
// //     }
// //     return result;

// //   }


// // }




// // interface IModalFormProps extends IFormProps {
// //   isOpen: boolean;
// //   setIsOpen: (value: boolean) => void;
// // }

// // export function ModalFormView: Component<IModalFormProps> = (props)   {

// //   const context = new BootstrapEngine(props.form.templates);
// //   const pageNo = context.pageNo;

// //   let onClose = () => { props.setIsOpen(false) }

// //   return (
// //     <ModalView isOpen={props.isOpen} onClose={onClose} title={props.form.name}
// //       buttons={[
// //         { text: "<", action: () => { pageNo.setValue(pageNo.getValue() - 1) }, class: "" },
// //         { text: String(pageNo.getValue()), action: () => { }, class: "" },
// //         { text: ">", action: () => { pageNo.setValue(pageNo.getValue() + 1) }, class: "" },
// //         { text: "Close", action: () => onClose(), class: "btn-primary" }]}>
// //       <FormBody
// //         {...props}
// //         context={context}
// //       />
// //     </ModalView>);

// // }

// // interface IPopupFormProps extends IFormProps {
// //   title?: string;
// //   isOpen: boolean;
// //   setIsOpen: (value: boolean) => void;
// // }

// // export function PopupFormView: Component<IPopupFormProps> = (props)   {
// //   const context = new BootstrapEngine(props.form.templates);
// //   let onClose = () => { props.setIsOpen(false) }

// //   return (
// //     <PopupView isOpen={props.isOpen} onClose={onClose} title={props.title}>
// //       <FormBody
// //         {...props}
// //         context={context}
// //       />
// //     </PopupView>);

// // }

// // export function formatTemplateString(templateString: string, data: Record<string, any>): HTMLElement {
// //   try {
// //     const compiledTemplate = Handlebars.compile(templateString);
// //     const result = compiledTemplate(data);

// //     const tempSpan = document.createElement('span');
// //     tempSpan.innerHTML = result;

// //     if (templateString.startsWith('<') && tempSpan.childElementCount == 1) {
// //       return tempSpan.firstElementChild as HTMLElement;
// //     } else {
// //       return tempSpan
// //     }
// //   }
// //   catch (e: unknown) {
// //     const errorSpan = document.createElement('span');
// //     errorSpan.innerText = String(e);
// //     return errorSpan;
// //   }
// // }


// export function PlainFormView: Component<IFormProps> = (props)   {
//   //   const context = new BootstrapEngine(props.form.templates);
//   //   let pageNo = context.pageNo;
//   return (<main>
//     this is a plain form here
//     {/*       <FormBody
//          context={context}
//          {...props}
//          header=<h1>{props.form.name}</h1>
//          footer={<>
//            <Pager pageCount={context.pageCount.getValue()} onPageSelected={p => pageNo.setValue(p)} selectedPage={pageNo.getValue()} />
//          </>
//          }
//        />*/}
//   </main >);
// }
