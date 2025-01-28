import { Component, For, Show } from "solid-js";
import { Styles } from "../../core/Styles";

export interface PagerProps {
  pageCount: number;
  selectedPage: number;
  onPageSelected: (page: number) => void;
}

Styles.add(".buttons.btn:focus", {
  border: '1px solid #ccc',
});

export const Pager: Component<PagerProps> = (props) => {
  const generatePages = () => {
    const { pageCount, selectedPage } = props;
    const pages: (number | string)[] = [];

    if (pageCount <= 9) {
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push(2);
      if (selectedPage == 5) pages.push(3);
      if (selectedPage > 5) pages.push("…");

      if (selectedPage > 3) pages.push(selectedPage - 1);
      if (selectedPage > 2) pages.push(selectedPage);
      if (selectedPage > 1 && selectedPage + 1 <= pageCount) pages.push(selectedPage + 1);

      if (selectedPage == pageCount - 4) pages.push(pageCount - 2);
      else if (selectedPage < pageCount - 3) pages.push("…");
      if (selectedPage < pageCount - 2) pages.push(pageCount - 1);
      if (selectedPage < pageCount - 1) pages.push(pageCount);
    }

    return pages;
  };

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
      <For each={generatePages()}>
        {(page) => (
          <Show
            when={typeof page === "number"}
            fallback={<li class="page-item disabled"><span class="page-link">…</span></li>}
          >
            <li class={`page-item ${props.selectedPage === page ? 'active' : ''}`}>
              <a
                class="page-link"
                href="#"
                onClick={() => typeof page === "number" && props.onPageSelected(page)}
              >
                {page}
              </a>
            </li>
          </Show>
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
