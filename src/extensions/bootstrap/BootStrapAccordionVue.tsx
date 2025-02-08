/*
    accordion: renderAsAccordion,
    export interface IBootstrapAccordionView extends IView {
    type: 'accordion';
    }


  function renderAsAccordion() {
    const [openIndex, setOpenIndex] = createSignal<number | null>(0);

    return (<>
      <div class="accordion" id="accordionExample">
        <For each={props.entries}>
          {(entry, index) => (
            <div class="accordion-item">
              <h2 class="accordion-header" id={`heading-${index()}`}>
                <button
                  class={`accordion-button ${openIndex() === index() ? '' : 'collapsed'}`}
                  type="button"
                  onClick={() => setOpenIndex(openIndex() === index() ? null : index())}
                >
                  Item {index() + 1}
                </button>
              </h2>
              <div
                id={`collapse-${index()}`}
                class={`accordion-collapse collapse ${openIndex() === index() ? 'show' : ''}`}
                aria-labelledby={`heading-${index()}`}
              >
                <div class="accordion-body">
                  {props.renderEntry?.(entry, index)}
                </div>
              </div>
            </div>
          )}
        </For>
      </div>
      {props.inputBottom?.()}
      {props.addButton?.()}
    </>);
  }
*/
