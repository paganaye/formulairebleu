import { computed, formulaireBleuJSX, formulaireBleuJSXFragment } from "../../core/tiny-jsx";
import { Box } from "../../core/Box";
import { ErrorView } from './BootstrapErrorsView';
import { SingleSelectionVue } from './BootstrapSingleSelectionView';
import { MultipleSelectionVue } from './BootstrapMultipleSelectionView';
import { ISelectionEntry, ISelectionList, IView } from "../../core/IForm";
import { IBootstrapMultipleSelectionView, IBootstrapSingleSelectionView } from './BootstrapForm';
import { BootstrapEngine } from './BootstrapEngine';

export type SelectionListInputProps = {
  box: Box;
  label: string;
  engine: BootstrapEngine;
};

export const BootstrapSelectionListView = (props: SelectionListInputProps) => {

  let comp = computed({}, () => {
    let selectionList: ISelectionList | undefined = (props.box.type as any).selectionList ?? props.box.type.selectionList;
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
    let view: IView = (props.box.type as any).selectionList ?? props.box.type.view;
    if (selectionList.multiple) {
      if (!view) view = { type: 'checkboxes' }
      function setSelectedKeys(newArr: any[]) {
        props.box.setValue(newArr);
        //        props.onValueChanged({ pagesChanged: false });
      }

      return <MultipleSelectionVue label={props.label} entries={entries}
        selectedKeys={props.box.getValue() as string[]} setSelectedKeys={setSelectedKeys}
        view={view as IBootstrapMultipleSelectionView} />

    } else {
      if (!view) view = { type: 'dropdown' }
      return <SingleSelectionVue label={props.label} entries={entries}
        selectedKey={String(props.box.getValue())} setSelectedKey={(v) => {
          props.box.setValue(v);
          //props.onValueChanged({ pagesChanged: false });
        }}
        view={view as IBootstrapSingleSelectionView} />
    }
  });
  return <>
    {comp.getValue()}
  </>;
}


