import { Component, For } from 'solid-js';
import { BootstrapContext, OnValueChanged } from './BootstrapFormVue';
import { ConstVue } from './ConstVue';
import { InputBottom, InputRenderer, InputTop } from './InputRenderer';
import { Box } from '../core/Box';


export type ObjectInputProps = {
  box: Box;
  onValueChanged: (onValueChanged: OnValueChanged) => void;
  label: string;
  level: number;
  context: BootstrapContext;
};

export const ObjectInput: Component<ObjectInputProps> = (props) => {
  return (
    <>
      <InputTop {...props as any} />
      <p>{props.label ?? props.box.getType().label}</p>
      <For each={props.box.getMembers()}>
        {(sub, index) => {
          return (sub.getType().type == 'const'
            ? <ConstVue box={sub} />
            : <div class="mb-2">
              {/* <label class="form-label">{sub.key}</label> */}
              <InputRenderer
                label={sub.getType().label ?? sub.name}
                box={sub}
                level={props.level + 1}
                onValueChanged={(o) => props.onValueChanged(o)}
                context={props.context} />
            </div>
          );
        }}
      </For>
      <InputBottom {...props as any} />
    </>
  );
};
