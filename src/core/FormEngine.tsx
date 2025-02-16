import { JSONValue, JSXComponent, JSXSource, Show, computed, formulaireBleuJSX, formulaireBleuJSXFragment } from "./tiny-jsx";
import { IForm, IFormType, IKeyedMemberType, INumberType, ITemplatedType } from "./IForm";
import { ErrorsView } from "../extensions/bootstrap/BootstrapErrorsView";
import { formatTemplateString } from "../extensions/bootstrap/BootstrapFormView";
import { ArrayBox, Box, IPageNo, ObjectBox, VariantBox } from "./Box";
import { Value } from './tiny-jsx';
import { ArrayValidations, BooleanValidations, ConstValidations, DatetimeValidations, DateValidations, ErrorString, NumberValidations, ObjectValidations, StringValidations, TimeValidations, ValidationRules, VariantValidations, VoidValidations } from "./Validation";
import { Styles } from "./Styles";

export type OnValueChanged = { pagesChanged?: boolean };


Styles.add('.form-span-label', {
    color: '#888',
    marginLeft: '0.5em',
    minWidth: '15%'
})

Styles.add('.form-span-content', {
    minWidth: '25%'
});

export interface IFormProps {
    form: IForm,
    box: Box
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
    readonly pageNo = new Value("formPageNo", 1);
    readonly pageCount = new Value("formPageCount", 1);
    readonly rePaginationCount = new Value("formRepaginationCount", 1);

    readonly nullBox = Box.enBox(this, null, "null", { type: 'const', value: null }, null)

    constructor(templates?: Record<string, IFormType>) {
        this.templates = templates ?? {};
    }

    getActualType<T extends IFormType>(type: T) {
        let viewType = (type?.view as any)?.type;
        let templateType: IFormType | undefined;
        if (viewType) templateType = this.templates[viewType];
        if (!templateType) {
            let typeType = type?.type;
            templateType = this.templates && this.templates[typeType];
        }
        return (templateType ?? type) as any;
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
                    let entries = (box as ArrayBox).entryBoxes
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
        const rootBox = new Value("formBodyRootBox", undefined);

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

        const isVisible = computed("inputRenderIsVisible", { page: this.pageNo, box: props.box.pageNo }, (p) => {
            let box = p.box;
            if (!box) return true;
            let page = p.page;
            if (page == 0) return true;
            return box.startPage <= page && (box.endPage == 0 || page <= box.endPage)
        });

        return (<>
            <Show when={isVisible}>
                {inputComponent?.(props)}
                {/* {JSON.stringify(props.box.pageNo.getValue())} */}
            </Show>
        </>);

    }

    abstract getRenderer(type: IFormType): JSXComponent<InputRenderProps>;

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
            <ErrorsView errors={props.box.errors} />
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
        // if (props.type.templateString) {
        //     title = formatTemplateString(props.type.templateString, props.box);
        // } else {
        //     title = parentType + " " + String(props.index + 1)
        // }

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

    // validateNumber(box: Box<INumberType>, validationRule: Validation, value: any, errors: ErrorString[]) {
    //     switch (validationRule.type) {
    //         case 'mandatory':
    //             if (value == null || value === '') {
    //                 errors.push(validationRule.message || `${box.name} is required.`);
    //             }
    //             break;
    //         default:
    //             errors.push("Unknown rule " + validationRule.type);
    //             break

    //     }

    // }

    validate(box: Box, value: JSONValue, rules: ValidationRules, errors: ErrorString[]): void {
        const name = box.name;
        const validators = {
            array: validateArray,
            boolean: validateBoolean,
            const: validateConst,
            date: validateDate,
            datetime: validateDatetime,
            number: validateNumber,
            object: validateObject,
            string: validateString,
            time: validateTime,
            variant: validateVariant,
            void: validateVoid,
        };
        if (rules != null) validators[box.type.type]?.(rules as any);


        function addError(
            error: number | string | true | { message?: string },
            defaultMessage: string
        ) {
            const message =
                typeof error === 'object' && typeof error.message === 'string'
                    ? error.message
                    : defaultMessage;
            errors.push(message);
        }

        function validateArray(rules: ArrayValidations) {
            if (rules.mandatory && (value == null || (Array.isArray(value) && value.length === 0))) {
                addError(rules.mandatory, `${name} is mandatory.`);
            }
            if (rules.minLength) {
                const minLength =
                    typeof rules.minLength === 'number'
                        ? rules.minLength
                        : rules.minLength.value;
                if (Array.isArray(value) && value.length < minLength) {
                    addError(rules.minLength, `${name} must have at least ${minLength} items.`);
                }
            }
            if (rules.maxLength) {
                const maxLength =
                    typeof rules.maxLength === 'number'
                        ? rules.maxLength
                        : rules.maxLength.value;
                if (Array.isArray(value) && value.length > maxLength) {
                    addError(rules.maxLength, `${name} must have at most ${maxLength} items.`);
                }
            }
        }

        function validateBoolean(rules: BooleanValidations) {
            if (rules.mandatory && (value === null || value === undefined)) {
                addError(rules.mandatory, `${name} is mandatory.`);
            }
        }

        function validateConst(rules: ConstValidations) {
            if (rules.mandatory && (value === null || value === undefined || value === '')) {
                addError(rules.mandatory, `${name} is mandatory.`);
            }
        }

        function validateDate(rules: DateValidations) {
            if (rules.mandatory && (!value || value === '')) {
                addError(rules.mandatory, `${name} is mandatory.`);
            }
            const dateValue = new Date(String(value));
            if (rules.minDate) {
                const minDateStr =
                    typeof rules.minDate === 'string' ? rules.minDate : rules.minDate.value;
                const minDate = new Date(minDateStr);
                if (dateValue < minDate) {
                    addError(
                        rules.minDate,
                        `${name} must be on or after ${minDate.toISOString().split('T')[0]}.`
                    );
                }
            }
            if (rules.maxDate) {
                const maxDateStr =
                    typeof rules.maxDate === 'string' ? rules.maxDate : rules.maxDate.value;
                const maxDate = new Date(maxDateStr);
                if (dateValue > maxDate) {
                    addError(
                        rules.maxDate,
                        `${name} must be on or before ${maxDate.toISOString().split('T')[0]}.`
                    );
                }
            }
        }

        function validateDatetime(rules: DatetimeValidations) {
            if (rules.mandatory && (!value || value === '')) {
                addError(rules.mandatory, `${name} is mandatory.`);
            }
            const dateTimeValue = new Date(String(value));
            if (rules.minDate) {
                const minDateStr =
                    typeof rules.minDate === 'string' ? rules.minDate : rules.minDate.value;
                const minDate = new Date(minDateStr);
                if (dateTimeValue < minDate) {
                    addError(
                        rules.minDate,
                        `${name} must be on or after ${minDate.toISOString()}.`
                    );
                }
            }
            if (rules.maxDate) {
                const maxDateStr =
                    typeof rules.maxDate === 'string' ? rules.maxDate : rules.maxDate.value;
                const maxDate = new Date(maxDateStr);
                if (dateTimeValue > maxDate) {
                    addError(
                        rules.maxDate,
                        `${name} must be on or before ${maxDate.toISOString()}.`
                    );
                }
            }
            if (rules.minTime) {
                const minTime =
                    typeof rules.minTime === 'string' ? rules.minTime : rules.minTime.value;
                const timeString = dateTimeValue.toTimeString().slice(0, 5);
                if (timeString < minTime) {
                    addError(rules.minTime, `${name} must be after ${minTime}.`);
                }
            }
            if (rules.maxTime) {
                const maxTime =
                    typeof rules.maxTime === 'string' ? rules.maxTime : rules.maxTime.value;
                const timeString = dateTimeValue.toTimeString().slice(0, 5);
                if (timeString > maxTime) {
                    addError(rules.maxTime, `${name} must be before ${maxTime}.`);
                }
            }
        }

        function validateNumber(rules: NumberValidations) {
            if (
                rules.mandatory &&
                (value === null || value === '' || Number.isNaN(Number(value)))
            ) {
                addError(rules.mandatory, `${name} is mandatory.`);
            }
            const numValue = Number(value);
            if (rules.minValue) {
                const minValue =
                    typeof rules.minValue === 'number' ? rules.minValue : rules.minValue.value;
                if (numValue < minValue) {
                    addError(rules.minValue, `${name} must be at least ${minValue}.`);
                }
            }
            if (rules.maxValue) {
                const maxValue =
                    typeof rules.maxValue === 'number' ? rules.maxValue : rules.maxValue.value;
                if (numValue > maxValue) {
                    addError(rules.maxValue, `${name} must be at most ${maxValue}.`);
                }
            }
            if (rules.maxDecimals !== undefined) {
                const maxDecimals =
                    typeof rules.maxDecimals === 'number'
                        ? rules.maxDecimals
                        : rules.maxDecimals.value;
                const decimals = value.toString().split('.')[1]?.length || 0;
                if (decimals > maxDecimals) {
                    addError(
                        rules.maxDecimals,
                        `${name} must have at most ${maxDecimals} decimal places.`
                    );
                }
            }
        }

        function validateObject(rules: ObjectValidations) {
            if (rules.mandatory && (value === null || value === undefined)) {
                addError(rules.mandatory, `${name} is mandatory.`);
            }
        }

        function validateString(rules: StringValidations) {
            if (rules.mandatory && (value === null || value === '')) {
                addError(rules.mandatory, `${name} is mandatory.`);
            }
            if (rules.minLength) {
                const minLength =
                    typeof rules.minLength === 'number'
                        ? rules.minLength
                        : rules.minLength.value;
                if (String(value).length < minLength) {
                    addError(rules.minLength, `${name} must have at least ${minLength} characters.`);
                }
            }
            if (rules.maxLength) {
                const maxLength =
                    typeof rules.maxLength === 'number'
                        ? rules.maxLength
                        : rules.maxLength.value;
                if (String(value).length > maxLength) {
                    addError(rules.maxLength, `${name} must have at most ${maxLength} characters.`);
                }
            }
            if (rules.regex) {
                let regexArray = Array.isArray(rules.regex) ? rules.regex : [rules.regex];
                for (let regex of regexArray) {
                    const regexPattern =
                        typeof regex === 'string' ? regex : regex.regex;
                    if (!new RegExp(regexPattern).test(String(value))) {
                        addError(regex, `Does not match expression ${regexPattern}.`);
                    }
                }
            }
        }

        function validateTime(rules: TimeValidations) {
            if (rules.mandatory && (value === null || value === '')) {
                addError(rules.mandatory, `${name} is mandatory.`);
            }
            if (rules.minTime) {
                const minTime =
                    typeof rules.minTime === 'string' ? rules.minTime : rules.minTime.value;
                if (String(value) < minTime) {
                    addError(rules.minTime, `${name} must be after ${minTime}.`);
                }
            }
            if (rules.maxTime) {
                const maxTime =
                    typeof rules.maxTime === 'string' ? rules.maxTime : rules.maxTime.value;
                if (String(value) > maxTime) {
                    addError(rules.maxTime, `${name} must be before ${maxTime}.`);
                }
            }
        }

        function validateVariant(rules: VariantValidations) {
            if (rules.mandatory && (value === null || value === '')) {
                addError(rules.mandatory, `${name} is mandatory.`);
            }
        }

        function validateVoid(rules: VoidValidations) {
            if (rules.mandatory && (value === null || value === '')) {
                addError(rules.mandatory, `${name} is mandatory.`);
            }
        }
    }

    Span(box: Box): HTMLSpanElement {
        let content = new Value<JSXSource[]>("BoxSpan", ["..."]);

        box.addChildChangedObserver(() => {
            content.setValue(toSpan(1, box));
        }, true)

        function toSpan(level: number, box: Box): JSXSource[] {
            if (box == null) return [""]
            switch (box.type.type) {
                case "object": {
                    let members = (box as ObjectBox).getMembers();
                    let result = members.flatMap(b => toSpan(level + 1, b));
                    return level == 1 ? result : ['{ ', ...result, ' }']
                }

                case "array": {
                    let entries = (box as ArrayBox).entryBoxes.getValue();
                    let result = entries.filter(m => m != null).flatMap(b => toSpan(level + 1, b));
                    return level == 1 ? result : ['[ ', ...result, ' ]']
                }

                case 'variant': {
                    let vbox = box as VariantBox;
                    let value = toSpan(level + 1, vbox.getValue()) as any;
                    return [<small class="form-span-label">{String(value.key) + ": "}</small>, <span class="form-span-content">{value.value}</span>];
                }

                default: {
                    let value = box.getValue();
                    value = String(value);
                    if (value.length == 0) return [""];
                    if (value.length > 40) value = value.slice(0, 37) + "..."
                    return [<small class="form-span-label">{(box.name) + ": "}</small>, <span class="form-span-content">{value}</span>];
                }
            }
        }
        return <>{content}</>;
    }
}