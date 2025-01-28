import { Component, For } from 'solid-js';
import { ConstView } from './BootstrapConstView';
import { Box } from "../../core/Box";
import { OnValueChanged } from '../../core/FormEngine';
import { BootstrapEngine } from './BootstrapEngine';


export type ObjectInputProps = {
  box: Box;
  onValueChanged: (onValueChanged: OnValueChanged) => void;
  label: string;
  level: number;
  engine: BootstrapEngine;
};

export const BootstrapObjectView: Component<ObjectInputProps> = (props) => {
  return (
    <>
      {props.engine.InputTop({ ...props })}
      <p>{props.label ?? props.box.getType().label}</p>
      <For each={props.box.getMembers()}>
        {(sub, index) => {
          return (sub.getType().type == 'const'
            ? <ConstView  {...sub.getType() as any} />
            : <div class="mb-2">
              <label class="form-label">{(sub as any).key}</label>
              {
                props.engine.InputRenderer({
                  engine: props.engine,
                  label: sub.getType().label ?? sub.name,
                  box: sub,
                  level: props.level + 1,
                  onValueChanged: props.onValueChanged
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
