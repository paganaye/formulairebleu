import { Component, For, Match, Show, Switch, createMemo, createSignal } from 'solid-js';
import { IFormArray, FormLineTemplate, getExtendedTemplate, ExtendedLabel, IArrayButtons, getButtons, SectionLine } from '../core/FormTemplate';
import FormLineComponent from './FormLineComponent';
import LabelComponent from './LabelComponent';
import { SolidQuill } from './SolidQuill';

interface IFormArrayProps {
  template: IFormArray
  value: any;
  setValue: (value: any) => void
  onPropertyChanged: (key: string, value: any) => void;
}

interface IFormArrayItemProps {
  lineNo: () => number;
  el: any;
}


const FormArrayComponent: Component<IFormArrayProps> = (props) => {
  const buttons = createMemo<IArrayButtons>(() => getButtons(props.template.item, props.template.arrayButtons));
  const [selectedRowNo, setSelectedRowNo] = createSignal(0);

  function getValue(lineNo: number, col: FormLineTemplate) {
    let rowValue = props.value[lineNo]
    if ('key' in col && col.key) return rowValue[col.key]
    else return rowValue;
  }
  function setValue(lineNo: number, col: FormLineTemplate, newValue: any) {
    let rowValue = props.value[lineNo]
    rowValue[col.key] = newValue;
    props.onPropertyChanged(`${props.template.key}[${lineNo}].${col.key}`, newValue)
  }

  const FormArrayItems: Component = () => {
    return <For each={props.value}>
      {(el, lineNo) => <FormArrayItem el={el} lineNo={lineNo} />}
    </For>
  }

  function radioInput(lineNo: number) {
    console.log("radioInput", lineNo);
    setSelectedRowNo(lineNo);
  }

  const FormArrayItem: Component<IFormArrayItemProps> = (lineProps) => {
    const label = createMemo(() => buttons().itemLabel(lineProps.lineNo(), lineProps.el));
    const content = (<For each={props.template.columns}>
      {(col, colIdx) => (
        <>
          <FormLineComponent
            template={col}
            value={getValue(lineProps.lineNo(), col)}
            setValue={(value) => setValue(lineProps.lineNo(), col, value)}
            onPropertyChanged={(k: string, v: any) => onPropertyChanged(lineProps.lineNo(), k, v)}
          />
          {props.template.columns.length - 1 === colIdx() && (
            <button class="btn" onClick={() => animateAndRemove(lineProps.lineNo())}>{buttons().deleteItem(lineProps.lineNo(), lineProps.el)}</button>
          )}
        </>
      )}
    </For>);

    return (<Switch fallback={<p>Invalid view-as for FormText</p>}>
      <Match when={props.template.viewAs === 'tabs'}>
        <input type="radio" name="my_tabs_2" role="tab" class="tab" aria-label={label()}
          oninput={() => radioInput(lineProps.lineNo())}
          checked={lineProps.lineNo() === selectedRowNo()} />
        <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6">
          {content}
        </div>
      </Match>
      <Match when={props.template.viewAs === 'accordion'}>
        <div class="collapse collapse-arrow bg-base-200">
          <input type="radio" name="my-accordion-2"
            oninput={() => radioInput(lineProps.lineNo())}
            checked={lineProps.lineNo() === selectedRowNo()} />
          <div class="collapse-title text-xl font-medium">
            {label()}
          </div>
          <div class="collapse-content">
            {content}
          </div>
        </div>
      </Match>
      <Match when={true /*default*/}>
        <div id={`row-${lineProps.lineNo}`} class="row-animation">
          <label>{label()}</label>
          {content}
        </div>
      </Match>
    </Switch>);

  }

  function addRow() {
    let newArray = props.value.slice()
    newArray.push({});
    console.log("new Array", newArray)
    props.setValue(newArray)
    setSelectedRowNo(newArray.length - 1);
  }

  function deleteRow(idx: number) {
    let currentArray = props.value;
    let newArray = [
      ...currentArray.slice(0, idx),
      ...currentArray.slice(idx + 1)
    ];
    props.setValue(newArray);
  }
  function animateAndRemove(idx: number) {
    const item = document.getElementById(`row-${idx}`);
    item?.classList.add('fade-out');
    setTimeout(() => {
      deleteRow(idx);
      if (selectedRowNo() >= props.value.length)
        setSelectedRowNo(props.value.length - 1);
    }, 500); // Match this duration with your CSS animation duration
  }

  function onPropertyChanged(lineNo: number, k: string, v: any) {
    props.onPropertyChanged(`${props.template.key}[${lineNo}].${k}`, v);
  }
  return (
    <>
      <style>
        {`
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.row-animation {
  animation: fadeIn 0.5s ease forwards;
}

.fade-out {
  animation: fadeOut 0.5s ease forwards;
}

@keyframes fadeOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-20px); }
}
        `}
      </style>
      <Show when={props.template} fallback={<p>Array sans modèle</p>}>
        <pre>selectedRowNo {selectedRowNo()}</pre>
        <LabelComponent label={props.template.label}>
          <Switch fallback={<p>Invalid view-as for FormText</p>}>
            <Match when={props.template.viewAs === 'tabs'}>
              <div role="tablist" class="tabs tabs-lifted w-full">
                <FormArrayItems />
              </div>
            </Match>
            <Match when={props.template.viewAs === 'accordion'}>
              <FormArrayItems />
            </Match>
            <Match when={true /*default*/}>
              <FormArrayItems />
            </Match>
          </Switch>
          <button onClick={addRow} class="btn">{buttons().addItem(props.value.length)}</button>
        </LabelComponent>
      </Show>
    </>
  );
};

export default FormArrayComponent;