import { JSXComponent, Show, Observable, computed, formulaireBleuJSX, formulaireBleuJSXFragment, Variable } from "../../core/tiny-jsx";
import { getUniqueId } from "../../core/Utils";
import { Styles } from "../../core/Styles";
import { Box } from "../../core/Box";
import { BootstrapEngine } from './BootstrapEngine';

export type NumberInputProps = {
  box: Box;
  label: string;
  engine: BootstrapEngine;
};

Styles.add('input.number-input', {
  textAlign: "right",
});

Styles.add('input.number-input[type="string"]', {
  paddingRight: '27px !important' // add the width of the up-down number input when it's hidden
});

Styles.add('input.form-range[type="range"]', {
  '-webkit-appearance': 'auto',
  '-moz-appearance': 'auto',
  'appearance': 'auto'
})

export function BootstrapNumberView(props: NumberInputProps) {
  let id = getUniqueId(`num_${props.label}`);
  const isFocused = new Variable("bootstrapNumberIsFocused", false);
  const suffix = (props.box.type.view as any)?.suffix;

  // Détection des différents types de vues
  const isSlider = () => (props.box.type.view?.type === 'slider');
  const isPopup = () => (props.box.type.view?.type === 'popup');

  function formatNumber() {
    let value = props.box.getValue();
    let num: number | null;
    switch (typeof value) {
      case 'number':
        num = value;
        break;
      default:
        num = parseNumber(String(value));
        break;
    }
    if (num == null) return '';
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: (props.box.type as any).decimals ?? 0
    }).format(num);
  }

  const parseNumber = (value: string): number | null => {
    let parsed = parseFloat(value.replace(/,/g, ""));
    return isNaN(parsed) ? null : parsed;
  };

  function renderAsPopupButton() {
    let popupVisible = new Variable("popupButtonPopupVisible", false);
    let { PopupButton, Span } = props.engine;

    return (
      <div class="row">
        <div class="col-auto">
          <PopupButton visible={popupVisible}>{renderAsNumberBox}</PopupButton>
        </div>
        <div class="col">{Span(props.box)}</div>
      </div>
    );
  }

  function renderAsNumberBox() {
    return (
      <>
        {props.engine.InputTop(props)}
        <div class="input-group mb-3">
          <div class="form-floating">
            <input
              x-test={isFocused}
              type={computed("BootstrapNumber.type", { isFocused }, (p) =>
                p.isFocused ? "number" : "string"
              )}
              id={id}
              class="form-control number-input"
              value={computed("box", { value: props.box }, p => formatNumber())}
              readOnly={computed("BootstrapNumber.readonly", { isFocused }, (p) =>
                (props.engine.isReadonly || !isFocused.getValue())
              )}
              placeholder={"" /* bootstrap won't show it when form-floating is set.  */}
              onFocus={(e) => {
                if (!isFocused.getValue()) {
                  isFocused.setValue(true);
                  setTimeout(() => {
                    let inp = e.target as HTMLInputElement;
                    if (inp) {
                      inp.value = String(props.box.getValue());
                      inp.select();
                    }
                  });
                }
              }}
              onBlur={(e: InputEvent) => {
                isFocused.setValue(false);
                setTimeout(() => {
                  let inp = e.target as HTMLInputElement;
                  if (inp) inp.value = formatNumber();
                });
                onInputChanged(e);
              }}
              onInput={(e: InputEvent) => {
                if (isFocused.getValue()) onInputChanged(e);
              }}
            />
            <label for={id} class="form-label">
              {props.label}
            </label>
          </div>
          <Show when={suffix}>
            <span class="input-group-text" id="basic-addon2">
              {suffix}
            </span>
          </Show>
        </div>
        {props.engine.InputBottom(props)}
      </>
    );
  }

  // Ajout de la vue Slider
  function renderAsSlider() {
    const min = (props.box.type.view as any)?.min ?? 0;
    const max = (props.box.type.view as any)?.max ?? 10;
    const step = (props.box.type.view as any)?.step ?? 1;
    const tickmarks = (props.box.type.view as any)?.tickmarks ?? false;
    // On récupère la valeur courante, ou zéro si invalide
    let markersId = tickmarks ? getUniqueId("marks") : undefined;
    return (
      <>
        {props.engine.InputTop(props)}
        <div class="mb-3">
          <label for={id} class="form-label">
            {props.label}
          </label>
          <input
            id={id}
            type="range"
            class="form-range"
            min={min}
            max={max}
            step={step}
            list={markersId}
            value={computed("rangeValue", { value: props.box }, (p) => p.value)}
            onInput={(e) => {
              const val = parseNumber((e.currentTarget as HTMLInputElement).value) ?? 0;
              props.box.setValue(val, { notify: true, validate: true });
            }}
          />
          <Show when={tickmarks}>
            <datalist id={markersId}>
              {Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => {
                const val = min + i * step;
                return <option value={val} />;
              })}
            </datalist>
          </Show>
        </div>
        {props.engine.InputBottom(props)}
      </>
    );
  }

  if (isSlider()) {
    return renderAsSlider();
  } else if (isPopup()) {
    return renderAsPopupButton();
  } else {
    return renderAsNumberBox();
  }

  function onInputChanged(e: Event) {
    props.box.setValue(parseNumber((e.currentTarget as HTMLInputElement).value), {
      notify: true,
      validate: true,
    });
  }
}
