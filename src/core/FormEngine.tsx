import { JsxComponent, Show, computed, formulaireBleuJSX, formulaireBleuJSXFragment } from "./tiny-jsx";
import { IForm, IFormType, IKeyedMemberType } from "./IForm";
import { ErrorsView } from "../extensions/bootstrap/BootstrapErrorsView";
import { formatTemplateString } from "../extensions/bootstrap/BootstrapFormView";
import { ArrayBox, Box, IPageNo, ObjectBox, VariantBox } from "./Box";
import { Value } from './tiny-jsx';

export type OnValueChanged = { pagesChanged?: boolean };

export interface IFormProps {
    form: IForm,
    $value: Value
    onValueChanged: (v: any) => void
}

export interface FormBodyProps extends IFormProps {
    engine: FormEngine;
    header?: HTMLElement;
    footer?: HTMLElement;
}

export interface InputRenderProps {
    engine: FormEngine;
    label: string | undefined;
    level: number;
    box?: Box;
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
    readonly rePaginationCount = new Value(1);

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
        let pagesChanged = false;

        let paginateRecursely = (box: Box) => {
            let originalType = box.type;
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
                    let entries = (box as ArrayBox).$entryBoxes
                    for (let e of entries.getValue()) {
                        paginateRecursely(e)
                    }
                    break;
                case 'object':
                    let members = (box as ObjectBox).getMembers()
                    for (let m of members) {
                        paginateRecursely(m)
                    }
                    break;
                case 'variant':
                    let innerVariant = (box as VariantBox).getInnerVariant().getValue();
                    if (innerVariant) paginateRecursely(innerVariant);
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
            if (!pagesChanged && startPage != box.pageNo.getValue().startPage) pagesChanged = true;
            box.pageNo.setValue({
                startPage,
                startLine,
                endPage: pageNo,
                endLine: lineNo
            })
        }

        paginateRecursely(rootBox)
        this.pageCount.setValue(pageNo);
        if (pagesChanged) {
            this.rePaginationCount.setValue(this.rePaginationCount.getValue() + 1);
        }
    }


    FormBody(props: FormBodyProps) {
        const rootBox = new Value(undefined);

        // createEffect(() => {
        //     rootBox.setValue(Box.enBox(null, props.form.name, props.form.dataType, null));
        // })

        let currentJSONString: string = "";

        rootBox.addObserver((v) => {
            console.log("hi");
        })
        // createEffect(() => {
        //     const propJSONString = JSON.stringify(props.value);
        //     if (propJSONString === currentJSONString) return;

        //     currentJSONString = propJSONString;
        //     const newBox = Box.enBox(null, props.form.name, props.form.dataType, props.value);
        //     rootBox.setValue(newBox);
        //     this.paginate(newBox);

        // });

        // function onValueChanged(onValueChanged: OnValueChanged) {
        //     const rootBoxValue = rootBox.getValue();
        //     if (!rootBoxValue) return;
        //     const jsonValue = Box.unBox(rootBoxValue);
        //     currentJSONString = JSON.stringify(jsonValue)
        //     props.value.setValue(jsonValue);

        //     if (onValueChanged?.pagesChanged) {
        //         this.paginate(rootBox);
        //     }
        // }


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


    InputRenderer(props: InputRenderProps) {
        let inputComponent = this.getRenderer(props.box.type);

        const isVisible = computed({ page: this.pageNo, box: props.box.pageNo }, (p) => {
            let box = p.box;
            if (!box) return true;
            let page = p.page;
            if (page == 0) return true;
            return box.startPage <= page && page <= box.endPage
        });

        return (<>
            <Show when={isVisible}>
                {inputComponent?.(props)}
                {/* {JSON.stringify(props.box.pageNo.getValue())} */}
            </Show>
        </>);

    }


    abstract getRenderer(type: IFormType): JsxComponent<InputRenderProps>;

    InputTop(props: InputTopProps) {
        return <>
            <Show when={props.box.type.help}>
                <div class="form-label text-body-tertiary"><small>{props.box.type.help}</small></div>
            </Show>
        </>
    }


    InputBottom(props: InputBottomProps) {
        // let errors = createMemo(() => props.box.errors());
        return <>
            <ErrorsView errors={['']} />
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

    isBoxVisible(box: Box) {
        let pageNo = this.pageNo.getValue();
        let boxPage = box.pageNo.getValue()
        if (!boxPage || !pageNo) return true;
        return boxPage.startPage <= pageNo && pageNo <= boxPage.endPage;
    }
}



