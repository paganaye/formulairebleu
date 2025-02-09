import { JsxComponent, formulaireBleuJSX, formulaireBleuJSXFragment, For, Show } from "../../core/tiny-jsx";
import { Styles } from "../../core/Styles";

Styles.add(".error", {
  color: "red"
});

export type ErrorsProps = {
  errors: string[];
};

export function ErrorView(props: { error: string }) {
  return (<Show when={props}>
    <div class="error">{props.error}</div>
  </Show >);
};

export function ErrorsView(props: ErrorsProps) {
  return (<Show when={props.errors}>
    <div class="errors">
      <For each={props.errors}>
        {(err: any) => <ErrorView error={err} />}
      </For>
    </div>
  </Show>);

};

