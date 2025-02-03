export type JSONPrimitive = number | string | null | boolean;
export type JSONArray = JSONValue[];
export type JSONObject = { [key: string]: JSONValue };
export type JSONValue = JSONPrimitive | JSONArray | JSONObject;

export class formulaireBleuJSXFragment { }

export type JSXSource = JSONValue | Node | (() => JSXSource) | Value<JSXSource>;

export class Observer<T = any> {
    constructor(readonly onValueChanged: (newValue: T) => void) { }
}

export class Value<T = any> {
    #observers?: Set<Observer<T>>;
    #value: T;
    constructor(value: T) { this.#value = value; }
    getValue() { return this.#value; }
    setValue(value: T) { this.#value = value; this.notifyObservers(); }

    addObserver(observer: Observer<T>) {
        (this.#observers || (this.#observers = new Set())).add(observer);
    }

    toString() {
        return this.#value.toString()
    }

    // removeObserver(observer: Observer<T>) {
    //     this.#observers?.delete(observer);
    //     // observer.observedValues.delete(this);
    // }

    notifyObservers() {
        this.#observers?.forEach(observer => observer.onValueChanged(this.#value));
    }
}

function observe<T>(source: T | Value<T>, update: (value: T) => void): void {
    if (source instanceof Value) {
        update(source.getValue());
        source.addObserver(new Observer(update));
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
            observe(source, observer);
            return elts;
        }
        if (Array.isArray(source))
            return source.flatMap(createElements);
        if (source instanceof Node)
            return [source];
        return [document.createTextNode(JSON.stringify(source))];
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
                            })
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
    const renderItem = children[0];
    if (typeof renderItem !== 'function')
        throw new Error("For expects its child to be a function");
    const result = new Value<Node[]>([]);
    const update = (eachArray: T[]) => {
        const nodes: Node[] = [];
        eachArray.forEach((item, index) =>
            nodes.push(...createElements(renderItem(item, index)))
        );
        result.setValue(nodes);
    };
    observe(props.each, update);
    return result;
}

export function render(content: JSXSource, root: HTMLElement = document.body) {
    createElements(content).forEach(n => root.appendChild(n));
}

export function computed<T extends Record<string, any>, R>(
    values: { [K in keyof T]: Value<T[K]> },
    calculation: (props: T) => R
): Value<R> {
    const calcResult = () => calculation(Object.fromEntries(
        Object.entries(values).map(([key, v]) => [key, v.getValue()])
    ) as T);
    const result = new Value<R>(calcResult());
    Object.values(values).forEach(v => observe(v, () => result.setValue(calcResult())));
    return result;
}

export function Show(props: { when: Value<any> | any, fallback?: any }, children?: any[]) {
    const result = new Value(undefined);
    observe(props.when, v => result.setValue(v ? children : props.fallback));
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
    observe(props.when, update);
    return result;
}

export function Match<T>(props: { value?: T; fallback?: boolean }, children: any[]) {
    return { props, children };
}

