import { Component } from "solid-js";
import { Box } from "../../core/Box";
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
import { formulairebleu } from "../../core/IForm"
type IFormType = formulairebleu.IFormType;

export class BootstrapEngine extends FormEngine {
    FormView(props: IFormProps) {
        let engine = this;
        return <BootstrapFormView engine={engine} {...props} />
    }

    getRenderer(type: IFormType): Component<any> {
        let actualType = this.getActualType(type);
        let typeRenderers: Record<string, Component<any>> = {
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



}