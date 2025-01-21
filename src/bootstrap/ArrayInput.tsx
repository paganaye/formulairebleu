import { Component, createEffect, createMemo, createSignal } from 'solid-js';
import { Box, ArrayBox, getDefaultValue } from '../core/Box';
import { IRenderOptions, OnValueChanged } from './FormVue';
import { InputRenderer, InputTop } from './InputRenderer';
import { ArrayRenderer, IColumn, SortOrder } from './ArrayRenderer';
import { IArrayType, ISelectionList } from '../core/ICoreForm';

export type ArrayInputProps = {
  box: ArrayBox;
  onValueChanged: (options: OnValueChanged) => void;
  label: string;
  options: IRenderOptions;
  selectionList?: ISelectionList;
  isSelected?: (item: any) => boolean;
  onSelectionChanged?: (item: any, newValue: boolean) => void;
};

export const ArrayInput: Component<ArrayInputProps> = (props) => {
  let [getEntries, setEntries] = createSignal<any[]>(props.box.getEntries())

  createEffect(() => {
    setEntries(props.box.getEntries());
  })
  //  return <ArrayInput0 {...props} />
  function newArrayEntry(): Box {
    let entryType = (props.box.getType() as IArrayType).entryType;
    return Box.enBox(props.box, props.label, entryType, getDefaultValue(entryType));
  }

  function addButton() {
    return props.options.readonly ? <></>
      : <button
        class="btn btn-sm btn-secondary mt-2"
        onClick={() => {
          let entries = [...getEntries()];
          entries.push(newArrayEntry());
          setEntries(entries);
          (props.box as any).setEntries(props.box.getType(), entries);
          props.onValueChanged({ pagesChanged: false });
        }}
      >Add</button>;
  }

  function deleteButton(index: () => number) {
    return props.options.readonly ? <></>
      : <button
        class="btn btn-sm btn-secondary mt-2"
        onClick={() => {
          let entries = [...getEntries()];
          entries.splice(index(), 1);
          setEntries(entries);
          (props.box as any).setEntries(props.box.getType(), entries);
          props.onValueChanged({ pagesChanged: false });
        }
        }
      > Delete</button >;
  }

  function renderEntry(entry: Box, index: () => number) {
    return <InputRenderer
      label={entry.name}
      box={entry}
      onValueChanged={() => {
        props.onValueChanged({});
      }}
      options={props.options} />;
  }

  const columns = createMemo(() => {
    let result: IColumn[] = [];
    let entryType = (props.box.getType() as IArrayType).entryType;
    if (!entryType) return [];

    if (entryType.type == 'object')
      result = entryType.membersTypes.map((t: any, i: any) => ({ key: t.key ?? "", label: t.key, memberIndex: i }));
    else result = [
      { key: "#value", label: "Value" }
    ]
    return result;
  })

  function renderEntryField(entry2: Box, index: () => number, column: IColumn) {
    return (<InputRenderer
      label={column.label ?? column.key}
      box={column.memberIndex == null ? entry2 : (entry2 as any).getMembers()[column.memberIndex ?? 0]}
      onValueChanged={(o) => {
        props.onValueChanged(o)
      }}
      options={props.options}
    />)
  }

  return <>
    <ArrayRenderer
      entries={getEntries()}
      viewAsType={props.box.getType().view as any}
      options={props.options}
      label={props.label}
      addButton={addButton}
      deleteButton={deleteButton}
      renderEntry={renderEntry}
      renderEntryField={renderEntryField}
      inputTop={() => <InputTop{...props as any} />}
      inputBottom={() => <InputTop{...props as any} />}
      isSelected={() => false}
      onSelectionChanged={() => undefined}
      columns={columns()}
    />
  </>;


}


