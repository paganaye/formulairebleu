// import { Component, For, Show, createEffect, createSignal } from 'solid-js';
// import Box from './Box';
// // import Select, { SelectChangeEvent } from '@suid/material/Select';
// // import MenuItem from '@suid/material/MenuItem';
// // import { Box, FormControl, InputLabel } from '@suid/material';

// export interface IStringSelectorProps {
//   selectedString: string;
//   strings: string[];
//   label: string;
//   setSelectedString: (newSelectedItem: string) => void;
// }

// const StringSelector: Component<IStringSelectorProps> = (props) => {
//   const [showChild, setShowChild] = createSignal(true);
//   const [strings, setStrings] = createSignal([]);

//   createEffect(() => {
//     // this is a hack to force the select to be re-rendered when the strings change.
//     !!(props.strings); // we want to access props.strings
//     setShowChild(false);
//     setTimeout(() => {
//       setStrings(props.strings)
//       setShowChild(true)
//       let index = props.strings.indexOf(props.selectedString);
//       if (index < 0 && props.strings.length) {
//         props.setSelectedString(props.strings[0])
//       }
//     });
//   });

//   function onSelectChange(event: any) {
//     let stringValue = event.target.value;
//     props.setSelectedString(stringValue);
//   }

//   createEffect(() => {

//   })

//   return (<Box>
//     <select class="select select-bordered w-full max-w-xs text-lg p-1"
//       style="-webkit-appearance: none; -moz-appearance: none; appearance: none;"
//       onChange={onSelectChange}>
//       <For each={strings()}>
//         {item => (
//           <option class="p-5">{item}</option>
//         )}
//       </For>
//     </select>
//   </Box >);
// };

// export default StringSelector;
