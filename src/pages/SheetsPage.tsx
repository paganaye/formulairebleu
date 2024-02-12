// import { createSignal, Component, For } from 'solid-js';
// // import { Button } from "@suid/material";
// import { commandRunner } from '../commandRunner';
// import "../../server/IServerTypes";
// import Page from '../components/Page';


// const Sheets: Component = () => {
//   const [result, setResult] = createSignal<any[][] | null>([["a", "b"], [1, 2]]);
//   const [error, setError] = createSignal("");
//   const server = commandRunner<IServerCommands>("Sheet1");

//   const getValues = async () => {
//     try {
//       setError("")
//       //const data = await server.getFullRange("Sheet1");
//       const values = await server.getRangeValues({ spreadsheetId: null, sheetName: 0 });
//       setResult(values as any); // Assuming the values are in a 2D array format
//     } catch (e) {
//       setError(JSON.stringify(e))
//     }
//   };

//   return (
//     <Page>
//       <p>hi</p>
//       {/* <Button variant="contained" onClick={getValues}>Get Values</Button>
//       {error()}
//       {result() !== null && (
//         <table>
//           <For each={result()}>
//             {row => (
//               <tr>
//                 <For each={row}>
//                   {col => <td>{typeof col === "boolean" ? col.toString() : col}</td>}
//                 </For>
//               </tr>
//             )}
//           </For>
//         </table>
//       )} */}
//     </Page>
//   );
// };

// export default Sheets;
