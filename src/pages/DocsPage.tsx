// import { createSignal, Component, For, Show } from 'solid-js';
// import { commandRunner } from '../commandRunner';
// // import { Backdrop, CircularProgress, Breadcrumbs, Button, Link, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Divider, SvgIcon, ListItemButton, TextField, FormControl, InputLabel, MenuItem, Select } from "@suid/material";
// //import { makeStyles } from '@mui/material/styles';
// import DocPreview from '../components/DocPreview';
// import DocThumbnail from '../components/DocThumbnail';
// import { T } from "../core/Translation"
// import Page from '../components/Page';

// const Docs: Component = () => {
//   const [loading, setLoading] = createSignal(false); // State to manage loading
//   const [url, setUrl] = createSignal("1BMXFjtkQqYcAHl5-mxLxvopy3J0VqcJ0Dl5XG6uPvlA");
//   const [previewUrl, setPreviewUrl] = createSignal("");
//   const [error, setError] = createSignal("");

//   async function changePreview() {
//     try {
//       setError("")
//       setLoading(true)
//       setPreviewUrl(url())
//     } catch (e) {
//       setError(e.message)
//     } finally {
//       setTimeout(() => setLoading(false), 2000)
//     }
//   }

//   return (
//     <Page>
//       {/* <Box >
//         <TextField 
//           id="outlined-basic"
//           label={T.file_url}
//           variant="outlined"
//           fullWidth
//           value={url()} onChange={(_event, value) => setUrl(value)}
//         />
//         <Button  variant="text" onClick={changePreview}>Affiche document</Button>
//         <pre>
//           {error()}
//         </pre>
//         <DocThumbnail url={previewUrl()} width='200px' height='200px' />
//         <DocPreview url={previewUrl()} width='calc(100% - 40px)' height='calc(100vh - 300px)' />
//       </Box>
//       <Backdrop open={loading()} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
//         <CircularProgress color="inherit" />
//         &emsp;Loading&hellip;
//       </Backdrop> */}
//     </Page>
//   );
// };

// export default Docs;
