import { formulaireBleuJSX, formulaireBleuJSXFragment } from "../../core/tiny-jsx";
import Nav from "../components/Nav";

export default function NotFound() {
    return (<>
        <div class="container">
            <Nav />
            <h1>Cette page n'existe pas</h1>
        </div>
    </>);
}
