import { Component, For, JSX, createMemo, createSignal } from 'solid-js';
import { FormSection, FormTemplate } from '../core/FormTemplate';
import FormPage from './FormPageComponent';
import FormPageComponent from './FormPageComponent';
// import { navigateToPage } from '../App';
// import { twMerge } from 'tailwind-merge';

interface IFormProps {
  //   class?: string;
  //   startIcon?: any;
  //   onClick?: (event: MouseEvent) => void;
  //   disabled?: boolean;
  //   children: JSX.Element;
  template: FormTemplate
  value: any;
  setValue: (value: any) => void;
  onPropertyChanged: (key: string, value: any) => void;
}

const FormComponent: Component<IFormProps> = (props) => {
  let [pageNo, setPageNo] = createSignal(1)
  //const [liveValue, setLiveValue] = createSignal(props.value)
  //   function handleClick(event: MouseEvent) {
  //     event.preventDefault();
  //     props.onClick(event)
  //   };
  let pages = createMemo(() => {
    let page = 0
    let currentPage: FormSection[];
    let pages: FormSection[][] = []
    props.template.sections.forEach((section, i) => {
      if (i == 0 || section.newPage) {
        page += 1
        currentPage = []
        pages.push(currentPage);
      }
      currentPage.push(section)
    })
    return pages;
  })
  let currentPage = createMemo(() => {
    return pages()[pageNo() - 1];
  })

  function onPropertyChanged(k: string, v: any) {
    //props.setValue(this.value);
    props.onPropertyChanged(k, v);
    // while in the different pages and components we try to not raise value changes
    // to avoid unnecessary refresh.
    // here at FormLevel we do raise a value changed so that it can be reflected outside.
    props.setValue({ ...this.value })
  }

  return (
    <>
      <h1>{props.template.title}</h1>
      <p>page: {pageNo()}</p>
      <FormPageComponent template={currentPage()} value={props.value} setValue={props.setValue}
        onPropertyChanged={onPropertyChanged} />
      <button class="btn" onClick={() => setPageNo(pageNo() - 1)}>-1</button>
      <button class="btn" onClick={() => setPageNo(pageNo() + 1)}>+1</button>
    </>
  );
};

export default FormComponent;