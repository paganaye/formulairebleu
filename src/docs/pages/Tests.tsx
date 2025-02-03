import { formulaireBleuJSX, formulaireBleuJSXFragment, Value } from "../../core/tiny-jsx";
import Nav from "../components/Nav";
import { IForm } from "../../core/IForm"
import "../../extensions/bootstrap/BootstrapExtension"
import { BootstrapEngine } from "../../extensions/bootstrap/BootstrapEngine"

export default function Tests() {
    let version = new Value("...");
    let error = new Value("");
    (async () => {
        try {
            // let pkg = await import('../../../package.json');
            // setVersion(pkg.version);
        } catch (e) {
            version.setValue((e as Error).message)
        }
    })();

    let form: IForm = {
        name: 'Form1',
        'dataType': { type: 'string' },
        version: "1",
        templates: {}
    }
    let engine = new BootstrapEngine();
    let value = new Value("a")

    return (<>
        <div class="container">
            <Nav />
            <h1>Tests</h1>
            <div>
                <p class="error">{error.getValue()}</p>
                <p>Cette page utilise la toute dernière version {version.getValue()} de la librairie Formulaire Bleu.</p>

                {engine.FormView({ value, form })}
            </div>
        </div>
    </>);
}
