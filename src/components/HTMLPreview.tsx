// import { createSignal, createEffect } from 'solid-js';
// import { twMerge } from 'tailwind-merge';

// export interface IHTMLPreview {
//   content?: string;
//   class?: string;
// }

// const HTMLPreview = (props: IHTMLPreview) => {
//   const [htmlContent, setHtmlContent] = createSignal("");

//   async function buildHTMLContent(content: string) {
//     let result = (content ?? "").replace('<body', `<body><div class="new-body"><div id="original-body"><div `);
//     result = result.replace('</body>', `
//       </div>
//     </div>
//   </div>
//   <div class="button-panel">
//     <button onclick="zoomOut()">-</button>
//     <button onclick="zoomIn()">+</button>
//     <button onclick="toggleFullscreen()">&#x26F6;</button>
//   </div>

//   <script>
//     let zoomLevel = 100;
//     const targetElement = document.body; // Change this to the specific element you want to zoom
//     const originalBody = document.getElementById("original-body");

//     function zoomIn() {
//       zoomLevel += 10;
//       originalBody.style.transform = \`scale($\{zoomLevel / 100})\`;
//       originalBody.style.transformOrigin = 'top left';
//     }

//     function zoomOut() {
//       zoomLevel = Math.max(zoomLevel - 10, 10);
//       originalBody.style.transform = \`scale($\{zoomLevel / 100})\`;
//       originalBody.style.transformOrigin = 'top left';
//     }

//     function toggleFullscreen() {
//       if (!document.fullscreenElement) {
//         targetElement.requestFullscreen().catch(err => {
//           alert(\`Error attempting to enable full-screen mode: $\{err.message}\`);
//         });
//       } else {
//         document.exitFullscreen();
//       }
//     }
//   </script>
//   <style>
//   /* Style for the button panel using Flexbox */
//   .button-panel {
//     position: fixed;
//     bottom: 0;
//     left: 0;
//     width: 100%;
//     background-color: #f8f8f8; /* Example background color */
//     padding: 10px;
//     display: flex; /* Enable Flexbox */
//     justify-content: center; /* Center items horizontally */
//     align-items: center; /* Center items vertically */
//   }

//   /* Fullscreen specific styles */
//   :fullscreen {
//     width: 100%;
//     height: 100%;
//     overflow: auto;
//   }

//   /* Ensure the zoomed element scales within the viewport */
//   :fullscreen .zoom-target {
//     transform-origin: top left;
//   }

//   .new-body {
//     overflow: auto;
//     height: calc(100vh - 50px);
//     background: #eee;
//     display: flex;
//     justify-content: center;
//     padding: 8px;
//   }

//   body {
//     overflow: hidden;
//   }
//   </style>
// </body>`);
//     setHtmlContent(result);
//   }

//   createEffect(() => {
//     buildHTMLContent(props.content);
//   });


//   const toggleFullscreen = () => {
//     const elem = document.documentElement;
//     if (!document.fullscreenElement) {
//       elem.requestFullscreen().catch(e => {
//         console.error(`Error attempting to enable full-screen mode: ${e.message}`);
//       });
//     } else {
//       document.exitFullscreen();
//     }
//   };
  
//   return (
//     <div class={twMerge("border-0", props.class)}>
//       <iframe style="width:100%; height:100%" srcdoc={htmlContent() as any}></iframe>
//     </div>
//   );
// };

// export default HTMLPreview;
