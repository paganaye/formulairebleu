import { JSXComponent, Show, Value } from "../../core/tiny-jsx";
//import { Portal } from "solid-js/web";
import { Buttons, DialogButton } from "./BootstrapButtonsView";

const currentModals = new Value<InnerModalPropsPlus[]>("currentModals", []);

type InnerModalPropsPlus = InnerModalProps & { handleClose: () => void }

interface InnerModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  buttons?: DialogButton[]
  backDropClickClosesModal: boolean
}

export function closeTopModal() {
  let topModal = (currentModals.getValue() as any).at(-1);
  if (topModal) {
    topModal.handleClose()
  }
}

export function InnerModalView(props, children): JSXComponent<InnerModalProps> {
  let animationTimeout: number | undefined;
  const showBackdrop = new Value("innerModalViewShowBackdrop", false);
  const showModal = new Value("innerModalViewShowModal", false);
  const isAnimating = new Value("innerModalIsAnimating", false);

  // createEffect(() => {
  //   if (props.isOpen) {
  //     handleOpen();
  //   } else {
  //     handleClose();
  //   }
  // });

  // onCleanup(() => {
  //   if (animationTimeout) clearTimeout(animationTimeout);
  // });

  function handleClose() {
    isAnimating.setValue(true);
    showModal.setValue(false);
    setTimeout(() => {
      showBackdrop.setValue(false);
      isAnimating.setValue(false);
      //setCurrentModals((modals) => modals.filter((modal) => modal !== props));
      props.onClose?.();
    }, 100); // Match Bootstrap's fade-out duration
  };

  function handleOpen() {
    //setCurrentModals((modals) => [...modals, { ...props, handleClose }]);
    isAnimating.setValue(true);
    setTimeout(() => {
      showBackdrop.setValue(true);
      isAnimating.setValue(true);
    }, 10); // Trigger animations

    setTimeout(() => isAnimating.setValue(false), 300); // Match Bootstrap's fade-in duration
  };

  function onModalBackgroundClicked(e: MouseEvent) {
    if (e.target instanceof HTMLElement && e.target.classList.contains("isModalBackground") && props.backDropClickClosesModal) {
      e.stopPropagation();
      handleClose();
    }
  }

  return (
    <Show when={props.isOpen || isAnimating.getValue() || showBackdrop.getValue()}>
      {/* <Portal> */}
      <div
        class="x-modal-backdrop"
        style={{ "z-index": "unset", "background-color": "black", opacity: "0.5", position: "fixed", width: "100vw", height: "100vh", top: "0", left: "0", "pointer-events": "all" }}
        classList={{ fade: true, show: showBackdrop.getValue() }}
        tabIndex="0"
      ></div>
      <div
        class="modal fade"
        tabindex="-1"
        style={{ display: "block", "z-index": "unset" }}
        classList={{ show: showModal.getValue(), isModalBackground: true }}
        aria-labelledby="modalLabel"
        aria-hidden="true"
        onmousedown={(e) => onModalBackgroundClicked(e)}>
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
              {children}
            </div>
            <Show when={props.buttons}>
              <div class="modal-footer">
                <Buttons buttons={props.buttons!} />
              </div>
            </Show>
          </div>
        </div>
      </div>
      {/* </Portal> */}
    </Show >
  );
};


interface IPopupProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
}
export function PopupView(props): JSXComponent<IPopupProps> {
  return <InnerModalView {...props} backDropClickClosesModal={true} />
}

interface IModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  buttons?: DialogButton[]
}

export function ModalView<IModalProps>(props) {
  return <InnerModalView {...props} backDropClickClosesModal={false} />
}
