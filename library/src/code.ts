
function buildHomepage(event: any, extra: any) {
  return libraryMainMenu(event, extra);
}

function litDonnees() {
  let donnees = Donnees.get();
  Logger.log(donnees);
}




function mailing(event: any, extra: any) {
  // CardService.newAction().setFunctionName('triggerFunction').setParameters({ title: "Mon formulaire", width: '800', height: '600' });
  return launchDialog(dialogs.mailing);
  // return CardService.newActionResponseBuilder()
  //   .setNotification(CardService.newNotification()
  //     .setText("On lance le publipostage..."))
  //   .build();
  //return buildHomepage(event, extra);
}

function settings(event: any, extra: any) {
  // CardService.newAction().setFunctionName('triggerFunction').setParameters({ title: "Mon formulaire", width: '800', height: '600' });
  return launchDialog(dialogs.settings);
  // return CardService.newActionResponseBuilder()
  //   .setNotification(CardService.newNotification()
  //     .setText("On lance les settings..."))
  //   .build();

  //return buildHomepage(event, extra);
}



function libraryMainMenu(event: { commonEventObject: { hostApp: any; }; }, extra: any) {
  let builder = CardService.newCardBuilder();
  let hostApp = event.commonEventObject.hostApp;
  let headerText = "Bienvenue dans le module d'extension Formulaire Bleu";
  let headerParagraph = CardService.newTextParagraph();
  headerText += ` dans ${hostApp}`
  headerText += ` in ${Session.getActiveUserLocale()}`;
  headerText += ` for ${Session.getActiveUser().getEmail()}`;
  headerText += ` version ${formulaireBleuVersion}`
  headerParagraph.setText(headerText);
  let mainSection = CardService.newCardSection();
  mainSection.addWidget(headerParagraph);
  builder.addSection(mainSection);
  return builder.build();
}

function addOnTestMenu(event: { commonEventObject: { hostApp: any; }; }, extra: any) {
  let hostApp = event.commonEventObject.hostApp;
  if (hostApp == 'SHEETS') {
    // ssUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();
  }
  // Build card
  let builder = CardService.newCardBuilder();
  let headerText = "Bienvenue dans le module d'extension Formulaire Bleu";

  let scriptProperties = PropertiesService.getScriptProperties();
  let documentProperties = PropertiesService.getDocumentProperties();
  let userProperties = PropertiesService.getUserProperties();



  let mainSection = CardService.newCardSection();
  let headerParagraph = CardService.newTextParagraph();


  // Create textboxes and buttons for each property type.
  var scriptPropertiesTextbox = CardService.newTextInput()
    .setFieldName("scriptProperties")
    .setTitle("Script Properties")
    .setValue(loadFromScriptProperties("scriptProperties"));

  var documentPropertiesTextbox = CardService.newTextInput()
    .setFieldName("documentProperties")
    .setTitle("Document Properties")
    .setValue(loadFromDocumentProperties("documentProperties"));

  var userPropertiesTextbox = CardService.newTextInput()
    .setFieldName("userProperties")
    .setTitle("User Properties")
    .setValue(loadFromUserProperties("userProperties"));

  var scriptPropertiesButton = CardService.newTextButton()
    .setText("Save to Script Properties")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("FormulaireBleu.saveToScriptProperties")
      .setParameters({ 'value': "scriptProperties" }));

  var documentPropertiesButton = CardService.newTextButton()
    .setText("Save to Document Properties")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("FormulaireBleu.saveToDocumentProperties")
      .setParameters({ 'value': "documentProperties" }));

  var userPropertiesButton = CardService.newTextButton()
    .setText("Save to User Properties")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("FormulaireBleu.saveToUserProperties")
      .setParameters({ 'value': "userProperties" }));


  mainSection.addWidget(scriptPropertiesTextbox);
  mainSection.addWidget(scriptPropertiesButton);
  mainSection.addWidget(documentPropertiesTextbox);
  mainSection.addWidget(documentPropertiesButton);
  mainSection.addWidget(userPropertiesTextbox);
  mainSection.addWidget(userPropertiesButton);


  switch (hostApp) {
    case "DOCS":
      menuGoogleDocs()
      break;
    case "SHEETS":
      menuGoogleSheets()
      break;
    case "DRIVE":
      menuGoogleDrive()
      break;
    case "GMAIL":
      menuGMail()
      break;
    default:
      headerParagraph.setText(headerText + ` dans ${hostApp}`);
      mainSection.addWidget(headerParagraph);
      break;
  }
  builder.addSection(mainSection);
  return builder.build();

  function menuGoogleDocs() {
    headerParagraph.setText(headerText + " pour Google Docs");
    mainSection.addWidget(headerParagraph);
    addTestPascalButton(DocumentApp);

  }

  function menuGoogleSheets() {
    headerParagraph.setText(headerText + " pour Google Sheets");
    mainSection.addWidget(headerParagraph);
    addTestPascalButton(SpreadsheetApp);
  }

  function addTestPascalButton(app: GoogleAppsScript.Document.DocumentApp | GoogleAppsScript.Spreadsheet.SpreadsheetApp) {
    // Create a selection input
    var selectionInput = CardService.newSelectionInput()
      .setTitle("Select Version")
      .setFieldName("version_selection")
      .setType(CardService.SelectionInputType.DROPDOWN)
      .addItem("1.0", "1.0", false)
      .addItem("1.1", "1.1", false)
      .addItem("1.2", "1.2", false)
      .addItem("1.3", "1.3", false)
      .addItem("1.4", "1.4", false)
      .addItem("1.5", "1.5", false)
      .addItem("dev", "dev", true);

    mainSection.addWidget(selectionInput);
    mainSection.addWidget(
      CardService.newButtonSet().addButton(
        CardService.newTextButton()
          .setText("test pascal")
          .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
          .setOnClickAction(
            CardService.newAction().setFunctionName('triggerFunction').setParameters({ title: "Mon formulaire", width: '800', height: '600' }),
          )
          .setDisabled(false),
      )
    );
  }

  function menuGoogleDrive() {
    headerParagraph.setText(headerText + " pour Google Drive");
    mainSection.addWidget(headerParagraph);
  }
  function menuGMail() {
    headerParagraph.setText(headerText + " pour GMail");
    mainSection.addWidget(headerParagraph);
    mainSection.addWidget(
      CardService.newTextParagraph().setText("Selectionnez un e-mail")
    );

  }
}

function loadFromScriptProperties(key: any) {
  var scriptProperties = PropertiesService.getScriptProperties();
  var value = scriptProperties.getProperty(key);
  return value || "";
}

function loadFromDocumentProperties(key: any) {
  var documentProperties = PropertiesService.getDocumentProperties();
  var value = documentProperties.getProperty(key);
  return value || "";
}

function loadFromUserProperties(key: any) {
  var userProperties = PropertiesService.getUserProperties();
  var value = userProperties.getProperty(key);
  return value || "";
}

function saveToScriptProperties(e: any) {
  var value = e.parameters.value;
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty(value, e.formInputs[value][0]);
}

function saveToDocumentProperties(e: any) {
  var value = e.parameters.value;
  var documentProperties = PropertiesService.getDocumentProperties();
  documentProperties.setProperty(value, e.formInputs[value][0]);
}

function saveToUserProperties(e: any) {
  var value = e.parameters.value;
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty(value, e.formInputs[value][0]);
}

function triggerFunction(e: any) {
  Logger.log(e);
  if (e.parameters) {
    return launchDialog(dialogs.home);
  } else if (e.command) {
    if (e.command === "getDocumentName") return getDocumentName();
  } else if (e.gmail) {
    return onGmailTriggerFunction(e);
  }
}

const dialogs: Record<IDialogType, IDialog> = {
  home: { type: 'home', title: 'homepage_dialog_title', width: 400, height: 300, modal: false },
  mailing: { type: 'mailing', title: 'mailing_dialog_title', width: 800, height: 600, modal: false },
  settings: { type: 'settings', title: 'settings_dialog_title', width: 600, height: 600, modal: false },
  email: { type: 'email', title: 'email_dialog_title', width: 800, height: 600, modal: false },
  notFound: { type: 'notFound', title: 'not_found_dialog_title', width: 800, height: 600, modal: false },
  test: { type: 'test', title: 'test_dialog_title', width: 800, height: 600, modal: false }
}


function launchDialog(dialog: IDialog) {
  let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let document = DocumentApp.getActiveDocument()
  let app = spreadsheet ? SpreadsheetApp : document ? DocumentApp : null;
  let email = Session.getEffectiveUser().getEmail();

  let company = email.split("@")[1];

  let title = T(dialog.title); // e.parameters.title ?? company
  let width = dialog.width; // +(e.parameters.width) || 800;
  let height = dialog.height; // +(e.parameters.width) || 600;
  let fbGlobals: IFBGlobals = {
    company,
    email,
    locale: Session.getActiveUserLocale(),
    libraryFormulaireBleuVersion: formulaireBleuVersion,
    dialog: dialog.type,
    dialogTitle: dialog.title,
    docId: document?.getId(),
    spreadsheetId: spreadsheet?.getId(),
    activeSheet: spreadsheet && spreadsheet.getActiveSheet().getName(),
    gmailUnread: GmailApp && GmailApp.getInboxUnreadCount()
  };
  // 
  // https://cdn.jsdelivr.net/gh/paganaye/formulairebleu/dist/index.js
  let html: string = `<script>formulaireBleuGlobals=${JSON.stringify(fbGlobals)};</script>
<style>
@keyframes delayedFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.delayed-message-1sec {
  opacity: 0;
  animation-name: delayedFadeIn;
  animation-fill-mode: forwards;
  animation-delay: 1s;
  animation-duration: 1s;
}
.delayed-message-3sec {
  opacity: 0;
  animation-name: delayedFadeIn;
  animation-fill-mode: forwards;
  animation-delay: 3s;
  animation-duration: 1s;
}
body {
  font-family: Google Sans,Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
}
.loader {
  border: 5px solid #f3f3f3; /* Light grey */
  border-top: 5px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: spin 2s linear infinite, fadeOut 4s ease-in-out forwards;
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes fadeOut {
  0% { opacity: 1; }
  90% { opacity: 1; }
  100% { opacity: 0; }
}
</style>`
  let loadingTitle, loadingFailedMessage;
  if (formulaireBleuVersion.endsWith('-dev')) {
    // http://localhost:5173/@vite/client
    html += `<script type="module" src="http://localhost:5173/@vite/client"></script>\n`;
    html += `<script type="module" src="http://localhost:5173/src/index.tsx"></script>\n`;
    loadingTitle = 'Exécution en mode developper...';
    loadingFailedMessage = `Si ce message persiste, vous exécutez à tord la version de développement de la  librairie Formulaire Bleu.<br/>`
      + `Alternativement votre environnement de développement n'est peut-être pas démarré.`
  } else {
    html += `<script src=${JSON.stringify(`https://cdn.jsdelivr.net/gh/paganaye/formulairebleu@${formulaireBleuVersion}/client/dist/index.js`)}></script>`
    loadingTitle = `Chargement de Formulaire Bleu ${formulaireBleuVersion}...`;
    loadingFailedMessage = `Il semble y avoir un problème de connexion Internet. Assurez-vous que votre connexion Internet est stable et réessayez.<br/>`
      + `Si ce message persiste vous utilisez peut-être une version trop ancienne de la librairie Formulaire Bleu qui a été supprimée.`;
  }
  html += `<div class="delayed-message-1sec">`;
  html += `  <h3>${loadingTitle}</h3>\n`
  html += `</div>`;
  html += `<div class="delayed-message-3sec">`;
  html += `  <p>${loadingFailedMessage}</p>\n`
  html += `</div>`;
  html += `<div class="loader"></div>`
  let htmlOutput = HtmlService
    .createHtmlOutput(html)
    .setWidth(width)
    .setHeight(height);

  if (app) {
    let ui = app!!.getUi();
    if (dialog.modal) ui.showModalDialog(htmlOutput, title);
    else ui.showModelessDialog(htmlOutput, title)
  } else {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText(`C'est embarassant mais je ne trouve pas d'éditeur.`))
      .build();
  }

}

function getDocumentName() {
  let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let document = DocumentApp.getActiveDocument()
  return (spreadsheet || document).getName()
}

function setDocumentName(newName: string) {
  let document = DocumentApp.getActiveDocument()
  if (document) {
    document.setName(newName);
  } else {
    let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (spreadsheet) spreadsheet.rename(newName)
    else throw Error("Neither in a document or a spreadsheet.")
  }
}