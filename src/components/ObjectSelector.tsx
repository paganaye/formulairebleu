// import { JSX, createMemo } from "solid-js";
// import StringSelector from "./StringSelector";

// export interface IObjectSelectorProps<T extends object> {
//   selectedObject: T;
//   objects: T[];
//   label: string;
//   setSelectedObject: (newSelectedObject: T) => void;
//   getKey(o: T): string;
// }

// export function ObjectSelector<T extends object>(props: IObjectSelectorProps<T>): JSX.Element {
//   const objectsMap = createMemo(() => new Map(props.objects.map(obj => [props.getKey(obj), obj])));
//   return <>
//     <StringSelector
//       label={props.label}
//       selectedString={props.selectedObject ? props.getKey(props.selectedObject) : null}
//       setSelectedString={(newString: string) => {
//         const selectedObject = objectsMap().get(newString);
//         if (selectedObject) {
//           props.setSelectedObject(selectedObject);
//         } else {
//           props.setSelectedObject(null);
//         }
//       }}
//       strings={[...objectsMap().keys()]}
//     />
//   </>;
// }


