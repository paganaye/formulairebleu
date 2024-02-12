// import fs from "fs"
// import path from "path"


// const fakeDocHtmlPreview = "fakeServer/raw/fakeDocHtmlPreview.html";
// const fake_doc_thumbnail = "fakeServer/raw/fake-doc-thumbnail.png";
// const fake_doc_thumbnail_2 = "fakeServer/raw/fake-doc-thumbnail-2.png";
// const fake_sheet_thumbnail = "fakeServer/raw/fake-sheet-thumbnail.png";
// const fake_sheet_thumbnail_2 = "fakeServer/raw/fake-sheet-thumbnail-2.png";
// const fake_mailings = "fakeServer/raw/fakeMailings.csv";

// function loadCSV(filePath: string) {
//   const fileData = fs.readFileSync(filePath, 'utf8');
//   const lines = fileData.split('\n');
//   const result = lines.map(line => line.split(','));
//   return result;
// }

// function fileAsImageData(filePath: string) {
//   // Read the file into a Buffer.
//   const fileData = fs.readFileSync(filePath);

//   // Get the file extension (e.g., 'png', 'jpg').
//   const extension = path.extname(filePath).slice(1);

//   // Convert the Buffer to a Base64 encoded string.
//   const base64String = fileData.toString('base64');

//   // Create and return the data URL.
//   return `data:image/${extension};base64,${base64String}`;
// }

// function fileAsString(filePath: string) {
//   const fileData = fs.readFileSync(filePath);
//   return fileData.toString();
// }


// export interface IHtmlOutput {
//   content: string;
//   title?: string;
//   setTitle(title: string): IHtmlOutput;
// }

// export interface ISheet {
//   getParent(): Spreadsheet;
//   getSheetName(): string;
//   getLastRow(): number;
//   getLastColumn(): number;
//   getRange(row: number, column: number, numRows: number, numColumns: number): Range;
// }

// export class Spreadsheet {
//   readonly sheets: Sheet[] = []
//   activeSheet: Sheet;

//   constructor(readonly spreadsheetFile: FakeFile) {
//     this.activeSheet = this.sheets[0];
//     this.sheets = [
//       new Sheet(this, "Sheet1"),
//       new Sheet(this, "Sheet2")
//     ]
//   }

//   getName(): string {
//     return this.spreadsheetFile.getName();
//   }

//   getId(): string {
//     return this.spreadsheetFile.id;
//   }

//   getSheets(): Sheet[] {
//     return this.sheets;
//   }

//   getSheetByName(name: string): Sheet | null {
//     let sheet = this.sheets.find(s => s.name == name)
//     return sheet!!;
//   }
// }

// export class Range {
//   sheet: Sheet;
//   row: number;
//   column: number;
//   numRows: number;
//   numColumns: number;

//   constructor(sheet: Sheet, row: number, column: number, numRows: number, numColumns: number) {
//     this.sheet = sheet;
//     this.row = row;
//     this.column = column;
//     this.numRows = numRows;
//     this.numColumns = numColumns;
//   }

//   getValues(): any[][] {
//     let result: any[][] = [];
//     for (let r = 0; r < this.numRows; r++) {
//       let row: any[] = []
//       for (let c = 0; c < this.numColumns; c++) {
//         row.push(this.sheet.getValue(this.row + r, this.column + c) ?? "");
//       }
//       result.push(row);
//     }
//     return result;
//   }

//   setValues(values: any[][]): void {
//     for (let r = 0; r < values.length; r++) {
//       let row: any[] = values[r];
//       for (let c = 0; c < row.length; c++) {
//         this.sheet.setValue(this.row + r, this.column + c, row[c]);
//       }
//     }
//     this.sheet.render(undefined)
//   }
// }

// export class Sheet implements ISheet {

//   constructor(readonly spreadsheet: Spreadsheet, public name: string, public cellValues: CellValues = [["A", "B", "C"], ["A2", "B2", "C2"], ["A3", "B3", "C3"]]) { }

//   spreadsheetDiv: any;

//   getParent(): Spreadsheet {
//     return this.spreadsheet;
//   }

//   getSheetName(): string {
//     return this.name;
//   }

//   getName(): string {
//     return this.name;
//   }


//   getLastRow(): number {
//     return this.cellValues?.length ?? 0;
//   }

//   getLastColumn(): number {
//     let result = Math.max(...this.cellValues.map(r => r.length));
//     return isFinite(result) ? result : 0;
//   }

//   getRange(row: number, column: number, numRows: number, numColumns: number): Range {
//     return new Range(this, row, column, numRows, numColumns);
//   }

//   render(spreadsheetDiv: any) {
//     if (spreadsheetDiv) this.spreadsheetDiv = spreadsheetDiv;
//     else spreadsheetDiv = this.spreadsheetDiv;

//     let rows = this.getLastRow();
//     let cols = this.getLastColumn();
//     let output: string[] = ["<table>"]
//     output.push("<tr>")
//     for (let column = 0; column <= cols; column += 1) {
//       output.push("<td>")
//       output.push(String.fromCharCode(64 + column))
//       output.push("</td>")
//     }
//     output.push("</tr>")
//     for (let row = 1; row <= rows; row += 1) {
//       output.push("<tr>")
//       output.push("<td>")
//       output.push(row.toString())
//       output.push("</td>")
//       for (let column = 1; column <= cols; column += 1) {
//         output.push("<td>")
//         output.push(this.getValue(row, column))
//         output.push("</td>")
//       }
//       output.push("</tr>")
//     }
//     output.push("</table>")

//     spreadsheetDiv.innerHTML = output.join("")
//   }

//   getValue(rowNo: number, columnNo: number): any {

//     let row = this.cellValues[rowNo - 1] || (this.cellValues[rowNo - 1] = []);
//     return row[columnNo - 1];
//   }

//   setValue(rowNo: number, columnNo: number, value: any): any {
//     let row = this.cellValues[rowNo - 1] || (this.cellValues[rowNo - 1] = []);
//     row[columnNo - 1] = value;
//   }
// }

// export class UIClass {
//   showSidebar(content: { title: string; content: string }): void {

//     let sidePanelDiv = document.getElementById("side-panel-div");
//     console.log(content.content);
//     //sidePanelDiv.innerHTML = content.content
//   }
// }

// export class FakeSpreadsheetAppClass {
//   ui = new UIClass();

//   getActiveSpreadsheet(): Spreadsheet {
//     return activeSpreadsheet;
//   }

//   getActiveSheet(): Sheet {
//     return activeSpreadsheet.activeSheet;
//   }

//   getUi(): UIClass {
//     return this.ui;
//   }

//   openById(id: string): Spreadsheet {
//     let file = FakeDriveApp.getFileById(id);
//     return new Spreadsheet(file as FakeFile)
//   }
// }

// export class User {
//   getEmail(): string {
//     return "fake@ganaye.com";
//   }
// }

// export class FakeSessionClass {
//   user = new User();

//   getActiveUser(): User {
//     return this.user;
//   }

//   getEffectiveUser(): User {
//     return this.user;
//   }

//   getScriptTimeZone(): string {
//     return "Europe/Paris";
//   }

//   getActiveUserLocale(): string {
//     return "";
//   }

//   getTemporaryActiveUserKey(): string {
//     return "";
//   }
// }

// export class HtmlOutput implements IHtmlOutput {
//   content: string;
//   title?: string;

//   constructor(content: string) {
//     this.content = content;
//   }

//   setTitle(title: string): IHtmlOutput {
//     this.title = title;
//     return this;
//   }
// }

// export class FakeHtmlServiceClass {
//   createHtmlOutput(a: string): HtmlOutput {
//     return new HtmlOutput(a);
//   }
// }

// class FakeIterator {
//   data: any[];
//   current: number;

//   constructor(data: any[]) {
//     this.data = data;
//     this.current = 0;
//   }

//   hasNext() {
//     return this.current < this.data.length;
//   }

//   next() {
//     if (!this.hasNext()) {
//       throw new Error("No more elements in iterator");
//     }
//     return this.data[this.current++];
//   }
// }

// export abstract class FakeFileOrFolder {
//   readonly id: string
//   private description: string = "";

//   constructor(private name: string, readonly parent: FakeFileOrFolder | null = driveRoot, readonly type: 'file' | 'folder', id?: string) {
//     this.id = id ?? ("ID" + Object.keys(allFilesOrFolders).length.toString().padStart(3, '0') + "-AAAA-BBBB-CCCC")
//     //if (id in allFilesOrFolders) throw Error("The id " + id + " already exists in the drive")
//     allFilesOrFolders[this.id] = this;
//   }
//   getParents() {
//     return new FakeIterator((this.parent == null) ? [] : [this.parent])
//   }
//   getId() { return this.id }
//   getName() { return this.name }

//   getSharingPermission() { return "NONE" }
//   getOwner() { return null }
//   getEditors() { return [] }
//   getViewers() { return [] }
//   isShareableByEditors() { return false }
//   isTrashed() { return false }
//   isStarred() { return false }
//   getDescription() { return this.description }
//   getAccess(email: string) { return "FAKE-NOT-IMPLEMENTED" }
//   addCommenter(arg: string) { }
//   addEditor(arg: string) { }
//   addViewer(arg: string) { }
//   //setDescription(arg:string) { this.getDescription = arg }
//   setName(arg: string) { this.name = arg }
//   removeCommenter(arg: string) { }
//   removeEditor(arg: string) { }
//   removeViewer(arg: string) { }
//   revokePermissions(arg: string) { }
// }

// export class FakeFile extends FakeFileOrFolder {
//   constructor(name: string, readonly mimeType: KnownMime, readonly parent: FakeFileOrFolder | null = driveRoot, id?: string) {
//     super(name, parent, 'file', id)
//   }
//   getMimeType(): string {
//     return this.mimeType
//   }

//   getThumbnail() {
//     switch (this.mimeType) {
//       case KnownMime.GOOGLE_DOC: return fileAsImageData(fake_doc_thumbnail);
//       case KnownMime.GOOGLE_SHEET: return fileAsImageData(fake_sheet_thumbnail_2);
//     }
//   }

//   getSize() {
//     return 100
//   }
// }

// export class FakeFolder extends FakeFileOrFolder {
//   constructor(name: string, parent: FakeFileOrFolder | null = driveRoot) {
//     super(name, parent, 'folder')
//   }
//   getFiles() {
//     let files = Object.values(allFilesOrFolders).filter(f => f.type == 'file' && f.parent == this);
//     return new FakeIterator(files)
//   }
//   getFolders() {
//     let folders = Object.values(allFilesOrFolders).filter(f => f.type == 'folder' && f.parent == this);
//     return new FakeIterator(folders)
//   }
// }

// export class FakeDriveAppClass {
//   getFileById(id: string) {
//     let fileOrFolder = allFilesOrFolders[id];
//     if (fileOrFolder && fileOrFolder.type == 'file') {
//       return fileOrFolder
//     }
//     return null
//   }
//   getFolderById(id: string) {
//     let fileOrFolder = allFilesOrFolders[id];
//     if (fileOrFolder && fileOrFolder.type == 'folder') {
//       return fileOrFolder
//     }
//     return null
//   }
// }

// export class FakeScriptAppClass {
//   getOAuthToken() {
//     return "FAKE-OATH-TOKEN";
//   }

// }

// export class FakeUrlFetchAppClass {
//   fetch(url: string, options: any) {
//     return new FakeUrlFetchResult();
//   }
// }

// export class FakeUrlFetchResult {
//   constructor() { }

//   getResponseCode() { return 200; }

//   getContentText() {
//     return fileAsString(fakeDocHtmlPreview);
//   }

// }


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

// var allFilesOrFolders: Record<string, FakeFileOrFolder> = {}
// var driveRoot = new FakeFolder("My Drive", null);
// var macroMainSpreadsheet = new FakeFile("Main Spreadsheet", KnownMime.GOOGLE_SHEET)
// var secondSpreadsheet = new FakeFile("Second Spreadsheet", KnownMime.GOOGLE_SHEET)
// var firstTemplate = new FakeFile("First template", KnownMime.GOOGLE_DOC, driveRoot, "1BMXFjtkQqYcAHl5-mxLxvopy3J0VqcJ0Dl5XG6uPvlA")
// var longFilename1 = new FakeFile("This file has long filename a very long filename a very very long filename but it can wrap", KnownMime.GOOGLE_DOC)
// var longFilename2 = new FakeFile("This_file_has_long_filename_a_very_long_filename_a_very_long_filename_and_it_can't_wrap", KnownMime.GOOGLE_DOC)
// var secondTemplate = new FakeFile("Second template", KnownMime.GOOGLE_DOC, driveRoot, '1aZb2m1pgJe1fITfgI9jjsUjJM8TZ__XlaGHIV2XE5R4')
// var macroDePublipostage = new FakeFile("Macro de publipostage", KnownMime.GOOGLE_SHEET, driveRoot, "1lJKj2_6TkWRxGeRjZBN21IRV2hP6qshOxOeL7fvF9n8")
// var activeSpreadsheet = new Spreadsheet(macroMainSpreadsheet);
// var archiveFolder = new FakeFolder("Archive")
// var workInProgressFolder = new FakeFolder("Work in progress")
// var archive2023Folder = new FakeFolder("2023", archiveFolder)
// var archivedFile1 = new FakeFile("Archive 2023", KnownMime.OTHER, archive2023Folder);
// var archivedFile2 = new FakeFile("Archive 2023", KnownMime.EML, archive2023Folder);
// activeSpreadsheet.sheets[0].cellValues = loadCSV(fake_mailings);
// activeSpreadsheet.sheets[0].name = "Mailings"

// export const FakeSpreadsheetApp = new FakeSpreadsheetAppClass();
// export const FakeSession = new FakeSessionClass();
// export const FakeHtmlService = new FakeHtmlServiceClass();
// export const FakeDriveApp = new FakeDriveAppClass();
// export const FakeScriptApp = new FakeScriptAppClass();
// export const FakeUrlFetchApp = new FakeUrlFetchAppClass();

