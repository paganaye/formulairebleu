import { Component, For, JSX, Match, Show, Switch, createEffect, createMemo, createSignal } from 'solid-js';
import { FormSection, FormTemplate, FormLineTemplate, FormNumberTemplate, FormSelectTemplate, StringOptions, StringOption } from '../core/FormTemplate';
import { template } from 'solid-js/web';
import LabelComponent from './LabelComponent';
import { PopupButton } from './PopupButton';
// import { navigateToPage } from '../App';
// import { twMerge } from 'tailwind-merge';

interface IFormNumberProps {
  //   class?: string;
  //   startIcon?: any;
  //   onClick?: (event: MouseEvent) => void;
  //   disabled?: boolean;
  //   children: JSX.Element;
  template: FormSelectTemplate
  value: any;
  setValue: (value: any) => void
}

const FormSelectComponent: Component<IFormNumberProps> = (props) => {
  let [selectedItem, setSelectedItem] = createSignal("");
  let [items, setItems] = createSignal<StringOptions>({
    type: 'strings',
    strings: [
      { value: 'one' },
      { value: 'two' }
    ]
  });

  function onPopupOpened() {
    console.log("Popup opened")
  }

  function selectItem(newValue: string) {
    setSelectedItem(newValue)
    props.setValue(newValue)
  }

  function onItemClicked(item: StringOption, idx: () => number, closePopup?: () => void) {
    selectItem(item.value)
    if (closePopup) closePopup();
  }

  createEffect(() => {
    let options = props.template.options;
    switch (options.type) {
      case "strings":
        setItems(options)
        break;
      case "form":
      case "lookuptable":
      case "member":
        throw Error(`Select options type '${options.type}' is not implemented yey.`)
    }
  })
  return (
    <div>
      <Show when={props.template} fallback={<p>FormNumber sans modèle</p>}>
        <LabelComponent label={props.template.label}>
          <Switch fallback={<p>Invalid view-as for FormSelect</p>}>
            <Match when={props.template.viewAs === 'radios'}>
              <div>
                <ul class="menu">
                  <For each={items().strings}>{(item, idx) =>
                    <li onClick={() => onItemClicked(item, idx)}>

                      <label class="cursor-pointer" >
                        <input type="radio" name="radio-10" class="radio radio-sm" checked />
                        <span class="label-text">{item.value}</span>
                      </label>
                    </li>
                  }</For>
                </ul>

              </div>
            </Match>
            <Match when={true/* default*/}>
              <PopupButton buttonLabel={selectedItem() ? selectedItem() + " ⌄" : " Select item ⌄"}
                onPopupOpened={onPopupOpened}
                class="w-full max-w-xs">
                {({ closePopup }) => (
                  <ul class="menu">
                    <For each={items().strings}>{(item, idx) =>
                      <li onClick={() => onItemClicked(item, idx, closePopup)}><a>{item.value}</a></li>
                    }</For>
                  </ul>
                )}
              </PopupButton>
            </Match>

          </Switch>

        </LabelComponent>
      </Show>
    </div>
  );
};

export default FormSelectComponent;