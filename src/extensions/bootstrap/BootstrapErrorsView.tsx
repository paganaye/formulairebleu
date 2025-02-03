import { JsxComponent, formulaireBleuJSX, formulaireBleuJSXFragment, For, Show } from "../../core/tiny-jsx";
import { Styles } from "../../core/Styles";

Styles.add(".error", {
  color: "red"
});

export type ErrorsProps = {
  errors: string[];
};

export const ErrorView: JsxComponent<{ error: string }> = (props) => {
  return (<Show when={props}>
    <div class="error">{props.error}</div>
  </Show >);
};

export const ErrorsView: JsxComponent<ErrorsProps> = (props) => {
  return (<Show when={props.errors}>
    <div class="errors">
      <For each={props.errors}>
        {(err: any) => <ErrorView error={err} />}
      </For>
    </div>
  </Show>);

};

