import {FormVue} from "formulairebleu"

function setValue(a) {
  console.log(a);
}
let formVue = FormVue({
  form: {
    name: "form1",
    version: '1',
    dataType: {
      type: 'object',
      membersTypes: [
        { key: 'A', type: 'string' },
        { key: 'B', type: 'number' },
        { key: 'C', type: 'boolean' }
      ]
    }
  }, value: {}, setValue
})

document.body.append(formVue);
