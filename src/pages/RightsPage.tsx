// import { createSignal, Component, For, Show } from 'solid-js';
// import { commandRunner } from '../commandRunner';
// // import { Backdrop, CircularProgress, Breadcrumbs, Button, Link, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Divider, SvgIcon, ListItemButton, TextField, FormControl, InputLabel, MenuItem, Select } from "@suid/material";
// //import { makeStyles } from '@mui/material/styles';
// // import FolderIcon from "@suid/icons-material/Folder";
// // import FolderOpenIcon from "@suid/icons-material/FolderOpen";
// // import DocIcon from "@suid/icons-material/Article";
// // import PdfIcon from "@suid/icons-material/PictureAsPdf";
// // import SheetIcon from "@suid/icons-material/ViewList";
// // import UnknownIcon from "@suid/icons-material/DeviceUnknown";
// import { google } from 'googleapis';
// import { setAttribute } from 'solid-js/web';
// import Box from '../components/Box';
// import Button from '../components/Button';
// import TextField from '../components/TextField';
// import Page from '../components/Page';

// enum KnownMime {
//   PDF = "application/pdf",
//   GOOGLE_DOC = "application/vnd.google-apps.document",
//   GOOGLE_SHEET = "application/vnd.google-apps.spreadsheet",
//   DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//   XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   EML = "message/rfc822",
//   CSV = "text/csv",
//   OTHER = 'application/octet-stream'
// }
// function getIdFromUrl(url: string): string {
//   let result = url.match(/[-\w]{25,}/);
//   if (!result) throw Error("Invalid document url " + url);
//   return result.toString();
// }


// const Rights: Component = () => {
//   const [loading, setLoading] = createSignal(false); // State to manage loading
//   const [url, setUrl] = createSignal("https://docs.google.com/document/d/1BMXFjtkQqYcAHl5-mxLxvopy3J0VqcJ0Dl5XG6uPvlA/edit");
//   const [arg, setArg] = createSignal("");
//   const [attribute, setAttribute] = createSignal("");
//   const [email, setEmail] = createSignal("pascal.ganaye@afs.org");
//   const [error, setError] = createSignal("");
//   const [result, setResult] = createSignal("");
//   const server = commandRunner<IServerCommands>("Sheet1");


//   async function getFileInfo() {
//     try {
//       setError("")
//       setLoading(true)
//       //getFolderContent(id);
//       let id = getIdFromUrl(url());
//       let result = await server.getFileInfo(id, email());
//       setResult(JSON.stringify(result, undefined, "   "))
//     } catch (e) {
//       setError(e.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   async function setFileProperty() {
//     try {
//       setError("")
//       setLoading(true)
//       let id = getIdFromUrl(url());
//       let result = await server.setFileAttribute(id, attribute() as FileAttribute, arg())
//       setResult(JSON.stringify(result, undefined, "   "))
//     } catch (e) {
//       setError(e.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // getFolderContent(undefined)

//   return (
//     <Page>
//       {/* <Box>
//         <TextField
//           id="outlined-basic"
//           label="File URL"
//           variant="outlined"
//           fullWidth
//           value={url()} onChange={(_event, value) => setUrl(value)}
//         />
//         <TextField
//           id="outlined-basic"
//           label="Email"
//           variant="outlined"
//           fullWidth
//           value={email()} onChange={(_event, value) => setEmail(value)}
//         />
//         <Button variant="text" onClick={getFileInfo}>Lit propriétés</Button>
//         <pre>
//           {result()}
//         </pre>
//         <pre>{error()}</pre>
//         <Divider />
//         <Box sx={{ minWidth: 120 }}>
//           <FormControl fullWidth >
//             <InputLabel id="demo-simple-select-label">Propriété</InputLabel>
//             <Select
//               labelId="demo-simple-select-label"
//               id="demo-simple-select"
//               value={attribute()}
//               label="Propriété"
//               onChange={(e) => setAttribute(e.target.value)}
//             >
//               <MenuItem value="setDescription">modifie description</MenuItem>
//               <MenuItem value="setName">modifie nom</MenuItem>
//               <MenuItem value="addCommenter">ajoute commenteur</MenuItem>
//               <MenuItem value="removeCommenter">enlève commenteur</MenuItem>
//               <MenuItem value="addEditor">ajoute editeur</MenuItem>
//               <MenuItem value="removeEditor">enlève éditeur</MenuItem>
//               <MenuItem value="addViewer">ajoute  viewer</MenuItem>
//               <MenuItem value="removeViewer">enlève viewer</MenuItem>
//               <MenuItem value="revokePermissions">enlève permissions</MenuItem>
//             </Select>
//           </FormControl>
//         </Box>
//         <TextField
//           id="outlined-basic"
//           label="Argument"
//           variant="outlined"
//           fullWidth
//           value={arg()} onChange={(_event, value) => setArg(value)}
//         />
//         <Button variant="text" onClick={setFileProperty}>Change propriété</Button>
//       </Box>
//       <Backdrop open={loading()} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
//         <CircularProgress color="inherit" />
//         &emsp;Loading&hellip;
//       </Backdrop> */}
//     </Page>
//   );
// };

// export default Rights;
