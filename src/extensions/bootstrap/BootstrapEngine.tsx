import { JsxComponent, formulaireBleuJSX } from "../../core/tiny-jsx"
import { FormEngine, IFormProps } from "../../core/FormEngine";
import { BootstrapArrayView } from "./BootstrapArrayView";
import { BootstrapBooleanView } from "./BootstrapBooleanView";
import { DateInputView } from "./BootstrapDateInputView";
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

export var Bootstrap: typeof BootstrapLib;

declare module "../../core/IForm" {

    export interface INumberViews {
        mynumber1: { type: 'mynumber1', min: number; };
    }
    export interface IBooleanViews {
        //   switch: IBootstapSwitchType;
    }
    export interface IArrayViews {
        table: { type: 'table' }
        tabs: { type: 'tabs' }
        flow: { type: 'flow' }
        object: { type: 'modal' }
        // carousel: { type: 'carousel', autoplay?: boolean, interval?: number }
        // list: { type: 'list' }
    }

}


export class BootstrapEngine extends FormEngine {

    constructor(templates?: Record<string, IFormType>, ensureBootstrapLoaded: boolean = true) {
        super(templates)
        if (ensureBootstrapLoaded) this.ensureBootstrapLoaded()
    }

    FormView(props: IFormProps) {
        let engine = this;
        return <BootstrapFormView engine={engine} {...props} />
    }

    getRenderer(type: IFormType): JsxComponent {
        let actualType = this.getActualType(type);
        let typeRenderers: Record<string, JsxComponent> = {
            'string': BootstrapStringView,
            'boolean': BootstrapBooleanView,
            'number': BootstrapNumberView,
            'array': BootstrapArrayView,
            'object': BootstrapObjectView,
            'variant': BootstrapVariantView,
            'selectionList': BootstrapSelectionListView,
            'date': DateInputView,
            'time': DateInputView,
            'datetime': DateInputView,
            'void': VoidView
        };
        let result = typeRenderers[(actualType.view as any)?.type ?? 'undefined'] ?? typeRenderers[actualType.type ?? 'undefined'];
        if (!result) {
            return () => <ErrorView error={`Form type is unknown ${JSON.stringify(actualType.type || null)}`} />
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



}