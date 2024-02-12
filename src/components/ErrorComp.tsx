// import { Component, createEffect, createSignal, onCleanup } from 'solid-js';
// import Button from './Button';

// interface IErrorCompProps {
//   mainLabel?: string;
//   error?: Error;
//   reset?: () => any;
// }

// const ErrorComp: Component<IErrorCompProps> = (props) => {
//   const [modalRef, setModalRef] = createSignal<any>();
//   const message = () => {
//     let src: any;
//     let e: any = props.error; 0
//     if (typeof e === 'object') {
//       src = ("message" in e) ? e.stack : e;
//     } else {
//       src = e;
//     }
//     return String(src);
//   }

//   return (
//     <div class="p-4">
//       <pre>{props.mainLabel ?? "Something bad happened"} </pre>
//       <pre style="white-space:pre-wrap">{message()}</pre>
//       <Button onClick={() => props.reset()}>Try again</Button>
//     </div>);
// }
// export default ErrorComp;