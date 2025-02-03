import { Component, For, Show } from "../../core/jsx";
import { Styles } from "../../core/Styles";

Styles.add(".error", {
  color: "red"
});

export type ErrorsProps = {
  errors: string[];
};

export const ErrorView: Component<{ error: string }> = (props) => {
  return (<Show when={props}>
    <div class="error">{props.error}</div>
  </Show >);
};

export const ErrorsView: Component<ErrorsProps> = (props) => {
  return (<Show when={props.errors}>
    <div class="errors">
      <For each={props.errors}>
        {(err) => <ErrorView error={err} />}
      </For>
    </div>
  </Show>);

};

