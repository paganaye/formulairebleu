import { createSignal } from "solid-js";
import Nav from "../components/Nav";
import { formulairebleu } from "../../core/IForm"
import "../../extensions/bootstrap/BootstrapExtension"
import { BootstrapEngine } from "../../extensions/bootstrap/BootstrapEngine"

export default function Tests() {
    let [getVersion, setVersion] = createSignal("...");
    let [getError, setError] = createSignal("");
    (async () => {
        try {
            let pkg = await import('../../../package.json');
            setVersion(pkg.version);
        } catch (e) {
            setVersion((e as Error).message)
        }
    })();

    let form: formulairebleu.IForm = {
        name: 'Form1',
        'dataType': { type: 'string' },
        version: "1",
        templates: {}
    }
    let engine = new BootstrapEngine();
    let [value, _setValue] = createSignal("a")
    function setValue(v: string) {
        _setValue(v);
    }
    return (<>
        <div class="container">
            <Nav />
            <h1>Tests</h1>
            <div>
                <p class="error">{getError()}</p>
                <p>Cette page utilise la toute dernière version {getVersion()} de la librairie Formulaire Bleu.</p>

                {engine.FormView({ value: value(), setValue, form })}
            </div>
        </div>
    </>);
}
