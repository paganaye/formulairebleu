import { Component, createMemo, createSignal } from 'solid-js';
import { Box } from "../../core/Box";
import { ErrorView } from './BootstrapErrorsView';
import { SingleSelectionVue } from './BootstrapSingleSelectionView';
import { MultipleSelectionVue } from './BootstrapMultipleSelectionView';
import { formulairebleu } from "../../core/IForm";
type ISelectionEntry = formulairebleu.ISelectionEntry;
type ISelectionList = formulairebleu.ISelectionList;
type IView = formulairebleu.IView;
import { IBootstrapMultipleSelectionView, IBootstrapSingleSelectionView } from './BootstrapForm';
import { OnValueChanged } from '../../core/FormEngine';
import { BootstrapEngine } from './BootstrapEngine';

export type SelectionListInputProps = {
  box: Box;
  onValueChanged: (onValueChanged: OnValueChanged) => void;
  label: string;
  engine: BootstrapEngine;
};

export const BootstrapSelectionListView: Component<SelectionListInputProps> = (props) => {

  let comp = createMemo(() => {
    let selectionList: ISelectionList | undefined = (props.box.getType() as any).selectionList ?? props.box.getType().selectionList;
    if (!selectionList) {
      return <ErrorView error="Internal Error, no selection list set." />
    }
    if (!Array.isArray(selectionList.entries)) {
      return <ErrorView error="dynamic-selection is not implemented yet." />
    }
    let entries: ISelectionEntry[] = selectionList.entries;
    if (!entries) {
      return <ErrorView error="Internal Error, no selection entries set." />
    } else if (entries.length == 0) {
      return <ErrorView error="Empty selection list." />
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


