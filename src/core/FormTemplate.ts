export type JSONPrimitive = string | number | boolean | null
export type JSONValue = JSONPrimitive | JSONObject | JSONArray
export type JSONObject = { [member: string]: JSONValue | undefined }
export type JSONArray = Array<JSONValue | undefined>


export type IExprSource = string;


export interface IExpr {
  getValue(context: IRuntimeContext): any
}

//                 2      4      6      8      12
export type Size = "xs" | "sm" | "md" | "lg" | "xl";

export interface IRuntimeContext {

}

export type LookupTableUrl = string; //= "AA" | "formulaire" | "evenements" | "modele" | "nature-depenses" | "parametres" | "roles"

export enum ScreenWidth {
  Phone = 6,
  Normal = 12
}

interface RegexValidation {
  regex: string;
  error: string;
}


export interface Aggregation {
  type: "min" | "max" | "sum" | "avg";
  label?: string;
}

export interface FormLineTemplate {
  type: string;
  key?: string;
  // condition?: IExprSource;
  // tags?: string[]
  // defaultValue?: any;
  // lineId?: number;
  mandatory?: boolean;
  // mandatoryMessage?: string;
  // regexValidations?: RegexValidation[];
  // style?: string;
  // editMode?: "default" | "popup" | "add-button" | "grid";
  // footer?: Aggregation[];
  // description?: string;
  // htmlName?: string;
  // canView?: string[];
  // canEdit?: string[];
  // size?: Size;
}
export interface ExtendedLabel {
  label?: string;
  required?: string;
  help?: string;
  placeHolder?: string
}

export function getExtendedTemplate(label: Label): ExtendedLabel {
  if (!label || typeof label === 'string') {
    return { 'label': label as string ?? "" }
  } else {
    return label
  }
};


export type Label = string | ExtendedLabel;

export interface FormQuestionTemplate extends FormLineTemplate {
  key: string;
  label?: Label;
}


export interface FormSection extends FormLineTemplate {
  type: "section";
  key?: string;
  title: string;
  lines: SectionLine[];
  newPage?: boolean;
  //hideHeader?: boolean;
}

export interface DynamicField {
  form: string;
  response: number;
  field: string;
}

export interface FormLabelTemplate extends FormLineTemplate {
  type: "label";
  label?: string;
  dynamic?: DynamicField
}

export interface ViewMode {
  editing: boolean;
  editable: boolean;
}

interface RegexValidation {
  regex: string;
  error: string;
}

export interface FormTextTemplate extends FormQuestionTemplate {
  type: "text";
  viewAs?: "text" | "multiline" | "richtext";
  regexValidations?: RegexValidation[];
  case?: "uppercase" | "lowercase" | "wordcase" | "titlecase";
  mask?: string;
  isPassword?: boolean;
}

export interface FormSelectTemplate extends FormQuestionTemplate {
  type: "select"
  options: SelectOptions;
  viewAs?: "dropdown" | "radios";
  multiselect?: boolean,
  selectionMultiple?: boolean;
}

export type SelectOptions = StringOptions | LookupTableOptions | FormOptions | MemberOptions

export interface StringOptions {
  type: "strings",
  strings: StringOption[]
}

export interface LookupTableOptions {
  type: "lookuptable",
  lookupTableUrl: LookupTableUrl;
  filter?: IExprSource;
  collectionField?: string;
  keyField?: string;
  labelField?: string;
  refresh?: boolean;
}

export interface FormOptions {
  type: "form",
  formId?: number;
  filter?: IExprSource;
}

export interface MemberOptions {
  type: "member",
  filter?: IExprSource;
}


export interface StringOption {
  value: string;
  label?: string;
  icon?: string;
}

export interface SelectOption {
  value: any;
  label?: string;
  icon?: string;
}

export interface FormDate extends FormQuestionTemplate {
  type: "date"
}

export interface FormTime extends FormQuestionTemplate {
  type: "time"
}

export interface FormBoolean extends FormQuestionTemplate {
  type: "boolean";
  viewAs?: "checkbox" | "toggle";
  defaultValue?: boolean;
}

export interface FormNumberTemplate extends FormQuestionTemplate {
  type: "number";
  min?: number;
  max?: number;
  decimals?: number;
  prefix?: string;
  hidebuttons?: boolean;
  defaultValue?: number;
}

export interface FormCalculatedLine extends FormLineTemplate {
  type: "calculated"
  expr: IExprSource
  key: string;
  label: string;
}

export interface FormComponent extends FormLineTemplate {
  type: "component"
  key: string;
  label: string;
  componentType: string;
}

export interface FormButton extends FormLineTemplate {
  type: "button"
  label: string;
  actions?: Action[];
}

interface PredefinedRow {
  predefinedRowId: number;
  description?: string;
  values?: JSONValue;
  readonlyColumns?: string[];
  deletable?: boolean
}

export interface IFormArray extends FormQuestionTemplate {
  type: "array";
  columns: SectionLine[];
  predefinedRows?: PredefinedRow[];
  canAddRows?: "auto" | "false" | "true";
  minRows?: number;
  maxRows?: number;
  addButtonText?: string;
  item?: string;
  arrayButtons?: IArrayButtons
  viewAs?: "tabs" | "accordion" | "linear"
}



export interface IArrayButtons {
  itemLabel?: (idx: number, item: any) => string;
  addItem?: (idx: number) => string;
  modifyItem?: (idx: number, item: any) => string;
  deleteItem?: (idx: number, item: any) => string;
}

export function getButtons(item: string, buttons: IArrayButtons): IArrayButtons {
  if (!item) item = 'row';
  if (!buttons) buttons = {};
  if (!buttons.addItem) buttons.addItem = (idx) => `Add ${item} #${idx + 1}`;
  if (!buttons.deleteItem) buttons.deleteItem = (idx) => `Delete ${item} #${idx + 1}`;
  if (!buttons.modifyItem) buttons.modifyItem = (idx) => `Modify ${item} #${idx + 1}`;
  if (!buttons.itemLabel) buttons.itemLabel = (idx) => `${item} #${idx + 1}`;
  return buttons;
};

export interface IFormUpload extends FormQuestionTemplate {
  type: "upload";
  minFileCount?: number;
  maxFileCount?: number;
  maxSize?: number;
  allowedExtensions?: string;
}


export interface IFormImage extends FormLineTemplate {
  type: "image";
  label?: string;
  key: string;
}

export interface IFormSound extends FormLineTemplate {
  type: "sound";
  label?: string;
  key: string;
}

export interface IFormConst extends FormLineTemplate {
  type: "const";
  key: string;
  label: string;
  value: any;
}


export interface IFormDocs extends FormQuestionTemplate {
  type: "docs";
}

export interface CommandCallAction {
  type: "call";
  command: string;
  args: IExprSource[];
  uniqueId?: number;
}

export interface IfAction {
  type: "if";
  condition: IExprSource;
  then: Action[];
  else?: Action[] | IfAction;
  uniqueId?: number;
}

export interface ForAction {
  type: "for";
  variableName: string;
  from: IExprSource;
  to: IExprSource;
  actions: Action[];
  uniqueId?: number;
}

export interface WhileAction {
  type: "while";
  condition: IExprSource;
  actions: Action[];
  uniqueId?: number;
}

export type Action = CommandCallAction | IfAction | WhileAction | ForAction;

export interface NamedScript {
  scriptName: string;
  actions: Action[];
}

export interface FormTemplate extends FormLineTemplate {
  type: "form";
  title: string;
  // multipleTitle?: string;
  // description?: string;
  // formVersion?: number;
  sections: FormSection[];
  // lastLineId?: number;
  // tags?: string[];
  // onStatusChanged?: Action[]
  // customScripts?: NamedScript[]
  // multipleEntries?: boolean,
  // isLookupTable?: boolean;
  // adminResponses?: boolean,
  // publicReadable?: boolean,
  // entryName?: string;
  // addNewLabel?: string
}
export type SectionLine = IFormDocs | FormLabelTemplate | FormTextTemplate | FormSelectTemplate
  | FormSelectTemplate | FormDate | FormTime | FormBoolean
  | FormNumberTemplate | IFormArray | IFormUpload | IFormImage | IFormConst
  | IFormSound | FormCalculatedLine | FormSection | FormComponent | FormButton


export interface UploadedFile {
  id: number;
  filename: string;
  size: number;
}

