// Styles.js

import { JSONObject } from "./Utils";


export class Styles {
  static styleSheet = (() => {
    const style = document.createElement('style');
    document.head.appendChild(style);
    return style.sheet!;
  })();

  static add(selector: string, styles: JSONObject) {
    try {
      const styleString = Object.entries(styles)
        .map(([prop, value]) => `${this.camelToKebab(prop)}: ${value};`)
        .join(' ');
      this.styleSheet.insertRule(`${selector} { ${styleString} }`, this.styleSheet.cssRules.length);
    } catch (e) {
      console.error(e);
    }
  }

  static camelToKebab(str: string) {
    return str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
  }
}


