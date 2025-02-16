import { Styles } from "../../core/Styles";
import { computed, formulaireBleuJSX, formulaireBleuJSXFragment, JSXSource, Value } from "../../core/tiny-jsx";

interface IAProps {
    href: string;
}
export let currentPage = new Value("currentPage", document.location.hash);

Styles.add("a.link.selected", {
    textDecoration: 'none'
});
window.onhashchange = (e: Event) => {
    currentPage.setValue(document.location.hash);
};
export default function A(props: IAProps, ...children: JSXSource[]) {
    return <a id={props.href.substring(1)} class={computed("selected", { currentPage }, (p) => p.currentPage == props.href ? 'link selected' : 'link')} href={props.href == '' ? '#' : props.href}>{children}</a>
}


