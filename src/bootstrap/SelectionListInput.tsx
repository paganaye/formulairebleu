import { Component, createMemo, createSignal } from 'solid-js';
import { Box } from '../core/Box';
import { OnValueChanged, BootstrapContext } from './BootstrapFormVue';
import { ErrorVue } from './ErrorsVue';
import { SingleSelectionVue } from './SingleSelectionVue';
import { MultipleSelectionVue } from './MultipleSelectionVue';
import { ISelectionEntry, ISelectionList, IView } from '../core/ICoreForm';
import { IBootstrapMultipleSelectionView, IBootstrapSingleSelectionView } from './IBootstrapForm';

export type SelectionListInputProps = {
  box: Box;
  onValueChanged: (onValueChanged: OnValueChanged) => void;
  label: string;
  context: BootstrapContext;
};

export const SelectionListInput: Component<SelectionListInputProps> = (props) => {

  let comp = createMemo(() => {
    let selectionList: ISelectionList | undefined = (props.box.getType() as any).selectionList ?? props.box.getType().selectionList;
    if (!selectionList) {
      return <ErrorVue error="Internal Error, no selection list set." />
    }
    if (!Array.isArray(selectionList.entries)) {
      return <ErrorVue error="dynamic-selection is not implemented yet." />
    }
    let entries: ISelectionEntry[] = selectionList.entries;
    if (!entries) {
      return <ErrorVue error="Internal Error, no selection entries set." />
    } else if (entries.length == 0) {
      return <ErrorVue error="Empty selection list." />
    }
    let view: IView = (props.box.getType() as any).selectionList ?? props.box.getType().view;
    if (selectionList.multiple) {
      if (!view) view = { type: 'checkboxes' }
      function setSelectedKeys(newArr: any[]) {
        props.box.setValue(newArr);
        props.onValueChanged({ pagesChanged: false });
      }

      return <MultipleSelectionVue label={props.label} entries={entries}
        selectedKeys={props.box.getJSONValue() as string[]} setSelectedKeys={setSelectedKeys}
        view={view as IBootstrapMultipleSelectionView} />

    } else {
      if (!view) view = { type: 'dropdown' }
      return <SingleSelectionVue label={props.label} entries={entries}
        selectedKey={String(props.box.getJSONValue())} setSelectedKey={(v) => {
          props.box.setValue(v);
          props.onValueChanged({ pagesChanged: false });
        }}
        view={view as IBootstrapSingleSelectionView} />
    }
  });
  return <>
    {comp()}
  </>;
}


