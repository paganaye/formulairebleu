import { computed, For, Match, Show, Switch, Value, formulaireBleuJSX, formulaireBleuJSXFragment, Observer } from '../core/tiny-jsx'
import { IForm, IFormType, InferFormType } from '../core/IForm';
import { BootstrapEngine } from '../extensions/bootstrap/BootstrapEngine';

let variant1 = {
    type: 'variant',
    help: "This is an object wit str2, num2, date2 and bool2 members.",
    label: "Object2 label here",
    pageBreak: true,
    variants: [
        { key: 'str1', type: 'string', label: 'A simple string', defaultValue: "A", help: 'Here you can enter an unconstrained string with default view.' },
        { key: 'num1', type: 'number', label: 'A simple number', defaultValue: 123, help: 'Here you can enter an unconstrained number with default view.' },
        { key: 'bool1', type: 'boolean', label: 'A simple boolean', defaultValue: false, help: 'Here you can enter an unconstrained boolean with default view.' },
        { key: 'date1', type: 'date', label: 'A simple date', help: 'Here you can enter an unconstrained boolean with default view.' },
    ]
} as const satisfies IFormType;

let str1 = { type: 'string', label: 'A simple string', defaultValue: "A", help: 'Here you can enter an unconstrained string with default view.' } as const satisfies IFormType;
let num1 = { type: 'number', label: 'A simple string', defaultValue: 55, help: 'Here you can enter an unconstrained string with default view.' } as const satisfies IFormType;
let arr1 = { type: 'array' as any, entryType: { type: 'string' }, pageBreak: false } as const satisfies IFormType;
let arr2 = { type: 'array' as any, view: { type: 'table' }, entryType: { type: 'object', membersTypes: [{ key: 'onum1', type: 'number' as any, pageBreak: true }, { key: 'ostr1', type: 'string' as any, pageBreak: false }] }, pageBreak: false } as const satisfies IFormType;
let arr3 = { type: 'array' as any, view: { type: 'flow' }, entryType: { type: 'object', membersTypes: [{ key: 'onum1', type: 'number' as any, pageBreak: true }, { key: 'ostr1', type: 'string' as any, pageBreak: false }] }, pageBreak: false } as const satisfies IFormType;

let obj1 = {
    type: 'object',
    help: "Parent object help",
    label: "Parent Object Label",
    membersTypes: [
        { key: 'num1', type: 'number' as any, pageBreak: true },
        { key: 'str1', type: 'string' as any, pageBreak: false },
        { key: 'dat1', type: 'date' as any, pageBreak: false },
        { key: 'tim1', type: 'time' as any, pageBreak: false },
    ]
} as const satisfies IFormType;

let telephone = { type: 'string', validations: [{ type: 'regex', arg: '09-99-99-99-99' }] } as const satisfies IFormType;

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

let form1Type = {
    name: 'form1',
    version: '1',
    templates: { telephone },
    dataType: { ...arr3 }
} as const satisfies IForm;

// // let n: formulairebleu.InferDataType<{ type: 'number' }> = 5
// // let b: formulairebleu.InferDataType<{ type: 'boolean' }> = false
// // let s: formulairebleu.InferDataType<{ type: 'string' }> = "abc"
// // let c1: formulairebleu.InferDataType<{ type: 'const', value: 5 }> = 5
// // let c2: formulairebleu.InferDataType<{ type: 'const', value: "abc" }> = "abc"
// // let c3: formulairebleu.InferDataType<{ type: 'const', value: true }> = true
// // let c4: formulairebleu.InferDataType<{ type: 'const', value: { a: 1 } }> = { a: 1 }
// // let d1: formulairebleu.InferDataType<{ type: 'date' }> = "2001-02-03"
// // let a1: formulairebleu.InferDataType<{ type: 'array', entryType: { type: 'number' } }> = [1, 2, 3]
// // let a2: formulairebleu.InferDataType<{ type: 'array', entryType: { type: 'string' } }> = ["A", "B"]
// // let a3: formulairebleu.InferDataType<{ type: 'array', entryType: { type: 'array', entryType: { type: 'number' } } }> = [[1], [2, 3]]
// // let o1: formulairebleu.InferDataType<{ type: 'object', membersTypes: [{ key: 'm', type: 'string' }] }> = { m: "abc" }
// // let o2: formulairebleu.InferDataType<{ type: 'object', membersTypes: [{ key: 'm1', type: 'string' }, { key: 'm2', type: 'boolean' }] }> = { m1: "abc", m2: true }
// // let v1: formulairebleu.InferDataType<{ type: 'variant', variants: [{ key: "str", type: 'string' }, { key: "num", type: 'number' }] }>[] = [{ key: "num", data: 5 }, { key: "str", data: 'ABC' }]
// // let f1: formulairebleu.InferFormType<{ name: 'form1', version: '1', dataType: { type: 'number' } }> = 123
// // let f1v = { name: 'form1', version: '1', dataType: { type: 'number' } } as const satisfies formulairebleu.IForm;
// // let f2: formulairebleu.InferFormType<typeof f1v> = 123

function randomize<T extends IForm>(form: T): InferFormType<T> {
    const randomValue = (type: IFormType): any => {
        let actualType = (form.templates && form.templates[type.type]) || type;
        switch (actualType.type) {
            case 'number': return Math.random() * 100;
            case 'boolean': return Math.random() < 0.5;
            case 'string': return Math.random().toString(36).substring(7);
            case 'const': return actualType.value;
            case 'date': return new Date().toISOString().split('T')[0];
            case 'datetime': return new Date().toISOString();
            case 'time': return new Date().toISOString().split('T')[1].substring(0, 8);
            case 'array': return [randomValue(actualType.entryType), randomValue(actualType.entryType)];
            case 'object': return Object.fromEntries(actualType.membersTypes.map(m => [m.key, randomValue(m)]));
            case 'variant': return { key: actualType.variants[0].key, value: randomValue(actualType.variants[0]) };
            case 'void': return undefined;
            default: {
                //ignore
            }
        }
    };
    return randomValue(form.dataType);
}

let formValue = randomize(form1Type);
let engine = new BootstrapEngine();

export default function App() {
    let value = new Value(formValue);
    value.setValue(formValue);
    let onValueChanged = (v: any) => {
        console.log("v", v);
    }
    let formView1 = engine.FormView({ form: form1Type, $value: value, onValueChanged })

    return (<div>
        {formView1}
        <pre>{computed({ value }, p => JSON.stringify(p.value, undefined, '   '))}</pre>
    </div>);
}

function testTinyJSX() {
    let checked = new Value(false)
    let intValue1 = new Value(5)
    let tick = () => {
        intValue1.setValue(intValue1.getValue() + 1);
        setTimeout(tick);
    }
    tick();
    return <>
        <input type="checkbox" onchange={() => {
            checked.setValue(!checked.getValue())
        }} />
        <Show when={computed({ checked, intValue1 }, (props) => props.checked && (props.intValue1 & 1))} fallback={<p>aa</p>}>
            <h1>hi {intValue1}</h1>
        </Show>
        <p>hi</p>
        <For each={["One", "Two", "Three", "Four", "Five"]}>
            {(e, i) => <p>{e}: {i} {intValue1}</p>}
        </For>
        <Switch when={computed({ intValue1 }, (v) => (v.intValue1 / 100) & 7)}>
            <Match value={1}>Un</Match>
            <Match value={2}><><p>this is Deux</p><p>This is Deux {intValue1}</p></></Match>
            <Match value={3}>Trois</Match>
            <Match value={4}>Quatre</Match>
            <Match value={5}>Cinq</Match>
            <Match fallback>Ot<b>er</b></Match>
        </Switch>
    </>
}



// // import { Route, HashRouter } from "@solidjs/router";
// // import Home from "./pages/Home";
// // import About from "./pages/About";
// // import FormEditor from "./pages/FormEditor";
// // import NotFound from "./pages/NotFound";
// // import Tests from "./pages/Tests";
// // import { ensureBootstrapLoaded } from "../extensions/bootstrap/ensureBootstrapLoaded";

// // ensureBootstrapLoaded()

// // export default function App() {
// //     return (<>
// //         <HashRouter>
// //             <Route path="/" component={Home} />
// //             <Route path="/about" component={About} />
// //             <Route path="/form-editor" component={FormEditor} />
// //             <Route path="/tests" component={Tests} />
// //             <Route path="*404" component={NotFound} />
// //         </HashRouter>
// //     </>);
// // }


// // /*
// // import { createSignal } from "../../core/jsx"
// // import { ensureBootstrapLoaded } from '../extensions/bootstrap/ensureBootstrapLoaded'
// // import '../extensions/plain-html/PlainHTMLExtension';
// // import { ConstValue } from "../core/IQuery";
// // import { PlainFormView } from '../extensions/plain-html/PlainFormView';
// import { BootstrapEngine } from '../extensions/bootstrap/BootstrapEngine';
// import { formulairebleu } from '../core/IForm';


// // // IBooleanViews
// // ensureBootstrapLoaded();

// let bootstrapEngine = new BoosetEntryBoxeststrapEngine({})


// // //let x: formulairebleu.IViews['number'];
// // let x: formulairebleu.INumberType = {} as any;
// // x.type = 'number';


// // let htmlView: ConstValue = { type: "const", data: "<p>this is <b>HTML</b></p>", view: "html" };


// {
//     key: "p1", type: "object", membersTypes: [
//         { key: 'a', type: "number", view: { type: 'mynumber1', min: 1 } },
//         { key: 'b', type: "string" },
//         { key: 'c', type: "boolean" },
//         { key: 'd', type: "date" },
//         { key: 'e', type: "datetime" },
//         { key: 'f', type: "time" },
//         { key: 'g', type: 'number', view: { type: "mynumber1", min: 1 } },
//         { key: 'h', type: "array", entryType: { type: "string" } }
//         // { type: "void", help: "hello", view: { type: "const", data: "<p>this is <b>HTML</b></p>", view: "html" } satisfies ConstValue },
//         // { type: "void", help: "hello", view: htmlView },
//         // { key: 'tel1', type: 'telephone' as any, pageBreak: true }
//     ], help: "Page 1"
// },
// { key: 'tel2', type: 'telephone' as any, pageBreak: true },
// { key: 'tel3', type: 'telephone' as any, pageBreak: true },
// { key: 'tel4', type: 'telephone' as any, pageBreak: true },
// { key: 'tel5', type: 'telephone' as any, pageBreak: true },
// { key: 'tel6', type: 'telephone' as any, pageBreak: true },
// { key: 'tel7', type: 'telephone' as any, pageBreak: true },
// { key: 'tel8', type: 'telephone' as any, pageBreak: true },
// { key: 'tel9', type: 'telephone' as any, pageBreak: true },
// { key: 'tel10', type: 'telephone' as any, pageBreak: true },
// { key: 'tel11', type: 'telephone' as any, pageBreak: true },
// { key: 'tel12', type: 'telephone' as any, pageBreak: true },
// { key: 'tel13', type: 'telephone' as any, pageBreak: true },
// { key: 'tel14', type: 'telephone' as any, pageBreak: true },
// { key: 'tel15', type: 'telephone' as any, pageBreak: true },
// { key: 'tel17', type: 'telephone' as any, pageBreak: true },
// { key: 'tel18', type: 'telephone' as any, pageBreak: true },
// { key: 'tel19', type: 'telephone' as any, pageBreak: true },
// { key: 'tel20', type: 'telephone' as any, pageBreak: true },
// { key: 'tel21', type: 'telephone' as any, pageBreak: true },
// { key: 'tel22', type: 'telephone' as any, pageBreak: true },
// { key: 'tel23', type: 'telephone' as any, pageBreak: true },
// { key: 'tel24', type: 'telephone' as any, pageBreak: true },
// { key: 'tel25', type: 'telephone' as any, pageBreak: true },
// { key: 'tel27', type: 'telephone' as any, pageBreak: true },
// { key: 'tel28', type: 'telephone' as any, pageBreak: true },
// { key: 'tel29', type: 'telephone' as any, pageBreak: true },
// { key: 'tel30', type: 'telephone' as any, pageBreak: true },
// { key: 'tel31', type: 'telephone' as any, pageBreak: true },
// {
//     key: 'o1',
//     type: 'object',
//     help: "This is an object wit str1, num1, date1 and bool1 members.",
//     label: "Object1 label here",
//     pageBreak: true,
//     membersTypes: [
//         { key: 'str1', type: 'string', label: 'A simple string', help: 'Here you can enter an unconstrained string with default view.' },
//         { key: 'num1', type: 'number', label: 'A simple number', help: 'Here you can enter an unconstrained number with default view.' },
//         { key: 'bool1', type: 'boolean', label: 'A simple boolean', help: 'Here you can enter an unconstrained boolean with default view.' },
//         { key: 'date1', type: 'date', label: 'A simple date', help: 'Here you can enter an unconstrained boolean with default view.' },
//     ]
// },
// {
//     key: 'o2',
//     type: 'object',
//     help: "This is an object wit str2, num2, date2 and bool2 members.",
//     label: "Object2 label here",
//     pageBreak: true,
//     membersTypes: [
//         { key: 'str1', type: 'string', label: 'A simple string', defaultValue: "A", help: 'Here you can enter an unconstrained string with default view.' },
//         { key: 'num1', type: 'number', label: 'A simple number', defaultValue: 123, help: 'Here you can enter an unconstrained number with default view.' },
//         { key: 'bool1', type: 'boolean', label: 'A simple boolean', defaultValue: false, help: 'Here you can enter an unconstrained boolean with default view.' },
//         { key: 'date1', type: 'date', label: 'A simple date', help: 'Here you can enter an unconstrained boolean with default view.' },
//     ]
// },
// {
//     key: 'o3',
//     type: 'array',
//     help: "This is an object wit str2, num2, date2 and bool2 members.",
//     label: "Object2 label here",
//     entryType: {
//         type: 'object',
//         membersTypes: [
//             { key: 'str1', type: 'string', label: 'A simple string', defaultValue: "A", help: 'Here you can enter an unconstrained string with default view.' },
//             { key: 'num1', type: 'number', label: 'A simple number', defaultValue: 123, help: 'Here you can enter an unconstrained number with default view.' },
//             { key: 'bool1', type: 'boolean', label: 'A simple boolean', defaultValue: false, help: 'Here you can enter an unconstrained boolean with default view.' },
//             { key: 'date1', type: 'date', label: 'A simple date', help: 'Here you can enter an unconstrained boolean with default view.' },
//         ]
//     }
// },
//  ]
// }

// {
//     key: "p1", type: "object", membersTypes: [
//         { key: 'a', type: "number", view: { type: 'mynumber1', min: 1 } },
//         { key: 'b', type: "string" },
//         { key: 'c', type: "boolean" },
//         { key: 'd', type: "date" },
//         { key: 'e', type: "datetime" },
//         { key: 'f', type: "time" },
//         { key: 'g', type: 'number', view: { type: "mynumber1", min: 1 } },
//         { key: 'h', type: "array", entryType: { type: "string" } }
//         // { type: "void", help: "hello", view: { type: "const", data: "<p>this is <b>HTML</b></p>", view: "html" } satisfies ConstValue },
//         // { type: "void", help: "hello", view: htmlView },
//         // { key: 'tel1', type: 'telephone' as any, pageBreak: true }
//     ], help: "Page 1"
// },
// { key: 'tel2', type: 'telephone' as any, pageBreak: true },
// { key: 'tel3', type: 'telephone' as any, pageBreak: true },
// { key: 'tel4', type: 'telephone' as any, pageBreak: true },
// { key: 'tel5', type: 'telephone' as any, pageBreak: true },
// { key: 'tel6', type: 'telephone' as any, pageBreak: true },
// { key: 'tel7', type: 'telephone' as any, pageBreak: true },
// { key: 'tel8', type: 'telephone' as any, pageBreak: true },
// { key: 'tel9', type: 'telephone' as any, pageBreak: true },
// { key: 'tel10', type: 'telephone' as any, pageBreak: true },
// { key: 'tel11', type: 'telephone' as any, pageBreak: true },
// { key: 'tel12', type: 'telephone' as any, pageBreak: true },
// { key: 'tel13', type: 'telephone' as any, pageBreak: true },
// { key: 'tel14', type: 'telephone' as any, pageBreak: true },
// { key: 'tel15', type: 'telephone' as any, pageBreak: true },
// { key: 'tel17', type: 'telephone' as any, pageBreak: true },
// { key: 'tel18', type: 'telephone' as any, pageBreak: true },
// { key: 'tel19', type: 'telephone' as any, pageBreak: true },
// { key: 'tel20', type: 'telephone' as any, pageBreak: true },
// { key: 'tel21', type: 'telephone' as any, pageBreak: true },
// { key: 'tel22', type: 'telephone' as any, pageBreak: true },
// { key: 'tel23', type: 'telephone' as any, pageBreak: true },
// { key: 'tel24', type: 'telephone' as any, pageBreak: true },
// { key: 'tel25', type: 'telephone' as any, pageBreak: true },
// { key: 'tel27', type: 'telephone' as any, pageBreak: true },
// { key: 'tel28', type: 'telephone' as any, pageBreak: true },
// { key: 'tel29', type: 'telephone' as any, pageBreak: true },
// { key: 'tel30', type: 'telephone' as any, pageBreak: true },
// { key: 'tel31', type: 'telephone' as any, pageBreak: true },
// {
//     key: 'o1',
//     type: 'object',
//     help: "This is an object wit str1, num1, date1 and bool1 members.",
//     label: "Object1 label here",
//     pageBreak: true,
//     membersTypes: [
//         { key: 'str1', type: 'string', label: 'A simple string', help: 'Here you can enter an unconstrained string with default view.' },
//         { key: 'num1', type: 'number', label: 'A simple number', help: 'Here you can enter an unconstrained number with default view.' },
//         { key: 'bool1', type: 'boolean', label: 'A simple boolean', help: 'Here you can enter an unconstrained boolean with default view.' },
//         { key: 'date1', type: 'date', label: 'A simple date', help: 'Here you can enter an unconstrained boolean with default view.' },
//     ]
// },
// {
//     key: 'o2',
//     type: 'object',
//     help: "This is an object wit str2, num2, date2 and bool2 members.",
//     label: "Object2 label here",
//     pageBreak: true,
//     membersTypes: [
//         { key: 'str1', type: 'string', label: 'A simple string', defaultValue: "A", help: 'Here you can enter an unconstrained string with default view.' },
//         { key: 'num1', type: 'number', label: 'A simple number', defaultValue: 123, help: 'Here you can enter an unconstrained number with default view.' },
//         { key: 'bool1', type: 'boolean', label: 'A simple boolean', defaultValue: false, help: 'Here you can enter an unconstrained boolean with default view.' },
//         { key: 'date1', type: 'date', label: 'A simple date', help: 'Here you can enter an unconstrained boolean with default view.' },
//     ]
// },
// {
//     key: 'o3',
//     type: 'array',
//     help: "This is an object wit str2, num2, date2 and bool2 members.",
//     label: "Object2 label here",
//     entryType: {
//         type: 'object',
//         membersTypes: [
//             { key: 'str1', type: 'string', label: 'A simple string', defaultValue: "A", help: 'Here you can enter an unconstrained string with default view.' },
//             { key: 'num1', type: 'number', label: 'A simple number', defaultValue: 123, help: 'Here you can enter an unconstrained number with default view.' },
//             { key: 'bool1', type: 'boolean', label: 'A simple boolean', defaultValue: false, help: 'Here you can enter an unconstrained boolean with default view.' },
//             { key: 'date1', type: 'date', label: 'A simple date', help: 'Here you can enter an unconstrained boolean with default view.' },
//         ]
//     }
// },
//  ]
// }