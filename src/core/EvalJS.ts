/* eslint-disable @typescript-eslint/ban-types */

import { IExpr } from "./FormTemplate";

class Const implements IExpr {
    constructor(private value: any) { }
    getValue(_context: IRuntimeContext) { return this.value; }
}

class StringConcat implements IExpr {
    constructor(private parts: IExpr[]) { }
    getValue(context: IRuntimeContext) {
        return this.parts.map(p => {
            let value = context.runtimeContext.runWithErrorHandling(() => {
                return p.getValue(context);
            });
            switch (typeof value) {
                case "function":
                    throw "TODO";
                //return createEjsCallback(value, undefined as any);
                case "object":
                    return JSON.stringify(value);
                default:
                    return value;
            }
        }).join('');
    }
}

class UnaryExpr implements IExpr {
    constructor(private symbol: string, private op: UnaryFunction, private arg1: IExpr) { }
    getValue(context: IRuntimeContext) {
        return this.op(context, this.arg1.getValue(context))
    }
}

class LambdaExpr implements IExpr {
    constructor(private argNames: string[], private content: IExpr) { }
    getValue(context: IRuntimeContext) {
        return (...args: any[]) => {
            let localContext = new LocalContext(context);
            this.argNames.forEach((n, i) => localContext.setVariable(n, args[i]))
            return this.content.getValue(localContext);
        }
    }
}

// https://www.w3schools.com/js/js_precedence.asp
const enum OpPriority {
    NONE,
    ARRAY_ENTRY = 17,
    PLUS_MINUS = 11,
    MUL_DIV_MOD = 12,
    IN = 9,
    INSTANCE_OF = 9,
    COMPARATORS = 9,
    EQ_NEQ = 8,
    BITWISE_AND = 7,
    BITWISE_XOR = 6,
    BITWISE_OR = 5,
    LOGICAL_AND = 4,
    LOGICAL_OR = 3,
    LAMBDA = 2,
    ARROW = 2,
    COMMA = 1
}

class BinaryExpr implements IExpr {
    constructor(private symbol: string, private op: BinaryOp,
        private arg1: IExpr, private arg2: IExpr) { }

    getValue(context: IRuntimeContext) {
        return this.op.binaryFunction(context, this.arg1.getValue(context), this.arg2.getValue(context))
    }
}

class ArrayExpr implements IExpr {
    constructor(private args: IExpr[]) { }
    getValue(context: IRuntimeContext) {
        return this.args.map(a => a.getValue(context));
    }
}

class ObjectExpr implements IExpr {
    constructor(private args: Record<string, IExpr>) { }
    getValue(context: IRuntimeContext) {
        let result: Record<string, any> = {};
        Object.keys(this.args).forEach(k => {
            result[k] = this.args[k].getValue(context);
        })
        return result;
    }
}

class GetVariable implements IExpr {
    constructor(readonly variableName: string) { }
    getValue(context: IRuntimeContext) {
        let value = context.getVariable(this.variableName);
        return value;
    }
}

class GetMember implements IExpr {
    constructor(readonly base: IExpr, readonly memberName: string) { }
    getValue(context: IRuntimeContext) {
        let baseValue = this.base.getValue(context);
        if (baseValue == undefined) return undefined;
        let value = baseValue[this.memberName];
        return value;
    }
}

class CallMethod implements IExpr {
    constructor(readonly thisExpr: IExpr | null, readonly methodName: string, readonly args: IExpr[]) { }
    getValue(context: IRuntimeContext) {
        let methodParent: any, method: any;
        if (this.thisExpr == null) {
            methodParent = null;
            method = context.getVariable(this.methodName)
        }
        else {
            methodParent = this.thisExpr.getValue(context);
            method = methodParent && methodParent[this.methodName]
        }
        if (method) {
            if (typeof method === "function") {
                let thisValue = methodParent;
                let argsValues = this.args.map(a => a.getValue(context));
                let result = method.apply(thisValue, argsValues);
                return result;
            } else {
                throw Error(`${this.methodName} is not a function ${typeof method}`)
            }
        } else {
            if (!methodParent) {
                if (this.thisExpr instanceof GetVariable) methodParent = this.thisExpr.variableName;
                else methodParent = JSON.stringify(this.thisExpr);
            }
            throw Error(`${methodParent} does not have a member called ${this.methodName}`)
        }
    }
}

class Tuple implements IExpr {
    constructor(readonly args: IExpr[]) { }
    getValue(context: IRuntimeContext) {
        return this.args[this.args.length - 1]?.getValue(context);
    }
}
type UnaryFunction = { (context: IRuntimeContext, a: any): any };
type BinaryFunction = { (context: IRuntimeContext, a: any, b: any): any };

const unaryOps: Record<string, UnaryFunction> = {
    "+": (_: any, a: any) => +a,
    "-": (_: any, a: any) => -a,
    "!": (_: any, a: any) => !a,
    typeof: (_: any, a: any) => typeof a
}

interface BinaryOp {
    priority: OpPriority;
    binaryFunction: BinaryFunction;
}

const binaryOps: Record<string, BinaryOp> = {
    "<": { priority: OpPriority.COMPARATORS, binaryFunction: (_, a, b) => a < b },
    "<=": { priority: OpPriority.COMPARATORS, binaryFunction: (_, a, b) => a <= b },
    ">": { priority: OpPriority.COMPARATORS, binaryFunction: (_, a, b) => a > b },
    ">=": { priority: OpPriority.COMPARATORS, binaryFunction: (_, a, b) => a >= b },
    "==": { priority: OpPriority.COMPARATORS, binaryFunction: (_, a, b) => a === b },
    "!=": { priority: OpPriority.EQ_NEQ, binaryFunction: (_, a, b) => a !== b },
    in: { priority: OpPriority.IN, binaryFunction: (_, a, b) => a in b },
    instanceof: { priority: OpPriority.INSTANCE_OF, binaryFunction: (_, a, b) => a instanceof b },
    "+": { priority: OpPriority.PLUS_MINUS, binaryFunction: (_, a, b) => a + b },
    "-": { priority: OpPriority.PLUS_MINUS, binaryFunction: (_, a, b) => a - b },
    "*": { priority: OpPriority.MUL_DIV_MOD, binaryFunction: (_, a, b) => a * b },
    "/": { priority: OpPriority.MUL_DIV_MOD, binaryFunction: (_, a, b) => a / b },
    "%": { priority: OpPriority.MUL_DIV_MOD, binaryFunction: (_, a, b) => a % b },
    "&": { priority: OpPriority.BITWISE_AND, binaryFunction: (_, a, b) => a & b },
    "|": { priority: OpPriority.BITWISE_OR, binaryFunction: (_, a, b) => a | b },
    "^": { priority: OpPriority.BITWISE_XOR, binaryFunction: (_, a, b) => a ^ b },
    "&&": { priority: OpPriority.LOGICAL_AND, binaryFunction: (_, a, b) => a && b },
    "||": { priority: OpPriority.LOGICAL_OR, binaryFunction: (_, a, b) => a || b },
    ",": { priority: OpPriority.COMMA, binaryFunction: (_, a, b) => b },
    arrayEntry: { priority: OpPriority.COMPARATORS, binaryFunction: (_, a, b) => a[b] },
    "=>": { priority: OpPriority.LAMBDA, binaryFunction: (_, a, b) => undefined }
}

export interface ParserOptions {
    mathFunctions: boolean;
    stringify: boolean;
    throwErrors: boolean;
}

interface EvalTemplateOptions {
    startDelimiter: string;
    endDelimiter: string;
}

export interface IRuntimeContext {
    runtimeContext: RuntimeContext;
    getVariable(variableName: string): any;
    setVariable(name: string, value: any): boolean;
}


export class RuntimeContext implements IRuntimeContext {
    public static mathFunctions?: Record<string, Function>;

    readonly scope: Record<string, any> = {}
    runtimeContext: RuntimeContext = this;

    runWithErrorHandling(action: () => any): any {
        if (this.options.throwErrors) {
            return action();
        } else {
            try {
                return action();
            } catch (err) {
                if (err instanceof Error) return err;
                return new Error(err as any);
            }
        }
    }


    constructor(readonly options: ParserOptions = { mathFunctions: true, stringify: true, throwErrors: false }) {
        let globals: Record<string, any> = {}
        if (options.mathFunctions ?? true) {
            if (!RuntimeContext.mathFunctions) {
                let mathFunction: Record<string, any> = RuntimeContext.mathFunctions = {};
                Object.getOwnPropertyNames(Math).forEach((n: any) => mathFunction[n] = (Math as any)[n]);
            }
            Object.assign(globals, RuntimeContext.mathFunctions);
        }
        if (options.stringify ?? true) {
            globals.stringify = JSON.stringify
        }
        this.scope = globals
    }

    getVariable(variableName: string): any {
        let value = this.scope[variableName]
        return value;
    }

    setVariable(name: string, value: any) {
        this.scope[name] = value;
        return true;
    }

    withNewLocalContext(scope: Record<string, any> = {}) {
        return new LocalContext(this, scope);
    }

}

export class LocalContext implements IRuntimeContext {
    readonly runtimeContext: RuntimeContext;

    constructor(readonly parent: IRuntimeContext, readonly scope: Record<string, any> = {}) {
        this.runtimeContext = parent.runtimeContext;
    }


    getVariable(variableName: string): any {
        let value = this.scope[variableName] ?? this.parent.getVariable(variableName);
        return value;
    }

    setVariable(name: string, value: any) {
        if (name in this.scope) {
            this.scope[name] = value;
            return true;
        }
        else return this.parent.setVariable(name, value)
    }

}

export class EvalJS {
    public static defaultOptions = { mathFunctions: true, stringify: true, globalThis: true };

    public static evalTemplate(source: string, context: IRuntimeContext,
        options: EvalTemplateOptions = { startDelimiter: "${", endDelimiter: "}" }): any {
        return context.runtimeContext.runWithErrorHandling(() => {
            let parser = new EvalJS(source);
            let expr = parser.parseStringExpr(options);
            return expr.getValue(context);
        })
    }

    public static parse(source: string | IExpr): IExpr {
        if (typeof source === "string") {
            let parser = new EvalJS(source);
            return parser.parseExpr();
        } else return source;
    }

    public static eval(source: string, context: IRuntimeContext): any {
        let parser = new EvalJS(source);
        let expr = parser.parseExpr();
        if (parser.pos < parser.source.length) throw parser.unexpectedCharacter()
        return context.runtimeContext.runWithErrorHandling(() => {
            return expr.getValue(context);
        })
    }

    private source: string;
    private pos: number;
    private curChar?: string;

    constructor(source: string) {
        this.source = source;
        this.pos = 0;
        this.setCurChar();
    }

    private nextChar(advance: number = 1): string | undefined {
        this.pos += advance;
        return this.setCurChar();
    }

    private peekNextChar() {
        return this.source[this.pos + 1];
    }

    private setCurChar(): string | undefined {
        let c = (this.curChar = this.source[this.pos]);
        return c;
    }

    private skipSpaces() {
        while (this.curChar == " ") this.nextChar();
        return this.curChar;
    }

    private parseExpr(priority: OpPriority = OpPriority.NONE): IExpr {
        let expr = this.parseLeft();
        while (true) {
            let op = this.skipSpaces();
            let nextChar = this.peekNextChar();
            if (op + nextChar in binaryOps) {
                op += nextChar;
            }
            switch (op) {
                case "}":
                case ")":
                case "]":
                case ",":
                case undefined:
                    return expr;
                case "=>":
                    if (priority >= OpPriority.LAMBDA) return expr;
                    this.nextChar(2);
                    let argNames: string[] = [];
                    if (expr instanceof GetVariable) {
                        argNames = [expr.variableName];
                    }
                    else if (expr instanceof Tuple) {
                        argNames = [];
                        expr.args.forEach(a => {
                            if (a instanceof GetVariable) argNames.push(a.variableName);
                            else throw this.unexpectedCharacter("Lamba arguments should only be variable names")
                        })
                    }
                    let content = this.parseExpr(OpPriority.NONE);
                    expr = new LambdaExpr(argNames, content)
                    break;
                default:
                    let binaryOp = binaryOps[op];
                    if (binaryOp) {
                        if (priority >= binaryOp.priority) return expr;
                        this.nextChar(op.length);
                        let expr2 = this.parseExpr(binaryOp.priority);
                        expr = new BinaryExpr(op, binaryOp, expr, expr2)
                    } else throw this.unexpectedCharacter(` Operator "${op} does not exist.".`);
            }
        }
    }

    private parseLeft(): IExpr {
        let result: IExpr;
        let c = this.skipSpaces();
        if (c && c in unaryOps) {
            this.nextChar();
            return new UnaryExpr(c, unaryOps[c], this.parseLeft())
        }
        if (c == undefined) throw this.unexpectedCharacter();
        if ((c >= "0" && c <= "9") || c == ".") result = new Const(this.parseNumber());
        else if (c == '"' || c == "'" || c == "`") result = this.parseQuotedString();
        else if (c == "[") {
            this.nextChar();
            result = new ArrayExpr(this.parseCommaDelimitedExpr("]"));
        } else if (c == "{") {
            result = this.parseJSONObject();
        } else if (c == "(") {
            let curChar = this.nextChar();
            if (curChar == ")") {
                result = new Tuple([]);
            } else {
                result = this.parseExpr();
                if (this.curChar == ",") {
                    let args: IExpr[] = [result];
                    while (this.curChar == ",") {
                        this.nextChar();
                        args.push(this.parseExpr());
                    }
                    result = new Tuple(args);
                }
            }
            this.expectCharacter(")");
        } else if (
            (c >= "a" && c <= "z") ||
            (c >= "A" && c <= "Z") ||
            c == "$" ||
            c == "_"
        )
            result = this.parseGetVariableOrGlobalFunctionCall();
        else throw this.unexpectedCharacter();
        c = this.skipSpaces();
        while (c == "." || c == "[") {
            this.nextChar();
            switch (c) {
                case ".":
                    result = this.parseGetMemberOrMethodCall(result);
                    break;
                case "[":
                    let idx = this.parseExpr();
                    this.expectCharacter("]");
                    result = new BinaryExpr("[]", binaryOps.arrayEntry, result, idx)
                    break;
            }
            c = this.skipSpaces();
        }
        return result;
    }

    private parseQuotedString(): IExpr {
        let quote = this.curChar!!;
        let c = this.nextChar();
        let startPos = this.pos;
        let exprs: IExpr[] | undefined;
        while (c && c !== quote) {
            if (c == "$" && this.peekNextChar() == "{") {
                this.expectCharacter("$")
                this.expectCharacter("{")
                if (!exprs) exprs = [];
                let string = this.source.substring(startPos, this.pos - 2);
                if (string.length) exprs.push(new Const(string));
                let expr = this.parseExpr();
                exprs.push(expr);
                this.expectCharacter("}")!
                startPos = this.pos;
                c = this.curChar!;
            } else {
                c = this.nextChar();
            }
        }
        let string = this.source.substring(startPos, this.pos);
        if (exprs && string.length) exprs.push(new Const(string));
        this.expectCharacter(quote);
        return exprs ? new StringConcat(exprs) : new Const(string);
    }

    private parseIdentifierName() {
        let startPos = this.pos;
        let c: string | undefined;
        do {
            c = this.nextChar();
        } while (
            (c != undefined) &&
            ((c >= "a" && c <= "z") ||
                (c >= "A" && c <= "Z") ||
                c == "$" ||
                c == "_" ||
                (c >= "0" && c <= "9"))
        );
        let identifier = this.source.substring(startPos, this.pos);
        if (identifier.length == 0)
            throw this.unexpectedCharacter(" Was expecting an indentifier.");
        return identifier;
    }

    private parseGetVariableOrGlobalFunctionCall(): IExpr {
        let identifierName = this.parseIdentifierName();
        if (this.curChar == "(") {
            this.expectCharacter("(");
            let args = this.parseCommaDelimitedExpr(")");
            return new CallMethod(null, identifierName, args);

        } else {
            return new GetVariable(identifierName);
        }
    }

    private parseGetMemberOrMethodCall(base: IExpr): IExpr {
        let identifierName = this.parseIdentifierName();
        if (this.curChar == "(") {
            this.expectCharacter("(");
            let args = this.parseCommaDelimitedExpr(")");
            return new CallMethod(base, identifierName, args);
        } else {
            return new GetMember(base, identifierName);
        }
    }

    private parseCommaDelimitedExpr(endChar: string): IExpr[] {
        let exprs: IExpr[] = [];
        while (this.curChar && this.curChar != endChar) {
            exprs.push(this.parseExpr());
            if (this.curChar == ",") this.nextChar();
            else if (this.curChar != endChar)
                throw this.unexpectedCharacter(
                    ` Was expecting a ","" or a "${endChar}".`
                );
        }
        this.expectCharacter(endChar);
        return exprs;
    }

    private parseJSONObject(): IExpr {
        this.expectCharacter("{");
        let result = {};

        while (this.curChar && this.curChar != "}") {
            this.skipSpaces();
            let name = this.parseIdentifierName();
            let c = this.skipSpaces();
            let value: any;
            if (c == ":") {
                this.nextChar();
                value = this.parseExpr();
            } else {
                value = new GetVariable(name);
            }
            (result as any)[name] = value;
            c = this.curChar;
            if (c == ",") this.nextChar();
            else if (c == "}") break;
            else throw this.unexpectedCharacter(` Was expecting a "," or a "}".`);
        }
        this.expectCharacter("}");
        return new ObjectExpr(result);
    }

    private parseNumber() {
        let startPos = this.pos;
        let c: string | undefined = this.curChar;
        while (c != undefined && c >= "0" && c <= "9") {
            c = this.nextChar();
        }
        if (c == ".") c = this.nextChar();
        while (c != undefined && c >= "0" && c <= "9") {
            c = this.nextChar();
        }
        let numberSource = this.source.substring(startPos, this.pos);
        return parseFloat(numberSource);
    }

    private unexpectedCharacter(msg?: string | undefined) {
        return Error(
            `Unexpected ${this.curChar === undefined ? "end of formula" : `character "${this.curChar}"`} at position ${this.pos}.${msg}`
        );
    }

    private parseStringExpr(options: EvalTemplateOptions): IExpr {
        let fragments: IExpr[] = [];
        while (true) {
            let startExpr = this.source.indexOf(options.startDelimiter, this.pos);
            if (startExpr >= 0) {
                let stringFragment = this.source.substring(this.pos, startExpr);
                if (stringFragment.length > 0) {
                    fragments.push(new Const(stringFragment));
                }
                this.pos = startExpr + options.startDelimiter.length;
                this.setCurChar();
                let exprFragment = this.parseExpr();
                fragments.push(exprFragment);
                this.expectCharacter(options.endDelimiter);
            } else {
                let stringFragment = this.source.substring(this.pos);
                if (stringFragment.length > 0) {
                    fragments.push(new Const(stringFragment));
                }
                break;
            }
        }
        return new StringConcat(fragments);
    }

    private expectCharacter(c: string) {
        let actual = ''
        for (let i = 0; i < c.length; i++) {
            actual += this.curChar;
            this.nextChar();
        }
        if (actual != c) throw this.unexpectedCharacter(` Was expecting "${c}", but found ${actual}`);
    }
}
