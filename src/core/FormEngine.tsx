import { Component, createEffect, JSXElement, createMemo, Show, JSX, formulaireBleuJSXFactory, formulaireBleuJSXFragmentFactory, Dynamic } from "./jsx";
import { JSONValue } from "./Utils";
import { formulairebleu } from "./IForm";
import { ErrorsView } from "../extensions/bootstrap/BootstrapErrorsView";
import { formatTemplateString } from "../extensions/bootstrap/BootstrapFormView";
import { Box } from "./Box";
import { Value } from './jsx';
type IForm = formulairebleu.IForm;
type IFormType = formulairebleu.IFormType;
type IKeyedMemberType = formulairebleu.IKeyedMemberType;

export type OnValueChanged = { pagesChanged?: boolean };

export interface IFormProps {
    form: IForm,
    value: Value
}

export interface FormBodyProps extends IFormProps {
    engine: FormEngine;
    header?: JSX.Element;
    footer?: JSX.Element;
}

export interface InputRenderProps {
    engine: FormEngine;
    label: string | undefined;
    level: number;
    box?: Box;
    onValueChanged: (onValueChanged: OnValueChanged) => void;
}

type InputTopProps = {
    box: Box;
    engine: FormEngine;
};

type InputBottomProps = {
    box: Box;
    engine: FormEngine;
};

type TitleProps = {
    parentType: IFormType;
    type: IFormType;
    box: Box;
    index: number
};

export abstract class FormEngine {
    templates: Record<string, IFormType>;
    isReadonly: boolean = false;
    readonly pageNo = new Value(1);
    readonly pageCount = new Value(1);

    constructor(templates?: Record<string, IFormType>) {
        this.templates = templates ?? {};
    }

    getActualType(type: IFormType): IFormType {
        let viewType = (type?.view as any)?.type;
        let templateType: IFormType | undefined;
        if (viewType) templateType = this.templates[viewType];
        if (!templateType) {
            let typeType = type?.type;
            templateType = this.templates[typeType];
        }
        return templateType ?? type;
    }

    paginate(rootBox: Box) {
        let pageNo = 1;
        let lineNo = 0
        let firstNonObjectSeen: boolean = false;

        let recurse = (box: Box) => {
            let originalType = box.getType();
            let actualType = this.getActualType(originalType)
            if ((originalType.pageBreak || actualType.pageBreak) && lineNo > 0) {
                pageNo += 1;
                lineNo = 0;
            }
            let startPage = pageNo;
            let startLine = lineNo;

            let typeType = actualType.type;
            switch (typeType) {
                case 'array':
                    firstNonObjectSeen = true;
                    let entries = box.getEntries()
                    for (let e of entries) {
                        recurse(e)
                    }
                    break;
                case 'object':
                    let members = box.getMembers()
                    for (let m of members) {
                        recurse(m)
                    }
                    break;
                case 'variant':
                    let variant = box.getInnerVariant();
                    recurse(variant.value)
                    break;
                case 'boolean':
                case 'const':
                case 'number':
                case 'string':
                    lineNo += 1;
                    break;
                case 'void':
                    break;
                default: {
                    //
                }
            }
            box.pageNo.setValue({
                startPage,
                startLine,
                endPage: pageNo,
                endLine: lineNo
            })
        }

        recurse(rootBox)
        this.pageCount.setValue(pageNo);
    }


    FormBody(props: FormBodyProps): JSXElement {
        const rootBox = new Value(undefined);

        // createEffect(() => {
        //     rootBox.setValue(Box.enBox(null, props.form.name, props.form.dataType, null));
        // })

        let currentJSONString: string = "";

        // createEffect(() => {
        //     const propJSONString = JSON.stringify(props.value);
        //     if (propJSONString === currentJSONString) return;

        //     currentJSONString = propJSONString;
        //     const newBox = Box.enBox(null, props.form.name, props.form.dataType, props.value);
        //     rootBox.setValue(newBox);
        //     this.paginate(newBox);

        // });

        function onValueChanged(onValueChanged: OnValueChanged) {
            const rootBoxValue = rootBox.getValue();
            if (!rootBoxValue) return;
            const jsonValue = Box.unBox(rootBoxValue);
            currentJSONString = JSON.stringify(jsonValue)
            props.value.setValue(jsonValue);

            if (onValueChanged?.pagesChanged) {
                this.paginate(rootBox);
            }
        }


        return (
            <div class="container" >
                {props.header}
                {/* < InputRenderer
                    label={props.form.dataType.label ?? props.form.name}
                    level={1}
                    box={getRootBox() as any}
                    onValueChanged={onValueChanged}
                    context={props.context}
                /> */}
                {props.footer}
            </div >
        );
    };


    InputRenderer(props: InputRenderProps): JSXElement {
        let inputComponent = new Value<Component<any> | undefined>(undefined);


        // createEffect(() => {
        //     inputComponent.setValue(() => this.getRenderer(props.box?.getType()));
        // })

        const isVisible = createMemo(() => {
            return this.isBoxVisible(props.box);
        })

        return <>
            <Show when={isVisible.getValue()}>
                <Dynamic component={inputComponent.getValue()} {...props} />
            </Show>
        </>;

    }

    isBoxVisible(box: Box): boolean {
        if (!box) return true;
        let currentPage = this.pageNo.getValue();
        if (currentPage == 0) return true;
        let boxPage = box.pageNo.getValue();
        if (!boxPage) return true;
        return boxPage.startPage <= currentPage && currentPage <= boxPage.endPage
    }

    abstract getRenderer(type: IFormType): Component<any> | undefined;

    InputTop(props: InputTopProps) {
        return <>
            <Show when={props.box.getType().help}>
                <div class="form-label text-body-tertiary"><small>{props.box.getType().help}</small></div>
            </Show>
        </>
    }


    InputBottom(props: InputBottomProps) {
        // let errors = createMemo(() => props.box.errors());
        return <>
            <ErrorsView errors={/*rrors()*/1} />
            {/* <Show when={props.options.filter?.(props as any)}>
              <Show fallback={<pre>Page {props.box.getStartPageNo()}:{props.box.getStartLineNo()}...{props.box.getEndPageNo()}:{props.box.getEndLineNo()} </pre>} when={props.box.getStartPageNo() == props.box.getEndPageNo() && props.box.getStartLineNo() == props.box.getEndLineNo()}>
              <pre>Page {props.box.getStartPageNo()}:{props.box.getStartLineNo()}</pre>
              <pre>filter:{JSON.stringify(props.options.filter?.(props as any))}</pre>
            </Show>
          </Show > */}
        </>
    }

    Title(props: TitleProps) {
        let title: string | HTMLElement;
        let parentType = (props.parentType as IKeyedMemberType).key ?? "Item";
        if (props.type.templateString) {
            title = formatTemplateString(props.type.templateString, Box.unBox(props.box) as any);
        } else {
            title = parentType + " " + String(props.index + 1)
        }

        return (
            <>
                {title}
            </>
        );
    };

    abstract FormView(props: IFormProps);


}