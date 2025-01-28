import { formulairebleu } from '../../../src/core/IForm'
import '../../../src/extensions/bootstrap/BootstrapExtension'

let x: formulairebleu.INumberViews = undefined as any;
x.mynumber1 = { type: 'mynumber1', min: 1 }

let y: keyof formulairebleu.INumberViews;
y = 'mynumber1';

export type INumberViews = formulairebleu.INumberViews[keyof formulairebleu.INumberViews];
let z: INumberViews;

let w: formulairebleu.INumberType = undefined as any;

w.view = { type: 'mynumber1', min: 1 }

let f: formulairebleu.IForm;

f = {
  name: 'a',
  version: '1',
  dataType: { type: 'boolean', view: { type: 'switch' } }
}

// let x: formulairebleu.IFormType = {} as any;

// let stringList1: ISelectionList = {
//   multiple: false,
//   entries: [
//     { value: "1", label: "Un" },
//     { value: "2", label: "Deux" }
//   ]
// }


// let form1: ICoreForm = {
//   name: 'MyFirstForm',
//   version: '1',
//   dataType: {
//     type: 'object',
//     membersTypes: [
//       { key: 'a1', type: 'string', selectionList: stringList1, view: { type: 'string' } },
//       { key: 'b1', type: 'number', selectionList: stringList1, view: { type: 'number' } },
//       { key: 'c1', type: 'boolean', selectionList: stringList1, view: { type: 'boolean' } },
//     ]
//   }
// }

// let [getValue, setValue] = createSignal({})
// // let elt = FormVue({ form: form1, value: getValue(), setValue })
// // console.log({ elt, t: typeof elt });


function App() {

  //       <p>Hi</p>
  //       {"this is " + "solid.js"}
  //       <BootstrapFormVue form={form1} value={getValue()} setValue={setValue} />
  //       <p>hi<b>Poulain</b></p>

  return (
    <>
      hello
    </>
  )
}

export default App
