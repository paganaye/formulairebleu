import { A, formulaireBleuJSXFactory, formulaireBleuJSXFragmentFactory } from "../../core/jsx";
import Nav from "../components/Nav";

export default function Home() {
    return (<>
        <div class="container">
            <Nav />
            <h1>Formulaire Bleu</h1>
            <p>Formulaire Bleu est une librairie de formulaires qui vous permet de créer des formulaires pour vos pages web ou vos applications Google Apps en toute simplicité.
                Avec Formulaire Bleu, vous prenez soin à la fois du créateur du formulaire et de ses utilisateurs.</p>
        </div>
    </>);
}
