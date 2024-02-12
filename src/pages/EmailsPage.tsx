// import { createSignal, Component, For, Show } from 'solid-js';
// import { commandRunner } from '../commandRunner';
// // import { Backdrop, CircularProgress, Breadcrumbs, Button, Link, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Divider, SvgIcon, ListItemButton, TextField, FormControl, InputLabel, MenuItem, Select } from "@suid/material";
// import { T } from '../core/Translation'
// import Button from '../components/Button';
// import Box from '../components/Box';
// import TextField from '../components/TextField';
// import Page from '../components/Page';

// const Emails: Component = () => {
//   const server = commandRunner<IServerCommands>("Sheet1");
//   const [loading, setLoading] = createSignal(false); // State to manage loading
//   const [url, setUrl] = createSignal("https://docs.google.com/document/d/1BMXFjtkQqYcAHl5-mxLxvopy3J0VqcJ0Dl5XG6uPvlA/edit");
//   const [recipientEmail, setRecipientEmail] = createSignal("paganaye@gmail.com");
//   const [recipentName, setRecipientName] = createSignal("Pascal GANAYE");
//   const [subject, setSubject] = createSignal("This is the subject");
//   const [textBody, setTextBody] = createSignal("This is the body of the email");
//   const [error, setError] = createSignal("");



//   async function sendEmail(draft: boolean) {
//     try {
//       setError('')
//       setLoading(true);
//       let emailData: IEmailData = {
//         sender: undefined, //{ name: '', email: '' },
//         replyTo: undefined,
//         recipients: [{ name: recipentName(), email: recipientEmail() }],
//         cc: [],
//         bcc: [],
//         subject: subject(),
//         htmlBody: '',
//         textBody: textBody(),
//         attachments: [],
//         saveAsDraft: draft
//       }
//       await server.sendEmail(emailData)
//     } catch (e: any) {
//       setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // getFolderContent(undefined)

//   return (
//     <Page>
//       {/* <Box
//         <TextField
//           id="outlined-basic"
//         label={T.recipient_email}
//         variant="outlined"
//         fullWidth
//         value={recipientEmail()} onChange={(_event, value) => setRecipientEmail(value)}
//       />
//       <TextField
//         id="outlined-basic"
//         label={T.recipient_name}
//         variant="outlined"
//         fullWidth
//         value={recipentName()} onChange={(_event, value) => setRecipientName(value)}
//       />
//       <TextField
//         id="outlined-basic"
//         label={T.email_subject}
//         variant="outlined"
//         fullWidth
//         value={subject()} onChange={(_event, value) => setSubject(value)}
//       />
//       <TextField
//         id="outlined-basic"
//         label={T.email_body}
//         multiline={true}
//         rows={5}
//         variant="outlined"
//         fullWidth
//         value={textBody()} onChange={(_event, value) => setTextBody(value)}
//       />
//       <Button variant="text" onClick={() => sendEmail(true)}>{T.email_save_as_draft}</Button>
//       <Button variant="text" onClick={() => sendEmail(false)}>{T.email_send}</Button>
//       <pre>{error()}</pre>
//     </Box >
//       <Backdrop open={loading()} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
//         <CircularProgress color="inherit" />
//         &emsp;Loading&hellip;
//       </Backdrop> */}
//     </Page>
//   );
// };

// export default Emails;
