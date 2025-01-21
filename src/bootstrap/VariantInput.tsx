import { Component, createEffect } from 'solid-js';
import { IRenderOptions, OnValueChanged } from './FormVue';
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
  //let id = getUniqueId(`txt_${props.label}`);
  let innerVariant = props.box.getInnerVariant();
  let viewAsType = new Value<string>((innerVariant?.value.getType() as any).key);

  createEffect(() => {
    //let view = props.box.getType().view ?? { type: 'textbox' };
    //mask = view.type == 'masked-textbox' ? view.mask : undefined;
  })

  function onViewChanged(value: string) {
    viewAsType.setValue(value);
    props.box.setValue({ type: value })
  }

  let entries = props.box.getVariants().map(v => ({ value: v.key, label: v.label ?? "" }));
  return (
    <>
      <InputTop {...props} />
      {JSON.stringify(props.box.getJSONValue())}
      <SingleSelectionVue view={{ type: 'dropdown' }} selectedKey={viewAsType.getValue()} entries={entries} setSelectedKey={(k) => onViewChanged(String(k))} label={"View as:"} />
      <InputRenderer box={props.box.getInnerVariant()?.value} label={props.label} onValueChanged={props.onValueChanged} options={props.options} />
      <InputBottom {...props} />
    </>
  );
};
