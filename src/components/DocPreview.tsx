// import { createSignal, Component, createEffect, Show } from 'solid-js';
// import { getIdFromUrl } from '../core/Utils';
// import { preview } from 'vite';

// export interface IDocPreview {
//   url: string;
//   width?: string;
//   height?: string
// }

// const DocPreview: Component<IDocPreview> = (props) => {
//   const [previewUrl, setPreviewUrl] = createSignal("");
//   const [error, setError] = createSignal("");
//   createEffect(() => {
//     try {
//       setError("")
//       const id = getIdFromUrl(props.url);
//       if (id) {
//         setPreviewUrl(`https://docs.google.com/document/d/${id}/preview`);
//       }
//     } catch (e) {
//       setError(e);
//     }
//   });

//   return (
//     <>
//       <Show when={error()}>
//         <p>{error()}</p>
//       </Show>
//       <Show when={!error()} >
//         <iframe style="width:100%; height:100%" src={previewUrl()}></iframe>
//       </Show>
//     </>
//   );
// };

// export default DocPreview;
