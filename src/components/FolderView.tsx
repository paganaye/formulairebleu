// import { createSignal, Component, For, Show, Signal, createEffect } from 'solid-js';
// import { commandRunner } from '../commandRunner';
// // import { Backdrop, CircularProgress, Breadcrumbs, Button, Link, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Divider, SvgIcon, ListItemButton, Popover } from "@suid/material";
// // import FolderIcon from "@suid/icons-material/Folder";
// // import FolderOpenIcon from "@suid/icons-material/FolderOpen";
// // import DocIcon from "@suid/icons-material/Article";
// // import PdfIcon from "@suid/icons-material/PictureAsPdf";
// // import SheetIcon from "@suid/icons-material/ViewList";
// // import UnknownIcon from "@suid/icons-material/DeviceUnknown";
// import DocThumbnail from './DocThumbnail';
// import Box from './Box';
// import Button from './Button';
// import Link from './Link';
// import Breadcrumbs from './Breadcrumbs';
// import { Icon, IconType } from './Icon';
// import { useAppStore } from '../core/AppStore';

// function getIcon(mime: string) {
//   let icon: IconType
//   switch (mime) {
//     case KnownMime.GOOGLE_DOC: icon = "file_doc"; break;
//     case KnownMime.GOOGLE_SHEET: icon = "google_spreadsheet"; break;
//     case KnownMime.DOCX: icon = "file_type_word"; break;
//     case KnownMime.XLSX: icon = "file_type_excel"; break;
//     default: icon = "unknown_document"; break;
//   }

//   return <Icon class='text-3xl' icon={icon} />
// }
// export enum KnownMime {
//   PDF = "application/pdf",
//   GOOGLE_DOC = "application/vnd.google-apps.document",
//   GOOGLE_SHEET = "application/vnd.google-apps.spreadsheet",
//   DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//   XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   EML = "message/rfc822",
//   CSV = "text/csv",
//   OTHER = 'application/octet-stream'
// }

// export interface IFolderPreviewProps {
//   setLoading?: (loading: boolean) => void;
//   currentFolder: () => IDriveFolder;
//   setCurrentFolder?: (driveFolder: IDriveFolder) => void;
//   selectedFile: () => IDriveFile;
//   setSelectedFile?: (driveFile: IDriveFile) => void;
//   mimeType?: string;
//   showFolders?: boolean;
//   showThumbnail?: boolean;
// }

// const FolderPreview: Component<IFolderPreviewProps> = (props) => {
//   const [content, setContent] = createSignal<IFolderContent>({ files: [], folders: [], path: [] });
//   const [error, setError] = createSignal("");
//   const server = commandRunner<IServerCommands>("Sheet1");
//   const [anchorEl, setAnchorEl] = createSignal<Element | null>(null);
//   const open = () => Boolean(anchorEl());
//   const { startLoading, completeLoading } = useAppStore();
//   const handlePopoverOpen = (event: { currentTarget: Element }) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handlePopoverClose = () => {
//     setAnchorEl(null);
//   };

//   async function loadFolderContent(folder: IDriveFolder, useCache = true) {
//     props?.setLoading(true);
//     try {
//       let values: IFolderContent = await server.getFolderContent(folder?.id)

//       if (!folder) folder = values.path.at(-1);
//       values.files.forEach(f => f.folder = folder);
//       if (props.mimeType) {
//         values.files = values.files.filter(f => f.mimeType === props.mimeType);
//       }
//       setContent(values);
//       props.setCurrentFolder(folder);
//     } catch (e) {
//       console.error("FolderPreview", e);
//       setError(e.message);
//     } finally {
//       //completeLoading();
//       props?.setLoading(false);
//     }
//   }

//   createEffect(() => {
//     loadFolderContent(props.currentFolder());
//   });

//   function handleFolderClick(newFolder: IDriveFolder) {
//     if (props.showFolders === false) return
//     props.setCurrentFolder(newFolder);
//   }

//   function handleFileClick(file: IDriveFile) {
//     props.setSelectedFile(file);
//   }

//   return (
//     <div>
//       {error()}
//       {/* {JSON.stringify(props.selectedFile())} */}
//       {content() !== null && (
//         <div>
//           {/* <p>props.showFolders:{JSON.stringify(props.showFolders)}</p> */}
//           <Show when={content().path.length > 0} fallback={
//             <Box>
//               <Link page="#load-folder">
//                 <span class="icon-middle material-symbols-outlined">play_arrow</span>Click to load folder
//               </Link>
//             </Box>
//           } >
//             <Show when={props.showFolders ?? true}>

//               <Breadcrumbs aria-label="breadcrumb">
//                 <For each={content().path.slice(0, -1)}>
//                   {row => (
//                     <Button startIcon={/*<FolderIcon />*/0} onClick={() => handleFolderClick(row)}>
//                       {row.name}
//                     </Button>

//                   )}
//                 </For>
//                 <Button startIcon={/*<FolderOpenIcon />*/0}>
//                   {content().path.slice(-1)[0]?.name}
//                 </Button>
//               </Breadcrumbs>
//             </Show>
//             <table class="table">
//               <thead>
//                 <tr>
//                   <th>Icon</th>
//                   <th>Name</th>
//                   <th>Size</th>
//                   <th>Last modified</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <For each={props.showFolders && content().folders}>
//                   {folder => (
//                     <tr onClick={() => handleFolderClick(folder)} classList={{
//                       "hover": true
//                     }}>
//                       <th><Icon icon="folder_outline_rounded" /></th>
//                       <td>{folder.name}</td>
//                       <td>&ensp;</td>
//                       <td>&ensp;</td>
//                     </tr>
//                   )}
//                 </For>
//                 <For each={content().files}>
//                   {file => (
//                     <tr onClick={() => handleFileClick(file)} classList={{
//                       "bg-base-200": props?.selectedFile()?.id === file.id,
//                       "hover": true
//                     }}>
//                       <th>{getIcon(file.mimeType)}</th>
//                       <td>{file.name}</td>
//                       <td>{file.size}</td>
//                       <td>{file.lastModification?.toString()}</td>
//                     </tr>
//                     //   <Popover
//                     //     id="mouse-over-popover"
//                     //     open={open()}
//                     //     anchorEl={anchorEl()}
//                     //     anchorOrigin={{
//                     //       vertical: 'center',
//                     //       horizontal: 'right',
//                     //     }}
//                     //     transformOrigin={{
//                     //       vertical: 'bottom',
//                     //       horizontal: 'left',
//                     //     }}
//                     //     onClose={handlePopoverClose}
//                     //     disableRestoreFocus            >
//                     //     <DocThumbnail url={file.id} width='400px' />
//                     //   </Popover>                  
//                   )}
//                 </For>
//               </tbody>
//             </table>

//           </Show>

//         </div >
//       )
//       }
//     </div >

//   );
// };

// export default FolderPreview;
