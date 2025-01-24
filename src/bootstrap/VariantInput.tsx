import { Component, createEffect } from 'solid-js';
import { IRenderOptions, OnValueChanged } from './FormVue';
import { InputBottom, InputRenderer, InputTop } from './InputRenderer';
import { Box, Value } from '../core/Box';
import { SingleSelectionVue } from './SingleSelectionVue';

export type VariantInputProps = {
  box: Box;
  onValueChanged: (options: OnValueChanged) => void;
  label: string;
  options: IRenderOptions;
};


export const VariantInput: Component<VariantInputProps> = (props) => {
  //let id = getUniqueId(`txt_${props.label}`);
  let innerVariant = props.box.getInnerVariant();
  let variantKeyString = new Value<string>((innerVariant?.value.getType() as any).key);

  createEffect(() => {
    //let view = props.box.getType().view ?? { type: 'textbox' };
    //mask = view.type == 'masked-textbox' ? view.mask : undefined;
  })

  function onViewChanged(value: string) {
    variantKeyString.setValue(value);
    props.box.setVariantKey(value)
  }

  let entries = props.box.getVariants().map(v => ({ value: v.key, label: v.label ?? "" }));
  return (
    <>
      <InputTop {...props} />
      <SingleSelectionVue view={{ type: 'dropdown' }} selectedKey={variantKeyString.getValue()} entries={entries} setSelectedKey={(k) => onViewChanged(String(k))} label={"View as:"} />
      <InputRenderer box={props.box.getInnerVariant()?.value} label={props.label} onValueChanged={props.onValueChanged} options={props.options} />
      <InputBottom {...props} />
    </>
  );
};
