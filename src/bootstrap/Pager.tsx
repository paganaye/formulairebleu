import { Component, For } from "solid-js";
import { Styles } from "../core/Styles";

export interface PagerProps {
  pageCount: number;
  selectedPage: number;
  onPageSelected: (page: number) => void;
}

Styles.add(".buttons.btn:focus", {
  border: '1px solid #ccc'
});

export const Pager: Component<PagerProps> = (props) => {
  return (
    <ul class="pagination">
      {/* Bouton "Previous" */}
      <li class={`page-item ${props.selectedPage === 1 ? 'disabled' : ''}`}>
        <a
          class="page-link"
          href="#"
          aria-label="Previous"
          onClick={() =>
            props.selectedPage > 1 && props.onPageSelected(props.selectedPage - 1)
          }
        >
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>

      {/* Boutons des pages */}
      <For each={Array.from({ length: props.pageCount }, (_, i) => i + 1)}>
        {(page) => (
          <li class={`page-item ${props.selectedPage === page ? 'active' : ''}`}>
            <a
              class="page-link"
              href="#"
              onClick={() => props.onPageSelected(page)}
            >
              {page}
            </a>
          </li>
        )}
      </For>

      {/* Bouton "Next" */}
      <li class={`page-item ${props.selectedPage === props.pageCount ? 'disabled' : ''}`}>
        <a
          class="page-link"
          href="#"
          aria-label="Next"
          onClick={() =>
            props.selectedPage < props.pageCount && props.onPageSelected(props.selectedPage + 1)
          }
        >
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  );
};
