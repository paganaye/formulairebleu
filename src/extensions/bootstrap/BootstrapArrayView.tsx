import { computed, formulaireBleuJSX, formulaireBleuJSXFragment, JSONValue, Value } from "../../core/tiny-jsx";
import { Box, ArrayBox, ObjectBox, getDefaultValue } from "../../core/Box";
import { ArrayRenderer, IColumn, SortOrder } from './BootstrapArrayRenderer';
import { IArrayType, ISelectionList } from "../../core/IForm";
import { BootstrapEngine } from './BootstrapEngine';

export type BootstrapArrayProps = {
  box: ArrayBox;
  label: string;
  level: number;
  engine: BootstrapEngine;
  selectionList?: ISelectionList;
  isSelected?: (item: any) => boolean;
  onSelectionChanged?: (item: any, newValue: boolean) => void;
};

export const BootstrapArrayView = (props: BootstrapArrayProps) => {

  // createEffect(() => {
  //   entries.setValue(props.box.getEntries());
  // })
  //  return <ArrayInput0 {...props} />
  function newArrayEntry(): JSONValue {
    let entryType = (props.box.type).entryType;
    return getDefaultValue(entryType);
  }

  function addButton() {
    return props.engine.isReadonly ? <></>
      : <button
        class="btn btn-sm btn-secondary mt-2"
        onClick={() => {
          let values = props.box.getValue();
          let newValues = [...values, newArrayEntry()]
          props.box.setValue(newValues, false);
        }}
      >Add</button>;
  }

  function deleteButton(index: number) {
    return props.engine.isReadonly ? <></>
      : <button
        class="btn btn-sm btn-secondary mt-2"
        onClick={() => {
          let values = props.box.getValue();
          values.splice(index, 1);
          props.box.setValue(values, false);
        }}
      > Delete</button >;
  }

  function renderEntry(entry: Box, index: number) {
    return (
      <div>
        <label>{entry.name}</label>
        <input
          type="text"
          value={entry.getValue() as string}
          onInput={(e) => entry.setValue(e.currentTarget.value, true)}
        />
        {deleteButton(index)}
      </div>
    );
  }

  const columns = computed({}, () => {
    let result: IColumn[] = [];
    let entryType = (props.box.type as IArrayType).entryType;
    if (!entryType) return [];

    if (entryType.type == 'object')
      result = entryType.membersTypes.map((t: any, i: any) => ({ key: t.key ?? "", label: t.key, memberIndex: i }));
    else result = [
      { key: "#value", label: "Value" }
    ]
    return result;
  });

  function renderEntryField(entry: Box, rowIndex: number, column: IColumn, columnIndex: number) {

    return (
      // <span>{column.memberIndex == null ? entry.getValue() : (entry as ObjectBox).getMembers()[column.memberIndex ?? 0].getValue()}</span>
      props.engine.InputRenderer({
        engine: props.engine,
        label: column.label,
        level: props.level,
        box: (entry as ObjectBox).members[columnIndex]
      })
    );
  }


  return <>
    <pre>hi here we have: {computed({}, (p) => 0)}</pre>
    <ArrayRenderer
      entryBoxes={props.box.$entryBoxes}
      viewAsType={props.box.type.view as any}
      engine={props.engine}
      label={props.label}
      addButton={addButton}
      deleteButton={deleteButton}
      renderEntry={renderEntry}
      renderEntryField={renderEntryField}
      inputTop={() => props.engine.InputTop(props)}
      inputBottom={() => props.engine.InputBottom(props)}
      isSelected={() => false}
      onSelectionChanged={() => undefined}
      columns={columns.getValue()}
    />
  </>;


}


