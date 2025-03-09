import { Box } from "../../core/Box";
import { IForm, IKeyedMemberType, IStringType } from "../../core/IForm";
import { formulaireBleuJSX } from "../../core/tiny-jsx";
import { IFormType } from "../../core/IForm";
import { BootstrapEngine } from "../../extensions/bootstrap/BootstrapEngine";
import { BootstrapFormView } from "../../extensions/bootstrap/BootstrapFormView";
import Nav from "../components/Nav";
import { BoxEditor } from "./Tests";
import { Styles } from "../../core/Styles";

Styles.add(".object-members", {
    'padding-left': '3em'
})

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
        { key: 'string', type: 'object', membersTypes: [{ key: 'type', type: 'const', value: 'string' }, keyField, ...stringType.membersTypes] },
        { key: 'number', type: 'object', membersTypes: [{ key: 'type', type: 'const', value: 'number' }, keyField, ...numberType.membersTypes] },
        { key: 'object', type: 'object', membersTypes: [{ key: 'type', type: 'const', value: 'object' }, keyField, ...objectType.membersTypes] },
        { key: 'array', type: 'object', membersTypes: [{ key: 'type', type: 'const', value: 'array' }, keyField, ...arrayType.membersTypes] },
        { key: 'const', type: 'object', membersTypes: [{ key: 'type', type: 'const', value: 'const' }, keyField, ...constType.membersTypes] },
        { key: 'datetime', type: 'object', membersTypes: [{ key: 'type', type: 'const', value: 'date' }, keyField, ...dateType.membersTypes] },
        { key: 'date', type: 'object', membersTypes: [{ key: 'type', type: 'const', value: 'datetime' }, keyField, ...datetimeType.membersTypes] },
        { key: 'time', type: 'object', membersTypes: [{ key: 'type', type: 'const', value: 'time' }, keyField, ...timeType.membersTypes] },
        { key: 'variant', type: 'object', membersTypes: [{ key: 'type', type: 'const', value: 'variant' }, keyField, ...variantType.membersTypes] },
        { key: 'void', type: 'object', membersTypes: [{ key: 'type', type: 'const', value: 'void' }, keyField, ...voidType.membersTypes] },
        { key: 'null', type: 'object', membersTypes: [{ key: 'type', type: 'const', value: 'null' }, keyField, ...nullType.membersTypes] }
    ]
} satisfies IFormType;
/*
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
 */

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
