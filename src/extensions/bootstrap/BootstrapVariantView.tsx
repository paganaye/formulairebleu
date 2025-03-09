import { formulaireBleuJSXFragment, formulaireBleuJSX, computed } from "../../core/tiny-jsx";
import { VariantBox } from "../../core/Box";
import { SingleSelectionVue } from './BootstrapSingleSelectionView';
import { BootstrapEngine } from './BootstrapEngine';

export type VariantInputProps = {
  box: VariantBox;
  label: string;
  level: number;
  engine: BootstrapEngine;
};


export function BootstrapVariantView(props: VariantInputProps) {
  //let id = getUniqueId(`txt_${props.label}`);

  // createEffect(() => {
  //   //let view = props.box.type.view ?? { type: 'textbox' };
  //   //mask = view.type == 'masked-textbox' ? view.mask : undefined;
  // })
  const variantComp = computed("BootstrapVariantView.comp", { box: props.box.variantInnerBox }, p => {

    return p.box ? props.engine.InputRenderer({
      engine: props.engine,
      label: props.label,
      level: props.level,
      box: p.box
    }) : <p>no box</p>;
  })

  let entries = props.box.getVariants().map((v, i) => ({ value: v.key, label: v.label ?? v.key ?? "#" + (i + 1) }));

  return (
    <>
      {props.engine.InputTop(props)}
      <SingleSelectionVue view={{ type: 'dropdown' }} selectedKey={props.box.typeKey} entries={entries} label={"View as:"} />
      {variantComp}
      {props.engine.InputBottom(props)}
    </>
  );
};
