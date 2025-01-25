import { createSignal } from 'solid-js'
import { FormVue } from '../bootstrap/FormVue'
import { IBootstrapForm } from '../bootstrap/IBootstrapForm'
import { ensureBootstrapLoaded } from '../bootstrap/ensureBootstrapLoaded'


ensureBootstrapLoaded();


let form1: IBootstrapForm = {
    name: 'form1',
    version: '1',
    dataType: {
        type: 'object',
        help: "This is an object wit str1, num1, date1 and bool1 members.",
        label: "Object1 label here",
        membersTypes: [
            {
                key: 'o1',
                type: 'object',
                help: "This is an object wit str1, num1, date1 and bool1 members.",
                label: "Object1 label here",
                membersTypes: [
                    { key: 'str1', type: 'string', label: 'A simple string', help: 'Here you can enter an unconstrained string with default view.' },
                    { key: 'num1', type: 'number', label: 'A simple number', help: 'Here you can enter an unconstrained number with default view.' },
                    { key: 'bool1', type: 'boolean', label: 'A simple boolean', help: 'Here you can enter an unconstrained boolean with default view.' },
                    { key: 'date1', type: 'date', label: 'A simple date', help: 'Here you can enter an unconstrained boolean with default view.' },
                ]
            },
            {
                key: 'o2',
                type: 'object',
                help: "This is an object wit str2, num2, date2 and bool2 members.",
                label: "Object2 label here",
                membersTypes: [
                    { key: 'str1', type: 'string', label: 'A simple string', defaultValue: "A", help: 'Here you can enter an unconstrained string with default view.' },
                    { key: 'num1', type: 'number', label: 'A simple number', defaultValue: 123, help: 'Here you can enter an unconstrained number with default view.' },
                    { key: 'bool1', type: 'boolean', label: 'A simple boolean', defaultValue: false, help: 'Here you can enter an unconstrained boolean with default view.' },
                    { key: 'date1', type: 'date', label: 'A simple date', defaultValue: "", help: 'Here you can enter an unconstrained boolean with default view.' },
                ]
            },
            {
                key: 'o3',
                type: 'array',
                help: "This is an object wit str2, num2, date2 and bool2 members.",
                label: "Object2 label here",
                entryType: {
                    type: 'object',
                    membersTypes: [
                        { key: 'str1', type: 'string', label: 'A simple string', defaultValue: "A", help: 'Here you can enter an unconstrained string with default view.' },
                        { key: 'num1', type: 'number', label: 'A simple number', defaultValue: 123, help: 'Here you can enter an unconstrained number with default view.' },
                        { key: 'bool1', type: 'boolean', label: 'A simple boolean', defaultValue: false, help: 'Here you can enter an unconstrained boolean with default view.' },
                        { key: 'date1', type: 'date', label: 'A simple date', defaultValue: "", help: 'Here you can enter an unconstrained boolean with default view.' },
                    ]
                }
            },
            {
                key: 'o3',
                type: 'variant',
                help: "This is an object wit str2, num2, date2 and bool2 members.",
                label: "Object2 label here",
                variants: [
                    { key: 'str1', type: 'string', label: 'A simple string', defaultValue: "A", help: 'Here you can enter an unconstrained string with default view.' },
                    { key: 'num1', type: 'number', label: 'A simple number', defaultValue: 123, help: 'Here you can enter an unconstrained number with default view.' },
                    { key: 'bool1', type: 'boolean', label: 'A simple boolean', defaultValue: false, help: 'Here you can enter an unconstrained boolean with default view.' },
                    { key: 'date1', type: 'date', label: 'A simple date', defaultValue: "", help: 'Here you can enter an unconstrained boolean with default view.' },
                ]

            }
        ]
    }
}

form1 = {
    name: 'MyFirstForm',
    version: '1',
    dataType: {
        type: 'time', label: 'A simple date', help: 'Here you can enter an unconstrained boolean with default view.'
    }
}


let [getValue, setValue] = createSignal({ type: "date " })


function App() {

    return (
        <>
            <p>Hi I don't reall need all this</p>
            {"this is " + "solid.js"}
            <FormVue form={form1} value={getValue()} setValue={setValue} />
        </>
    )
}

export default App
