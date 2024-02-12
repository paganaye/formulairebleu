// import { createSignal, Component, Show, createEffect, createMemo, Switch, Match, ErrorBoundary, For, JSXElement } from 'solid-js';
// import FileSelector from "../components/FileSelector";
// import { KnownMime } from '../components/FolderView';
// import HTMLPreview from '../components/HTMLPreview';
// import { commandRunner } from '../commandRunner';
// import StringSelector from '../components/StringSelector';
// import Button from '../components/Button';
// import Page from '../components/Page';
// import myIcon from '../icons/excel.svg?raw';
// import DataTable from '../components/Datatable';
// import ErrorComp from '../components/ErrorComp';
// import Pager from '../components/Pager';
// import { IDataSource, cellValuesToObjects, notNull } from '../core/Utils';
// import { ObjectSelector } from '../components/ObjectSelector';

import { Component } from "solid-js";

// console.log({ myIcon });

// interface IMailing {
//   id: number,
//   name: string,
//   user: string,
//   published: boolean,
//   templateURL: string,
//   dataURL: string,
//   mailingType: "email" | "file",
//   args: object,
//   status: string,
//   comments: string,
//   description: string
// }

// interface IMailingStep {
//   validate(errors: Errors): void;
//   shortTitle?: string;
//   content: JSXElement;
// }

const MailingPage: Component = () => {
  //   // signals
  //   const [attachments, setAttachments] = createSignal<IDriveFile[]>([]);
  //   const [error, setError] = createSignal("")
  //   const [mailingFilter, setMailingFilter] = createSignal("");
  //   const [mailings, setMailings] = createSignal<IDataSource<IMailing>>();
  //   const [newAttachment, setNewAttachment] = createSignal<IDriveFile>();
  //   const [rowNo, setRowNo] = createSignal(1);
  //   const [rows, setRows] = createSignal<IDataSource>();
  //   const [selectedDoc, setSelectedDoc] = createSignal<IDriveFile>();
  //   const [selectedMailing, setSelectedMailing] = createSignal<IMailing>()
  //   const [selectedSheetName, setSelectedSheetName] = createSignal("");
  //   const [selectedSpreadsheet, setSelectedSpreadsheet] = createSignal<IDriveFile>();
  //   const [selectedTemplate, setSelectedTemplate] = createSignal<IDriveFile>();
  //   const [selectedTemplateHTML, setSelectedTemplateHTML] = createSignal("");
  //   const [sheetNames, setSheetNames] = createSignal(["A", "B", "C"])
  //   const [spreadsheetInfo, setSpreadsheetInfo] = createSignal<ISpreadsheetInfo>();
  //   const [stepNo, setPageNo] = createSignal(0);

  //   const filteredMailings = createMemo(() => {
  //     let objects = mailings();
  //     let selectedMailingId = localStorage.getItem("selectedMailing")
  //     if (selectedMailingId) {
  //       let found = objects?.rowObjects.find(o => o?.id?.toString() == selectedMailingId)
  //       if (found) setSelectedMailing(found)
  //     }
  //     return objects;
  //   })

  //   const transformedTemplate = createMemo(() => {
  //     let row = rows()?.rowObjects[rowNo()]
  //     let template = selectedTemplateHTML();
  //     console.log({ row, template })
  //     return template;
  //   });


  //   const templates = createMemo(() => {
  //     const result: IDriveFile[] = notNull([selectedDoc(), ...attachments()]);
  //     if (result.length > 0 && result.indexOf(selectedTemplate()) < 0) setSelectedTemplate(result[0])
  //     return result;
  //   });

  //   const server = commandRunner<IServerCommands>("Sheet1");
  //   const mailingSteps: IMailingStep[] = [
  //     {
  //       shortTitle: "Modèles sauvegardés",
  //       content: (
  //         <>
  //           <p>Publipostages</p>
  //           <StringSelector label='SheetName' selectedString={mailingFilter()} setSelectedString={(s) => setMailingFilter(s)}
  //             strings={["Mes publipostages", "Tous les publipostages"]}></StringSelector>
  //           <DataTable objects={filteredMailings()} columns={["name", "user", "comments", "description"]}
  //             selectedRow={selectedMailing()} setSelectedRow={onSetSelectedMailing}></DataTable>
  //           <Button class="btn-primary" onClick={nextStep}>Nouveau plublipostage...</Button>
  //         </>
  //       ),
  //       validate(errors) {
  //         if (selectedMailing() == null) errors.push("Vous devez sélectionner un publipostage ou en créer un.")
  //       }
  //     },
  //     {
  //       shortTitle: "Fichier de données",
  //       content: (
  //         <>
  //           <p>Sélectionnez la source de donnée du publipostage</p>
  //           <FileSelector selectedFile={selectedSpreadsheet} setSelectedFile={setSelectedSpreadsheet} mimeType={KnownMime.GOOGLE_SHEET}>Select sheet</FileSelector>
  //         </>
  //       ),
  //       validate(errors) {
  //         if (selectedSheet() == null) errors.push("Vous devez sélectionner un publipostage ou en créer un.")
  //       }
  //     },

  //     {
  //       shortTitle: "Feuille des données",
  //       content: (
  //         <>
  //           <Show when={selectedSpreadsheet()}>
  //             <StringSelector label='SheetName' selectedString={selectedSheetName()} setSelectedString={(s) => setSelectedSheetName(s)}
  //               strings={sheetNames()}></StringSelector>
  //             <DataTable objects={rows()} ></DataTable>
  //           </Show>

  //         </>
  //       ),
  //       validate(errors) {
  //         if (selectedSheet() == null) errors.push("Vous devez sélectionner un publipostage ou en créer un.")
  //       }
  //     },
  //     {
  //       shortTitle: "Modèle",
  //       content: (
  //         <>
  //           <p>Selectionner le modèle de document ou de courrier du publipostage</p>
  //           <FileSelector selectedFile={selectedDoc} setSelectedFile={setSelectedDoc} mimeType={KnownMime.GOOGLE_DOC}>Select doc</FileSelector>
  //           <Show when={selectedDoc()}>
  //             <For each={attachments()}>
  //               {attachment => (
  //                 <FileSelector selectedFile={() => attachment} setSelectedFile={() => removeAttachment(attachment)} mimeType={KnownMime.GOOGLE_DOC}>Select doc</FileSelector>
  //               )}
  //             </For>
  //             <FileSelector selectedFile={newAttachment} setSelectedFile={addNewAttachment} mimeType={KnownMime.GOOGLE_DOC}>Addd attachment</FileSelector>
  //           </Show>
  //         </>
  //       ),
  //       validate(errors) {
  //         if (selectedSheet() == null) errors.push("Vous devez sélectionner un publipostage ou en créer un.")
  //       }
  //     },
  //     {
  //       shortTitle: "Dernier details",
  //       content: (<>
  //         <p>ici on choisis les récipients ou le dossier de sortie</p>
  //       </>
  //       ),
  //       validate(errors) {
  //         if (selectedSheet() == null) errors.push("Vous devez sélectionner un publipostage ou en créer un.")
  //       }
  //     },
  //     {
  //       shortTitle: "Aperçu",
  //       content: (<>
  //         <ObjectSelector 
  //           label="Selected template" 
  //           objects={templates()}
  //           selectedObject={selectedTemplate()}
  //           setSelectedObject={setSelectedTemplate}
  //           getKey={t => t.name} />
  //         <Pager pages={rows()?.rowObjects?.length} currentPage={rowNo()} setCurrentPage={setRowNo} ></Pager>
  //         <HTMLPreview content={transformedTemplate()} class="flex-1 w-full" />
  //       </>
  //       ),
  //       validate(errors) {
  //         if (selectedSheet() == null) errors.push("Vous devez sélectionner un publipostage ou en créer un.")
  //       }
  //     },
  //     {
  //       shortTitle: "Exécution",
  //       content: (
  //         <>
  //           <p>Record found: 1234</p>
  //           <button class="btn btn-primary">Appuyez pour lancer le publipostage</button>
  //         </>
  //       ),
  //       validate(errors) {
  //         if (selectedSheet() == null) errors.push("Vous devez sélectionner un publipostage ou en créer un.")
  //       }
  //     },
  //   ];

  //   const currentMailingStep = createMemo(() => {
  //     return mailingSteps[stepNo()]
  //   })


  //   const selectedSheet = createMemo(() => {
  //     const sheetInfo = spreadsheetInfo()?.sheets.filter(f => f.sheetName === selectedSheetName())[0];
  //     return sheetInfo;
  //   })


  //   createEffect(async () => {
  //     let rangeValues = await server.getRangeValues({ spreadsheetId: null, sheetName: "Mailings" })
  //     let objects = cellValuesToObjects(rangeValues);
  //     setMailings(objects);
  //   })

  //   createEffect(async () => {
  //     let id = selectedSpreadsheet()?.id;
  //     setSpreadsheetInfo(null);
  //     if (id) {
  //       let spreadsheetInfo = await server.getSpreadsheetInfo(id, { maxRows: 10 });
  //       setSpreadsheetInfo(spreadsheetInfo); // Mise à jour du signal avec les nouvelles données
  //       const sheetNames = spreadsheetInfo.sheets.map((sh) => sh.sheetName)
  //       setSheetNames(sheetNames)
  //       setSelectedSheetName(sheetNames[0]);
  //     }
  //   });

  //   createEffect(async () => {
  //     let id = selectedTemplate()?.id;
  //     let result = id ? (await server.convertDocument(selectedTemplate()?.id, "html", "")).resultText
  //       : null;
  //     setSelectedTemplateHTML(result);
  //   })

  //   createEffect(async () => {
  //     try {
  //       let sheetName = selectedSheetName();
  //       let rows: IDataSource;
  //       if (sheetName) {
  //         let cellValues = await server.getRangeValues({ spreadsheetId: spreadsheetInfo()?.driveFile.id, sheetName: selectedSheetName() })
  //         rows = cellValuesToObjects(cellValues);
  //       } else {
  //         rows = null;
  //       }
  //       setRows(rows)
  //     } finally {
  //       //completeLoading();
  //     }
  //   });

  //   function addNewAttachment(newAttachment: IDriveFile) {
  //     setAttachments([...attachments(), newAttachment])
  //   }

  //   function removeAttachment(attachment: IDriveFile) {
  //     setAttachments(attachments().filter(a => a !== attachment))
  //   }

  //   function previousStep() {
  //     setPageNo(stepNo() - 1)
  //   }

  //   function nextStep() {
  //     let errors: Errors = [];
  //     currentMailingStep().validate(errors);
  //     if (errors.length == 0) {
  //       setError("");
  //       setPageNo(stepNo() + 1)
  //     } else {
  //       setError(errors.map(e => e.toString()).join(", "))
  //     }
  //   }
  //   function onSetSelectedMailing(newMailing: IMailing) {
  //     setSelectedMailing(newMailing);
  //     localStorage.setItem("selectedMailing", String(newMailing?.id))
  //   }

  return (
    <>HI Mailing
      {/*
//     <Page>
//       <ul class="steps">
//         <For each={mailingSteps}>
//           {(step, index) => (
//             <li classList={{
//               step: true,
//               "step-primary": stepNo() >= index()
//             }}>
//               {step.shortTitle}
//             </li>
//           )}
//         </For>
//       </ul>
//       <hr class="mb-3" />
//       <div class="flex-1 overflow-y-auto flex flex-col">
//         {/*we are in a scroll area between our steps on top and our buttons at the bottom* /}
//         <div class="flex-1 flex flex-col">
//           <ErrorBoundary fallback={(error, reset) => ErrorComp({ error, reset, mainLabel: "Error in Mailing Page" })}>
//             {currentMailingStep().content}
//           </ErrorBoundary>
//         </div>
//       </div>
//       <div>
//         <Button onClick={previousStep} disabled={stepNo() == 0}>Previous</Button>&ensp;
//         <Button onClick={nextStep} disabled={stepNo() >= mailingSteps.length - 1}>Next</Button>
//         <span>{error()}</span>
//       </div>
//     </Page >*/
      }
    </>
  );
};

export default MailingPage;
