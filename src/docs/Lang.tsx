let ENGLISH = {
    welcome: 'Welcome',
    menu_home: 'Home',
    menu_form_editor: 'Form Editor',
    menu_tests: 'Tests',
    menu_about: 'About'
}

let FRENCH: typeof ENGLISH = {
    ...ENGLISH,
    welcome: 'Bienvenue',
    menu_home: 'Accueil',
    menu_form_editor: 'Éditeur de formulaire',
    menu_tests: 'Tests',
    menu_about: 'À propos'
}

let lang = navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en';


export let LANG = (lang == 'fr') ? FRENCH
    : ENGLISH;

document.documentElement.setAttribute('lang', lang);

console.log("Language:", lang)