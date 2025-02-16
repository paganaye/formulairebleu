import { formulaireBleuJSX, formulaireBleuJSXFragment } from "../../core/tiny-jsx";
import { Styles } from "../../core/Styles";
import { LANG } from '../Lang'
import A from "./A";

Styles.add('nav.main-nav > a', {
    margin: '5px'
})
Styles.add('nav.main-nav > a.active', {
    margin: '15px'
})

export default function App() {
    return (<>
        <nav class="main-nav">
            <A href="">{LANG.menu_home}</A>
            <A href="#form-editor">{LANG.menu_form_editor}</A>
            <A href="#tests">{LANG.menu_tests}</A>
            <A href="#about">{LANG.menu_about}</A>
        </nav>
    </>);
}


/*
import { createSignal } from "../../core/jsx"
import { ensureBootstrapLoaded } from '../extensions/bootstrap/ensureBootstrapLoaded'
import '../extensions/plain-html/PlainHTMLExtension';
import { ConstValue } from "../core/IQuery";
import { PlainFormView } from '../extensions/plain-html/PlainFormView';
import { BootstrapEngine } from '../extensions/bootstrap/BootstrapEngine';
import { formulairebleu } from '../core/IForm';


// IBooleanViews
ensureBootstrapLoaded();

let bootstrapEngine = new BootstrapEngine({})


//let x: formulairebleu.IViews['number'];
let x: formulairebleu.INumberType = {} as any;
x.type = 'number';


let htmlView: ConstValue = { type: "const", data: "<p>this is <b>HTML</b></p>", view: "html" };

let form1 = {
    name: 'form1',
    version: '1',
    templates: {
        telephone: { type: 'string', validations: [{ type: 'regex', arg: '09-99-99-99-99' }] }
    },
    dataType: {
        type: 'object',
        help: "Parent object help",
        label: "Parent Object Label",
        membersTypes: [
            {

                key: "p1", type: "object", membersTypes: [
                    { key: 'a', type: "number", view: { type: 'mynumber1', min: 1 } },
                    { key: 'b', type: "string" },
                    { key: 'c', type: "boolean" },
                    { key: 'd', type: "date" },
                    { key: 'e', type: "datetime" },
                    { key: 'f', type: "time" },
                    { key: 'g', type: 'number', view: { type: "mynumber1", min: 1 } },
                    { key: 'h', type: "array", entryType: { type: "string" } }
                    // { type: "void", help: "hello", view: { type: "const", data: "<p>this is <b>HTML</b></p>", view: "html" } satisfies ConstValue },
                    // { type: "void", help: "hello", view: htmlView },
                    // { key: 'tel1', type: 'telephone' as any, pageBreak: true }
                ], help: "Page 1"
            },

            { key: 'tel2', type: 'telephone' as any, pageBreak: true },
            { key: 'tel3', type: 'telephone' as any, pageBreak: true },
            { key: 'tel4', type: 'telephone' as any, pageBreak: true },
            { key: 'tel5', type: 'telephone' as any, pageBreak: true },
            { key: 'tel6', type: 'telephone' as any, pageBreak: true },
            { key: 'tel7', type: 'telephone' as any, pageBreak: true },
            { key: 'tel8', type: 'telephone' as any, pageBreak: true },
            { key: 'tel9', type: 'telephone' as any, pageBreak: true },
            { key: 'tel10', type: 'telephone' as any, pageBreak: true },
            { key: 'tel11', type: 'telephone' as any, pageBreak: true },
            { key: 'tel12', type: 'telephone' as any, pageBreak: true },
            { key: 'tel13', type: 'telephone' as any, pageBreak: true },
            { key: 'tel14', type: 'telephone' as any, pageBreak: true },
            { key: 'tel15', type: 'telephone' as any, pageBreak: true },
            { key: 'tel17', type: 'telephone' as any, pageBreak: true },
            { key: 'tel18', type: 'telephone' as any, pageBreak: true },
            { key: 'tel19', type: 'telephone' as any, pageBreak: true },
            { key: 'tel20', type: 'telephone' as any, pageBreak: true },
            { key: 'tel21', type: 'telephone' as any, pageBreak: true },
            { key: 'tel22', type: 'telephone' as any, pageBreak: true },
            { key: 'tel23', type: 'telephone' as any, pageBreak: true },
            { key: 'tel24', type: 'telephone' as any, pageBreak: true },
            { key: 'tel25', type: 'telephone' as any, pageBreak: true },
            { key: 'tel27', type: 'telephone' as any, pageBreak: true },
            { key: 'tel28', type: 'telephone' as any, pageBreak: true },
            { key: 'tel29', type: 'telephone' as any, pageBreak: true },
            { key: 'tel30', type: 'telephone' as any, pageBreak: true },
            { key: 'tel31', type: 'telephone' as any, pageBreak: true },
            {
                key: 'o1',
                type: 'object',
                help: "This is an object wit str1, num1, date1 and bool1 members.",
                label: "Object1 label here",
                pageBreak: true,
                membersTypes: [
                    { key: 'str1', type: 'string', label: 'A simple string', help: 'Here you can enter an unconstrained string with default view.' },
                    { key: 'num1', type: 'number', label: 'A simple number', help: 'Here you can enter an unconstrained number with default view.' },
                    { key: 'bool1', type: 'boolean', label: 'A simple boolean', help: 'Here you can enter an unconstrained boolean with default view.' },
                    { key: 'date1', type: 'date', label: 'A simple date', help: 'Here you can enter an unconstrained boolean with default view.' },
                ]
            },
           
        ]
    }
} as const satisfies formulairebleu.IForm;

let n: formulairebleu.InferDataType<{ type: 'number' }> = 5
let b: formulairebleu.InferDataType<{ type: 'boolean' }> = false
let s: formulairebleu.InferDataType<{ type: 'string' }> = "abc"
let c1: formulairebleu.InferDataType<{ type: 'const', value: 5 }> = 5
let c2: formulairebleu.InferDataType<{ type: 'const', value: "abc" }> = "abc"
let c3: formulairebleu.InferDataType<{ type: 'const', value: true }> = true
let c4: formulairebleu.InferDataType<{ type: 'const', value: { a: 1 } }> = { a: 1 }
let d1: formulairebleu.InferDataType<{ type: 'date' }> = "2001-02-03"
let a1: formulairebleu.InferDataType<{ type: 'array', entryType: { type: 'number' } }> = [1, 2, 3]
let a2: formulairebleu.InferDataType<{ type: 'array', entryType: { type: 'string' } }> = ["A", "B"]
let a3: formulairebleu.InferDataType<{ type: 'array', entryType: { type: 'array', entryType: { type: 'number' } } }> = [[1], [2, 3]]
let o1: formulairebleu.InferDataType<{ type: 'object', membersTypes: [{ key: 'm', type: 'string' }] }> = { m: "abc" }
let o2: formulairebleu.InferDataType<{ type: 'object', membersTypes: [{ key: 'm1', type: 'string' }, { key: 'm2', type: 'boolean' }] }> = { m1: "abc", m2: true }
let v1: formulairebleu.InferDataType<{ type: 'variant', variants: [{ key: "str", type: 'string' }, { key: "num", type: 'number' }] }>[] = [{ key: "num", data: 5 }, { key: "str", data: 'ABC' }]
let f1: formulairebleu.InferFormType<{ name: 'form1', version: '1', dataType: { type: 'number' } }> = 123
let f1v = { name: 'form1', version: '1', dataType: { type: 'number' } } as const satisfies formulairebleu.IForm;
let f2: formulairebleu.InferFormType<typeof f1v> = 123

function randomize<T extends formulairebleu.IForm>(form: T): formulairebleu.InferFormType<T> {
    const randomValue = (type: formulairebleu.IFormType): any => {
        let actualType = (form.templates && form.templates[type.type]) || type;
        switch (actualType.type) {
            case 'number': return Math.random() * 100;
            case 'boolean': return Math.random() < 0.5;
            case 'string': return Math.random().toString(36).substring(7);
            case 'const': return actualType.value;
            case 'date': return new Date().toISOString().split('T')[0];
            case 'datetime': return new Date().toISOString();
            case 'time': return new Date().toISOString().split('T')[1].substring(0, 8);
            case 'array': return [randomValue(actualType.entryType)];
            case 'object': return Object.fromEntries(actualType.membersTypes.map(m => [m.key, randomValue(m)]));
            case 'variant': return { key: actualType.variants[0].key, data: randomValue(actualType.variants[0]) };
            case 'void': return undefined;
            default: {
                //ignore
            }
        }
    };
    return randomValue(form.dataType);
}
let value = randomize(form1);
//value.tel4 = "TEL4";

let [getValue, setValue] = createSignal<any>(value)

function App() {
    let formView = bootstrapEngine.FormView({ form: form1, value: getValue(), setValue });

    return (
        <>
            <PlainFormView form={form1} value={getValue()} setValue={setValue} />
            <hr />
            {formView}
        </>
    )
}

export default App
*/