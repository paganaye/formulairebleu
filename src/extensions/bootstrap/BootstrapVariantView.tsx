import { Component, createEffect, formulaireBleuJSXFragmentFactory } from "../../core/jsx";
import { Box } from "../../core/Box";
import { Value } from '../../core/jsx';
import { SingleSelectionVue } from './BootstrapSingleSelectionView';
import { OnValueChanged } from '../../core/FormEngine';
import { BootstrapEngine } from './BootstrapEngine';

export type VariantInputProps = {
  box: Box;
  onValueChanged: (onValueChanged: OnValueChanged) => void;
  label: string;
  level: number;
  engine: BootstrapEngine;
};


export const BootstrapVariantView: Component<VariantInputProps> = (props) => {
  //let id = getUniqueId(`txt_${props.label}`);
  let innerVariant = props.box.getInnerVariant();
  let variantKeyString = new Value<string>((innerVariant?.value.getType() as any).key);

  // createEffect(() => {
  //   //let view = props.box.getType().view ?? { type: 'textbox' };
  //   //mask = view.type == 'masked-textbox' ? view.mask : undefined;
  // })

  function onViewChanged(value: string) {
    variantKeyString.setValue(value);
    props.box.setVariantKey(value)
  }

  let entries = props.box.getVariants().map(v => ({ value: v.key, label: v.label ?? "" }));
  return (
    <>
      todo
      {/* <InputTop {...props} />
      <SingleSelectionVue view={{ type: 'dropdown' }} selectedKey={variantKeyString.getValue()} entries={entries} setSelectedKey={(k) => onViewChanged(String(k))} label={"View as:"} />
      <InputRenderer box={props.box.getInnerVariant()?.value} label={props.label} onValueChanged={props.onValueChanged} context={props.context} level={props.level} />
      <InputBottom {...props} /> */}
    </>
  );
};
