import { Component, For, JSX, Show, createMemo, createSignal } from 'solid-js';
import { FormSection, FormTemplate, FormLineTemplate, FormNumberTemplate, Label, ExtendedLabel, getExtendedTemplate } from '../core/FormTemplate';
import { template } from 'solid-js/web';
// import { navigateToPage } from '../App';
// import { twMerge } from 'tailwind-merge';

interface ILabelProps {
  //   class?: string;
  //   startIcon?: any;
  //   onClick?: (event: MouseEvent) => void;
  //   disabled?: boolean;
  //   children: JSX.Element;
  useLabelTag?: boolean;
  label: Label
  error?: string;
  children: JSX.Element;

}

const LabelOrDiv = (props: { useLabelTag: boolean; class?: string; children: JSX.Element }) =>
  props.useLabelTag ? (
    <label class={props.class}>{props.children}</label>
  ) : (
    <div class={props.class}>{props.children}</div>
  );

const LabelComponent: Component<ILabelProps> = (props) => {
  const extendedTemplate = createMemo<ExtendedLabel>(() => getExtendedTemplate(props.label));

  return (
    <LabelOrDiv useLabelTag={props.useLabelTag} class="form-control w-full">
      <div class="label">
        <span class="label-text">{extendedTemplate().label}</span>
        <span class="label-text-alt">{extendedTemplate().required}</span>
      </div>
      {props.children}
      <div class="label">
        <span class="label-text-alt">{props.error ?? extendedTemplate().help}</span>
      </div>
    </LabelOrDiv>
  );
};

export default LabelComponent;