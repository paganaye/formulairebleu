import { getUniqueId } from "./Utils";

export type JSONPrimitive = number | string | null | boolean;
export type JSONArray = JSONValue[];
export type JSONObject = { [key: string]: JSONValue };
export type JSONValue = JSONPrimitive | JSONArray | JSONObject;

export class formulaireBleuJSXFragment { }

export type JSXSource = JSONValue | Node | (() => JSXSource) | IObservable<JSXSource>;

export type Observer<T> = (newValue: T) => void


export interface IObservable<T = any> {
    getValue(): T;
    addObserver(observer: Observer<T>);
}

export interface IVariable<T = any> extends IObservable<T> {
    setValue(newValue: T, options?: ISetValueOptions): void;
}


export function isObservable(v: any): v is IObservable {
    return v && typeof v.getValue === "function";
}

export interface ISetValueOptions {
    notify: boolean
}

const directProperties = new Set([
    "value", "checked", "selected", "disabled", "readOnly",
    "className", "id", "href", "src"
]);


export abstract class Observable<T = any> implements IObservable<T> {
    #observers?: Set<Observer<T>>;
    readonly id: string;
    abstract getValue(): T;

    constructor(namePrefix?: string) {
        this.id = getUniqueId(namePrefix ?? this.constructor.name);
    }

    addObserver(observer: Observer<T>, immediate: boolean = false) {
        (this.#observers || (this.#observers = new Set())).add(observer);
        if (immediate) observer(this.getValue())
    }

    notifyObservers(value: T) {
        this.#observers?.forEach(observer => observer(value));
    }
}

export class Variable<T = any> extends Observable<T> implements IVariable<T> {
    #value: T;
    getValue(): T { return this.#value; }
    setValue(newValue: T, options: ISetValueOptions = { notify: true }): void {
        if (newValue === this.#value) return
        //if (Array.isArray(newValue) && Array.isArray(this.#value) && newValue.length == 0 && this.#value.length == 0) return
        this.#value = newValue;
        if (options.notify) this.notifyObservers(newValue);
    }

    constructor(namePrefix: string, value: T = undefined) {
        super(namePrefix)
        this.#value = value;
    }
}


function observe<T>(source: T | IObservable<T>, update: (value: T) => void, init: boolean): void {
    if (isObservable(source)) {
        if (init) update(source.getValue());
        source.addObserver(update);
    } else {
        update(source);
    }
}

function createElements(source: JSXSource): Node[] {
    if (source === undefined) return [document.createComment(getUniqueId("undefined-source"))];
    if (source === null) return [document.createComment(getUniqueId("null-source"))];
    const type = typeof source;
    if (['string', 'number', 'boolean'].includes(type))
        return [document.createTextNode(source.toString())];
    if (type == 'object') {
        if (isObservable(source)) {
            let elts = createElements(source.getValue());
            const observer = (val: any) => {
                const next = elts[elts.length - 1]?.nextSibling;
                const newElts = createElements(val);
                if (newElts.length == 0) {
                    newElts.push(document.createComment(getUniqueId((source as Observable).id + "-placeholder")));
                }
                const parent = elts[0]?.parentNode;
                if (parent) {
                    elts.forEach(n => n.parentNode?.removeChild(n));
                    newElts.forEach(n => parent.insertBefore(n, next));
                }
                elts.length = 0;
                elts.push(...newElts);
            };
            source.addObserver(observer);
            return elts;
        }
        if (Array.isArray(source))
            return source.flatMap(createElements);
        if (source instanceof Node)
            return [source];
        return [document.createTextNode(String(source))];
    }
    if (type === 'function')
        return createElements((source as (() => JSXSource))());
    throw Error('Unexpected JSX child ' + source);
}

export type JSXComponent<TProps = Record<string, any>> = ((props: TProps, children?: JSXSource[]) => Node | Node[]);

export function formulaireBleuJSX(
    src: string | JSXComponent<any> | formulaireBleuJSXFragment,
    attrs?: Record<string, JSXSource>,
    ...children: JSXSource[]
): Node | Node[] {
    switch (typeof src) {
        case 'string':
            const elt = document.createElement(src);
            // elt.id = getUniqueId(src);
            if (attrs) {
                Object.keys(attrs).forEach(k => {
                    let v = attrs[k];
                    if (k == 'ref' && v instanceof Observable) {
                        setTimeout(() => (v as Variable).setValue(elt));
                    }
                    if (k.startsWith("on") && typeof v === "function")
                        elt.addEventListener(k.slice(2).toLowerCase(), v);
                    else {
                        if (v === undefined) v = "";
                        if (isObservable(v)) observe(v, (v) => setElementAttribute(elt, k, v), true)
                        else setElementAttribute(elt, k, v);
                    }
                });
            }
            children.forEach(child => {
                createElements(child).forEach(n => {
                    elt.appendChild(n)
                });
            });
            return elt;
        case 'function':
            if (src === formulaireBleuJSXFragment)
                return children.flatMap(createElements);
            else {
                const props = attrs || {};
                return (src as Function)(props, children);
            }
        default:
            throw Error('Unexpected JSX element ' + src);
    }

    function setElementAttribute(elt: HTMLElement, key: string, value: any) {
        if (directProperties.has(key)) {
            elt[key] = value;
        } else {
            if (value === true) value = ""
            if (value === false) elt.removeAttribute(key)
            else elt.setAttribute(key, value);
        }
    }
}

export function For<T>(
    props: {
        each: T[] | IObservable<T[]>
    },
    children: (entry: any, index: number) => JSXSource
) {
    const childZero = children[0];
    if (typeof childZero !== 'function')
        throw new Error("For expects its child to be a function");
    const forContent = new Variable<Node[]>("ForContent", []);
    const update = (eachArray: T[]) => {
        const nodes: Node[] = [];
        eachArray?.forEach((item, index) => {
            nodes.push(...createElements(childZero(item, index)))
        });
        if (nodes.length == 0) nodes.push(document.createComment(getUniqueId('For-placeholder')));
        forContent.setValue(nodes);
    };
    observe(props.each, update, true);
    return forContent;
}

export function render(content: JSXSource, root: HTMLElement = document.body) {
    createElements(content).forEach(n => root.appendChild(n));
}

export function computed<T extends Record<string, any>, R>(
    computationName: string,
    values: { [K in keyof T]: IObservable<T[K]> },
    calculation: (props: T) => R
): IObservable<R> {
    const args = {} as T,
        result = new Variable<R>(computationName, undefined!);
    for (const key in values) {
        const v = values[key];
        args[key] = v.getValue();
        v.addObserver(nv => {
            args[key] = nv;
            let newEntries = calculation(args);
            result.setValue(newEntries);
        });
    }
    result.setValue(calculation(args));
    return result;
}

export function Show(props: { when: IObservable<any> | any, fallback?: any }, children?: JSXSource[]) {
    let when = props.when;
    while (typeof when == 'function') when = when();
    if (when instanceof Observable) {
        const showResult = new Variable("show", undefined);
        observe(when, v => showResult.setValue(v ? children : props.fallback), true);
        return showResult;
    } else {
        return when ? children : props.fallback
    }
}

interface MatchElement<T> {
    props: {
        value?: T;
        fallback?: boolean;
    };
    children: any[];
}

export function Switch<T>(
    props: { when: IObservable<T> | T },
    children: MatchElement<T>[]) {
    const switchContent = new Variable<Node[]>("switchContent", []);
    const update = (value: T) => {
        const matchedChild = children.find(child =>
            child.props?.value !== undefined ? child.props.value === value : child.props?.fallback
        );
        switchContent.setValue(matchedChild ? createElements(matchedChild.children) : []);
    };
    observe(props.when, update, true);
    return switchContent;
}

export function Match<T>(props: { value?: T; fallback?: boolean }, children: any[]) {
    return { props, children };
}


