import { formulaireBleuJSX, formulaireBleuJSXFragment, Value } from "../../core/tiny-jsx";
import Nav from "../components/Nav";

export default function Tests() {
    let testIframe = new Value<HTMLIFrameElement>("testIframe");
    testIframe.addObserver(iframe => {
        if (iframe && iframe.contentDocument) {
            iframe.contentDocument.open();
            iframe.contentDocument.write(`
<p>hi</p>
<script>        
    window.addEventListener("message", (event) => {
        if (event.origin !== window.location.origin) return;
        console.log("Message reçu :", event.data);

        // Réponse vers la page principale
        event.source.postMessage("Réponse depuis l'iframe", event.origin);
    });
</script>
`);
            iframe.contentDocument.close();

            iframe.contentWindow.postMessage("hello iframe", "*");
            window.addEventListener("message", (event) => {
                if (event.origin !== window.location.origin) return; // Sécurité
                console.log("Message reçu depuis l'iframe :", event.data);
            });

        }
    })

    return (<>
        <Nav />
        <h1>Tests</h1>
        <div class="container">

            <iframe ref={testIframe}></iframe>
        </div>
    </>);
}
