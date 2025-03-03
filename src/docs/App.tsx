import { computed, formulaireBleuJSX, formulaireBleuJSXFragment } from '../core/tiny-jsx'
import { currentPage } from './components/A';
import About from './pages/About';
import FormEditor from './pages/FormEditor';
import Home from "./pages/Home";
import NotFound from './pages/NotFound';
import Tests from './pages/Tests';
import "../extensions/bootstrap/BootstrapEngine"
import { BootstrapEngine } from "../extensions/bootstrap/BootstrapEngine";

export let demoFormEngine = new BootstrapEngine()

export default function App() {

    return computed("router", { currentPage }, (p) => {
        switch (p.currentPage) {
            case "": return <Home />
            case '#about': return <About />
            case '#form-editor': return <FormEditor />
            case '#tests': return <Tests />
            default: return <NotFound />
        }
    });

}

