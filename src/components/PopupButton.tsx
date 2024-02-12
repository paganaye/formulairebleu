import { JSXElement, createSignal, onCleanup } from 'solid-js';
import { Instance, StrictModifiers, createPopper } from '@popperjs/core';
import { twMerge } from 'tailwind-merge';

export interface IPopupButtonProps {
  onPopupOpened?: () => void;
  children: (params: { closePopup: () => void }) => JSXElement;
  buttonLabel?: string; // Add buttonLabel prop
  class?: string;
}

export function PopupButton(props: IPopupButtonProps) {
  const [open, setOpen] = createSignal(false)
  const [buttonRef, setButtonRef] = createSignal<any>();
  const [popupRef, setPopupRef] = createSignal<any>();
  let popperInstance: Instance | null = null;

  function openPopup(e: MouseEvent) {
    e?.stopPropagation(); // Prevent click from closing the popup immediately
    document.addEventListener('click', documentClicked);
    setOpen(true);
    if (popperInstance) {
      //popupRef().setAttribute('data-show', '');
      popperInstance.update();
    } else {
      popperInstance = createPopper<StrictModifiers>(buttonRef(), popupRef(), {
        placement: 'bottom-end'
      });
    }
    popperInstance.setOptions((options: any) => ({
      ...options,

      modifiers: [
        ...options.modifiers,
        {
          name: 'offset',
          options: {
            offset: [0, 4],
          },
        },
        { name: 'eventListeners', enabled: true }
      ],
    }));
    popperInstance.update();
    props.onPopupOpened?.()
  };

  function closePopup(_event?: MouseEvent) {
    console.log("ClosingMenu")
    setOpen(false);
    document.removeEventListener('click', documentClicked);
    //popupRef().removeAttribute('data-show');
    // popperInstance?.setOptions((options: any) => ({
    //   ...options,
    //   modifiers: [
    //     ...options.modifiers,
    //     { name: 'eventListeners', enabled: false },
    //   ],
    // }));
    popperInstance?.destroy();
    popperInstance = null;
  };

  function documentClicked(e: any) {
    console.log("Document clicked", e.keepMenuOpen)
    if (e.keepMenuOpen) {
      e.preventDefault();
      e.stopPropagation()
    }
    else closePopup();
  }

  function cleanUp() {
    closePopup();
  }

  onCleanup(cleanUp);


  return (
    <>
      {/* <style>{`
.popup-content[data-show] { display: block; }      
`}
      </style> */}
      <div class="popup" >
        <button class={twMerge("m-1 btn", props.class)} ref={setButtonRef} onClick={openPopup}>{props.buttonLabel ?? "…"}</button>
        <div class="popup-content rounded-box z-50 shadow-md p-1 bg-white min-w-48" classList={{ hidden: !open() }}
          ref={setPopupRef}>
          {props.children({ closePopup: closePopup })}
        </div>
      </div >
    </>
  );
}