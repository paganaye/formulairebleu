import { Box } from "../../core/Box";
import { IForm } from "../../core/IForm";
import { Styles } from "../../core/Styles";
import { computed, For, formulaireBleuJSX, formulaireBleuJSXFragment, JSONValue, JSXSource, Show, Value } from "../../core/tiny-jsx";
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

const allTests: Test =
{
    type: 'section',
    title: 'Tests Formulaire bleu',
    content: [
        {
            type: 'section',
            title: 'Simple types',
            description: "One of Formulaire bleu primarily goals is to produces JSON output, this is why FormulaireBleu's basic types are JSON types. We have strings, numbers, booleans, objects and arrays.",
            content: [
                {
                    type: 'section',
                    title: 'String type', content: [
                        { type: 'form', form: { version: '1', name: 'Simple string form', dataType: { type: 'string', help: 'There is no extra parameters, just  a plain string form.' } } },
                        { type: 'form', form: { version: '1', name: 'string with default values', dataType: { type: 'string', help: 'A string with a default value of "A".', defaultValue: "A" } } },
                        { type: 'form', form: { version: '1', name: 'string with validation', dataType: { type: 'string', validations: { mandatory: true }, help: 'Here the string is mandatory. By default, the validation is done when the user leave the field' } } },
                        {
                            type: 'form', form: {
                                version: '1', name: 'string with regex', dataType: {
                                    type: 'string', validations: {
                                        regex: [{ regex: '^[0-7\-]+$', message: "The string must only consist of octal numbers 0 to 7 or dashes " }],
                                        minLength: 3,
                                        maxLength: 10,
                                    }, help: 'This string can only contain the number 0 to 7 and dashes.'
                                },
                            }
                        },
                        {
                            type: 'form', form: {
                                version: '1', name: 'String from selection list',
                                dataType: {
                                    type: 'string', help: 'There is no extra parameters, just  a plain string form.', view: {
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
                        { type: 'form', form: { version: '1', name: 'string in popup', dataType: { type: 'string', help: 'string in popup help.', view: { type: 'popup' } } } }
                    ]
                },
                {
                    type: 'section',
                    title: 'Number Type', content: [
                        { type: 'form', form: { version: '1', name: 'Simple number form', dataType: { type: 'number', help: 'There is no extra parameters, just  a plain number form.' } } },
                        { type: 'form', form: { version: '1', name: 'number with default values', dataType: { type: 'number', help: 'A number form with a default value of 1.', defaultValue: 1 } } },
                        { type: 'form', form: { version: '1', name: 'number slider', dataType: { type: 'number', help: 'This is a slider help', view: { type: 'slider', tickmarks: true } } } },
                        { type: 'form', form: { version: '1', name: 'number form', dataType: { type: 'number', validations: { mandatory: true }, help: 'A mandatory number.' } } },
                        { type: 'form', form: { version: '1', name: 'number in popup', dataType: { type: 'number', help: 'number in popup help.', view: { type: 'popup' } } } }
                    ]
                },
                {
                    type: 'section',
                    title: 'Boolean type', content: [
                        { type: 'form', form: { version: '1', name: 'Simple boolean form', dataType: { type: 'boolean', help: 'There is no extra parameters, just  a plain boolean form. Typically it will show as a checkbox.' } } },
                        { type: 'form', form: { version: '1', name: 'boolean with default values', dataType: { type: 'boolean', help: 'A boolean form with a default value of true.', defaultValue: true } } },
                        { type: 'form', form: { version: '1', name: 'boolean validation', dataType: { type: 'boolean', validations: { mandatory: true }, help: 'A mandatory boolean.' } } },
                        { type: 'form', form: { version: '1', name: 'boolean switch', dataType: { type: 'boolean', help: 'boolean viewed as a switch', view: { type: 'switch' } } } },
                        { type: 'form', form: { version: '1', name: 'boolean in popup', dataType: { type: 'boolean', help: 'boolean in popup help.', view: { type: 'popup' } } } },
                        { type: 'form', form: { version: '1', name: 'switch in popup', dataType: { type: 'boolean', help: 'boolean in popup help.', view: { type: 'switch', popup: true } } } }
                    ]
                }
            ]
        },
        {
            type: 'section',
            title: 'Arrays',
            content: [
                { type: 'form', form: { version: '1', name: 'Array1', dataType: { type: 'array', entryType: { type: 'string' }, help: 'Array1 help.' } } },
                { type: 'form', form: { version: '1', name: 'Array2', dataType: { type: 'array', entryType: { type: 'number' }, help: 'Array1 help.' } } },
                { type: 'form', form: { version: '1', name: 'Array3', dataType: { type: 'array', entryType: { type: 'boolean' }, help: 'Array1 help.' } } },
                { type: 'form', form: { version: '1', name: 'Array1', dataType: { type: 'array', entryType: { type: 'string' }, help: 'Array1 help.' } } },
            ]
        },
        {
            type: 'section',
            title: 'Objects',
            content: [
                { type: 'form', form: { version: '1', name: 'Simple string form', dataType: { type: 'string', help: 'There is no extra parameters, just  a plain string form.' } } },
                { type: 'form', form: { version: '1', name: 'string with default values', dataType: { type: 'string', help: 'A string with a default value of "A".', defaultValue: "A" } } },
                { type: 'form', form: { version: '1', name: 'string form', dataType: { type: 'string', validations: { mandatory: true }, help: 'A mandatory string.' } } }

            ]
        }
    ]

};

function TestComp(props: { test: Test, level: number }) {

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
        let jsonValue = new Value("");
        let box = Box.enBox(innerFormEngine, null, form.name, form.dataType, 'value' in test ? test.value : undefined);
        box.addChildChangedObserver((o) => {
            jsonValue.setValue(JSON.stringify(box.getValue(), undefined, '  '))
        });
        return (<div class="form-comp">
            <BootstrapFormView engine={innerFormEngine} form={form} box={box} />
            <pre class="output">current form value: {jsonValue}</pre>
            <Show when={box.type.validations}>
                <button type="button" class="btn btn-secondary" onClick={validate}>Validate</button>
                <button type="button" class="btn btn-secondary" onClick={clearErrors}>Clear</button>
            </Show>
        </div>);

        function validate() {
            box.validate(box.getValue())
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
        const activeTab = new Value("tabsActiveTab", 0);
        let content = tabs.content;
        return <>
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

        </>
    }

}


export default function Tests() {
    return (
        <div class="container">
            <Nav />
            <TestComp test={(allTests as any)/*.content[1].content[0]*/} level={1} />
        </div>);
}
