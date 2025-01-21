import { createSignal } from 'solid-js'


import { IForm, FormVue } from 'formulairebleu';

let form1: IForm = {
  name: 'MyFirstForm',
  version: '1',
  dataType: {
    type: 'object',
    membersTypes: [
      { key: 'a', type: 'string' },
      { key: 'b', type: 'number' },
      { key: 'c', type: 'boolean' },
    ]
  }
}

let [getValue, setValue] = createSignal({})

// let elt = FormVue({ form: form1, value: getValue(), setValue })
// console.log({ elt, t: typeof elt });


function App() {

  return (
    <>
      <FormVue form={form1} value={getValue()} setValue={setValue} />
    </>
  )
}

export default App
