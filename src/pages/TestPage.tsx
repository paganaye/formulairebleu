import { Component, createSignal } from "solid-js";
import { FormTemplate } from "../core/FormTemplate";
import FormComponent from "../components/FormComponent";

const TestPage: Component = () => {
  let x: FormTemplate = {
    type: 'form',
    title: 'voici Form1',
    sections: [
      {
        type: 'section', title: 'section1',
        lines: [
          {
            key: 'a', type: 'text', label: {
              label: 'number A', help: "Should be between 1 to 5",
              required: "*"
            },
            viewAs: "richtext"
          },
          {
            key: 'b1', type: 'select', label: 'select B1', options: {
              type: 'strings',
              strings: [{ value: "A" }, { value: "B" }, { value: "C" }]
            }
          },
          {
            key: 'b2', type: 'select', label: 'select B2',
            viewAs: "radios",
            options: {
              type: 'strings',
              strings: [{ value: "A" }, { value: "B" }, { value: "C" }]
            }
          },
          {
            key: 'c', type: 'array', label: "Une liste d'ingrédients", columns: [
              { type: 'text', key: 'nom', label: "nom" },
              { type: 'number', key: 'quantité', label: "quantité" }
            ],
            item: "ingrédient",
            viewAs: "linear"
          },
        ],
        newPage: false,
      },
      {
        type: 'section', title: 'section2',
        lines: [
          { type: 'text', label: 'text D', key: 'd' },
        ],
        newPage: false
      },
      {
        key: 'section3',
        type: 'section', title: 'section3',
        lines: [
          { key: "e", type: 'number', label: 'number e' },
          { key: "f", type: 'number', label: 'number f' },
        ],
        newPage: true
      }
    ]
  };
  console.log(x);

  const [value, setValue] = createSignal({
    a: { "ops": [{ "insert": "Hello " }, { "attributes": { "bold": true }, "insert": "World" }] },
    b: 2, c: [{ t: "t1" }, { t: "t2" }], section3: { d: 123, e: 22, f: 33 }
  });
  const [message, setMessage] = createSignal('');

  function onPropertyChanged(k: string, v: any) {
    setMessage(k + "=" + JSON.stringify(v));
  }
  function onSetValue(newValue: any) {
    setValue(newValue)
  }
  return (
    <div >
      <h1>Test Page</h1>
      <p>{message()}</p>
      <pre>{JSON.stringify(value())}</pre>
      <hr />
      <FormComponent template={x} value={value()} setValue={onSetValue}
        onPropertyChanged={onPropertyChanged} />
    </div>
  );
};

export default TestPage;

