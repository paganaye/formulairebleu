// import { createSignal, Component, Show, createMemo, JSX } from 'solid-js';
// import FolderView from './FolderView';
// import DocThumbnail from './DocThumbnail';
// import Button from './Button';
// import Icon from './Icon';
// // import ClearIcon from '@suid/icons-material/Clear';
// export interface IFileSelectorProps {
//   title?: string;
//   selectedFile: () => IDriveFile;
//   setSelectedFile?: (driveFile: IDriveFile) => void;
//   children?: JSX.Element | JSX.Element[] | string
//   mimeType?: string;
//   showFolders?: boolean;
//   showThumbnail?: boolean;
// }

// const FileSelector: Component<IFileSelectorProps> = (props) => {
//   const [currentFolder, setCurrentFolder] = createSignal<IDriveFolder>();
//   const [currentFile, setCurrentFile] = createSignal<IDriveFile>();

//   const [loading, setLoading] = createSignal(false); // State to manage loading
//   const [modalRef, setModalRef] = createSignal<any>();


//   const title = createMemo(() => props.title ?? props.children ?? "Select a File...");

//   const isSelectedFileInCurrentFolder = createMemo(() => {
//     return currentFile()?.folder.id == currentFolder()?.id
//   });

//   function openDialog() {
//     setCurrentFile(props.selectedFile());
//     setCurrentFolder(props.selectedFile()?.folder)
//     modalRef()?.showModal();
//   }

//   function clearSelectedFile() {
//     props.setSelectedFile(undefined);
//   }

//   function handleConfirm() {
//     props?.setSelectedFile(currentFile())
//     modalRef()?.close();
//   }

//   function handleCancel() {
//     modalRef()?.close();
//   }


//   return (
//     <div class="flex justify-center flex-1">
//       <Show when={props.selectedFile()}>
//         <div class="relative inline-block"> {/* 'inline-block' peut être remplacé par 'block' si nécessaire */}
//           <DocThumbnail
//             url={props.selectedFile().id}
//             class="w-auto h-auto max-w-screen max-h-[50vh]"
//           />
//           <button
//             class="btn btn-circle btn-outline absolute top-0 right-0"
//             onClick={() => clearSelectedFile()}
//           >
//             <Icon icon='close' />
//           </button>
//         </div>
//       </Show>
//       <Show when={!props.selectedFile()}>
//         <div class="p-16">
//         <button class="btn" onClick={() => openDialog()}>{title()}</button>
//         </div>
//       </Show>
//       <dialog ref={setModalRef} class="modal">
//         <div class="modal-box w-11/12 max-w-5xl">
//           <form method="dialog">
//             {/* if there is a button in form, it will close the modal */}
//             <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
//           </form>
//           <h3 class="font-bold text-lg">{title()}</h3>
//           <FolderView currentFolder={currentFolder} setCurrentFolder={setCurrentFolder}
//             selectedFile={currentFile} setSelectedFile={setCurrentFile}
//             setLoading={setLoading}
//             mimeType={props.mimeType}
//             showFolders={props.showFolders}
//             showThumbnail={props.showThumbnail} />
//           <div class="modal-action">
//             <form method="dialog">
//               {/* if there is a button, it will close the modal */}
//               <Button onClick={handleCancel}>Annuler</Button>&ensp;
//               <Button class="primary" disabled={!currentFile() || !isSelectedFileInCurrentFolder()} onClick={handleConfirm}>Confirmer</Button>
//             </form>
//           </div>
//         </div>
//       </dialog>
//     </div >
//   );
// };

// export default FileSelector;
