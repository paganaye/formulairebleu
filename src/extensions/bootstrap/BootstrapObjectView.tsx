import { JsxComponent, For, formulaireBleuJSX, formulaireBleuJSXFragment, computed, Value, Show } from "../../core/tiny-jsx";
import { ConstView } from './BootstrapConstView';
import { Box, ObjectBox } from "../../core/Box";
import { BootstrapEngine } from './BootstrapEngine';
import { IFormType } from "../../core/IForm";


export type ObjectInputProps = {
  box: ObjectBox;
  label: string;
  level: number;
  engine: BootstrapEngine;
};

export function BootstrapObjectView(props: ObjectInputProps) {
  const renderFunctions = {
    popup: renderAsPopup,
    tabs: renderAsTabs,
    wizard: renderAsWizard,
    default: renderAsFlow,
  }
  let viewAsType = props.box.type.view;
  let renderFunction = renderFunctions[viewAsType?.type] || renderAsFlow;
  let members = props.box.getMembers();

  function renderEntry(sub: any, i: number) {
    return props.engine.InputRenderer({
      engine: props.engine,
      label: sub.type.label ?? sub.name,
      box: sub,
      level: props.level + 1,
    })
  }

  function renderAsTabs() {
    const activeTab = new Value(0);
    return <>
      <div class="tabs-container">
        <ul class="nav nav-tabs">
          <For each={members}>
            {(box, index) => (
              <li class="nav-item">
                <button
                  class={computed({ activeTab }, p => `nav-link ${index === p.activeTab ? 'active' : ''}`)}
                  onClick={() => activeTab.setValue(index)}
                >
                  {() => box.type.label || box.type.key}
                </button>
              </li>
            )}
          </For>
        </ul>
        <div class="tab-content mt-3">
          <For each={members}>
            {(entry, index) => (
              <div class={computed({ activeTab }, p => `tab-pane fade ${index === p.activeTab ? 'show active' : ''}`)}>
                {renderEntry(entry, index)}
              </div>
            )}
          </For>
        </div>
      </div >
      {inputBottom}
    </>
  }

  function validateStep(index: number): boolean {
    return true;
  }


  function renderAsWizard(args: { onClosed?: () => void }) {
    const activeStep = new Value(0);

    function nextStep(index) {
      if (validateStep(index)) {
        if (index >= members.length - 1) {
          activeStep.setValue(0);
          args.onClosed?.();
        }
        else activeStep.setValue(index + 1);
      }
    }

    function prevStep(index) {
      if (index > 0) {
        activeStep.setValue(index - 1);
      }
    }

    return <>
      <div id="wizardCarousel" class="carousel slide" data-bs-ride="false">

        {/* Indicateurs */}
        <div class="carousel-indicators">
          <For each={members}>
            {(step, index) => (
              <button
                type="button"
                data-bs-target="#wizardCarousel"
                class={computed({ activeStep }, p => { index <= p.activeStep ? 'active' : '' })}
                disabled
              ></button>
            )}
          </For>
        </div>

        {/* Slides */}
        <div class="carousel-inner">
          <For each={members}>
            {(entry, index) => (
              <div class={computed({ activeStep }, p => `carousel-item ${index === p.activeStep ? 'active' : ''}`)}>
                {renderEntry(entry, index)}
                <div class="d-flex justify-content-between mt-3">
                  <button class="btn btn-secondary" disabled={index === 0} onClick={() => prevStep(index)}>Précédent</button>
                  <button class="btn btn-primary" onClick={() => nextStep(index)}>Suivant</button>
                </div>
              </div>
            )}
          </For >
        </div >

      </div >
    </>
  }



  function renderAsPopup(inPopupRenderFunction?: Function, showButtons: boolean = true) {
    if (!inPopupRenderFunction || inPopupRenderFunction == renderAsPopup) {
      inPopupRenderFunction = renderAsFlow
    }
    const isOpen = new Value(false);

    function openModal() {
      isOpen.setValue(true);
    }

    function closeModal() {
      isOpen.setValue(false);
    }

    function validateAndClose() {
      if (validatePopup()) {
        closeModal();
      }
    }

    function validatePopup(): boolean {
      return true; // Ajouter la validation ici si nécessaire
    }

    return <>

      <Show when={isOpen} fallback={
        <div class="row">
          <div class="col-auto">
            <button class="btn btn-primary" onClick={openModal}>Ouvrir</button>
          </div>
          <div class="col">{props.engine.Span(props.box)}</div>
        </div>}>
        <div class={computed({ isOpen }, p => `modal fade ${p.isOpen ? 'show d-block' : ''}`)} tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Fenêtre modale</h5>
                <button type="button" class="btn-close" onClick={closeModal}></button>
              </div>
              <div class="modal-body">
                {inPopupRenderFunction({ onClosed: closeModal })}
              </div>
              <Show when={showButtons}>
                <div class="modal-footer">
                  <button class="btn btn-secondary" onClick={closeModal}>Fermer</button>
                  <button class="btn btn-primary" onClick={validateAndClose}>Valider</button>
                </div>
              </Show>
            </div>
          </div>
        </div>
      </Show >
      {computed({ isOpen }, p => p.isOpen ? <div class="modal-backdrop fade show"></div> : null)}
    </>
  }


  function inputTop() {
    return props.engine.InputTop(props)
  }

  function inputBottom() {
    return props.engine.InputBottom(props)
  }

  function renderAsFlow() {
    return (
      <>
        {inputTop}
        <p>{props.label ?? props.box.type.label}</p>
        <For each={members}>
          {(sub, index) => {
            return (sub.type.type == 'const'
              ? <ConstView  {...sub.getType() as any} />
              : <div class="mb-2">
                <label class="form-label">{(sub as any).key}</label>
                {
                  props.engine.InputRenderer({
                    engine: props.engine,
                    label: sub.type.label ?? sub.name,
                    box: sub,
                    level: props.level + 1,
                  })
                }
              </div>
            );
          }}
        </For>
        {inputBottom}
      </>
    );
  }

  if (typeof viewAsType === 'object' && 'popup' in viewAsType && viewAsType.popup) {
    return renderAsPopup(renderFunction, false)
  } else {
    return renderFunction;

  }

};
