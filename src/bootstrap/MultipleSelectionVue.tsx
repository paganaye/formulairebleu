import { createMemo, For, JSX } from "solid-js";
import { ISelectionEntry } from "../core/ICoreForm";
import { IMultipleSelectionViewAs } from "./IBootstrapForm";
import { getUniqueId } from "../core/Utils";

export type MultipleSelectionProps = {
  label: string;
  entries: ISelectionEntry[];
  selectedKeys: string[];
  setSelectedKeys: (keys: string[]) => void;
  viewAs: IMultipleSelectionViewAs;
};

export function MultipleSelectionVue(props: MultipleSelectionProps): JSX.Element {
  let groupId = getUniqueId("checkbox-group");

  const selectedSet = createMemo(() => {
    return new Set<string>(props.selectedKeys)
  })

  function toggleSelection(key: string, elt: HTMLInputElement) {
    // we make sure to keep the original order
    let newSelection: string[] = props.entries.map(e => e.key).filter(k => k === key ? elt.checked : selectedSet().has(k));
    props.setSelectedKeys(newSelection);
  }

  return <div class="multiple-selection">
    <label class="pe-1">{props.label}</label>
    <div id={groupId} class="d-flex flex-column">
      <For each={props.entries}>
        {(entry) => (
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              id={`${groupId}-${entry.key}`}
              value={entry.key}
              checked={(selectedSet()).has(entry.key)}
              onInput={(e) => toggleSelection(entry.key, e.target)}
            />
            <label class="form-check-label" for={`${groupId}-${entry.key}`}>
              {entry.label || entry.key}
            </label>
          </div>
        )}
      </For>
    </div>
  </div>;
}

