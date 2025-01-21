import { ICoreForm, IFormViewEngine, IView } from "../core/ICoreForm";

export interface IBootstrapRadioButtonsView extends IView {
  type: 'radiobuttons';
  class: string;
  itemClass: string;
}

export interface IBootstrapSwitchesView extends IView {
  type: 'switches';
}

export interface IBootstrapCheckboxesView extends IView {
  type: 'checkboxes';
}

export interface IBootstrapCheckboxView extends IView {
  type: 'checkbox';
}

export interface IBootstrapSwitchView extends IView {
  type: 'switch';
}

export interface IBootstrapTextboxView extends IView {
  type: 'textbox';
}

export interface IBootstrapNumberTextboxView extends IView {
  type: 'textbox';
  suffix?: string;
}

export interface IBootstrapDateView extends IView {
  type: 'date';
  suffix?: string;
}

export interface IBootstrapMaskedTextboxView extends IView {
  type: 'masked-textbox';
  mask: string;
}

export interface IBootstrapDropDownView extends IView {
  type: 'dropdown';
}

export interface IBootstrapObjectView extends IView {
  type: 'object';
  order?: 'default' | 'alphabetical'
}

export interface IBootstrapFlowView extends IView {
  type: 'flow';
  separator: boolean;
}

export interface IBootstrapTableView extends IView {
  type: 'table';
  sortable?: boolean;
  columnResize?: boolean;
  columnReorder?: boolean;
}

export interface IBootstrapTabsView extends IView {
  type: 'tabs';
}

export interface IBootstrapAccordionView extends IView {
  type: 'accordion';
}

export interface IBootstrapListView extends IView {
  type: 'list';
  ordered?: boolean;
  templateString: string;
}

export interface IBootstrapVariantView extends IView {
  type: 'variant';
  // to be expanded
}

export interface IBootstrapVoidView extends IView {
  type: 'void';
  // to be expanded
}

export interface IBootstrapConstView extends IView {
  type: 'const';
  // to be expanded
}


export interface IBootstrapViewEngine extends IFormViewEngine {
  array: IBootstrapFlowView | IBootstrapTableView | IBootstrapTabsView | IBootstrapAccordionView | IBootstrapListView,
  boolean: IBootstrapCheckboxView | IBootstrapSwitchView | IBootstrapSingleSelectionView,
  const: IBootstrapConstView,
  date: IBootstrapDateView,
  number: IBootstrapNumberTextboxView | IBootstrapSingleSelectionView,
  object: IBootstrapObjectView,
  string: IBootstrapTextboxView | IBootstrapMaskedTextboxView | IBootstrapSingleSelectionView | IBootstrapMultipleSelectionView,
  variant: IBootstrapVariantView,
  void: IBootstrapVoidView,
  singleSelection: IBootstrapSingleSelectionView,
  multipleSelection: IBootstrapMultipleSelectionView
}

export type IBootstrapSingleSelectionView = IBootstrapDropDownView | IBootstrapRadioButtonsView
export type IBootstrapMultipleSelectionView = IBootstrapDropDownView | IBootstrapCheckboxesView

export interface IBootstrapForm extends ICoreForm<IBootstrapViewEngine> {
}

