import { Component, For, Show } from 'solid-js';
import { Styles } from '../core/Styles';

Styles.add(".error", {
  color: "red"
});

export type ErrorsProps = {
  errors: string[];
};

export const ErrorVue: Component<{ error: string }> = (props) => {
  return (<Show when={props}>
    <div class="error">{props.error}</div>
  </Show >);
};

export const ErrorsVue: Component<ErrorsProps> = (props) => {
  return (<Show when={props.errors}>
    <div class="errors">
      <For each={props.errors}>
        {(err) => <ErrorVue error={err} />}
      </For>
    </div>
  </Show>);

};

