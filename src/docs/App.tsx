import { computed, For, Match, Show, Switch, Value, formulaireBleuJSX, formulaireBleuJSXFragment, Observer } from '../core/tiny-jsx'
import { IForm, IFormType, InferFormType, ISelectionList } from '../core/IForm';
import { BootstrapEngine } from '../extensions/bootstrap/BootstrapEngine';
import { randomize } from '../random';

let variant1 = {
    type: 'variant',
    help: "This is an object wit str2, num2, date2 and bool2 members.",
    label: "variant1 label here",
    pageBreak: true,
    variants: [
        { key: 'str1', type: 'string', label: 'A simple string', defaultValue: "A", help: 'Here you can enter an unconstrained string with default view.' },
        { key: 'num1', type: 'number', label: 'A simple number', defaultValue: 123, help: 'Here you can enter an unconstrained number with default view.' },
        { key: 'bool1', type: 'boolean', label: 'A simple boolean', defaultValue: false, help: 'Here you can enter an unconstrained boolean with default view.' },
        { key: 'date1', type: 'date', label: 'A simple date', help: 'Here you can enter an unconstrained boolean with default view.' },
    ]
} as const satisfies IFormType;

let str1 = {
    type: 'string', label: 'Hex Bytes',
    // defaultValue: "A", 
    help: 'Here you can enter hexadecimal bytes.',
    validations: {
        mandatory: true,
        regex: { regex: "^[0-9A-F]+[0-9A-F]( [0-9A-F]+[0-9A-F]+)*$", message: "Invalid Hexadecimal sequence. For example: 00 02 FF" },
        maxLength: 11
    }
} as const satisfies IFormType;
let num1 = { type: 'number', label: 'A simple string', defaultValue: 55, help: 'Here you can enter an unconstrained string with default view.' } as const satisfies IFormType;
let arr1 = { type: 'array' as any, entryType: { type: 'string', pageBreak: true } } as const satisfies IFormType;
let arr2 = { type: 'array' as any, view: { type: 'table' }, entryType: { type: 'object', membersTypes: [{ key: 'onum1', type: 'number' as any, pageBreak: true }, { key: 'ostr1', type: 'string' as any, pageBreak: false }] }, pageBreak: false } as const satisfies IFormType;
let arr3 = { type: 'array' as any, view: { type: 'flow' }, entryType: { type: 'object', membersTypes: [{ key: 'onum1', type: 'number' as any, pageBreak: true }, { key: 'ostr1', type: 'string' as any, pageBreak: false }] }, pageBreak: false } as const satisfies IFormType;

let obj1 = {
    type: 'object',
    help: "Parent object help",
    label: "Parent Object Label",
    membersTypes: [
        { key: 'num1', ...num1 },
        { key: 'str1', ...str1 },
        { key: 'dat1', type: 'date' as any, pageBreak: false },
        { key: 'tim1', type: 'time' as any, pageBreak: false },
    ]
} as const satisfies IFormType;

let telephone = {
    type: 'string', validations: {
        mandatory: true,
        minLength: 6
    }
} as const satisfies IFormType;

let complex = {
    type: 'object',
    membersTypes: [
        { key: 'str1', ...str1 },
        { key: 'num1', ...num1 },
        { key: 'variant1', ...variant1 },
        { key: 'obj1', ...obj1 },
        { key: 'arr1', ...arr1 },
        { key: 'arr2', ...arr2 }
    ]
} as const satisfies IFormType

let complex2 = { type: 'array' as any, entryType: complex, pageBreak: true } as const satisfies IFormType;

let objectWithTEmplateAndPopup = {
    name: 'form1',
    version: '1',
    templates: { Telephone: telephone },
    dataType: {
        type: 'object',
        membersTypes: [
            { key: 'primary', type: 'Telephone' },
            { key: 'other', ...obj1, view: { type: "tabs", popup: true } }
        ]
    }
} as const satisfies IForm;

let arrayWithPopup = {
    type: 'array',
    view: { type: 'popup' },
    entryType: obj1
} as const satisfies IFormType;

let selectionList = {
    multiple: false,
    entries: [
        { label: "<empty>", value: "" },
        { value: "AA" },
        { value: "BB" },
        { value: "CC" }
    ]
} as const satisfies ISelectionList<string>;

let stringWithSelectionList = {
    type: 'string',
    help: "This is an object wit str2, num2, date2 and bool2 members.",
    label: "stringWithSelectionList label here",
    view: { type: 'select', selectionList },
} as const satisfies IFormType;


let form1Type = {
    name: 'form1',
    version: '1',
    templates: { Telephone: telephone },
    dataType: variant1
} as const satisfies IForm;


let formValue = randomize(form1Type);
let engine = new BootstrapEngine();
// formValue = undefined;

export default function App() {
    formValue = { key: "str1", value: "123" }
    let value = new Value("appValue", formValue);
    value.setValue(formValue);
    let onValueChanged = (v: any) => {
        console.log("v", v);
    }

    let formView1 = engine.FormView({ form: form1Type, value: value, onValueChanged })
    // setTimeout(() => {
    //     value.setValue({ key: "str1", value: "ABC" } as any);
    //     // setTimeout(() => {
    //     //     value.setValue({ key: "num1", value: 1234 } as any);
    //     //     setTimeout(() => {
    //     //         value.setValue({ key: "bool1", value: true } as any);
    //     //     }, 1000)
    //     // }, 1000)
    // }, 1000)
    return (<div>
        {formView1}
        {/* <pre>{computed("app.pre", { value }, p => JSON.stringify(p.value, undefined, '   '))}</pre> */}
    </div>);
}
