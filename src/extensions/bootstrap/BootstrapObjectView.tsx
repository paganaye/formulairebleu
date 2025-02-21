import { JSXComponent, For, formulaireBleuJSX, formulaireBleuJSXFragment, computed, Value, Show } from "../../core/tiny-jsx";
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
    popup: renderAsPopupButton,
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
    const activeTab = new Value("tabActiveTab", 0);
    return <>
      <div class="tabs-container">
        <ul class="nav nav-tabs">
          <For each={members}>
            {(box, index) => (
              <li class="nav-item">
                <button
                  class={computed("Tabs.Button", { activeTab }, p => `nav-link ${index === p.activeTab ? 'active' : ''}`)}
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
              <div class={computed("Tabs.Panel", { activeTab }, p => `tab-pane fade ${index === p.activeTab ? 'show active' : ''}`)}>
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


  function renderAsWizard(args: { onClosed?: () => void } = {}) {
    const activeStep = new Value("wizardActiveStep", 0);

    function nextStep(index) {
      if (validateStep(index)) {
        if (index >= members.length - 1) {
          if (args.onClosed) {
            activeStep.setValue(0);
            args.onClosed();
          }
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
                class={computed("Wizard.carouselButtonClass", { activeStep }, p => { index <= p.activeStep ? 'active' : '' })}
                disabled
              ></button>
            )}
          </For>
        </div>

        {/* Slides */}
        <div class="carousel-inner">
          <For each={members}>
            {(entry, index) => (
              <div class={computed("Wizard.carouselContentClass", { activeStep }, p => `carousel-item ${index === p.activeStep ? 'active' : ''}`)}>
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

  function renderAsPopupButton() {
    let popupVisible = new Value("popupButtonPopupVisible", false);
    let { PopupButton, Span } = props.engine;

    return <>
      <div class="row">
        <div class="col-auto">
          <PopupButton visible={popupVisible}>
            {renderFunction}
          </PopupButton>
        </div>
        <div class="col">{Span(props.box)}</div>
      </div >
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
    return renderAsPopupButton
  } else {
    return renderFunction;
  }

};
