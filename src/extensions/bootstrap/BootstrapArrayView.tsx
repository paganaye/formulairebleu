import { Component, createEffect, createMemo, createSignal } from 'solid-js';
import { Box, getDefaultValue } from "../../core/Box";
import { ArrayRenderer, IColumn, SortOrder } from './BootstrapArrayRenderer';
import { formulairebleu } from "../../core/IForm";
import { OnValueChanged } from '../../core/FormEngine';
import { BootstrapEngine } from './BootstrapEngine';
type IArrayType = formulairebleu.IArrayType;
type ISelectionList = formulairebleu.ISelectionList;

export type ArrayInputProps = {
  box: Box;
  onValueChanged: (onValueChanged: OnValueChanged) => void;
  label: string;
  level: number;
  engine: BootstrapEngine;
  selectionList?: ISelectionList;
  isSelected?: (item: any) => boolean;
  onSelectionChanged?: (item: any, newValue: boolean) => void;
};

export const BootstrapArrayView: Component<ArrayInputProps> = (props) => {
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
    return props.engine.isReadonly ? <></>
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
    return props.engine.isReadonly ? <></>
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
    return <>todo</>
    // <InputRenderer
    //   label={entry.name}
    //   level={props.level + 1}
    //   box={entry}
    //   onValueChanged={() => {
    //     props.onValueChanged({});
    //   }}
    //   engine={props.engine} />;
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
    return <>todo</>
    // (<InputRenderer
    //   label={column.label ?? column.key}
    //   box={column.memberIndex == null ? entry2 : (entry2 as any).getMembers()[column.memberIndex ?? 0]}
    //   level={props.level + 1}
    //   onValueChanged={(o) => {
    //     props.onValueChanged(o)
    //   }}
    //   context={props.engine}
    // />)
  }

  return <>
    <ArrayRenderer
      entries={getEntries()}
      viewAsType={props.box.getType().view as any}
      engine={props.engine}
      label={props.label}
      addButton={addButton}
      deleteButton={deleteButton}
      renderEntry={renderEntry}
      renderEntryField={renderEntryField}
      inputTop={() => <p>todo</p> /*<InputTop{...props as any} />*/}
      inputBottom={() => <p>todo</p>/*<InputTop{...props as any} />*/}
      isSelected={() => false}
      onSelectionChanged={() => undefined}
      columns={columns()}
    />
  </>;


}


