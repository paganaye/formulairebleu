import { Box } from "../../core/Box";
import { IForm, IKeyedMemberType, IStringType } from "../../core/IForm";
import { formulaireBleuJSX } from "../../core/tiny-jsx";
import { IFormType } from "../../core/IForm";
import { BootstrapEngine } from "../../extensions/bootstrap/BootstrapEngine";
import { BootstrapFormView } from "../../extensions/bootstrap/BootstrapFormView";
import Nav from "../components/Nav";
import { BoxEditor } from "./Tests";

const stringType = {
    type: 'object',
    membersTypes: [
        { key: 'label', type: 'string' },
        { key: 'help', type: 'string' },
        { key: 'defaultValue', type: 'string' },
        { key: 'view', type: 'string' },
        { key: 'validations', type: 'string' }
    ]
} satisfies IFormType;

const numberType = {
    type: 'object',
    membersTypes: [
        { key: 'label', type: 'string' },
        { key: 'help', type: 'string' },
        { key: 'defaultValue', type: 'number' },
        { key: 'minValue', type: 'number' },
        { key: 'maxValue', type: 'number' },
        { key: 'decimals', type: 'number' },
        { key: 'view', type: 'string' },
        { key: 'validations', type: 'string' }
    ]
} satisfies IFormType;
const booleanType = {
    type: 'object',
    membersTypes: [
        { key: 'label', type: 'string' },
        { key: 'help', type: 'string' },
        { key: 'defaultValue', type: 'boolean' },
        { key: 'view', type: 'string' },
        { key: 'validations', type: 'string' }
    ]
} satisfies IFormType;


const arrayType = {
    type: 'object',
    membersTypes: [
        { key: 'label', type: 'string' },
        { key: 'help', type: 'string' },
        // entryType est le type des éléments contenus dans le tableau
        { key: 'entryType', type: 'FormType' },
        { key: 'primaryKeys', type: 'array', entryType: { type: 'string' } },
        { key: 'view', type: 'string' },
        { key: 'validations', type: 'string' }
    ]
} satisfies IFormType;

const constType = {
    type: 'object',
    membersTypes: [
        { key: 'value', type: 'string' },
        { key: 'help', type: 'string' }
    ]
} satisfies IFormType;

const dateType = {
    type: 'object',
    membersTypes: [
        { key: 'label', type: 'string' },
        { key: 'help', type: 'string' },
        { key: 'view', type: 'string' },
        { key: 'validations', type: 'string' }
    ]
} satisfies IFormType;

const datetimeType = {
    type: 'object',
    membersTypes: [
        { key: 'label', type: 'string' },
        { key: 'help', type: 'string' },
        { key: 'view', type: 'string' },
        { key: 'validations', type: 'string' }
    ]
} satisfies IFormType;

const timeType = {
    type: 'object',
    membersTypes: [
        { key: 'label', type: 'string' },
        { key: 'help', type: 'string' },
        { key: 'view', type: 'string' },
        { key: 'validations', type: 'string' }
    ]
} satisfies IFormType;


const objectType = {
    type: 'object',
    membersTypes: [
        { key: 'label', type: 'string' },
        { key: 'help', type: 'string' },
        { key: 'membersTypes', type: 'array', entryType: { type: 'KeyedFormType' } },
        { key: 'view', type: 'string' },
        { key: 'validations', type: 'string' }
    ]
} satisfies IFormType;

const variantType = {
    type: 'object',
    membersTypes: [
        { key: 'label', type: 'string' },
        { key: 'help', type: 'string' },
        // La propriété variants permet de définir des sous-types
        { key: 'variants', type: 'array', entryType: { type: 'FormType' } },
        { key: 'determinant', type: 'string' },
        { key: 'flat', type: 'boolean' },
        { key: 'view', type: 'string' },
        { key: 'validations', type: 'string' }
    ]
};

const voidType = {
    type: 'object',
    membersTypes: [
        { key: 'label', type: 'string' },
        { key: 'help', type: 'string' },
        { key: 'view', type: 'string' }
    ]
}
const nullType = {
    key: 'null',
    type: 'object',
    membersTypes: [
        { key: 'label', type: 'string' },
        { key: 'help', type: 'string' }
    ]
}

const formType: IFormType = {
    type: 'variant',
    flat: true,
    determinant: 'type',
    variants: [
        { key: 'string', ...stringType },
        { key: 'number', ...numberType },
        { key: 'object', ...objectType },
        { key: 'array', ...arrayType },
        { key: 'const', ...constType },
        { key: 'date', ...dateType },
        { key: 'datetime', ...datetimeType },
        { key: 'time', ...timeType },
        { key: 'variant', ...variantType },
        { key: 'void', ...voidType },
        { key: 'null', ...nullType }
    ]
} satisfies IFormType;

const keyField = {
    key: 'key', type: 'string'
} satisfies IKeyedMemberType

const keyedFormType: IFormType = {
    type: 'variant',
    flat: true,
    determinant: 'type',
    variants: [
        { type: 'object', membersTypes: [keyField, ...stringType.membersTypes] },
        { type: 'object', membersTypes: [keyField, ...numberType.membersTypes] },
        { type: 'object', membersTypes: [keyField, ...objectType.membersTypes] },
        { type: 'object', membersTypes: [keyField, ...arrayType.membersTypes] },
        { type: 'object', membersTypes: [keyField, ...constType.membersTypes] },
        { type: 'object', membersTypes: [keyField, ...dateType.membersTypes] },
        { type: 'object', membersTypes: [keyField, ...datetimeType.membersTypes] },
        { type: 'object', membersTypes: [keyField, ...timeType.membersTypes] },
        { type: 'object', membersTypes: [keyField, ...variantType.membersTypes] },
        { type: 'object', membersTypes: [keyField, ...voidType.membersTypes] },
        { type: 'object', membersTypes: [keyField, ...nullType.membersTypes] }
    ]
} satisfies IFormType;


const metaForm: IForm = {
    version: '1',
    name: 'MetaFormEditor',
    dataType: {
        type: 'object',
        membersTypes: [
            { key: 'name', type: 'string' },
            {
                key: 'dataType',
                ...formType
            }
        ]
    }
};

export default function FormEditor() {
    const engine = new BootstrapEngine({ FormType: formType, KeyedFormType: keyedFormType });
    const initialValue = {
        name: 'My Form',
        dataType: {
            type: 'string',
            label: 'Enter text',
            help: 'This is a string field'
        }
    };

    const box = Box.enBox(engine, null, metaForm.name, metaForm.dataType, initialValue);

    return (
        <div class="container">
            <Nav />
            <h1>Form Editor</h1>
            <BootstrapFormView engine={engine} form={metaForm} box={box} />
            <BoxEditor box={box} style="height:400px" />
        </div>
    );
}
