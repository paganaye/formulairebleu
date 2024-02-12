interface IRange {
  row: number,
  column: number,
  numRows: number,
  numColumns: number
}

type CellValue = string | number | boolean | Date;
type CellRow = CellValue[];
type CellValues = CellRow[];
type RowObject = Record<string, CellValue>;

interface IDataFileURL {
  url: string;
  sheetName: string;
}

type IDriveFileOrFolder = IDriveFile | IDriveFolder

interface IDriveFile {
  id: string;
  name: string;
  type: 'file';
  mimeType: string;
  folder?: IDriveFolder;
  lastModification?: Date;
  size?: number;
}

interface IDriveFolder {
  id: string;
  icon?: string;
  name: string;
  type: 'folder';
}

interface IFolderContent {
  path: IDriveFolder[],
  folders: IDriveFolder[]
  files: IDriveFile[]
}

interface ISheetId {
  spreadsheetId: string;
  sheetName: string | number;
}

interface ISpreadsheetInfo {
  driveFile: IDriveFile;
  sheets: ISheetInfo[]
}

interface ISheetInfo {
  sheetName: string;
  lastRow: number;
  lastColumn: number;
  rows: CellValues
}

interface IColumns {
  headerRowNo?: number;
  columns: IColumn[]
}

interface IColumn {
  fieldName: string;
  columnText: string;
}

interface IEmailAddress {
  email: string;
  name?: string;
}

interface IAttachment {
  fileName: string;
  url: string;
  conversion?: FileConversion;
  errors?: Errors;
}

type FileConversion = "docx" | "ebook" | "eml" | "gdoc" | "gsheet" | "html" | "odt" | "pdf" | "rtf" | "txt" | "none";

interface IEmailData {
  sender?: IEmailAddress;
  replyTo?: IEmailAddress;
  recipients: IEmailAddress[]
  cc?: IEmailAddress[]
  bcc?: IEmailAddress[]
  subject: string;
  textBody: string;
  attachments?: IAttachment[]
  saveAsDraft?: boolean;
  htmlBody: string;
}


interface ISendEmailResult {
  data: IEmailData;
  errors?: Errors;
}

interface IMailingData {
  mainTemplateUrl: string;
  mainDataFileUrl: string;
  firstRow?: number;
  rowCount?: number;
  outputFolder?: string;
  sender?: IEmailAddress;
  replyTo?: IEmailAddress;
  recipients: IEmailAddress[]
  cc?: IEmailAddress[]
  bcc?: IEmailAddress[]
  subject: string;
  attachments?: IAttachment[]
}

type Errors = (string | IError)[];

interface IError {
  type?: string,
  message: string;
  position?: string;
  args?: any[]
  stack?: string[]
}

interface IMailingResult {
  errors?: Errors;
  mailStatuses: {
    rownNo: number;
    errors?: Errors;
    emailStatus: ISendEmailResult;
    mainDocument: string;
    attachments?: IAttachment[]
  }
}

interface IProcessTextResult {
  resultText: string;
  errors?: Errors;
}

interface IProcessDocTemplateResult {
  resultUrl: string;
  errors?: Errors;
}

interface IConvertDocumentResult {
  resultUrl?: string;
  resultText?: string;
  errors?: Errors;
}

type IDialogType = 'home' | 'email' | 'mailing' | 'settings' | 'test' | 'notFound';

interface IDialog {
  type: IDialogType;
  title: any; // should be Translatable
  width: number;
  height: number;
  modal: boolean
}

interface IFBGlobals {
  company: string;
  email: string,
  locale: string,
  libraryFormulaireBleuVersion: string,
  dialog: string,
  dialogTitle: string,
  docId: string,
  spreadsheetId: string,
  activeSheet: string,
  gmailUnread: number | undefined,
  webApp?: boolean;
}

// interface IServerCommands {
//   convertDocument(url: string, conversion: FileConversion, outputUrl: string): IConvertDocumentResult;
//   deleteDocument(url: string): void;
//   doMailing(mailing: IMailingData): IMailingResult;
//   doMultiply(a: number, b: number): number;
//   getFileInfo(id: string, email?: string): IFileAccessInfo;
//   getFolderContent(folderId?: string): IFolderContent;
//   getRangeValues(sheetId: ISheetId, range?: IRange): CellValues;
//   getSpreadsheetInfo(spreadsheetId: string, options: { maxRows: number }): ISpreadsheetInfo;
//   getRangeAsObjects(sheetId: ISheetId, range?: IRange): RowObject[];
//   appendRows(sheetId: ISheetId, rows: CellValue[][]): void
//   appendObjectRows(sheetId: ISheetId, columns: IColumns, rows: object[]): void

//   processDocTemplate(docTemplateUrl: string, data: object, outputUrl: string): IProcessDocTemplateResult;
//   processTextTemplate(textTemplate: string, data: object): IProcessTextResult;
//   sendEmail(email: IEmailData): ISendEmailResult;
//   setFileAttribute(id: string, fileAttribute: FileAttribute, arg: string): IFileAccessInfo;
//   setRangeValues(sheetName: string, range: IRange, values: CellValues): void;
//   showModal(page: string, options?: { width: number, height: number, title?: string | undefined }): void;
//   showSideBar(page: string): void;
//   getDocThumbnailUrl(id: string): string;
//   getOAuthToken(): string;
// }

// interface IFileAccessInfo {
//   id: string;
//   name: string;
//   owner: string | null;
//   editors: string[];
//   viewers: string[];
//   description: string;
//   isStarred: boolean;
//   isTrashed: boolean;
//   isShareable: boolean;
//   sharingPermissions: string;
//   userAccess?: string;
//   size?: number;
// }

// type FileAttribute = "addCommenter" | "addEditor" | "addViewer" | "setDescription" | "setName" | "removeCommenter" | "removeEditor" | "removeViewer" | "revokePermissions";

