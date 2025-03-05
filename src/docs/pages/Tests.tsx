import { Box } from "../../core/Box";
import { IForm } from "../../core/IForm";
import { Styles } from "../../core/Styles";
import { computed, For, formulaireBleuJSX, formulaireBleuJSXFragment, JSONValue, JSXSource, Show, Variable, IVariable } from "../../core/tiny-jsx";
import { BootstrapEngine } from "../../extensions/bootstrap/BootstrapEngine";
import { BootstrapFormView } from "../../extensions/bootstrap/BootstrapFormView";
import Nav from "../components/Nav";

interface ISourceTest {
    type: 'source';
    title: string;
    source: string;
    expectedResult?: string | number | boolean;
}

interface IFormTest {
    type: 'form';
    form: IForm;
    value?: JSONValue;
}

interface ITabs {
    type: 'tabs',
    title?: string;
    description?: JSXSource;
    content: Test[];
}

interface ISection {
    type: 'section',
    title?: string;
    description?: JSXSource;
    content: Test[];
}

type Test = ISourceTest | IFormTest | ITabs | ISection;

Styles.add("div.section", {
    'marginBottom': '2em'
})

Styles.add("div.form-comp", {
    paddingLeft: '4em'
});

Styles.add("pre.output", {
    'marginTop': '0.5em'
})

Styles.add("textarea.form-schema-editor", {
    fontFamily: 'monospace'
})

const allTests: Test =
{
    type: 'section',
    title: 'Formulaire Bleu - Test Suite',
    description: 'A comprehensive test suite for Formulaire Bleu, covering all supported data types, validations, and input styles.',
    content: [
        {
            type: 'section',
            title: 'Basic Types',
            description: "This section covers the fundamental JSON data types: strings, numbers, and booleans. These are the building blocks of any form.",
            content: [
                {
                    type: 'section',
                    title: 'String Type',
                    description: "String inputs allow users to enter text values. Additional options include default values, validation rules, and dropdown selections.",
                    content: [
                        { type: 'form', form: { version: '1', name: 'Basic String', dataType: { type: 'string', help: 'A simple text input without constraints.' } } },
                        { type: 'form', form: { version: '1', name: 'String with Default', dataType: { type: 'string', help: 'Pre-filled with "A".', defaultValue: "A" } } },
                        { type: 'form', form: { version: '1', name: 'Required String', dataType: { type: 'string', validations: { mandatory: true }, help: 'User must enter a value before leaving the field.' } } },
                        {
                            type: 'form', form: {
                                version: '1', name: 'Regex Validation', dataType: {
                                    type: 'string', validations: {
                                        regex: [{ regex: '^[0-7\-]+$', message: "Only digits 0-7 and dashes are allowed." }],
                                        minLength: 3,
                                        maxLength: 10,
                                    }, help: 'Text input restricted to octal digits (0-7) and dashes.'
                                },
                            }
                        },
                        {
                            type: 'form', form: {
                                version: '1', name: 'Dropdown Selection',
                                dataType: {
                                    type: 'string', help: 'Select a predefined option from a dropdown menu.', view: {
                                        type: 'select', selectionList: {
                                            entries: [
                                                { label: 'Small', value: 'SM' },
                                                { label: 'Medium', value: 'MD' },
                                                { label: 'Large', value: 'LG' }
                                            ]
                                        }
                                    }
                                },
                            }
                        },
                        { type: 'form', form: { version: '1', name: 'Popup Input', dataType: { type: 'string', help: 'Text input shown in a popup for better focus.', view: { type: 'popup' } } } }
                    ]
                },
                {
                    type: 'section',
                    title: 'Number Type',
                    description: "Number inputs allow users to enter numerical values, including sliders and required fields.",
                    content: [
                        { type: 'form', form: { version: '1', name: 'Basic Number', dataType: { type: 'number', help: 'A simple numeric input.' } } },
                        { type: 'form', form: { version: '1', name: 'Number with Default', dataType: { type: 'number', help: 'Pre-filled with 1.', defaultValue: 1 } } },
                        { type: 'form', form: { version: '1', name: 'Number Slider', dataType: { type: 'number', help: 'Slider input with tick marks for better selection.', view: { type: 'slider', tickmarks: true } } } },
                        { type: 'form', form: { version: '1', name: 'Required Number', dataType: { type: 'number', validations: { mandatory: true }, help: 'User must enter a number before submitting.' } } },
                        { type: 'form', form: { version: '1', name: 'Popup Number', dataType: { type: 'number', help: 'Number input displayed in a popup for better focus.', view: { type: 'popup' } } } }
                    ]
                },
                {
                    type: 'section',
                    title: 'Boolean Type',
                    description: "Boolean inputs represent true/false values and can be displayed as checkboxes or switches.",
                    content: [
                        { type: 'form', form: { version: '1', name: 'Basic Boolean', dataType: { type: 'boolean', help: 'A simple checkbox input for true/false values.' } } },
                        { type: 'form', form: { version: '1', name: 'Boolean with Default', dataType: { type: 'boolean', help: 'Pre-filled with "true".', defaultValue: true } } },
                        { type: 'form', form: { version: '1', name: 'Required Boolean', dataType: { type: 'boolean', validations: { mandatory: true }, help: 'User must select an option before proceeding.' } } },
                        { type: 'form', form: { version: '1', name: 'Boolean Switch', dataType: { type: 'boolean', help: 'Displayed as an ON/OFF switch for better UX.', view: { type: 'switch' } } } },
                        { type: 'form', form: { version: '1', name: 'Popup Boolean', dataType: { type: 'boolean', help: 'Boolean selection inside a popup.', view: { type: 'popup' } } } },
                        { type: 'form', form: { version: '1', name: 'Switch in Popup', dataType: { type: 'boolean', help: 'Switch control inside a popup for better visibility.', view: { type: 'switch', popup: true } } } }
                    ]
                }
            ]
        },
        {
            type: 'section',
            title: 'Other Types',
            description: "This section covers date, time, datetime and location type. While not JSON these common type are in the core package for any form.",
            content: [
                {
                    type: 'section',
                    title: 'Date and time types',
                    description: "String inputs allow users to enter text values. Additional options include default values, validation rules, and dropdown selections.",
                    content: [
                        { type: 'form', form: { version: '1', name: 'Simple date', dataType: { type: 'date' } } },
                        { type: 'form', form: { version: '1', name: 'Simple time', dataType: { type: 'time' } } },
                        { type: 'form', form: { version: '1', name: 'Simple datetime', dataType: { type: 'datetime' } } }
                    ]
                },
                {
                    type: 'section',
                    title: 'Location Type',
                    description: "A location on the map.",
                    content: [
                        { type: 'form', form: { version: '1', name: 'TODO', dataType: { type: 'number', help: 'TODO' } } },
                    ]
                }
            ]
        },
        {
            type: 'section',
            title: 'Arrays',
            description: "Arrays allow users to enter multiple values of the same type, such as a list of numbers, strings or any other type.",
            content: [
                { type: 'form', form: { version: '1', name: 'String Array', dataType: { type: 'array', entryType: { type: 'string' }, help: 'A list of text values.' } } },
                { type: 'form', form: { version: '1', name: 'Number Array', dataType: { type: 'array', entryType: { type: 'number' }, help: 'A list of numeric values.' } } },
                { type: 'form', form: { version: '1', name: 'Boolean Array', dataType: { type: 'array', entryType: { type: 'boolean' }, help: 'A list of true/false values.' } } },
                { type: 'form', form: { version: '1', name: 'Object Array', dataType: { type: 'array', entryType: { type: 'object', membersTypes: [{ key: "name", type: "string" }, { key: "dob", type: "date" }] }, help: 'A list of person.' } } },
                { type: 'form', form: { version: '1', name: 'Object Array with table view', dataType: { type: 'array', view: { type: "table" }, entryType: { type: 'object', membersTypes: [{ key: "name", type: "string" }, { key: "dob", type: "date" }] }, help: 'A list of person.' } } },
                { type: 'form', form: { version: '1', name: 'Object Array with popup view', dataType: { type: 'array', view: { type: "popup" }, entryType: { type: 'object', membersTypes: [{ key: "name", type: "string" }, { key: "dob", type: "date" }] }, help: 'A list of person.' } } },
                { type: 'form', form: { version: '1', name: 'Object Array with tabs view', dataType: { type: 'array', view: { type: "tabs" }, entryType: { type: 'object', membersTypes: [{ key: "name", type: "string" }, { key: "dob", type: "date" }] }, help: 'A list of person.' } } },
                { type: 'form', form: { version: '1', name: 'Object Array with popup and button view', dataType: { type: 'array', view: { type: "popup", buttons: "OKCancel" }, entryType: { type: 'object', membersTypes: [{ key: "name", type: "string" }, { key: "dob", type: "date" }] }, help: 'A list of person.' } } },
                { type: 'form', form: { version: '1', name: 'Variant Array', dataType: { type: 'array', view: { type: "popup", buttons: "OKCancel" }, entryType: { type: 'variant', variants: [{ key: "name", type: "string" }, { key: "dob", type: "date" }] }, help: 'A list of either name or dob.' } } }
            ]
        },
        {
            type: 'section',
            title: 'Objects',
            description: "Objects contain multiple fields of different types, allowing for complex data structures.",
            content: [
                {
                    type: 'form', form: {
                        version: '1', name: 'Object Form', dataType: {
                            type: 'object', membersTypes: [
                                { key: "str", type: "string" },
                                // { key: "num", type: "number" },
                                // { key: "bool1", type: "boolean" },
                                // { key: "bool2", type: "boolean", view: { type: 'switch' } },
                                {
                                    key: "innerObject",
                                    type: 'object', membersTypes: [
                                        // { key: "first", type: "string" },
                                        { key: "last", type: "string" }
                                    ],
                                    help: 'A structured object containing multiple fields with different data types.'
                                }
                            ],
                            help: 'A structured object containing multiple fields with different data types.'
                        }
                    }
                }
            ]
        },
        {
            type: 'section',
            title: 'Variants',
            description: "Variant types allow a field to take different types at different times, enforcing mutually exclusive options.",
            content: [
                {
                    type: 'form', form: {
                        version: '1', name: 'Variant Form', dataType: {
                            type: 'variant', variants: [
                                { key: "str", type: "string" },
                                { key: "num", type: "number" },
                                { key: "bool1", type: "boolean" },
                                { key: "boolIn", type: "object", membersTypes: [{ key: "v", type: 'boolean', view: { type: 'switch' } }] },
                                {
                                    key: "obj", type: "object", membersTypes: [
                                        { key: 'firstname', type: 'string' },
                                        { key: 'lastname', type: 'string' },
                                        { key: 'dog', type: 'const', value: 'k9' }
                                    ]
                                }
                            ], help: 'A field that can take only one type at a time, ensuring valid input.'
                        }
                    }
                },
                {
                    type: 'form', form: {
                        version: '1', name: 'Flat Variant Form', dataType: {
                            flat: true,
                            type: 'variant', variants: [
                                { key: "str", type: "string" },
                                { key: "num", type: "number" },
                                {
                                    key: "obj", type: "object", membersTypes: [
                                        { key: 'firstname', type: 'string' },
                                        { key: 'lastname', type: 'string' },
                                        { key: 'dog', type: 'const', value: 'k9' }
                                    ]
                                }
                            ], help: 'A field that can take only one type at a time, ensuring valid input.'
                        }
                    }
                },
                {
                    type: 'form', form: {
                        version: '1', name: 'Flat Variant with determinant Form', dataType: {
                            flat: true, determinant: "type",
                            type: 'variant', variants: [
                                {
                                    key: "car", type: "object", membersTypes: [
                                        { key: 'hybrid', type: 'boolean' },
                                    ]
                                }
                                , {
                                    key: "man", type: "object", membersTypes: [
                                        { key: 'firstname', type: 'string' },
                                    ]
                                }
                            ], help: 'A field that can take only one type at a time, ensuring valid input.'
                        }
                    }
                }
            ]
        }
    ]
};

export function JSONEditor(props: { jsonValue: IVariable<any> }) {
    let isValid = new Variable("isValid", true);
    let source = new Variable("source", "");

    props.jsonValue.addObserver((s) => {
        let newJSON = JSON.stringify(s, undefined, "   ");
        source.setValue(newJSON);
    });

    return (<div class="container mt-3">
        <label for="exampleTextarea" class="form-label">Form data</label>
        <textarea class={computed("isValid", { isValid }, (p) => "form-control form-schema-editor" + (p.isValid ? "" : " is-invalid"))} placeholder="Source" style="height: 150px;"
            onInput={onSourceInput} value={source} />
        <div class="invalid-feedback">Invalid JSON Value</div>
    </div>)

    function onSourceInput(e: InputEvent) {
        try {
            let preElt = e.target as HTMLInputElement;
            let val = JSON.parse(preElt.value);
            if (JSON.stringify(props.jsonValue.getValue()) != JSON.stringify(val)) {
                props.jsonValue.setValue(val, { notify: true });
            }
            isValid.setValue(true);
        }
        catch (e: any) {
            isValid.setValue(false);
        }
    }
}

export function BoxEditor(props: { box: Box }) {
    var jsonValue = new Variable("jsonValue", {})
    props.box.addChildChangedObserver((o) => {
        let v = props.box.getValue();
        jsonValue.setValue(v, { forceUpdate: true, notify: true })
    }, true);
    jsonValue.addObserver((v) => {
        if (JSON.stringify(v) != JSON.stringify(props.box.getValue())) props.box.setValue(v, { validate: true, notify: true });
    })
    return <JSONEditor jsonValue={jsonValue} />

}

function TestComp(props: { test: Test, level: number }) {

    if (!props.test) return <p>No test</p>
    switch (props.test.type) {
        case "form": return formComp();
        case "tabs": return tabsComp(props.test);
        case "section": return sectionComp(props.test);
        case "source": return sourceComp();
    }

    function formComp() {
        let test = props.test;
        let form = 'form' in test ? test.form : undefined;
        let innerFormEngine = new BootstrapEngine();
        let box = Box.enBox(innerFormEngine, null, form.name, form.dataType, 'value' in test ? test.value : undefined);
        return (<div class="form-comp">
            <BootstrapFormView engine={innerFormEngine} form={form} box={box} />
            <BoxEditor box={box} />
            <Show when={box.type.validations}>
                <button type="button" class="btn btn-secondary" onClick={validate}>Validate</button>
                <button type="button" class="btn btn-secondary" onClick={clearErrors}>Clear</button>
            </Show>
        </div>);

        function validate() {
            //box.validate(box.getValue())
        }

        function clearErrors() {
            box.clearErrors();
        }

    }

    function sectionComp(section: ISection) {
        return <div class="section">
            <Show when={section.title}><h1 class={"display-" + props.level}>{section.title}</h1></Show>
            <Show when={section.description}><div>{section.description}</div></Show>
            <For each={section.content}>
                {(e) => {
                    return <div>
                        <TestComp test={e} level={props.level + 1} />
                    </div>
                }}
            </For >
        </div>

    }
    function sourceComp() {
        return <p>sourceComp</p>
    }
    function tabsComp(tabs: ITabs) {
        const activeTab = new Variable("tabsActiveTab", 0);
        let content = tabs.content;
        return (<>
            <Show when={tabs.title}><h1 class={"display-" + props.level}>{tabs.title}</h1></Show>
            <Show when={tabs.description}><p>{tabs.description}</p></Show>
            <div class="tabs-container">
                <ul class="nav nav-tabs">
                    <For each={content}>
                        {(entry, index) => (
                            <li class="nav-item">
                                <button
                                    class={computed("tabsHeader#" + index, { activeTab }, p => `nav-link ${index === p.activeTab ? 'active' : ''}`)}
                                    onClick={() => activeTab.setValue(index)}
                                >
                                    {entry.title ?? (index + 1)}
                                </button>
                            </li>
                        )}
                    </For>
                </ul>
                <div class="tab-content mt-3">
                    <For each={content}>
                        {(e: any, index: number) => {
                            return <div class={computed("tabsPanel#" + index, { activeTab }, p => `tab-pane fade ${index === p.activeTab ? 'show active' : ''}`)}>
                                <TestComp test={e} level={props.level + 1} />
                            </div>
                        }}
                    </For>
                </div>
            </div >
        </>)
    }
}

export default function Tests() {
    return (
        <div class="container">
            <Nav />
            {/* <TestComp test={(allTests as any).content[1].content[0]} level={1} /> */}
            <TestComp test={(allTests as any).content[4]/*.content[0].content[2].content[3].content[1].content[0]*/} level={1} />
        </div>);
}
