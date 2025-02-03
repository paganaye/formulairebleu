type ValueChangedHandler = (() => void);

export class Value<T = any> {
    #value: T;
    #observers: ValueChangedHandler[] | undefined;

    constructor(value: T) {
        this.#value = value;
    }

    getValue() {
        console.log("getValue", this.#value, spyStack)
        return this.#value;
    }

    setValue(value: T) {
        this.#value = value;
        if (this.#observers) {
            for (let observerCallback of this.#observers) {
                observerCallback();
            }
        }
    }

    addObserver(observer: ValueChangedHandler) {
        if (!this.#observers) this.#observers = [observer];
        else this.#observers.push(observer);
    }
}

export type Accessor<T = any> = () => T;
export type Setter<T = any> = (v: T | ((prev: T) => void)) => void;

export type Component<T> = (props: any) => any;

export function createEffect(action: (() => void)): any {
    action();
}

export function createMemo<T>(action: (() => T)): Value<T> {
    let actionResult = action();
    let result = new Value(actionResult);
    return result;
}

export namespace JSX {
    export type Element = HTMLElement;
}

export class JSXElement { }
export function Dynamic(...args: any[]) { }

export function Show(props: { when: boolean | Value<boolean> | any, fallback?: any /*, children: any, fallback?: any*/ }) {
    const container = document.createDocumentFragment();

    function renderContent() {
        // Clear previous content
        // while (container.firstChild) container.removeChild(container.firstChild);
        // const condition = props.when instanceof Value ? props.when.getValue() : props.when;
        // let content = condition ? props.children : props.fallback;
        // if (content === undefined || content === null) content = document.createComment("empty");
        // if (typeof content === 'function') content = content();
        // if (Array.isArray(content)) {
        //     content.forEach(child => container.appendChild(renderChild(child)));
        // } else {
        //     container.appendChild(renderChild(content));
        // }
    }

    renderContent();
    if (props.when instanceof Value) props.when.addObserver(renderContent);
    return container;

    function renderChild(child: any): Node {
        if (child instanceof Node) return child;
        if (typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean')
            return document.createTextNode(child.toString());
        if (child instanceof Value) {
            const node = document.createTextNode(child.getValue()?.toString() ?? '');
            child.addObserver(() => {
                const newNode = document.createTextNode(child.getValue()?.toString() ?? '');
                if (node.parentNode) node.parentNode.replaceChild(newNode, node);
            });
            return node;
        }
        if (typeof child === 'function') return renderChild(child());
        if (Array.isArray(child)) {
            const frag = document.createDocumentFragment();
            child.forEach(c => frag.appendChild(renderChild(c)));
            return frag;
        }
        throw Error('Unexpected child type in Show: ' + child);
    }
}

export function For<T>(props: { each: T[] | Value<T[]>/*, children: (item: T, index: number) => any*/ }) {
    const container = document.createDocumentFragment();

    function renderList() {
        // Clear previous content
        while (container.firstChild) container.removeChild(container.firstChild);
        const list = props.each instanceof Value ? props.each.getValue() : props.each;
        for (let item of list) {
            let childElt: Node | Value = createElement(item);
            if (childElt instanceof Value) {
                childElt.addObserver(() => {
                    let val = childElt.getValue();
                    const newElt = createElement(val);
                    container.replaceChild(newElt, childElt);
                })
            }
            addChild(container, childElt);
        }
    }

    renderList();
    return container;
}

export function A(...args: any[]) { }

export function formulaireBleuJSXFactory(src: HTMLElement | string | (() => HTMLElement) | formulaireBleuJSXFragmentFactory,
    attrs?: Record<string, any>,
    ...children: any[]) {
    return spy(typeof src === 'string' ? src : 'name' in src ? src.name : String(src), () => {
        let elt: HTMLElement | DocumentFragment;
        let attrsProcessed = false;
        switch (typeof src) {
            case 'string':
                elt = document.createElement(src);
                break;
            case 'function':
                if (src === formulaireBleuJSXFragmentFactory) {
                    elt = document.createDocumentFragment();
                } else {
                    let props = {};
                    if (attrs) {
                        for (let k of Object.keys(attrs)) {
                            let v = attrs[k];
                            props[k] = v;
                        }
                    }
                    attrsProcessed = true;
                    elt = (src as any)(props as any)
                }
                break;
            default:

                throw Error('Unexpected JSX element ' + elt)
        }
        if (attrs && !attrsProcessed) {
            for (let k of Object.keys(attrs)) {
                let v = attrs[k];
                if (elt instanceof DocumentFragment) throw Error("Document fragment cannot have attributes")
                elt.setAttribute(k, v);
            }
        }
        if (children) {
            for (let child of children) {
                addChild(elt, child)
            }
        }
        return elt;
    })
}

function createElement(source: any): Node {
    switch (typeof source) {
        case 'string':
        case 'number':
        case 'boolean':
            return document.createTextNode(source.toString());
        case 'undefined':
            return document.createComment("undefined");
        case 'function':
            return createElement(source());
        default:
            if (source == null) {
                return document.createComment("null");
            } else if (source instanceof Node) {
                return source;
            } else if (source instanceof Value) {
                let val = source.getValue();
                return val == undefined ? document.createComment("---") : createElement(val);
            } else {
                throw Error('Unexpected JSX child ' + source);
            }
    }
}

function addChild(parent: HTMLElement | DocumentFragment, child: any): Node {
    let childElt: Node = createElement(child)
    if (child instanceof Value) {
        child.addObserver(() => {
            let val = child.getValue();
            const newElt = createElement(val);
            parent.replaceChild(newElt, childElt);
            childElt = newElt;
        });
    }
    parent.appendChild(childElt);
    return childElt;
}

export class formulaireBleuJSXFragmentFactory { }

interface ISpy {
    name: string;
}

const spyStack: ISpy[] = []

function spy<T>(name: string, action: () => T): T {
    console.log("Enter " + name)
    spyStack.push({ name })
    let res = action();
    spyStack.pop();
    console.log("Left " + name)
    return res;
}

export function render(content: JSXElement | (() => JSXElement), root: HTMLElement = document.body) {
    return spy("render", () => {
        let contentValue = createElement(content)
        root.appendChild(contentValue as any)
    })
}



export function dynamic(values: Value[], callBack: () => any) {
    for (let v of values) {
        v.addObserver(() => {
            callBack();
        })
    }
}