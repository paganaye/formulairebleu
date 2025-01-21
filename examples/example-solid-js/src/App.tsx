import { createSignal } from 'solid-js'


import { FormVue, IBootstrapForm, ISelectionList } from 'formulairebleu';

let stringList1: ISelectionList = {
  multiple: false,
  entries: [
    { value: "1", label: "Un" },
    { value: "2", label: "Deux" }
  ]
}

let numberList1: ISelectionList = {
  entries: [
    { value: "1", label: "Un" },
    { value: "2", label: "Deux" }
  ]
}


let form1: IBootstrapForm = {
  name: 'MyFirstForm',
  version: '1',
  dataType: {
    type: 'object',
    membersTypes: [
      { key: 'a1', type: 'string', selectionList: stringList1, view: { type: 'selectionList' } },
      { key: 'b1', type: 'number', selectionList: numberList1, view: { type: 'selectionList' } },
      { key: 'c1', type: 'boolean', selectionList: numberList1, view: { type: 'selectionList' } },

    ]
  }
}

let [getValue, setValue] = createSignal({})
// let elt = FormVue({ form: form1, value: getValue(), setValue })
// console.log({ elt, t: typeof elt });


function App() {

  return (
    <>
      <p>Hi</p>
      {"this is " + "solid.js"}
      <FormVue form={form1} value={getValue()} setValue={setValue} />
      <p>hi<b>Poulain</b></p>
    </>
  )
}

export default App
