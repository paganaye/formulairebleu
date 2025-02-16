import { computed, formulaireBleuJSX, formulaireBleuJSXFragment, JSONValue, Show, Value } from "../../core/tiny-jsx";
import { Box, ArrayBox, ObjectBox } from "../../core/Box";
import { IArrayType, IObjectType, ISelectionList } from "../../core/IForm";
import { BootstrapEngine } from './BootstrapEngine';
import { For } from "../../core/tiny-jsx";
import { Styles } from "../../core/Styles";
import { ArrayUtils } from "../../core/ArrayUtils";

export type BootstrapArrayProps = {
    box: ArrayBox;
    label: string;
    level: number;
    engine: BootstrapEngine;
    isSelected?: (item: any) => boolean;
    onSelectionChanged?: (item: any, newValue: boolean) => void;
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

export function BootstrapArrayView(props: BootstrapArrayProps) {
    let viewAsType = props.box.type.view;
    let arrayUtils = new ArrayUtils(props.box)

    const renderFunctions = {
        table: renderAsTable,
        tabs: renderAsTabs,
        carousel: renderAsCarousel,
        list: renderAsList,
        flow: renderAsFlow,
        popup: renderAsPopup
    };
    let renderFunction = renderFunctions[viewAsType?.type] || renderAsFlow;
    let entryBoxes = props.box.entryBoxes;
    let currentPageBoxes = computed("BootstrapArrayView.currentPageBoxes", { $entryBoxes: props.box.entryBoxes, pageNo: props.engine.pageNo, rePaginationCount: props.engine.rePaginationCount }, (p) => {
        return props.box.entryBoxes.getValue().filter(p => props.engine.isBoxVisible(p))
    })

    function inputTop() {
        props.engine.InputTop(props)
    }

    function inputBottom() {
        props.engine.InputBottom(props)
    }

    function newArrayEntry(): JSONValue {
        let entryType = (props.box.type).entryType;
        return props.box.getDefaultValue();
    }

    function addButton() {
        return props.engine.isReadonly ? <></>
            : <button
                class="btn btn-sm btn-secondary mt-2"
                onClick={() => {
                    let values = props.box.getValue();
                    let newValues = [...values, newArrayEntry()]
                    props.box.setValue(newValues);
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
                    props.box.setValue(values);
                }}
            >Delete</button >;
    }

    function renderEntry(entry: Box, rowIndex: number) {
        let simpleField = (columns.length == 1 && columns[0].key === "#value");
        return (
            <div>
                <label>{entry.name}</label>
                {simpleField
                    ? <input
                        type="text"
                        value={entry.getValue() as string}
                        onInput={(e) => entry.setValue(e.currentTarget.value)}
                    />
                    : <For each={columns}>
                        {(column, columnIndex) => (renderEntryField(entry, rowIndex, column, columnIndex))}
                    </For>}
                {deleteButton(rowIndex)}
            </div>
        );
    }

    let columns: IColumn[] = [];
    let entryType = (props.box.type as IArrayType).entryType as IObjectType;
    if (entryType && entryType.type == 'object')
        columns = entryType.membersTypes.map((t: any, i: any) => ({ key: t.key ?? "", label: t.key, memberIndex: i }));
    else columns = [
        { key: "#value", label: "Value" }
    ]

    function renderEntryField(entry: Box, rowIndex: number, column: IColumn, columnIndex: number) {
        return (
            // <span>{column.memberIndex == null ? entry.getValue() : (entry as ObjectBox).getMembers()[column.memberIndex ?? 0].getValue()}</span>
            props.engine.InputRenderer({
                engine: props.engine,
                label: column.label,
                level: props.level,
                box: (entry instanceof ObjectBox) ? entry.members[columnIndex] : entry
            })
        );
    }

    interface TableRowProps {
        entry: any;
        index: number;
    }


    function TableRow(rowProps: TableRowProps) {

        return (<tr>
            <For each={columns}>
                {(column, columnIndex) => (<td>
                    {renderEntryField(rowProps.entry, rowProps.index, column, columnIndex)}
                </td>)}
            </For>
            <td>
                {deleteButton(rowProps.index)}
            </td>
        </tr>);

    }
    // function handleCheckBoxOrRadioInput(e: InputEvent, formMemberName: string, value: any) {
    //     let checkboxElement = e.target as HTMLInputElement;
    //     if (!checkboxElement) return
    //     let checked = checkboxElement.checked;
    //     props.onSelectionChanged?.(value, checked);
    // }

    function renderAsTable() {
        //     // const entryType = props.entryType;
        //     // var memberTypes: IObjectMemberType[] = entryType.type == 'object' ? entryType.membersTypes
        //     //    : [{ key: "", ...entryType }];


        return <>
            <label>{props.label}</label>
            {inputTop}
            <table>
                <thead>

                    <Show when={columns[0]?.key != "#value"}>
                        {computed("tableLabels", { sortOrder: arrayUtils.sortOrders }, (p) => (<tr>
                            <For each={columns}>
                                {(entry, index) => (
                                    <th class="table-title" onMouseDown={(e) => arrayUtils.toggleSort(entry.key, index, e)}>
                                        {entry.key}{arrayUtils.sortSuffix(entry.key)}
                                    </th>
                                )}
                            </For>
                            <th>&nbsp;</th>
                        </tr>))}
                    </Show>
                    <tr>
                        <For each={columns}>
                            {(entry, index) => (
                                <th>
                                    <input
                                        type="text"
                                        placeholder={`Filter`}
                                        style={{ width: '100%' }}
                                        onInput={(e) => arrayUtils.updateFilter(index, (e.target as HTMLInputElement).value)} />
                                </th>

                            )}
                        </For>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {computed("BootstrapArrayVIew.pageContent", { pageNo: props.engine.pageNo }, (p) => {

                        return <For each={arrayUtils.sortedValues}>
                            {(entry, index) => (
                                <TableRow {...props} entry={entry} index={index} />
                            )}
                        </For>
                    })}

                </tbody>
            </table>
            {addButton()}
            {inputBottom()}
        </>;
    }

    function renderAsPopup() {
        return (
            <>
                {inputTop}
                <div class="list-group">
                    <For each={currentPageBoxes}>
                        {(entry, index) => {
                            let isOpen = new Value("popupIsOpen", false);
                            return (
                                <div class="list-group-item list-group-item-action d-flex align-items-center"
                                    onClick={() => isOpen.setValue(true)}>
                                    <span>#{String(index + 1)} {props.engine.Span(entry)}</span>
                                    <props.engine.PopupButton visible={isOpen} button={<span></span>}>
                                        {renderEntry?.(entry, index)}
                                    </props.engine.PopupButton>
                                </div>
                            );
                        }}
                    </For >
                </div >
                {addButton()}
                {props.engine.InputBottom(props)}
            </>
        );
    }



    function renderAsFlow() {
        return (
            <>
                {inputTop}
                <For each={currentPageBoxes}>
                    {(entry, index) => (
                        <div class="flow-item">
                            {renderEntry?.(entry, index)}
                        </div>
                    )}
                </For>
                {addButton()}
                {props.engine.InputBottom(props)}
            </>
        );
    }


    function renderAsTabs() {
        const activeTab = new Value("tabsActiveTab", 0);
        return <>
            <div class="tabs-container">
                <ul class="nav nav-tabs">
                    <For each={currentPageBoxes}>
                        {(entry, index) => (
                            <li class="nav-item">
                                <button
                                    class={computed("tabsHeader#" + index, { activeTab }, p => `nav-link ${index === p.activeTab ? 'active' : ''}`)}
                                    onClick={() => activeTab.setValue(index)}
                                >
                                    {index + 1}
                                </button>
                            </li>
                        )}
                    </For>
                </ul>
                <div class="tab-content mt-3">
                    <For each={currentPageBoxes}>
                        {(entry, index) => (
                            <div class={computed("tabsPanel#" + index, { activeTab }, p => `tab-pane fade ${index === p.activeTab ? 'show active' : ''}`)}>
                                {renderEntry(entry, index)}
                            </div>
                        )}
                    </For>
                </div>
            </div >
            {inputBottom}
            {addButton()}
        </>
    }


    function renderAsCarousel() {
        const activeIndex = new Value("carouselActiveIndex", 0);
        const length = entryBoxes.getValue().length;
        const view: { autoplay?: boolean, interval?: number } = props.box.type.view as any || {};
        const autoplay = view.autoplay !== undefined ? view.autoplay : true;
        const intervalTime = view.interval ?? 3000;

        if (autoplay && length > 0) {
            const intervalId = setInterval(() => {
                activeIndex.setValue((activeIndex.getValue() + 1) % length);
            }, intervalTime);
        }

        return <>
            {inputTop()}
            <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-indicators">
                    <For each={entryBoxes}>
                        {(entry, index) => (
                            <button type="button"
                                class={computed("carouselClass", { activeIndex }, p => index === p.activeIndex ? 'active' : '')}
                                aria-current={computed("carouselAriaCurrent", { activeIndex }, p => index === p.activeIndex ? 'true' : 'false')}
                                aria-label={`Slide ${index + 1}`}
                                onClick={() => activeIndex.setValue(index)}
                            ></button>
                        )}
                    </For>
                </div>
                <div class="carousel-inner">
                    <For each={entryBoxes}>
                        {(entry, index) => (
                            <div class={computed("carouselInner", { activeIndex }, p => `carousel-item ${index === p.activeIndex ? 'active' : ''}`)}>
                                {renderEntry(entry, index)}
                            </div>
                        )}
                    </For>
                </div>
                <button class="carousel-control-prev" type="button"
                    onClick={() => activeIndex.setValue((activeIndex.getValue() - 1 + length) % length)}>
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button"
                    onClick={() => activeIndex.setValue((activeIndex.getValue() + 1) % length)}>
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
            {inputBottom()}
            {addButton()}
        </>;
    }

    function renderAsList() {
        //const selectionType = (props.selectionList && props.selectionList.multiple) ? "checkbox" : "radio";
        // const id = `list_${props.label.replace(/\s+/g, '_')}_${Math.random().toString(36).substr(2, 9)}`;

        // function handleListItemClick(e: MouseEvent) {
        //     const target = e.currentTarget as HTMLElement;
        //     const input = target.querySelector("input");
        //     if (!input) return;
        //     if (selectionType === "checkbox") {
        //         input.checked = !input.checked;
        //         props.onSelectionChanged?.(input.value, input.checked);
        //     } else {
        //         input.checked = true;
        //         props.onSelectionChanged?.(input.value, true);
        //     }
        // }

        // function handleInputChange(e: Event, entry: Box) {
        //     const input = e.currentTarget as HTMLInputElement;
        //     props.onSelectionChanged?.(entry, input.checked);
        // }

        // function getTitle(entry: Box): string {
        //     return entry.name || String(entry.getValue());
        // }

        // return <>
        //     {inputTop()}
        //     <ul class="list-group">
        //         <For each={currentPageBoxes}>
        //             {(entry) => {
        //                 const title = getTitle(entry);
        //                 return (
        //                     <li class="list-group-item" onClick={handleListItemClick} style="cursor: pointer;">
        //                         <input
        //                             class="form-check-input me-2"
        //                             type={selectionType}
        //                             name={selectionType === "radio" ? id : undefined}
        //                             value={title}
        //                             checked={props.isSelected ? props.isSelected(entry) : false}
        //                             oninput={(e) => handleInputChange(e, entry)}
        //                         />
        //                         <label class="form-check-label">{title}</label>
        //                     </li>
        //                 );
        //             }}
        //         </For>
        //     </ul>
        //     {inputBottom()}
        //     {addButton()}
        // </>;
        return <>todo</>
    }

    return <>
        <pre>hi here we have: {computed("BootstrapArrayView.Content", {}, (p) => 0)}</pre>
        {renderFunction}
    </>;


}