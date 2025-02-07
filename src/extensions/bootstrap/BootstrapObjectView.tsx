import { JsxComponent, For, formulaireBleuJSX, formulaireBleuJSXFragment } from "../../core/tiny-jsx";
import { ConstView } from './BootstrapConstView';
import { Box, ObjectBox } from "../../core/Box";
import { BootstrapEngine } from './BootstrapEngine';


export type ObjectInputProps = {
  box: ObjectBox;
  label: string;
  level: number;
  engine: BootstrapEngine;
};

export const BootstrapObjectView: JsxComponent<ObjectInputProps> = (props) => {
  return (
    <>
      {props.engine.InputTop({ ...props })}
      <p>{props.label ?? props.box.type.label}</p>
      <For each={props.box.getMembers()}>
        {(sub, index) => {
          return (sub.type.type == 'const'
            ? <ConstView  {...sub.getType() as any} />
            : <div class="mb-2">
              <label class="form-label">{(sub as any).key}</label>
              {
                props.engine.InputRenderer({
                  engine: props.engine,
                  label: sub.type.label ?? sub.name,
                  box: sub,
                  level: props.level + 1,
                })
              }
            </div>
          );
        }}
      </For>
      {props.engine.InputBottom({ ...props })}
    </>
  );
};
