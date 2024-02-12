// import { Component, For, Show, createEffect, createMemo } from 'solid-js';
// import { IDataSource, cellValuesToObjects } from '../core/Utils';

// interface IDataTableProps {
//   objects?: IDataSource;
//   columns?: string[],
//   selectedRow?: object,
//   setSelectedRow?: (o: Object) => void
// }

// const DataTable: Component<IDataTableProps> = (props) => {
//   const columns = createMemo(() => {
//     return props.columns ? props.columns.map(c => props.objects?.columns?.find(c2 => c2?.fieldName == c)).map(c => Boolean(c))
//       : props.objects?.columns;
//   });

//   function handleClick(object: Object) {
//     if (props.setSelectedRow) props.setSelectedRow(object);
//   }

//   return (
//     <div style="flex-1 overflow: scroll">
//       <Show when={props.objects} fallback={<p>{"No data"}</p>}>
//         <div class="max-w-full overflow-x-auto" >
//           <table class="table w-full">
//             <thead>
//               <tr>
//                 <th></th>
//                 <For each={columns()}>{(h) => <th>{h.columnText}</th>}</For>
//               </tr>
//             </thead>
//             <tbody>
//               <For each={props.objects.rowObjects}>
//                 {(row, index) => (
//                   <tr classList={{
//                     "bg-base-200": props?.selectedRow === row,
//                     "hover": true
//                   }}
//                     onClick={() => handleClick(row)}>
//                     <th>{index() + 1}</th>
//                     <For each={columns()}>{(column) => <td>{row[column.fieldName]}</td>}</For>
//                   </tr>
//                 )}
//               </For>
//             </tbody>
//           </table>
//         </div>
//       </Show>
//     </div>
//   );
// };

// export default DataTable;