import { formulaireBleuJSXFragment, formulaireBleuJSX, For, JSONValue, JSXComponent, Value, computed, IValue } from "../../core/tiny-jsx";
import { getUniqueId, } from "../../core/Utils";
import { ISelectionEntry, IView } from "../../core/IForm";
import { IBootstrapRadioButtonsView } from './BootstrapForm';
import { Bootstrap } from "./BootstrapEngine";


export type SingleSelectionProps = {
  label: string;
  entries: ISelectionEntry[];
  selectedKey: IValue<string>;
  view: IView;
};

// Styles.add("div.selection-entries.", {
//   display: 'flex',
//   flexDirection: 'row',
//   flexWrap: 'wrap'
// });

// Styles.add("div.six-columns > div.selection-entries > div.selection-entry", {
//   backgroundColor: 'red',
// });

export function SingleSelectionVue(props: SingleSelectionProps): JSXComponent {
  let id = getUniqueId("single_selection");
  let dropDown: bootstrap.Dropdown;

  function onDropdownClick(e: MouseEvent) {
    if (!dropDown) dropDown = new Bootstrap.Dropdown(document.getElementById(id)!, { autoClose: true });
    dropDown.toggle();
  }
  switch (props.view.type) {
    case "radiobuttons":
      let view = props.view as IBootstrapRadioButtonsView
      return <div class={`single-selection ${view.type} ${view.class}`}>
        <label class="pe-1">{props.label}</label>
        <div id={id} class="selection-entries row">
          <For each={props.entries}>
            {(entry) => (
              <div class={`selection-entry ${view.itemClass ?? ''}`} >
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name={id}
                    id={`${id}-${entry.value}`}
                    value={String(entry.value)}
                    checked={entry.value === props.selectedKey}
                    onInput={() => props.selectedKey.setValue(entry.value)}
                  />
                  <label class="form-check-label" for={`${id}-${entry.value}`}>
                    {entry.label || String(entry.value)}
                  </label>
                </div>
              </div>
            )}
          </For>
        </div >
      </div >

    case "select":
      return <div class="form-floating">
        <select class="form-select" id={id} onInput={(e) => props.selectedKey.setValue((e.target as HTMLSelectElement).value)}>
          <For each={props.entries ?? []}>
            {(entry) => (
              <option value={String(entry.value)} selected={entry.value === props.selectedKey}>
                {entry.label || String(entry.value)}
              </option>
            )}
          </For>
        </select>
        <label for={id}>{props.label}</label>
      </div>;

    case "dropdown":
    default:
      return <div class="dropdown" x-data-bs-toggle="dropdown"
        aria-haspopup="true">
        <label class="pe-1">{props.label}</label>
        <button
          class="btn btn-secondary dropdown-toggle btn-sm"
          type="button"
          id={id}
          aria-expanded="false"
          onClick={onDropdownClick}
        >
          {computed("SingleSelectionVue.buttonText", { selectedKey: props.selectedKey }, (p) => (props.entries ?? []).find((entry) => entry.value === p.selectedKey)?.label || props.selectedKey)
          }
        </button>
        <ul class="dropdown-menu" aria-labelledby={id}>
          <For each={props.entries ?? []}>
            {(entry) => (
              <li>
                <button
                  class="dropdown-item"
                  type="button"
                  onClick={() => {
                    dropDown?.hide();
                    props.selectedKey.setValue(entry.value)
                  }}
                >
                  {entry.label || String(entry.value)}
                </button>
              </li>
            )}
          </For>
        </ul>
      </div >
  }
}
