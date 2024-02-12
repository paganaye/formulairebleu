// import { createSignal, createEffect, Show, Component } from 'solid-js';
// import { getIdFromUrl } from '../core/Utils';
// import { commandRunner } from '../commandRunner';

// // You would need to replace 'getThumbnailLink' with the actual function that
// // calls the Google Drive API and returns the thumbnail URL.

// export interface IDocThumbnailPreviewProps {
//   class: string;
//   url: string;
//   width?: string;
//   height?: string;
// }

// const DocThumbnail: Component<IDocThumbnailPreviewProps> = (props) => {
//   const [thumbnailUrl, setThumbnailUrl] = createSignal("");
//   const [imageLoaded, setImageLoaded] = createSignal(false); // New signal to track image loading state
//   const server = commandRunner<IServerCommands>("Sheet1");

//   createEffect(() => {
//     const fetchThumbnail = async () => {
//       try {
//         setThumbnailUrl("")
//         setImageLoaded(false)
//         const id = getIdFromUrl(props.url);
//         if (id) {
//           const link = await server.getDocThumbnailUrl(id);
//           setThumbnailUrl(link);
//         }
//       } catch (e) {
//         // ignore
//       }
//     };

//     fetchThumbnail();
//   });

//   const handleImageLoad = () => {
//     setImageLoaded(true); // Set the image as loaded
//   };

//   return (
//     <Show when={thumbnailUrl()}>
//       <img class={props.class} src={thumbnailUrl()} alt="Document Thumbnail" onLoad={handleImageLoad} />
//     </Show>
//   );

// };

// export default DocThumbnail;
