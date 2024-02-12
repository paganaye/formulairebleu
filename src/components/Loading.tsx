// import { Component, createEffect, createSignal, onCleanup } from 'solid-js';

// interface LoadingProps {
//   visible: boolean;
//   mainLabel?: string;
//   secondLabel?: string;
// }

// const Loading: Component<LoadingProps> = (props) => {
//   const [modalRef, setModalRef] = createSignal<any>();
//   function handleEscapeKey(event: KeyboardEvent) {
//     if (event.key === 'Escape') {
//       event.preventDefault(); // Empêcher la fermeture du modal
//     }
//   };
//   createEffect(() => {
//     const modal = modalRef();
//     if (modal) {
//       if (props.visible) modal.showModal();
//       document.addEventListener('keydown', handleEscapeKey);
//       onCleanup(() => {
//         document.removeEventListener('keydown', handleEscapeKey);
//       });
//     }
//   });

//   createEffect(() => {
//     if (props.visible) modalRef()?.showModal()
//     else modalRef()?.close()
//   });

//   return (
//     <>
//       {/* Open the modal using document.getElementById('ID').showModal() method */}
//       <dialog ref={setModalRef} class="modal">
//         <div class="modal-box">
//           <h3 class="font-bold text-lg"><span style="vertical-align:middle;" class="loading loading-spinner loading-md"></span>
//             &emsp;{props.mainLabel}</h3>
//           <p class="py-4">{props.secondLabel}</p>
//         </div>
//       </dialog>
//     </>
//   );
// };

// export default Loading;