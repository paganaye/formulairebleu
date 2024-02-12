class Logs {
  static lines: string[] = []

  static log(...data: any[]) {
    let lineParts: string[] = data.map(p => {
      switch (typeof p) {
        case 'string':
        case 'number':
        case 'boolean': return p.toString();
        default:
          return stringifyWithCircularReference(p);
      }
    });
    let line = lineParts.join(' ');
    Logger.log(line);
    this.lines.push(line)
  }

  static flush() {
    let result = this.lines.join('\n');
    this.lines.length = 0;
    return result;
  }
}

function stringifyWithCircularReference(obj: any) {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return "[Circulaire]";
      }
      seen.add(value);
    }
    return value;
  }, 2);
}

function debugCard(object: any) {
  Logger.log(object);
  // Convertir l'objet en chaîne JSON en gérant la récursivité
  var texteJson = stringifyWithCircularReference(object);
  return textCard(texteJson);
}

interface ILink {
  url: string,
  text: string
}
type ILinkOrString = ILink | string

function textCard(content: string | ILinkOrString[], options: { title?: string; } = {}) {
  let card = CardService.newCardBuilder()
  let section = CardService.newCardSection();

  if (Array.isArray(content)) {
    content.forEach((part) => {
      if (typeof (part) === "string") {
        addText(part)
      } else if (typeof (part) === "object") {
        addButton(part)
      }
    })
  }
  else {
    addText(content);
  }
  let builtCard = card.addSection(section).build();
  return builtCard;

  function addText(texte: string) {
    section.addWidget(CardService.newTextParagraph().setText(texte));
  }

  function addButton(l: ILink) {
    section.addWidget(
      CardService.newTextButton()
        .setText(l.text)
        .setOpenLink(
          CardService.newOpenLink()
            .setUrl(l.url)
            .setOpenAs(CardService.OpenAs.FULL_SIZE)
            .setOnClose(CardService.OnClose.NOTHING)
        ))
  }
}
