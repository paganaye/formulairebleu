import { formulaireBleuJSXFragment, formulaireBleuJSX, computed } from "../../core/tiny-jsx";
import { Box, VariantBox } from "../../core/Box";
import { Value } from '../../core/tiny-jsx';
import { SingleSelectionVue } from './BootstrapSingleSelectionView';
import { BootstrapEngine } from './BootstrapEngine';

export type VariantInputProps = {
  box: VariantBox;
  label: string;
  level: number;
  engine: BootstrapEngine;
};


export const BootstrapVariantView = (props: VariantInputProps) => {
  //let id = getUniqueId(`txt_${props.label}`);
  let innerVariant = props.box.getInnerVariant();

  // createEffect(() => {
  //   //let view = props.box.type.view ?? { type: 'textbox' };
  //   //mask = view.type == 'masked-textbox' ? view.mask : undefined;
  // })
  const variantComp = computed({ key: props.box.key, box: props.box.variantBox }, p => {
    if (p.key && p.box) {
      return props.engine.InputRenderer({
        engine: props.engine,
        label: props.label,
        level: props.level,
        box: p.box
      });
    } else return undefined;
    return undefined;
  })

  function onViewChanged(value: string) {
    props.box.key.setValue(value)
  }

  let entries = props.box.getVariants().map(v => ({ value: v.key, label: v.label ?? "" }));
  return (
    <>
      {props.engine.InputTop(props)}
      <SingleSelectionVue view={{ type: 'dropdown' }} selectedKey={props.box.key} entries={entries} label={"View as:"} />
      {variantComp}
      {props.engine.InputBottom(props)}
    </>
  );
};
