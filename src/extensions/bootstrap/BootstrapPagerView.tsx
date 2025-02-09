import { JsxComponent, For, Show, formulaireBleuJSXFragment, formulaireBleuJSX, Value, computed, IValue } from "../../core/tiny-jsx";
import { Styles } from "../../core/Styles";

export interface PagerProps {
  pageCount: IValue<number>;
  selectedPage: IValue<number>;
}

Styles.add(".buttons.btn:focus", {
  border: '1px solid #ccc',
});

export function Pager(props: PagerProps) {
  function generatePages() {
    const pageCount = props.pageCount.getValue();
    const selectedPage = props.selectedPage.getValue();
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

  return <>{
    computed({ pageCount: props.pageCount, selectedPage: props.selectedPage }, (p) =>
      <ul class="pagination">
        {/* Bouton "Previous" */}
        <li class={`page-item ${p.selectedPage === 1 ? 'disabled' : ''}`}>
          <a
            class="page-link"
            href="#"
            aria-label="Previous"
            onClick={() => p.selectedPage > 1 && props.selectedPage.setValue(p.selectedPage - 1)}
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>

        {/* Boutons des pages */}
        <For each={generatePages()}>
          {(page) => (
            <Show
              when={() => typeof page === "number"}
              fallback={<li class="page-item disabled"><span class="page-link">…</span></li>}
            >
              <li class={`page-item ${p.selectedPage === page ? 'active' : ''}`}>
                <a
                  class="page-link"
                  href="#"
                  onClick={() => typeof page === "number" && props.selectedPage.setValue(page)}
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
            onClick={() => p.selectedPage < p.pageCount && props.selectedPage.setValue(p.selectedPage + 1)}
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>)}
  </>;
};
