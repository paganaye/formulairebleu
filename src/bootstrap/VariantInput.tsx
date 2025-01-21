import { Component, createEffect } from 'solid-js';
import { IRenderOptions, OnValueChanged } from './FormVue';
import { getUniqueId } from '../core/Utils';
import { VariantBox } from '../core/Box';
import { InputBottom, InputRenderer, InputTop } from './InputRenderer';
import { Value } from '../core/Box';
import { SingleSelectionVue } from './SingleSelectionVue';

export type VariantInputProps = {
  box: VariantBox;
  onValueChanged: (options: OnValueChanged) => void;
  label: string;
  options: IRenderOptions;
};


export const VariantInput: Component<VariantInputProps> = (props) => {
  let id = getUniqueId(`txt_${props.label}`);
  let innerVariant = props.box.getInnerVariant();
  let viewAsType = new Value<string>((innerVariant?.value.getType() as any).key);

  createEffect(() => {
    //let viewAs = props.box.getType().viewAs ?? { type: 'textbox' };
    //mask = viewAs.type == 'masked-textbox' ? viewAs.mask : undefined;
  })

  function onViewAsChanged(value: string) {
    viewAsType.setValue(value);
    props.box.setValue({ type: value })
  }

  let entries = props.box.getVariants().map(v => ({ key: v.key, label: v.label }));
  return (
    <>
      <InputTop {...props} />
      {JSON.stringify(props.box.getJSONValue())}
      <SingleSelectionVue viewAs={{ type: 'dropdown' }} selectedKey={viewAsType.getValue()} entries={entries} setSelectedKey={(k) => onViewAsChanged(k)} label={"View as:"} />
      <InputRenderer box={props.box.getInnerVariant()?.value} label={props.label} onValueChanged={props.onValueChanged} options={props.options} />
      <InputBottom {...props} />
    </>
  );
};
