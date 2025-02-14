import { IForm, InferDataType, InferFormType } from '../core/IForm';

let n: InferDataType<{ type: 'number' }> = 5
let b: InferDataType<{ type: 'boolean' }> = false
let s: InferDataType<{ type: 'string' }> = "abc"
let c1: InferDataType<{ type: 'const', value: 5 }> = 5
let c2: InferDataType<{ type: 'const', value: "abc" }> = "abc"
let c3: InferDataType<{ type: 'const', value: true }> = true
let c4: InferDataType<{ type: 'const', value: { a: 1 } }> = { a: 1 }
let d1: InferDataType<{ type: 'date' }> = "2001-02-03"
let a1: InferDataType<{ type: 'array', entryType: { type: 'number' } }> = [1, 2, 3]
let a2: InferDataType<{ type: 'array', entryType: { type: 'string' } }> = ["A", "B"]
let a3: InferDataType<{ type: 'array', entryType: { type: 'array', entryType: { type: 'number' } } }> = [[1], [2, 3]]
let o1: InferDataType<{ type: 'object', membersTypes: [{ key: 'm', type: 'string' }] }> = { m: "abc" }
let o2: InferDataType<{ type: 'object', membersTypes: [{ key: 'm1', type: 'string' }, { key: 'm2', type: 'boolean' }] }> = { m1: "abc", m2: true }
let v1: InferDataType<{ type: 'variant', variants: [{ key: "str", type: 'string' }, { key: "num", type: 'number' }] }>[] = [{ key: "num", value: 5 }, { key: "str", value: 'ABC' }]
let f1: InferFormType<{ name: 'form1', version: '1', dataType: { type: 'number' } }> = 123
let f1v = { name: 'form1', version: '1', dataType: { type: 'number' } } as const satisfies IForm;
let f2: InferFormType<typeof f1v> = 123
