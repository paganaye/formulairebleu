// import { createSignal, Component } from 'solid-js';
// // import { Backdrop, CircularProgress } from "@suid/material";
// import FileSelector from "../components/FileSelector";
// import { KnownMime } from '../components/FolderView';
// import Page from '../components/Page';


// const Files: Component = () => {
//   const [selectedFile, setSelectedFile] = createSignal<IDriveFile>();
//   const [selectedDoc, setSelectedDoc] = createSignal<IDriveFile>();
//   const [selectedSheet, setSelectedSheet] = createSignal<IDriveFile>();


//   return (
//     <Page>
//       <FileSelector selectedFile={selectedFile} setSelectedFile={setSelectedFile} >Select file</FileSelector>
//       <FileSelector selectedFile={selectedDoc} setSelectedFile={setSelectedDoc} mimeType={KnownMime.GOOGLE_DOC}>Select doc</FileSelector>
//       <FileSelector selectedFile={selectedSheet} setSelectedFile={setSelectedSheet} mimeType={KnownMime.GOOGLE_SHEET}>Select sheet</FileSelector>
//       <FileSelector selectedFile={selectedFile} setSelectedFile={setSelectedFile} showFolders={false} showThumbnail={false}>Select file without folders or preview</FileSelector>
//     </Page>

//   );
// };

// export default Files;
