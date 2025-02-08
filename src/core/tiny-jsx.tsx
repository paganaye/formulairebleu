export type JSONPrimitive = number | string | null | boolean;
export type JSONArray = JSONValue[];
export type JSONObject = { [key: string]: JSONValue };
export type JSONValue = JSONPrimitive | JSONArray | JSONObject;

export class formulaireBleuJSXFragment { }

export type JSXSource = JSONValue | Node | (() => JSXSource) | Value<JSXSource>;

export type Observer<T> = (newValue: T) => void



export class Value<T = any> {
    #observers?: Set<Observer<T>>;
    #value: T;
    constructor(value: T) { this.#value = value; }
    getValue(): T { return this.#value; }
    setValue(newValue: T): void {
        if (newValue === this.#value) return
        this.#value = newValue;
        this.notifyObservers();
    }

    addObserver(observer: Observer<T>) {
        (this.#observers || (this.#observers = new Set())).add(observer);
    }

    // removeObserver(observer: Observer<T>) {
    //     this.#observers?.delete(observer);
    //     // observer.observedValues.delete(this);
    // }

    notifyObservers() {
        this.#observers?.forEach(observer => observer(this.#value));
    }
}



function observe<T>(source: T | Value<T>, update: (value: T) => void, init: boolean): void {
    if (source instanceof Value) {
        if (init) update(source.getValue());
        source.addObserver(update);
    } else {
        update(source);
    }
}

function createElements(source: JSXSource): Node[] {
    if (source === undefined) return [document.createComment("undefined")];
    if (source === null) return [document.createComment("null")];
    const type = typeof source;
    if (['string', 'number', 'boolean'].includes(type))
        return [document.createTextNode(source.toString())];
    if (type == 'object') {
        if (source instanceof Value) {
            let elts = createElements(source.getValue());
            const observer = (val: any) => {
                const parent = elts[0]?.parentNode;
                const next = elts[elts.length - 1]?.nextSibling;
                const newElts = createElements(val);
                if (parent) {
                    elts.forEach(n => parent.removeChild(n));
                    newElts.forEach(n => parent.insertBefore(n, next));
                }
                elts = newElts;
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

export type JsxComponent<TProps = Record<string, any>> = ((props: TProps, children?: JSXSource[]) => Node | Node[]);

export function formulaireBleuJSX(
    src: string | JsxComponent<any> | formulaireBleuJSXFragment,
    attrs?: Record<string, JSXSource>,
    ...children: JSXSource[]
): Node | Node[] {
    switch (typeof src) {
        case 'string':
            const elt = document.createElement(src);
            if (attrs) {
                Object.keys(attrs).forEach(k => {
                    let v = attrs[k];
                    if (k.startsWith("on") && typeof v === "function")
                        elt.addEventListener(k.slice(2).toLowerCase(), v);
                    else {
                        if (v === undefined) v = "";
                        if (v instanceof Value) {
                            observe(v, (v) => {
                                if (v === true) v = ""
                                if (v === false) elt.removeAttribute(k)
                                else elt.setAttribute(k, v as string)
                            }, true)
                        } else {
                            if (v == true) v = "";
                            if (v !== false) elt.setAttribute(k, v as any);
                        }
                    }
                });
            }
            children.forEach(child =>
                createElements(child).forEach(n => elt.appendChild(n))
            );
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
}

export function For<T>(
    props: { each: T[] | Value<T[]> },
    children: (entry: any, index: number) => JSXSource
) {
    const childZero = children[0];
    if (typeof childZero !== 'function')
        throw new Error("For expects its child to be a function");
    const result = new Value<Node[]>([]);
    const update = (eachArray: T[]) => {
        const nodes: Node[] = [];
        eachArray.forEach((item, index) =>
            nodes.push(...createElements(childZero(item, index)))
        );
        if (nodes.length == 0) nodes.push(document.createComment('placeholder'));
        result.setValue(nodes);
    };
    observe(props.each, update, true);
    return result;
}

export function render(content: JSXSource, root: HTMLElement = document.body) {
    createElements(content).forEach(n => root.appendChild(n));
}

export function computed<T extends Record<string, any>, R>(
    values: { [K in keyof T]: Value<T[K]> },
    calculation: (props: T) => R
): Value<R> {
    const args = {} as T, result = new Value<R>(undefined!);
    for (const key in values) {
        const v = values[key];
        args[key] = v.getValue();
        v.addObserver(nv => {
            args[key] = nv;
            result.setValue(calculation(args));
        });
    }
    result.setValue(calculation(args));
    return result;
}

export function Show(props: { when: Value<any> | any, fallback?: any }, children?: any[]) {
    const result = new Value(undefined);
    observe(props.when, v => result.setValue(v ? children : props.fallback), true);
    return result;
}

export function Switch<T>(
    props: { when: Value<T> | T },
    children: any[]) {
    const result = new Value<Node[]>([]);
    const update = (value: T) => {
        const matchedChild = children.find(child =>
            child.props?.value !== undefined ? child.props.value === value : child.props?.fallback
        );
        result.setValue(matchedChild ? createElements(matchedChild.children) : []);
    };
    observe(props.when, update, true);
    return result;
}

export function Match<T>(props: { value?: T; fallback?: boolean }, children: any[]) {
    return { props, children };
}

