import Nav from "../components/Nav";

export default function About() {
    return (<>
        <div class="container">
            <Nav />
            <h1>A propos de Formulaire Bleu</h1>
            <p>Formulaire bleu est développé par Pascal GANAYE</p>
            <p>Formulaire Bleu ne stocke pas vos données. Vos formulaires et leurs données résident sur votre propre fichier Google Docs ou sur votre serveur.</p>
            <p>Formulaire Bleu est entièrement gratuit et open source.
                Distribué  sur <a href="https://github.com/paganaye/formulairebleu">github.com</a> sous une licence permissive (MIT License),
                il vous permet de l'utiliser, de le modifier et de le redistribuer librement,
                que ce soit dans des projets personnels ou commerciaux.</p>
            <p>
                Si vous avez une suggestion d’amélioration, si vous rencontrez un bug ou si vous souhaitez me contacter, veuillez <a href="https://github.com/paganaye/formulairebleu/issues/new">créer un ticket</a>
            </p>
        </div>
    </>);
}
