import { ICoreForm, IViewAs } from "../core/ICoreForm";

export interface IDropDownSelection extends IViewAs {
  type: 'dropdown';
}

export interface IRadioButtonsViewAs extends IViewAs {
  type: 'radiobuttons';
  class: string;
  itemClass: string;
}

export interface ISwitchesSelection extends IViewAs {
  type: 'switches';
}

export interface ICheckboxesSelection extends IViewAs {
  type: 'checkboxes';
}

export interface ICheckboxView extends IViewAs {
  type: 'checkbox';
}

export interface ISwitchView extends IViewAs {
  type: 'switch';
}

export interface ITextboxView extends IViewAs {
  type: 'textbox';
}

export interface INumberTextboxView extends IViewAs {
  type: 'textbox';
  suffix?: string;
}

export interface IMaskedTextboxView extends IViewAs {
  type: 'masked-textbox';
  mask: string;
}

export interface IDropDownView extends IViewAs {
  type: 'dropdown';
}

export interface IObjectViewAs extends IViewAs {
  type: 'object';
  order?: 'default' | 'alphabetical'
}

export interface IFlowView extends IViewAs {
  type: 'flow';
  separator: boolean;
}

export interface ITableView extends IViewAs {
  type: 'table';
  sortable?: boolean;
  columnResize?: boolean;
  columnReorder?: boolean;
}

export interface ITabsView extends IViewAs {
  type: 'tabs';
}

export interface IAccordionView extends IViewAs {
  type: 'accordion';
}

export interface IListView extends IViewAs {
  type: 'list';
  ordered?: boolean;
  templateString: string;
}

export interface IBootstrapFormEngine {
  string: ITextboxView | IMaskedTextboxView;
  number: INumberTextboxView;
  boolean: ICheckboxView | ISwitchView;
  object: IObjectViewAs;
  array: IFlowView | ITableView | ITabsView | IAccordionView | IListView;
  void: IViewAs;
  singleSelection: ISingleSelectionViewAs;
  multipleSelection: IMultipleSelectionViewAs;
}

export type ISingleSelectionViewAs = IDropDownSelection | IRadioButtonsViewAs
export type IMultipleSelectionViewAs = IDropDownSelection | IRadioButtonsViewAs

export type IBootstrapForm = ICoreForm<IBootstrapFormEngine>;
