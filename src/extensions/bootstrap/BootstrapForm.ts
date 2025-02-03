import { IView } from "../../core/IForm";
import { ConstValue } from "../../core/IQuery";

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

export interface IBootstrapListView extends IView {
  type: 'list';
  ordered?: boolean;
  templateString: string;
}

export interface IBootstrapVariantView extends IView {
  type: 'variant';
  // to be expanded
}

export type IConstValue = ConstValue


export interface IBootstrapConstView extends IView {
  type: 'const';
  // to be expanded
}

export type IBootstrapSingleSelectionView = IBootstrapDropDownView | IBootstrapRadioButtonsView
export type IBootstrapMultipleSelectionView = IBootstrapDropDownView | IBootstrapCheckboxesView


