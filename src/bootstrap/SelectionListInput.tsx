import { Component, createMemo, createSignal } from 'solid-js';
import { Box } from '../core/Box';
import { OnValueChanged, IRenderOptions } from './FormVue';
import { ErrorVue } from './ErrorsVue';
import { SingleSelectionVue } from './SingleSelectionVue';
import { MultipleSelectionVue } from './MultipleSelectionVue';
import { IFormType, ISelectionList } from '../core/ICoreForm';
import { IMultipleSelectionViewAs, ISingleSelectionViewAs } from './IBootstrapForm';

export type SelectionListInputProps = {
  box: Box<IFormType>;
  onValueChanged: (options: OnValueChanged) => void;
  label: string;
  options: IRenderOptions;
};

export const SelectionListInput: Component<SelectionListInputProps> = (props) => {

  let comp = createMemo(() => {
    let selectionList: ISelectionList | undefined = (props.box.getType() as any).selectionList
    if (!selectionList) {
      return <ErrorVue error="Internal Error, no SelectionList set." />
    }

    if (selectionList.multiple) {
      let viewAs: IMultipleSelectionViewAs = selectionList.viewAs ?? { type: 'checkboxes' } as any;
      function setSelectedKeys(newArr: any[]) {
        props.box.setValue(newArr);
        props.onValueChanged({ pagesChanged: false });
      }

      return <MultipleSelectionVue label={props.label} entries={selectionList.entries}
        selectedKeys={props.box.getJSONValue() as string[]} setSelectedKeys={setSelectedKeys}
        viewAs={viewAs} />

    } else {
      let viewAs: ISingleSelectionViewAs = selectionList.viewAs as any ?? { type: 'dropdown' };
      return <SingleSelectionVue label={props.label} entries={selectionList.entries}
        selectedKey={String(props.box.getJSONValue())} setSelectedKey={(v) => {
          props.box.setValue(v);
          props.onValueChanged({ pagesChanged: false });
        }}
        viewAs={viewAs} />
    }
  });
  return <>{comp()}</>;
}


