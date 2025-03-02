import { JSXComponent, JSXSource, Show, Observable, Variable, computed, formulaireBleuJSX, formulaireBleuJSXFragment, IVariable } from "../../core/tiny-jsx"
import { FormEngine, IFormProps } from "../../core/FormEngine";
import { BootstrapArrayView } from "./BootstrapArrayView";
import { BootstrapBooleanView } from "./BootstrapBooleanView";
import { BootstrapDateView } from "./BootstrapDateView";
import { ErrorView } from "./BootstrapErrorsView";
import { BootstrapFormView } from "./BootstrapFormView";
import { BootstrapNumberView } from "./BootstrapNumberView";
import { BootstrapObjectView } from "./BootstrapObjectView";
import { BootstrapSelectionListView } from "./BootstrapSelectionListView";
import { BootstrapStringView } from "./BootstrapStringView";
import { BootstrapVariantView } from "./BootstrapVariantView";
import { VoidView } from "./BootstrapVoidView";
import { IFormType } from '../../core/IForm'

import type * as BootstrapLib from 'bootstrap';
import { Box } from "../../core/Box";

export var Bootstrap: typeof BootstrapLib;

export type ICorePopupOptions = {
    title?: string;
    buttonText?: boolean;
}
export type IPopupOptions = ICorePopupOptions & {
    buttons?: "OKCancel" | "Close" | "None"
}

declare module "../../core/IForm" {

    export interface IStringViews {
        popup: { type: 'popup' } & IPopupOptions,
    }

    export interface INumberViews {
        popup: { type: 'popup' } & IPopupOptions,
        slider: { type: 'slider', min?: number, max?: number, step?: number, tickmarks?: boolean }
    }

    export interface IBooleanViews {
        switch: { type: 'switch', popup?: true | IPopupOptions },
        popup: { type: 'popup' } & IPopupOptions,
    }

    export interface IArrayViews {
        table: { type: 'table', popup?: true | IPopupOptions }
        tabs: { type: 'tabs', popup?: true | IPopupOptions }
        flow: { type: 'flow', popup?: true | IPopupOptions }
        popup: { type: 'popup' } & IPopupOptions,
    }

    export interface IObjectViews {
        popup: { type: 'popup' } & IPopupOptions,
        wizard: { type: 'wizard', popup?: true | ICorePopupOptions },
        tabs: { type: 'tabs', popup?: true | IPopupOptions }
    }

}

declare module "../../core/Validation" {

    export interface StringValidations /* extends IValidationRules */ {
        bootstrapColor?: { type: 'bootstrap-color' }
    }

}


export class BootstrapEngine extends FormEngine {

    constructor(templates?: Record<string, IFormType>, ensureBootstrapLoaded: boolean = true) {
        super(templates)
        if (ensureBootstrapLoaded) this.ensureBootstrapLoaded()
    }

    FormView(props: IFormProps) {
        let engine = this;
        initTemplates();

        return <BootstrapFormView engine={engine} {...props} />

        function initTemplates() {
            let formTemplates = props.form.templates;
            if (formTemplates) {
                for (let key of Object.keys(formTemplates)) {
                    engine.templates[key] = formTemplates[key];
                }
            }
        }
    }

    getRenderer(type: IFormType): JSXComponent {
        let actualType = this.getActualType(type);
        let typeRenderers: Record<string, JSXComponent> = {
            'string': BootstrapStringView,
            'boolean': BootstrapBooleanView,
            'number': BootstrapNumberView,
            'array': BootstrapArrayView,
            'object': BootstrapObjectView,
            'variant': BootstrapVariantView,
            'selectionList': BootstrapSelectionListView,
            'select': BootstrapSelectionListView,
            'date': BootstrapDateView,
            'time': BootstrapDateView,
            'datetime': BootstrapDateView,
            'void': VoidView
        };
        let result = typeRenderers[(actualType.view as any)?.type ?? 'undefined'] ?? typeRenderers[actualType.type ?? 'undefined'];
        if (!result) {
            return () => <ErrorView error={`Form type  ${JSON.stringify(actualType.type ?? null)} is unknown`} />
        }
        return result;

    }

    ensureBootstrapLoaded() {

        function isBootstrapCssLoaded(): boolean {
            const testElement = document.createElement('div');
            testElement.className = 'container';
            document.body.appendChild(testElement);
            const isLoaded = window.getComputedStyle(testElement).marginLeft !== '0px';
            document.body.removeChild(testElement); // Nettoyage
            return isLoaded;
        }

        function isBootstrapJsLoaded(): boolean {
            let bootstrap = (window as any).bootstrap;
            if (bootstrap) Bootstrap = bootstrap;
            return typeof bootstrap !== 'undefined';

        }
        if (!isBootstrapCssLoaded()) {
            const link = document.createElement('link');
            link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
            link.rel = "stylesheet";
            link.integrity = "sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH";
            link.crossOrigin = "anonymous";
            document.head.appendChild(link);
        }
        if (!isBootstrapJsLoaded()) {
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js";
            script.integrity = "sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz";
            script.crossOrigin = "anonymous";
            script.defer = true;
            document.body.appendChild(script);

            script!!.onload = (_: Event) => setTimeout(() => {
                console.log("loaded");
                Bootstrap = (window as any).bootstrap;
            })
        }
        console.log("Bootstrap loaded");
    }

    PopupButton(props: {
        visible?: IVariable<boolean>, button?: JSXComponent, header?: JSXComponent, footer?: JSXComponent, closeable?: boolean,
        validate?: () => boolean
    }, children: JSXSource[]) {
        let isOpen = props.visible ?? new Variable("popupButtonIsOpen", false);
        let button = props.button ?? <button class="btn btn-primary" onClick={() => { isOpen.setValue(true) }}>{"…"}</button>

        function validateAndClose(): boolean {
            if (props.validate && !props.validate()) return false;
            isOpen.setValue(false);
            return true;
        }

        function containerClicked(e: Event) {
            if (e.target === e.currentTarget) {
                if (validateAndClose()) { e.stopPropagation() }
            }
        }
        let modalBody = new Variable<HTMLDivElement>("popupButtonModalBody");

        isOpen.addObserver(v => {
            if (v) setTimeout(() => {
                let body = modalBody.getValue();
                let input = body?.querySelector("input, textarea, button") as HTMLInputElement;
                input?.focus();
                if (typeof input.select === "function") input?.select()
            })
        })
        return <>
            <Show when={isOpen} fallback={button}>
                <div class={computed("PopupButton.class", { isOpen }, p => `modal fade ${p.isOpen ? 'show d-block' : ''}`)} tabindex="-1" onClick={containerClicked}>
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <Show when={props.header}>
                                <div class="modal-header">
                                    <h5 class="modal-title">{props.header}</h5>
                                    {props.closeable != false && <button type="button" class="btn-close" onClick={validateAndClose}></button>}
                                </div>
                            </Show>
                            <div class="modal-body" ref={modalBody}>
                                {children}
                            </div>
                            <Show when={props.footer}>
                                <div class="modal-footer">
                                    {props.footer}
                                </div>
                            </Show>
                        </div>
                    </div>
                </div>
            </Show >
            {computed("PopupButton.backDrop", { isOpen }, p =>
                p.isOpen ? <div class="modal-backdrop fade show"></div> : null
            )}
        </>
    }


}