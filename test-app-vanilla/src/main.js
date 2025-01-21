import * as FB from "formulairebleu"

console.log(FB.FormVue);
setTimeout(() => {
  function setValue(a) {
    console.log(a);
  }
  let form = FB.FormVue({
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

  document.body.append(form);
}, 2000);
