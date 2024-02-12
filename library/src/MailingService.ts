// console.log("Mailing.ts")


// class AFSMailing implements IServerCommands {
//   private static _instance: AFSMailing;

//   static getInstance() {
//     return (this._instance) || (this._instance = new AFSMailing())
//   }


//   getFolderContent(folderId?: string): IFolderContent {
//     let path: IDriveFolder[] = [];
//     let files: IDriveFile[] = [];
//     let folders: IDriveFolder[] = [];

//     if (!folderId) {
//       let currentFile = DriveApp.getFileById(SpreadsheetApp.getActiveSpreadsheet().getId());
//       let parents = currentFile.getParents();
//       folderId = parents?.hasNext() ? parents.next().getId() : undefined;
//     }

//     if (folderId) {
//       let folder = DriveApp.getFolderById(folderId);
//       let current: GoogleAppsScript.Drive.Folder | null = folder;
//       while (current) {
//         path.unshift({ id: current.getId(), name: current.getName(), type: "folder" });
//         let parents: GoogleAppsScript.Drive.FolderIterator = current.getParents();
//         current = parents.hasNext() ? parents.next() : null;
//       }

//       let driveFiles = folder.getFiles();
//       while (driveFiles.hasNext()) {
//         let file = driveFiles.next();
//         files.push(this._driveFile(file));
//       }

//       let driveFolders = folder.getFolders();
//       while (driveFolders.hasNext()) {
//         let subFolder = driveFolders.next();
//         folders.push({ id: subFolder.getId(), name: subFolder.getName(), type: 'folder' });
//       }
//     }
//     return {
//       path,
//       folders,
//       files
//     };
//   }

//   _driveFile(file: GoogleAppsScript.Drive.File): IDriveFile {
//     return {
//       id: file.getId(),
//       name: file.getName(),
//       type: 'file',
//       mimeType: file.getMimeType(),
//       size: file.getSize()
//     }
//   }

//   setRangeValues(sheetName: string, range: IRange, values: CellValue[][]): void {
//     throw new Error("Method not implemented.");
//   }
//   readDataFile(dataFile: IDataFileURL): CellValue[][] {
//     throw new Error("Method not implemented.");
//   }

//   doMultiply(a: number, b: number): number {
//     return a * b;
//   }


//   //   // ⌛ ✅ 🟡 ❌


//   getFileInfo(idOrUrl: string, email?: string): IFileAccessInfo {
//     let id = Utils.getIdFromUrl(idOrUrl);
//     let driveFile = DriveApp.getFileById(id);

//     let sharingPermissions = driveFile.getSharingPermission()
//     let owner = driveFile.getOwner()
//     let editors = driveFile.getEditors()
//     let viewers = driveFile.getViewers()
//     let isShareable = driveFile.isShareableByEditors();
//     let isTrashed = driveFile.isTrashed();
//     let isStarred = driveFile.isStarred();
//     let description = driveFile.getDescription() ?? "";
//     let size = driveFile.getSize();

//     let userAccess = null
//     if (email) {
//       userAccess = driveFile.getAccess(email);

//     }
//     let result: IFileAccessInfo = {
//       id,
//       name: driveFile.getName(),
//       sharingPermissions: sharingPermissions.toString(),
//       userAccess: userAccess?.toString(),
//       owner: Utils.userString(owner),
//       editors: Utils.userStrings(editors),
//       viewers: Utils.userStrings(viewers),
//       description,
//       isStarred,
//       isTrashed,
//       isShareable,
//       size
//     }
//     return result;
//   }


//   setFileAttribute(idOrUrl: string, fileAttribute: FileAttribute, arg: string): IFileAccessInfo {
//     let id = Utils.getIdFromUrl(idOrUrl);
//     let driveFile = DriveApp.getFileById(id);
//     switch (fileAttribute) {
//       case "addCommenter": driveFile.addCommenter(arg); break;
//       case "addEditor": driveFile.addEditor(arg); break;
//       case "addViewer": driveFile.addViewer(arg); break;
//       case "setDescription": driveFile.setDescription(arg); break;
//       case "setName": driveFile.setName(arg); break;
//       case "removeCommenter": driveFile.removeCommenter(arg); break;
//       case "removeEditor": driveFile.removeEditor(arg); break;
//       case "removeViewer": driveFile.removeViewer(arg); break;
//       case "revokePermissions": driveFile.revokePermissions(arg); break;
//       default:
//         throw Error("Invalid attribute " + fileAttribute)
//     }
//     return this.getFileInfo(id)
//   }

//   showModal(page: string, options: { width?: number, height?: number, title?: string } = {}): void {
//     let width = options.width ?? 640;
//     let height = options.height ?? 480;
//     let title = options.title ?? page;
//     let htmlOutput = HtmlService.createHtmlOutputFromFile("index");
//     htmlOutput.append('<script>var dialogRoute = ' + JSON.stringify(page) + ';</script>').setWidth(width).setHeight(height).setTitle(title);
//     SpreadsheetApp.getUi().showModalDialog(htmlOutput, "title")
//   }

//   showSideBar(page: string, options: { title?: string } = {}): void {
//     let title = options.title ?? page;
//     let htmlOutput = HtmlService.createHtmlOutputFromFile("index");
//     htmlOutput.append('<script>var dialogRoute = ' + JSON.stringify(page) + ';</script>');
//     SpreadsheetApp.getUi().showSidebar(htmlOutput);
//   }

//   // appendRows(sheet: ISheetInfo, rows: object[]): void {
//   //   throw new Error("Method not implemented.");
//   // }

//   getOAuthToken() {
//     return ScriptApp.getOAuthToken()
//   }

//   convertDocument(docId: string, conversion: FileConversion, outputUrl: string): IConvertDocumentResult {
//     var url = "https://docs.google.com/feeds/download/documents/export/Export?id=" +
//       docId + "&exportFormat=" + conversion;

//     var options = {
//       headers: {
//         Authorization: 'Bearer ' + ScriptApp.getOAuthToken()
//       },
//       muteHttpExceptions: true
//     };

//     var response = UrlFetchApp.fetch(url, options);

//     if (response.getResponseCode() == 200) {
//       var resultText = response.getContentText();
//       return { resultText }
//     } else {
//       throw new Error('Failed to fetch the document. Response Code: ' + response.getResponseCode());
//     }

//   }
//   deleteDocument(url: string): void {
//     throw new Error("Method not implemented.");
//   }
//   doMailing(mailing: IMailingData): IMailingResult {
//     throw new Error("Method not implemented.");
//   }
//   processDocTemplate(docTemplateUrl: string, data: object, outputUrl: string): IProcessDocTemplateResult {
//     throw new Error("Method not implemented.");
//   }
//   processTextTemplate(textTemplate: string, data: object): IProcessTextResult {
//     throw new Error("Method not implemented.");
//   }
//   sendEmail(email: IEmailData): ISendEmailResult {
//     let mailAdvancedParameters: GoogleAppsScript.Mail.MailAdvancedParameters = {
//       // /** an array of files to send with the email */
//       // attachments?: Base.BlobSource[] | undefined;
//       // /** a comma-separated list of email addresses to BCC */
//       // bcc?: string | undefined;
//       // /** the body of the email */
//       body: email.textBody,
//       // /** a comma-separated list of email addresses to CC */
//       // cc?: string | undefined;
//       // /** if set, devices capable of rendering HTML will use it instead of the required body argument; you can add an optional inlineImages field in HTML body if you have inlined images for your email */
//       htmlBody: email.htmlBody,
//       // /** a JavaScript object containing a mapping from image key (String) to image data (BlobSource); this assumes that the htmlBody parameter is used and contains references to these images in the format <img src="cid:imageKey" /> */
//       // inlineImages?: { [imageKey: string]: Base.BlobSource } | undefined;
//       // /** the name of the sender of the email (default: the user's name) */
//       // name?: string | undefined;
//       // /** true if the email should be sent from a generic no-reply email address to discourage recipients from responding to emails; this option is only possible for G Suite accounts, not Gmail users */
//       // noReply?: boolean | undefined;
//       // /** an email address to use as the default reply-to address (default: the user's email address) */
//       // replyTo?: string | undefined;
//       // /** the subject of the email */
//       subject: email.subject,
//       // /** the address of the recipient */
//       to: Utils.emailsToString(email.recipients)
//     }
//     MailApp.sendEmail(mailAdvancedParameters)
//     return {
//       data: email,
//       errors: undefined
//     }
//   }

//   getDocThumbnailUrl(fileId: string): string {
//     try {
//       var file = DriveApp.getFileById(fileId);
//       var blob = file.getThumbnail();
//       if (typeof blob === "string") return blob;
//       if (blob) {
//         var dataString = Utilities.base64Encode(blob.getBytes());
//         var mimeType = blob.getContentType();
//         return 'data:' + mimeType + ';base64,' + dataString;
//       }
//     } catch (e) { }
//     throw new Error('No thumbnail available');
//   }

//   getRangeValues(sheetId: ISheetId, range?: IRange | undefined): CellValues {
//     let sheet = this._getSheet(sheetId);
//     let sheetRange: GoogleAppsScript.Spreadsheet.Range;

//     if (range) {
//       sheetRange = sheet.getRange(range.row, range.column, range.numRows, range.numColumns);
//     } else {
//       sheetRange = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn());
//     }
//     return sheetRange.getValues()
//   }

//   getSpreadsheetInfo(spreadsheetId: string, options: { maxRows?: number } = {}): ISpreadsheetInfo {
//     let fileFile = DriveApp.getFileById(spreadsheetId)
//     let driveFile = this._driveFile(fileFile);
//     let spreadsheet = this._getSpreadsheet(spreadsheetId);
//     let sheets: ISheetInfo[] = spreadsheet.getSheets().map(sh => this._getSheetInfo(sh));
//     let result: ISpreadsheetInfo = {
//       driveFile,
//       sheets
//     }
//     return result;
//   }

//   _getSheetInfo(sh: GoogleAppsScript.Spreadsheet.Sheet, options: { maxRows?: number } = {}): ISheetInfo {
//     let sheetInfo: ISheetInfo = {
//       sheetName: sh.getName(),
//       lastRow: sh.getLastRow(),
//       lastColumn: sh.getLastColumn(),
//       rows: []
//     };
//     sheetInfo.rows = [];
//     let range = sh.getRange(1, 1, sheetInfo.lastColumn, Math.min(sheetInfo.lastColumn, options?.maxRows ?? 10));
//     sheetInfo.rows = range.getValues() as CellValues;
//     return sheetInfo;
//   }

//   getRangeAsObjects(sheetId: ISheetId, range?: IRange | undefined): RowObject[] {
//     let sheet: GoogleAppsScript.Spreadsheet.Sheet = this._getSheet(sheetId);
//     let rows = this.getRangeValues(sheetId, range);
//     let header = rows.shift() ?? []
//     let result: RowObject[] = rows.map((r) => {
//       let rowObject: RowObject = {};
//       r.forEach((r, idx) => {
//         rowObject[header[idx] as string ?? ("col" + idx)] = r;
//       });
//       return rowObject;
//     })
//     return result;
//   }

//   appendRows(sheetId: ISheetId, rows: CellValue[][]): void {
//     throw new Error("Method not implemented.");
//   }
//   appendObjectRows(sheetId: ISheetId, columns: IColumns, rows: object[]): void {
//     throw new Error("Method not implemented.");
//   }
//   _getSpreadsheet(spreadsheetId: string): GoogleAppsScript.Spreadsheet.Spreadsheet {
//     let useActiveSpreadsheet: boolean;
//     let spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet | null = null;
//     if (!spreadsheetId || spreadsheetId === SpreadsheetApp.getActiveSpreadsheet().getId()) {
//       useActiveSpreadsheet = true;
//       spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
//     } else {
//       useActiveSpreadsheet = false;
//       spreadsheet = SpreadsheetApp.openById(spreadsheetId);
//     }
//     if (!spreadsheet) throw Error(`Spreadsheet ${spreadsheetId} does not exist.`)
//     return spreadsheet;
//   }

//   _getSheet(sheetInfo: ISheetId): GoogleAppsScript.Spreadsheet.Sheet {
//     let spreadsheet = this._getSpreadsheet(sheetInfo.spreadsheetId);
//     let sheetName = sheetInfo.sheetName ?? 0
//     let result: GoogleAppsScript.Spreadsheet.Sheet | null
//     if (typeof sheetName === 'number') {
//       result = spreadsheet.getSheets()[sheetName];
//     } else {
//       result = spreadsheet.getSheetByName(sheetName)
//     }
//     if (!result) throw Error(`Sheet ${sheetName} does not exist.`)
//     return result;
//   }

//   // getFullRange(sheetName: string): ILastRowAndColumn {
//   // }

//   // getFullRangeValues(sheetName: string): string[][] {
//   //   let { lastRow, lastColumn } = this.getFullRange(sheetName);
//   //   if (lastRow > 1 && lastColumn > 1) {
//   //     let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName)!!;
//   //     let range = sheet.getRange(1, 1, lastRow, lastColumn);
//   //     return range.getValues();
//   //   } else return [];
//   // }

//   // getRangeValues(sheetName: string, range: IRange): string[][] {
//   //   let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
//   //   if (!sheet) throw Error("Sheet " + sheetName + " doesn't exist anymore");
//   //   let sheetRange = sheet.getRange(range.row, range.column, range.numRows, range.numColumns);
//   //   return sheetRange.getValues();
//   // }
//   //   setRangeValues(sheetName: string, range: IRange, values: any[][]): void {
//   //     let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
//   //     if (!sheet) throw Error("Sheet " + sheetName + " doesn't exist anymore");
//   //     let sheetRange = sheet.getRange(range.row, range.column, range.numRows, range.numColumns);
//   //     sheetRange.setValues(values);
//   //   }

//   //   readDataFile(dataFile: IDataFileURL): CellData[][] {
//   //     let spreadsheet = SpreadsheetApp.openByUrl(dataFile.url);
//   //     let sheet;
//   //     // Check if the Sheet1 is specified.
//   //     if (dataFile.sheetName) {
//   //       sheet = spreadsheet.getSheetByName(dataFile.sheetName);
//   //       if (!sheet) throw Error("Sheet " + dataFile.sheetName + " no longer exists");
//   //     } else {
//   //       sheet = spreadsheet.getSheets()[0];
//   //     }
//   //     let sheetRange = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn());
//   //     return sheetRange.getValues();
//   //   }

//   //   static showMailing() {
//   //     AFSMailingSidePanelLauncher.show("show")
//   //   }

//   //   static showHelp() {
//   //     AFSMailingSidePanelLauncher.show("help")
//   //   }
// }

// (globalThis as any).AFSMailing = AFSMailing;


