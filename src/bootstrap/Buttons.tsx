import { Component, For } from "solid-js";
import { Styles } from "../core/Styles";


export interface DialogButton {
  text: string;
  action: () => void;
  class?: string;
}

export interface DialogButtonsProps {
  buttons: DialogButton[];
}


Styles.add(".buttons.btn:focus", {
  border: '1px solid #ccc'
})

export const Buttons: Component<DialogButtonsProps> = (props) => {
  return <For each={props.buttons}>
      {(button) => {
      return (
        <button tabIndex={0}
            type="button"
            class={"buttons btn " + button.class}
            onClick={() => button.action()}
        > {button.text}</button>);
      }}
  </For>;
};
