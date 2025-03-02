import { computed, formulaireBleuJSX, formulaireBleuJSXFragment, IObservable, JSONObject, JSONValue, Observable, Variable } from "./tiny-jsx";
import { Box, ArrayBox, ObjectBox } from "./Box";
import { IArrayType, IFormType, IObjectType, ISelectionList } from "./IForm";
import { FormEngine } from "./FormEngine";
import { keepFocus } from "./Utils";

export type BaseArrayProps = {
  box: ArrayBox;
  label: string;
  level: number;
  engine: FormEngine;
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

export class ArrayUtils {
  sortOrders = new Variable<SortOrder[]>("arraySortOrders", []);
  filters = new Variable<string[]>("arrayFilters", []);
  entryBoxes: IObservable<Box<IFormType>[]>;
  columns: IColumn[] = undefined;

  constructor(readonly box: ArrayBox) {
    this.entryBoxes = box.entryBoxes;

    let entryType = (this.box.type as IArrayType).entryType;
    this.columns = (entryType && entryType.type == 'object')
      ? (entryType as IObjectType).membersTypes.map((t: any, i: any) => ({ key: t.key ?? "", label: t.key, memberIndex: i }))
      : [{ key: "#value", label: "Value" }]

  }

  // createEffect(() => {
  //   entries.setValue(props.box.getEntries());
  // })
  //  return <ArrayInput0 {...props} />

  newArrayEntry(): JSONValue {
    let entryType = (this.box.type).entryType;
    return this.box.getDefaultValue();
  }

  addValue() {
    let values = this.box.getValue();
    let newValues = [...values, this.newArrayEntry()]
    this.box.setValue(newValues);
  }

  deleteValue(index: number) {
    let values = this.box.getValue();
    values.splice(index, 1);
    this.box.setValue(values);
  }

  toggleSort(key: string, fieldNo: number, event: MouseEvent) {
    keepFocus(event);
    let prev = this.sortOrders.getValue();
    const existing = prev.find((s) => s.column.key === key);

    let newList;
    if (!existing) {
      newList = event.ctrlKey
        ? [...prev, { column: this.columns[fieldNo], direction: "asc" }]
        : [{ column: this.columns[fieldNo], direction: "asc" }];
    } else if (existing.direction === "asc") {
      newList = prev.map((s) =>
        s.column.key === key ? { ...s, direction: "desc" } : s
      );
    } else {
      newList = event.ctrlKey
        ? prev.filter((s) => s.column.key !== key)
        : [];
    }
    console.log(JSON.stringify(newList));
    this.sortOrders.setValue(newList);
  }

  updateFilter(index: number, value: string) {
    const newFilters = [...this.filters.getValue()];
    newFilters[index] = value.toLowerCase();
    this.filters.setValue(newFilters);
  }

  _filteredValues: IObservable<any[]> = undefined;

  get filteredValues() {
    return this._filteredValues ?? (this._filteredValues = computed("arrayFilteredValues", { entries: this.entryBoxes, filters: this.filters }, (p) => {
      const data = [...p.entries];
      const currentFilters = p.filters;

      let result: any[] = data.filter((entry) => {
        if (entry instanceof Box) entry = Box.unBox(entry as any) as any;
        return this.columns.every((column, index) => {
          const filterValue = currentFilters[index];
          if (!filterValue) return true;
          const entryValue = column.key ? entry[column.key] : entry;
          if (entryValue == null) return filterValue == 'null';
          const normalizedCellValue = String(entryValue).toLowerCase();
          return normalizedCellValue.includes(filterValue);
        });
      });
      return result;
    }));
  }


  _sortedValues: any = undefined;

  get sortedValues() {
    return this._sortedValues ?? (this._sortedValues = computed("arraySortedValues", { filteredValues: this.filteredValues, sortOrder: this.sortOrders }, (p) => {
      const data = p.filteredValues;
      const orderBy = p.sortOrder;

      data.sort((boxA: Box, boxB: Box) => {
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

    }));

  }

  sortSuffix(key: string | undefined) {
    if (!key) return "";
    let sortOrderValue = this.sortOrders.getValue();
    const index = sortOrderValue.findIndex(s => s.column.key === key);
    if (index >= 0) {
      return (sortOrderValue[index].direction === "asc" ? "▲" : "▼") + (index > 0 ? String(index + 1) : "");
    }
    return "";
  }



}


