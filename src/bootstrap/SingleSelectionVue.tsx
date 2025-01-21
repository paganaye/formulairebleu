import * as Bootstrap from 'bootstrap';
import { For, JSX } from "solid-js";
import { getUniqueId } from "../core/Utils";
import { Styles } from "../core/Styles";
import { ISelectionEntry } from '../core/ICoreForm';
import { IRadioButtonsViewAs, ISingleSelectionViewAs } from './IBootstrapForm';


export type SingleSelectionProps = {
  label: string;
  entries: ISelectionEntry[];
  selectedKey: string;
  setSelectedKey: (key: string) => void;
  viewAs: ISingleSelectionViewAs;
};

// Styles.add("div.selection-entries.", {
//   display: 'flex',
//   flexDirection: 'row',
//   flexWrap: 'wrap'
// });

// Styles.add("div.six-columns > div.selection-entries > div.selection-entry", {
//   backgroundColor: 'red',
// });
declare var bootstrap: typeof Bootstrap

export function SingleSelectionVue(props: SingleSelectionProps): JSX.Element {
  let id = getUniqueId("single_selection");
  let dropDown: bootstrap.Dropdown;

  function onDropdownClick(e: MouseEvent) {
    if (!dropDown) dropDown = new bootstrap.Dropdown(document.getElementById(id)!, { autoClose: true });
    dropDown.toggle();
  }
  switch (props.viewAs.type) {
    case "radiobuttons":
      let viewAs = props.viewAs as IRadioButtonsViewAs
      return <div class={`single-selection ${viewAs.type} ${viewAs.class}`}>
        <label class="pe-1">{props.label}</label>
        <div id={id} class="selection-entries row">
          <For each={props.entries}>
            {(entry) => (
              <div class={`selection-entry ${viewAs.itemClass ?? ''}`} >
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name={id}
                    id={`${id}-${entry.key}`}
                    value={entry.key}
                    checked={entry.key === props.selectedKey}
                    onInput={() => props.setSelectedKey(entry.key)}
                  />
                  <label class="form-check-label" for={`${id}-${entry.key}`}>
                    {entry.label || entry.key}
                  </label>
                </div>
              </div>
            )}
          </For>
        </div >
      </div >
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
          {
            props.entries.find((entry) => entry.key === props.selectedKey)?.label || props.selectedKey
          }
        </button>
        <ul class="dropdown-menu" aria-labelledby={id}>
          <For each={props.entries}>
            {(entry) => (
              <li>
                <button
                  class="dropdown-item"
                  type="button"
                  onClick={() => {
                    // dropDown?.hide();
                    props.setSelectedKey(entry.key)
                  }}
                >
                  {entry.label || entry.key}
                </button>
              </li>
            )}
          </For>
        </ul>
      </div >
  }
}
