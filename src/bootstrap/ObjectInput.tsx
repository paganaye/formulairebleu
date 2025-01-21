import { Component, For } from 'solid-js';
import { IRenderOptions, OnValueChanged } from './FormVue';
import { ConstVue } from './ConstVue';
import { InputBottom, InputRenderer, InputTop } from './InputRenderer';
import { ObjectBox } from '../core/Box';


export type ObjectInputProps = {
  box: ObjectBox;
  onValueChanged: (options: OnValueChanged) => void;
  label: string;
  options: IRenderOptions;
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
                onValueChanged={(o) => props.onValueChanged(o)}
                options={props.options} />
            </div>
          );
        }}
      </For>
      <InputBottom {...props as any} />
    </>
  );
};
