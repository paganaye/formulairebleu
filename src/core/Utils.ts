import { Aggregation } from "./FormTemplate";

export function aggregate(rows: any[], colIndex: number, footer: Aggregation): number {
  let values: number[] = []
  rows.forEach(c => {
    try {
      if (c && c.responses) {
        let str = c.responses[colIndex].getValue();
        if (str != null) {
          let num = Number.parseFloat(str);
          values.push(num)
        }
      }
    } catch (error) {
      return undefined
    }
  });
  switch (footer.type) {
    case "min":
      return Math.min(...values)
    case "max":
      return Math.max(...values)
    case "avg":
      return values.reduce((a, b) => a + b, 0) / values.length;
    case "sum":
      return values.reduce((a, b) => a + b, 0);
  }
  return NaN
}
// export function getIdFromUrl(url: string): string {
//   if (!url) return ""
//   let result = url.match(/[-\w]{20,}/);
//   if (!result) throw Error("Invalid document url " + url);
//   return result.toString();
// }

// export function delay(sec: number) {
//   return new Promise((resolve) => setTimeout(resolve, sec * 1000))
// }


// export async function getOrCache<T>(key: any, action: () => Promise<T>): Promise<T> {
//   let cacheKey = JSON.stringify(key);
//   let cachedString = localStorage.getItem(cacheKey);
//   if (cachedString) {
//     let cachedObject = JSON.parse(cachedString);
//     return cachedObject.value as T
//   } else {
//     let values = await action()
//     localStorage.setItem(cacheKey, JSON.stringify({ value: values }));
//     return values;
//   }
// }

// export function googleDocExportAs(docId: string, format = "html") {
//   const url = `https://docs.google.com/document/d/${docId}/export?format=${format}`;
// }

// export interface IDataSource<T = any> {
//   columns: IColumn[];
//   rowObjects: T[];
// }

// export function cellValuesToObjects(cellValues: CellValues): IDataSource {
//   let header = cellValues.shift() ?? []
//   let columns = headerRowToColumns(header);
//   let rowObjects: object[] = [];

//   for (let row of cellValues) {
//     let rowObject: RowObject = {};
//     row.forEach((r, idx) => {
//       rowObject[columns[idx].fieldName] = r;
//     });
//     rowObjects.push(rowObject)
//   }
//   return {
//     columns,
//     rowObjects
//   };

//   function headerRowToColumns<T extends object>(header: CellRow): IColumn[] {
//     let result = header.map((columnText, idx) => {
//       let column: IColumn = ({
//         fieldName: columnText.toString().replace(/ /g, '') ?? "col#" + (idx + 1),
//         columnText: columnText.toString()
//       });
//       return column;
//     });
//     return result;
//   }
// }


// export function notNull<T>(array: (T | null | undefined)[]): T[] {
//   return array.filter(item => item != null) as T[];
// }
