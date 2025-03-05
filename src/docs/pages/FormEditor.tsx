import { Box } from "../../core/Box";
import { IArrayType, IForm, IKeyedMemberType, IKeyValue, IStringType, IVariantType } from "../../core/IForm";
import { formulaireBleuJSX, formulaireBleuJSXFragment } from "../../core/tiny-jsx";
import { BootstrapEngine } from "../../extensions/bootstrap/BootstrapEngine";
import { BootstrapFormView } from "../../extensions/bootstrap/BootstrapFormView";
import Nav from "../components/Nav";
import { BoxEditor, JSONEditor } from "./Tests";

export default function FormEditor() {
    let innerFormEngine = new BootstrapEngine({
        FormType: {
            type: 'variant',
            variants: [
                {
                    key: 'string', type: 'object', membersTypes: [
                        { key: 'name', type: 'string' },
                        { key: 'defaultValue', type: 'string', view: { type: 'string' } } satisfies IKeyedMemberType<IStringType>,
                        {
                            key: 'test', type: 'string', view: {
                                type: 'select', selectionList: {
                                    entries: [
                                        { value: '1' },
                                        { value: '2' },
                                        { value: '3' }
                                    ]
                                }
                            }
                        } satisfies IKeyedMemberType<IStringType>,
                        {
                            key: 'view', type: 'variant', flat: true,
                            variants: [
                                { key: 'string', type: 'object', membersTypes: [] },
                                { key: 'popup', type: 'object', membersTypes: [] },
                                {
                                    key: 'select', type: 'object', membersTypes: [
                                        {
                                            key: "entries", type: 'array', entryType: {
                                                type: 'object', membersTypes: [
                                                    { key: 'value', type: 'string' },
                                                    { key: 'label', type: 'string', optional: true } satisfies IKeyedMemberType<IStringType>
                                                ]
                                            }
                                        } as IKeyedMemberType<IArrayType>
                                    ]
                                },
                            ]
                        } satisfies IKeyedMemberType<IVariantType>,
                        { key: 'validations', type: 'string' }

                    ]
                },
                {
                    key: 'number', type: 'object', membersTypes: [
                        { key: 'name', type: 'string' },
                        { key: 'defaultValue', type: 'string' },
                        { key: 'view', type: 'string' },
                        { key: 'validations', type: 'string' }
                    ]
                },
                {
                    key: 'boolean', type: 'object', membersTypes: [
                        { key: 'name', type: 'string' },
                        { key: 'defaultValue', type: 'string' },
                        { key: 'view', type: 'string' },
                        { key: 'validations', type: 'string' }
                    ]
                },
                {
                    key: 'object', type: 'object', membersTypes: [
                        { key: 'name', type: 'string' },
                        { key: 'defaultValue', type: 'string' },
                        {
                            key: 'membersTypes', type: 'array', entryType: { key: 'todo', type: 'string' },

                        },
                        { key: 'view', type: 'string' },
                        { key: 'validations', type: 'string' }
                    ]
                },
                {
                    key: 'array', type: 'object', membersTypes: [
                        { key: 'name', type: 'string' },
                        { key: 'defaultValue', type: 'string' },
                        { key: 'view', type: 'string' },
                        { key: 'validations', type: 'string' }]
                }
            ]
        }
    });
    let form: IForm = {
        version: '1',
        name: 'form1',

        dataType: {
            type: 'object',
            membersTypes: [
                { key: 'name', type: 'string' },
                {
                    key: 'dataType',
                    type: 'array',
                    entryType: { type: 'FormType' }
                }
            ]
        }
    }
    let value = {
        first: 'pascal'
    };
    let box = Box.enBox(innerFormEngine, null, form.name, form.dataType, value);
    /*
        let previewForm: IForm = {
            version: '1',
            name: 'form1',
            templates: {},
            dataType: {
                type: 'object',
                membersTypes: [
                    { key: 'first', type: 'string', label: 'hello' }
                ]
            }
    
        }
        let previewValue = {
            first: 'pascal'
        };
        let previewBox = Box.enBox(innerFormEngine, null, form.name, form.dataType, previewValue);
    */

    return (<>
        <div class="container">
            <Nav />
            <h1>Éditeur de formulaire</h1>
            <BootstrapFormView engine={innerFormEngine} form={form} box={box} />
            <BoxEditor box={box} />
            {/* <h1>Preview</h1>
            <BootstrapFormView engine={innerFormEngine} form={previewForm} box={previewBox} /> */}
        </div>
    </>);
}
