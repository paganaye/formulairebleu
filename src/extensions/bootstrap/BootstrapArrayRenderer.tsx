import { For, JSONObject, JSONValue, JSXSource, Show, computed, formulaireBleuJSX, formulaireBleuJSXFragment } from "../../core/tiny-jsx";
import { keepFocus } from "../../core/Utils";
import { getUniqueId } from "../../core/Utils";
import { Value } from '../../core/tiny-jsx';
import { Styles } from "../../core/Styles";
import { Box } from "../../core/Box";
import { IBootstrapListView } from "./BootstrapForm";
import { FormEngine } from "../../core/FormEngine";

export type ArrayRendererProps<T = any> = {
  engine: FormEngine;
  viewAsType: any | undefined;
  label: string;
  // entryType: IDataType;
  entryBoxes: Value<Box[]>
  selectionType?: 'single' | 'multiple';
  renderEntry: (entry: T, index: number) => JSXSource;
  renderEntryField: (entry: T, rowIndex: number, column: IColumn, columnIndex: number) => JSXSource;
  deleteButton: (index: number) => JSXSource;
  inputTop: () => JSXSource;
  inputBottom: () => JSXSource;
  addButton: () => JSXSource;
  isSelected: (entry: T) => boolean;
  onSelectionChanged: (entry: T, value: boolean) => void;
  columns: IColumn[];
};


export interface IColumn {
  key: string;
  label?: string;
  width?: number;
}

export interface SortOrder {
  column: IColumn;
  direction: "asc" | "desc";
}

Styles.add("th.table-title", {
  cursor: "pointer "
});

export function ArrayRenderer<T = any>(props: ArrayRendererProps<T>): JSXSource {
  let viewAsType = new Value(props.viewAsType?.type ?? "table");

  function handleCheckBoxOrRadioInput(e: InputEvent, formMemberName: string, value: any) {
    let checkboxElement = e.target as HTMLInputElement;
    if (!checkboxElement) return
    let checked = checkboxElement.checked;
    props.onSelectionChanged?.(value, checked);
  }

  function renderAsTable() {
    // const entryType = props.entryType;
    // var memberTypes: IObjectMemberType[] = entryType.type == 'object' ? entryType.membersTypes
    //    : [{ key: "", ...entryType }];

    const sortOrder = new Value<SortOrder[]>([]);
    const filters = new Value<string[]>([]);

    function toggleSort(key: string, fieldNo: number, event: MouseEvent) {
      keepFocus(event);
      // sortOrder.setValue((prev) => {
      //   const existing = prev.find((s) => s.column.key === key);
      //   if (!existing) {
      //     return event.ctrlKey
      //       ? [...prev, { column: props.columns[fieldNo], direction: "asc" }]
      //       : [{ column: props.columns[fieldNo], direction: "asc" }];
      //   }
      //   if (existing.direction === "asc") {
      //     return prev.map((s) =>
      //       s.column.key === key ? { ...s, direction: "desc" } : s
      //     );
      //   }
      //   const newList = prev.filter((s) => s.column.key !== key);
      //   return event.ctrlKey ? newList : [];
      // });
    }

    function updateFilter(index: number, value: string) {
      // setFilters((prev) => {
      //   const newFilters = [...prev];
      //   newFilters[index] = value.toLowerCase(); // Normalisation en minuscules
      //   return newFilters;
      // });
    }

    const filteredValues = computed({ entries: props.entryBoxes }, (p) => {
      const data = [...p.entries];
      const currentFilters = filters.getValue();

      return data.filter((entry) => {
        if (entry instanceof Box) entry = Box.unBox(entry as any) as any;
        return props.columns.every((column, index) => {
          const filterValue = currentFilters[index];
          if (!filterValue) return true; // Pas de filtre appliqué pour cette colonne
          const entryValue = column.key ? (entry as JSONObject)[column.key] : entry;
          if (entryValue == null) return filterValue == 'null';
          const normalizedCellValue = String(entryValue).toLowerCase();
          return normalizedCellValue.includes(filterValue);
        });
      });
    });


    const sortedValues = computed({ filteredValues }, (p) => {
      const data = p.filteredValues; // Appliquer le tri aux données filtrées
      const orderBy = sortOrder.getValue();

      data.sort((boxA: T, boxB: T) => {
        let a: JSONValue = (boxA instanceof Box) ? Box.unBox(boxA as any) : boxA as JSONValue;
        let b: JSONValue = (boxB instanceof Box) ? Box.unBox(boxB as any) : boxB as JSONValue;
        for (const order of orderBy) {
          const columnKey = order.column.key;

          let result: number = 0;

          if (a && typeof (a) === 'object' && b && typeof b == 'object') {
            a = (a as JSONObject)[columnKey];
            b = (b as JSONObject)[columnKey];
          }
          if (typeof a === 'number' && typeof b === 'number') {
            result = a - b;
          } else if (typeof a === 'boolean' && typeof b === 'boolean') {
            result = (a === b) ? 0 : (a ? 1 : -1);
          } else {
            a = (a == null) ? "" : String(a);
            b = (b == null) ? "" : String(b);
            result = a.localeCompare(b);
          }

          if (result !== 0) {
            if (order.direction === "desc") return -result;
            else return result;
          }
        }
        if (boxA instanceof Box && boxB instanceof Box) {
          return boxA.uniqueId - boxB.uniqueId;
        }
        return 0;
      });
      return [...data];
    });

    function sortSuffix(key: string | undefined) {
      if (!key) return "";
      let sortOrderValue = sortOrder.getValue();
      const index = sortOrderValue.findIndex(s => s.column.key === key);
      if (index >= 0) {
        return (sortOrderValue[index].direction === "asc" ? "▲" : "▼") + (index > 0 ? String(index + 1) : "");
      }
      return "";
    }

    interface TableRowProps extends ArrayRendererProps {
      entry: any;
      index: number;
    }

    const TableRow = (rowProps: TableRowProps) => {
      //let memberTypes = (props.entryType as IObjectType).membersTypes;
      //let isObject = (props.entryType.type === 'object');
      let columns = rowProps.columns;


      return (<tr>
        <For each={columns}>
          {(column, columnIndex) => (<td>
            {rowProps.renderEntryField?.(rowProps.entry, rowProps.index, column, columnIndex)}
          </td>)}
        </For>
        <td>
          {rowProps.deleteButton(rowProps.index)}
        </td>
      </tr>);
    };


    return <>
      <label>{props.label}</label>
      {props.inputTop()}
      <table>
        <thead>
          {/* <Show when={props.columns[0]?.key != "#value"}>
            <tr>
              <For each={props.columns}>
                {(entry, index) => (
                  <th class="table-title" onMouseDown={(e) => toggleSort(entry.key!!, index(), e)}>
                    {entry.key}{sortSuffix(entry.key)}
                  </th>
                )}
              </For>
              <th>&nbsp;</th>
            </tr>
          </Show> */}
          <tr>
            <For each={props.columns}>
              {(entry, index) => (
                <th>
                  <input
                    type="text"
                    placeholder={`Filter`}
                    style={{ width: '100%' }}
                    onInput={(e) => updateFilter(index, (e.target as HTMLInputElement).value)} />

                </th>
              )}
            </For>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <For each={sortedValues}>
            {(entry, index) => (
              <TableRow {...props} entry={entry} index={index} />
            )}
          </For>
        </tbody>
      </table>
      {props.addButton?.()}
      {props.inputBottom()}
    </>;
  }

  function renderAsFlow() {
    return (
      <>
        {props.inputTop()}
        <For each={props.entryBoxes}>
          {(entry, index) => (
            <div class="flow-item">
              {props.renderEntry?.(entry, index)}
            </div>
          )}
        </For>
        {props.inputBottom()}
        {props.addButton?.()}
      </>
    );
  }


  function renderAsTabs() {
    const activeTab = new Value(0);

    return (
      <>
        <div class="tabs-container">
          <ul class="nav nav-tabs">
            <For each={props.entryBoxes}>
              {(entry, index) => (
                <li class="nav-item">
                  <button
                    class={`nav-link ${index() === activeTab.getValue() ? 'active' : ''}`}
                    onClick={() => activeTab.setValue(index())}
                  >
                    {index() + 1}
                  </button>
                </li>
              )}
            </For>
          </ul>
          <div class="tab-content mt-3">
            <For each={props.entryBoxes}>
              {(entry, index) => (
                <div class={`tab-pane fade ${index() === activeTab.getValue() ? 'show active' : ''}`}>
                  {props.renderEntry?.(entry, index)}
                </div>
              )}
            </For>
          </div>
        </div>
        {props.inputBottom?.()}
        {props.addButton?.()}
      </>
    );
  }



  function renderAsCarousel() {
    return <p>TODO</p>
    // const [activeIndex, setActiveIndex] = createSignal(0);
    // const length = props.entries.length;
    // let view = props.viewAsType as ICarouselView;
    // let intervalId: number | undefined;
    // if (view.autoplay ?? true) {
    //   intervalId = setInterval(() => {
    //     setActiveIndex((activeIndex() + 1) % length);
    //   }, view.interval ?? 3000) as any;
    // }
    // onCleanup(() => {
    //   if (intervalId !== undefined) {
    //     clearInterval(intervalId);
    //   }
    // });

    // return (<>
    //   <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
    //     {/* Indicateurs */}
    //     {/* <div class="carousel-indicators">
    //              <For each={props.box.value}>
    //                {(_, index) => (
    //                  <button
    //                    type="button"
    //                    class={index() === activeIndex() ? 'active' : ''}
    //                    aria-current={index() === activeIndex() ? 'true' : 'false'}
    //                    aria-label={`Slide ${index() + 1}`}
    //                    onClick={() => setActiveIndex(index())}
    //                  ></button>
    //                )}
    //              </For>
    //            </div> */}
    //     {/* Slides */}
    //     <div class="carousel-inner">
    //       <For each={props.entries}>
    //         {(entry, index) => (
    //           <div class={`carousel-item ${index() === activeIndex() ? 'active' : ''}`}>
    //             {props.renderEntry?.(entry, index)}
    //           </div>
    //         )}
    //       </For>
    //     </div>
    //     {/* Contrôles */}
    //     {/* <button
    //              class="carousel-control-prev"
    //              type="button"
    //              data-bs-target="#carouselExample"
    //              data-bs-slide="prev"
    //            >
    //              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    //              <span class="visually-hidden">Previous</span>
    //            </button>
    //           <button
    //              class="carousel-control-next"
    //              type="button"
    //              data-bs-target="#carouselExample"
    //              data-bs-slide="next"
    //            >
    //              <span class="carousel-control-next-icon" aria-hidden="true"></span>
    //              <span class="visually-hidden">Next</span>
    //            </button>
    //           <span class="carousel-control-next-icon" aria-hidden="true"></span>
    //            <span class="visually-hidden">Next</span> */}
    //   </div>
    //   {props.inputBottom?.()}
    //   {props.addButton?.()}
    // </>);
  }


  function renderAsList() {
    const view = props.viewAsType as IBootstrapListView;
    const selectionType = props.selectionType;
    let id = getUniqueId(`list_${props.label}`)
    function handleListItemClick(e: MouseEvent) {
      const input = (e.currentTarget as HTMLElement).querySelector("input");
      if (input?.type === "checkbox") {
        input.checked = !input.checked;
      } else {
        input?.click();
        // if (props.selectionList?.selectClosesModal) {
        //   setTimeout(() => closeTopModal())
        // }
      }
    };

    return (<>
      <ul class="list-group">
        <For each={props.entryBoxes}>
          {(entry) => {
            const title = "TODO"; //formatTemplateString(view?.templateString, entry as any);
            const inputType = props.selectionType === "multiple" ? "checkbox" : "radio";
            return (
              <li class="list-group-item" onClick={handleListItemClick} style="cursor: pointer;">
                <input
                  class="form-check-input me-2"
                  type={inputType}
                  name={inputType === "radio" ? id : undefined}
                  value={String(title)}
                  checked={props.isSelected?.(entry)}
                  oninput={(e) => handleCheckBoxOrRadioInput(e, id, entry)}
                />
                <label class="form-check-label">{title}</label>
              </li>
            );
          }}
        </For>
      </ul>
      {props.inputBottom?.()}
      {props.addButton?.()}
    </>);
  }

  const render = computed({}, () => {
    const renderFunctions = {
      table: renderAsTable,
      tabs: renderAsTabs,
      carousel: renderAsCarousel,
      list: renderAsList,
      flow: renderAsFlow,
    };
    let renderFunction = renderFunctions[viewAsType.getValue()] || renderAsFlow;
    return <>
      {renderFunction()}
    </>
  });

  return (
    <>
      {/* <SingleSelectionVue view={{ type: 'dropdown' }} selectedKey={viewAsType.getValue()} entries={entries} setSelectedKey={(k) => onViewChanged(k)} label={"View as:"} /> */}
      {render.getValue()}
    </>
  );
};

