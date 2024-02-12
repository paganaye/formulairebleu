// console.log("Code.ts START")

// function mailing() {
//   console.log("raw", Utils.rawVariableName("A B C"));
//   let htmlOutput = HtmlService.createHtmlOutputFromFile("index");
//   htmlOutput.setWidth(1024);
//   htmlOutput.setHeight(768);
//   SpreadsheetApp.getUi().showModalDialog(htmlOutput, "AFS Publicpostage");
// }

// function onOpen() {
//   var ui = SpreadsheetApp.getUi();
//   ui
//     .createAddonMenu()
//     .addItem(T.menu_show, 'showMailing')
//     .addSeparator()
//     .addItem(T.menu_help, 'showHelp')
//     .addToUi();
// }

// function doGet(e: any) {
//   let htmlOutput = HtmlService.createHtmlOutputFromFile("index");
//   return htmlOutput;
// }

// function doPost(e: any) {
//   return HtmlService.createHtmlOutput("<p>doPost Result</p>")
// }


// function serverCommand(request: ISideBarRequest): ISideBarResponse {

//   let response: any;
//   let activeSheet = SpreadsheetApp.getActiveSheet();
//   if (request.showSheet) {
//     let newSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(request.sheetName);
//     if (newSheet != activeSheet) {
//       newSheet?.activate();
//       activeSheet = newSheet!;
//     }
//   }
//   try {
//     const afsMailing = AFSMailing.getInstance();

//     const { command, args } = request;
//     if (command in afsMailing) {
//       let result = (afsMailing as any)[command](...args);
//       response = {
//         result,
//       }
//     } else {
//       response = {
//         error: {
//           type: "COMMAND_NOT_FOUND",
//           message: `Command ${command} not found`,
//           args: [command]
//         },
//         result: undefined,
//       }
//     }
//   } catch (e: any) {
//     response = {
//       error: {
//         type: "ServerRuntimeError",
//         message: e.message,
//         stack: e.stack,
//         args: []
//       },
//       result: undefined
//     }
//   }
//   if (request.getCurrentRange) {
//     const activeRange = activeSheet.getActiveRange();
//     if (activeRange) {
//       response.currentRange = activeRange.getA1Notation();
//     }
//   }
//   if (request.getCurrentSheetName) {
//     response.currentRange = activeSheet.getName()
//   }
//   if (request.getSheetNames) {
//     response.sheetNames = SpreadsheetApp.getActiveSpreadsheet().getSheets().map(s => s.getSheetName());
//   }
//   return response;
// }


// (globalThis as any).serverCommand = serverCommand;
