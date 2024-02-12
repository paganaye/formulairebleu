/* @refresh reload */
import { render } from 'solid-js/web';
import "./index.css";
import App from './App';


let AFSFont = 'lato,sans-serif';
let AFSWeightNormal = 400;
let AFSWeightTitle = 700;
let AFSWeightButton = 900;
let AFSDarkGrayText = "#494452"
let AFSBlue = '#1c7abf';
let AFSPink = "#e81b5f";
let AFSPurple = "#7f3195";
let AFSWhitishBackground = "#f8f8f9"


document.addEventListener("DOMContentLoaded", (event) => {
  function getCurrentScriptUrl() {
    if (document.currentScript) {
      return (document.currentScript as any).src;
    } else {
      const scriptElements = document.getElementsByTagName('script');
      const lastScript = scriptElements[scriptElements.length - 1];
      if (lastScript) {
        return lastScript.src;
      }
    }
  }

  const root = document.getElementById('root') || document.body;
  root.innerHTML = "";

  const scriptUrl = getCurrentScriptUrl();
  // We automatically load our css separately.
  if (scriptUrl && scriptUrl.indexOf('/index.js') >= 0) document.head.insertAdjacentHTML('beforeend', `<link href="${scriptUrl.replace('/index.js', '/index.css')}" rel="stylesheet" />`)
  let rootElt = document.getElementById('formulaire-bleu') ?? document.body;
  rootElt.innerHTML = '';
  render(() => <App />, rootElt);
});

