import { computed, For, JSXComponent } from "../../core/tiny-jsx";
import { ISelectionEntry } from "../../core/IForm";

import { IBootstrapMultipleSelectionView } from "./BootstrapForm";
import { getUniqueId } from "../../core/Utils";

export type MultipleSelectionProps = {
  label: string;
  entries: ISelectionEntry[];
  selectedKeys: string[];
  setSelectedKeys: (keys: string[]) => void;
  view: IBootstrapMultipleSelectionView;
};

export function MultipleSelectionVue(props: MultipleSelectionProps): JSXComponent {
  let groupId = getUniqueId("checkbox-group");

  const selectedSet = computed("MultipleSelectionVue.Set", {}, () => {
    return new Set<string>(props.selectedKeys)
  });

  function toggleSelection(key: string, elt: HTMLInputElement) {
    // we make sure to keep the original order
    let newSelection: string[] = props.entries.map(e => String(e.value)).filter(k => k === key ? elt.checked : selectedSet.getValue().has(String(k)));
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
              id={`${groupId}-${entry.value}`}
              value={String(entry.value)}
              checked={(selectedSet.getValue()).has(String(entry.value))}
              onInput={(e) => toggleSelection(String(entry.value), e.target)}
            />
            <label class="form-check-label" for={`${groupId}-${entry.value}`}>
              {entry.label || String(entry.value)}
            </label>
          </div>
        )}
      </For>
    </div>
  </div>;
}

