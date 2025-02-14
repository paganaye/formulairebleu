import { IForm, IFormType, InferFormType, ISelectionList } from './core/IForm';

export function randomize<T extends IForm>(form: T): InferFormType<T> {
    function randomValue(type: IFormType): any {
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
                return null
            }
        }
    };
    return randomValue(form.dataType);
}
