import { Component, JSX, onCleanup, Show, createSignal, createEffect } from "solid-js";
import { Portal } from "solid-js/web";
import { Buttons, DialogButton } from "./Buttons";

const [currentModals, setCurrentModals] = createSignal<InnerModalPropsPlus[]>([]);

type InnerModalPropsPlus = InnerModalProps & { handleClose: () => void }

interface InnerModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: JSX.Element;
  buttons?: DialogButton[]
  backDropClickClosesModal: boolean
}

export function closeTopModal() {
  let topModal = (currentModals() as any).at(-1);
  if (topModal) {
    topModal.handleClose()
  }
}

export const InnerModalVue: Component<InnerModalProps> = (props) => {
  let animationTimeout: number | undefined;
  const [showBackdrop, setShowBackdrop] = createSignal(false);
  const [showModal, setShowModal] = createSignal(false);
  const [isAnimating, setAnimating] = createSignal(false);

  createEffect(() => {
    if (props.isOpen) {
      handleOpen();
    } else {
      handleClose();
    }
  });

  onCleanup(() => {
    if (animationTimeout) clearTimeout(animationTimeout);
  });

  function handleClose() {
    setAnimating(true);
    setShowModal(false);
    setTimeout(() => {
      setShowBackdrop(false);
      setAnimating(false);
      setCurrentModals((modals) => modals.filter((modal) => modal !== props));
      props.onClose?.();
    }, 100); // Match Bootstrap's fade-out duration
  };

  function handleOpen() {
    setCurrentModals((modals) => [...modals, { ...props, handleClose }]);
    setAnimating(true);
    setTimeout(() => {
      setShowBackdrop(true);
      setShowModal(true);
    }, 10); // Trigger animations

    setTimeout(() => setAnimating(false), 300); // Match Bootstrap's fade-in duration
  };

  function onModalBackgroundClicked(e: MouseEvent) {
    if (e.target instanceof HTMLElement && e.target.classList.contains("isModalBackground") && props.backDropClickClosesModal) {
      e.stopPropagation();
      handleClose();
    }
  }

  return (
    <Show when={props.isOpen || isAnimating() || showBackdrop()}>
      <Portal>
        <div
          class="x-modal-backdrop"
          style={{ "z-index": "unset", "background-color": "black", opacity: "0.5", position: "fixed", width: "100vw", height: "100vh", top: "0", left: "0", "pointer-events": "all" }}
          classList={{ fade: true, show: showBackdrop() }}
          tabIndex="0"
        ></div>
        <div
          class="modal fade"
          tabindex="-1"
          style={{ display: "block", "z-index": "unset" }}
          classList={{ show: showModal(), isModalBackground: true }}
          aria-labelledby="modalLabel"
          aria-hidden="true"
          onmousedown={(e) => onModalBackgroundClicked(e)}
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <Show when={props.title}>
                <div class="modal-header">
                  <h5 class="modal-title" id="modalLabel">{props.title}</h5>
                  <button
                    type="button"
                    class="btn-close"
                    aria-label="Close"
                    onClick={handleClose}
                  ></button>
                </div>
              </Show>
              <div class="modal-body">
                {props.children}
              </div>
              <Show when={props.buttons}>
                <div class="modal-footer">
                  <Buttons buttons={props.buttons!} />
                </div>
              </Show>
            </div>
          </div>
        </div>
      </Portal>
    </Show >
  );
};


interface IPopupProps {
  isOpen: boolean;
  onClose?: () => void;
  children: JSX.Element;
  title?: string;
}
export const PopupVue: Component<IPopupProps> = (props) => {
  return <InnerModalVue {...props} backDropClickClosesModal={true} />
}

interface IModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  children: JSX.Element;
  buttons?: DialogButton[]
}

export const ModalVue: Component<IModalProps> = (props) => {
  return <InnerModalVue {...props} backDropClickClosesModal={false} />
}

export default ModalVue;
