import { Component, createSignal, createMemo, For, Show, JSX, onCleanup } from "solid-js";
//import { Box } from "./Box";
import { formatTemplateString, IRenderOptions } from "./FormVue";
import { keepFocus } from "../core/Utils";
import { getUniqueId } from "../core/Utils";
import { Value } from "../core/Box";
import { Styles } from "../core/Styles";
import { Box } from "../core/Box";
import { IBootstrapFormEngine, IListView } from "./IBootstrapForm";
import { JSONObject, JSONValue } from "../core/Utils";

export type ArrayRendererProps<T = any> = {
  options: IRenderOptions;
  viewAsType: IBootstrapFormEngine['array'] | undefined;
  label: string;
  // entryType: IDataType;
  entries: T[]
  selectionType?: 'single' | 'multiple';
  renderEntry: (entry: T, index: () => number) => JSX.Element;
  renderEntryField: (entry: T, index: () => number, column: IColumn) => JSX.Element;
  deleteButton: (index: () => number) => JSX.Element;
  inputTop: () => JSX.Element;
  inputBottom: () => JSX.Element;
  addButton: () => JSX.Element;
  isSelected: (entry: T) => boolean;
  onSelectionChanged: (entry: T, value: boolean) => void;
  columns: IColumn[];
};


export interface IColumn {
  key: string;
  memberIndex?: number;
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

export function ArrayRenderer<T = any>(props: ArrayRendererProps<T>): JSX.Element {
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

    const [sortOrder, setSortOrder] = createSignal<SortOrder[]>([]);
    const [filters, setFilters] = createSignal<string[]>([]);

    function toggleSort(key: string, fieldNo: number, event: MouseEvent) {
      keepFocus(event);
      setSortOrder((prev) => {
        const existing = prev.find((s) => s.column.key === key);
        if (!existing) {
          return event.ctrlKey
            ? [...prev, { column: props.columns[fieldNo], direction: "asc" }]
            : [{ column: props.columns[fieldNo], direction: "asc" }];
        }
        if (existing.direction === "asc") {
          return prev.map((s) =>
            s.column.key === key ? { ...s, direction: "desc" } : s
          );
        }
        const newList = prev.filter((s) => s.column.key !== key);
        return event.ctrlKey ? newList : [];
      });
    }

    function updateFilter(index: number, value: string) {
      setFilters((prev) => {
        const newFilters = [...prev];
        newFilters[index] = value.toLowerCase(); // Normalisation en minuscules
        return newFilters;
      });
    }

    const filteredValues = createMemo(() => {
      const data = [...props.entries];
      const currentFilters = filters();

      return data.filter((entry) => {
        if (entry instanceof Box) entry = Box.unBox(entry) as any;
        return props.columns.every((column, index) => {
          const filterValue = currentFilters[index];
          if (!filterValue) return true; // Pas de filtre appliqué pour cette colonne
          const entryValue = (column.memberIndex !== undefined) ? (entry as JSONObject)[column.key] : entry;
          if (entryValue == null) return filterValue == 'null';
          const normalizedCellValue = String(entryValue).toLowerCase();
          return normalizedCellValue.includes(filterValue);
        });
      });
    });


    const sortedValues = createMemo(() => {
      const data = filteredValues(); // Appliquer le tri aux données filtrées
      const orderBy = sortOrder();

      data.sort((boxA: T, boxB: T) => {
        let a: JSONValue = (boxA instanceof Box) ? Box.unBox(boxA) : boxA as JSONValue;
        let b: JSONValue = (boxB instanceof Box) ? Box.unBox(boxB) : boxB as JSONValue;
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
      let sortOrderValue = sortOrder();
      const index = sortOrderValue.findIndex(s => s.column.key === key);
      if (index >= 0) {
        return (sortOrderValue[index].direction === "asc" ? "▲" : "▼") + (index > 0 ? String(index + 1) : "");
      }
      return "";
    }

    interface TableRowProps extends ArrayRendererProps {
      entry: any;
      index: () => number;
    }

    const TableRow: Component<TableRowProps> = (rowProps) => {
      //let memberTypes = (props.entryType as IObjectType).membersTypes;
      //let isObject = (props.entryType.type === 'object');
      let columns = rowProps.columns;


      return (<tr>
        <For each={columns}>
          {(column) => (<td>
            {rowProps.renderEntryField?.(rowProps.entry, rowProps.index, column)}
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
          <Show when={props.columns[0]?.key != "#value"}>
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
          </Show>
          <tr>
            <For each={props.columns}>
              {(entry, index) => (
                <th>
                  <input
                    type="text"
                    placeholder={`Filter`}
                    style={{ width: '100%' }}
                    onInput={(e) => updateFilter(index(), (e.target as HTMLInputElement).value)} />

                </th>
              )}
            </For>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <For each={sortedValues()}>
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
    let values = props.entries;
    return <>
      {/* <pre>{JSON.stringify(values, undefined, "   ")}</pre> */}
      {props.inputTop()}
      <Show when={values} fallback={(<p>No entries</p>)}>
        <For each={values}>
          {(entry, index) => (
            <>
              {props.renderEntry?.(entry, index)}
              {props.deleteButton?.(index)}
            </>
          )}
        </For>
      </Show>
      {props.inputBottom()}
      {props.addButton?.()}
    </>;

  }

  function renderAsTabs() {
    const [activeTab, setActiveTab] = createSignal(0);

    return (
      <>
        <div class="tabs-container">
          {/* Onglets de navigation */}
          <ul class="nav nav-tabs">
            <For each={props.entries}>
              {(entry, index) => (
                <li class="nav-item">
                  <button
                    class={`nav-link ${index() === activeTab() ? 'active' : ''}`}
                    onClick={() => setActiveTab(index())}
                  >
                    Tab {index() + 1}
                  </button>
                </li>
              )}
            </For>
          </ul>
          {/* Contenu des onglets */}
          <div class="tab-content mt-3">
            <For each={props.entries}>
              {(entry, index) => (
                <div
                  class={`tab-pane fade ${index() === activeTab() ? 'show active' : ''}`}
                >
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

  function renderAsAccordion() {
    const [openIndex, setOpenIndex] = createSignal<number | null>(0);

    return (<>
      <div class="accordion" id="accordionExample">
        <For each={props.entries}>
          {(entry, index) => (
            <div class="accordion-item">
              <h2 class="accordion-header" id={`heading-${index()}`}>
                <button
                  class={`accordion-button ${openIndex() === index() ? '' : 'collapsed'}`}
                  type="button"
                  onClick={() => setOpenIndex(openIndex() === index() ? null : index())}
                >
                  Item {index() + 1}
                </button>
              </h2>
              <div
                id={`collapse-${index()}`}
                class={`accordion-collapse collapse ${openIndex() === index() ? 'show' : ''}`}
                aria-labelledby={`heading-${index()}`}
              >
                <div class="accordion-body">
                  {props.renderEntry?.(entry, index)}
                </div>
              </div>
            </div>
          )}
        </For>
      </div>
      {props.inputBottom?.()}
      {props.addButton?.()}
    </>);
  }

  function renderAsCarousel() {
    return <p>TODO</p>
    // const [activeIndex, setActiveIndex] = createSignal(0);
    // const length = props.entries.length;
    // let viewAs = props.viewAsType as ICarouselView;
    // let intervalId: number | undefined;
    // if (viewAs.autoplay ?? true) {
    //   intervalId = setInterval(() => {
    //     setActiveIndex((activeIndex() + 1) % length);
    //   }, viewAs.interval ?? 3000) as any;
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
    const viewAs = props.viewAsType as IListView;
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
        <For each={props.entries}>
          {(entry) => {
            const title = formatTemplateString(viewAs?.templateString, entry as any);
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


  function onViewAsChanged(value: string) {
    console.log("onViewAsInput", value);
    viewAsType.setValue(value as any);
  }

  let entries = [
    { key: "table", label: "Table" },
    { key: "tabs", label: "Tabs" },
    { key: "accordion", label: "Accordion" },
    { key: "list", label: "List" },
    { key: "flow", label: "Flow" }
  ];

  const render = createMemo(() => {
    const renderFunctions = {
      table: renderAsTable,
      tabs: renderAsTabs,
      accordion: renderAsAccordion,
      carousel: renderAsCarousel,
      list: renderAsList,
      flow: renderAsFlow,
    };
    let renderFunction = renderFunctions[viewAsType.getValue()] || renderAsFlow;
    return <>
      <pre>{renderFunction.name}</pre>
      {renderFunction()}
    </>
  });

  return (
    <>
      {/* <SingleSelectionVue viewAs={{ type: 'dropdown' }} selectedKey={viewAsType.getValue()} entries={entries} setSelectedKey={(k) => onViewAsChanged(k)} label={"View as:"} /> */}
      {render()}
    </>
  );
};

