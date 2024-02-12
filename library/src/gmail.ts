interface IGMailEvent {
  gmail: { messageId: any; accessToken: string; }
  formInput: Record<string, any>
}
function onGmailTriggerFunction(e: IGMailEvent) {
  // Activate temporary Gmail scopes, in this case to allow
  // message metadata to be read.

  var accessToken = e.gmail.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);

  return cardCopieEmailSurLeDrive(e, { update: false })

  // return CardService.newActionResponseBuilder()
  //   .setNotification(CardService.newNotification()
  //     .setText("Email Selected"))
  //   .build();
}

function cardCopieEmailSurLeDrive(e: IGMailEvent, options: { update?: boolean } = {}) {
  let donnees = Donnees.get();
  // Assume `e.formInput` contains the state of your form inputs. Adjust as necessary.
  const userInput = e.formInput || {};
  const selectedEmailType = userInput.typeEmail; // For the dropdown
  const descriptionText = userInput.description; // For the text input

  // Your existing card setup logic here...

  // When setting up the dropdown, mark the item as selected based on the current state
  let emailTypeDropdown = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setTitle("Type d'email")
    .setFieldName("typeEmail");

  // Example of adding items to the dropdown and marking one as selected based on state
  const emailTypes = ["comptes bancaires", "pieces comptables",
    "justificatifs cantines 1T",
    "justificatifs cantines 2T",
    "justificatifs cantines 3T",
    "justificatifs cantines 4T",
    "justificatifs cantines 5T",
    "autre"];
  emailTypes.forEach((type) => emailTypeDropdown.addItem(type, type, type === selectedEmailType));
  // emailTypeDropdown.setOnChangeAction(CardService.newAction().setFunctionName('FormulaireBleu.onTypeEmailChanged'));

  let messageId = e.gmail.messageId;
  let emailSubject = messageId && GmailApp.getMessageById(messageId)?.getSubject();
  // For the text box, set the value based on the current state
  let textBox = CardService.newTextInput()
    .setFieldName("description")
    .setTitle("Description")
    .setValue(descriptionText || emailSubject || "");

  let dest = donnees.racineAnneeAA.get()?.getName()
  var card = CardService.newCardBuilder();
  // Ajouter un paragraphe de texte à la carte
  card.addSection(
    CardService.newCardSection()
      .addWidget(CardService.newTextParagraph().setText(new Date().toISOString()))
      .addWidget(CardService.newTextParagraph().setText(`Ici on copie les emails dans ${dest}`))
      .addWidget(emailTypeDropdown) // Ajout du dropdown
      .addWidget(textBox)  // Ajout de la zone de texte
      .addWidget(
        CardService.newButtonSet().addButton(
          CardService.newTextButton()
            .setText("copie email sur le drive")
            .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
            .setOnClickAction(
              CardService.newAction().setFunctionName('FormulaireBleu.copieEmailToDrive'),
            )
            .setDisabled(false),
        )
      )
  );
  return card.build();

}

// function onTypeEmailChanged(e: IGMailEvent) {
//   return CardService.newActionResponseBuilder()
//     .setStateChanged(true)
//     .setNavigation(CardService.newNavigation().updateCard(cardCopieEmailSurLeDrive(e, { update: true })))
//     .build();
// }

function createErrorCard(errorMessage: string) {
  var card = CardService.newCardBuilder();

  card.addSection(
    CardService.newCardSection()
      .addWidget(CardService.newTextParagraph().setText(`Error: ${errorMessage}`))
    // Add other widgets as needed
  );

  return card.build();
}


function fake_copieEmailToDrive() {
  var e = {
    "messageMetadata": {
      "accessToken": "APTu-uelP2xMk53cobSJyaMYI5QWThBm-QlujCCoE60xA2UhSS6uDr7XhdeoBTWx-Sdx-KfwTK_GVcJtRdDHj4pf5uXCMxhkrG2Ijt4QwqgpVhO5_Ruhdte50qrDWK7oVPSiEd6foF4KssjGKM22KobGFFEyemVDgA",
      "messageId": "msg-f:1789502844616929313",
      "threadId": "thread-f:1788904826492404634|msg-f:1789502844616929313"
    },
    "formInput": {
      "description": "Re: Angélique Mauti",
      "typeEmail": "comptes bancaires"
    },
  };
  copieEmailToDrive(e);
}
function copieEmailToDrive(e: any) {
  let output: ILinkOrString[] = [];
  var messageId = e.messageMetadata.messageId;
  var message = GmailApp.getMessageById(messageId);
  var sujetEmail = message.getSubject();
  var contenuEmail = message.getBody();
  var piecesJointes = message.getAttachments();
  let description = e.formInput.description;
  let typeEmail = e.formInput.typeEmail;
  //  return onGmailTriggerFunction({ ...e, error: "Non non non" });
  if (!description) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText("Veuillez saisir une description. Celle-ci sera utilisée comme nom pour le dossier nouvellement créé."))
      .build();
  }
  if (!typeEmail) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText("Veuillez saisir un type d'email. Celui-ci est utilisé pour mettre les fichiers dans le bon dossier."))
      .build();
  }

  let donnees = Donnees.get();
  let dossier1: GoogleAppsScript.Drive.Folder;

  switch (typeEmail) {
    case "comptes bancaires": dossier1 = donnees.compteBancaires.get(); break;
    case "pieces comptables": dossier1 = donnees.piecesComptables.get(); break;
    case "justificatifs cantines 1T": dossier1 = donnees.justificatifsCantines1T.get(); break;
    case "justificatifs cantines 2T": dossier1 = donnees.justificatifsCantines2T.get(); break;
    case "justificatifs cantines 3T": dossier1 = donnees.justificatifsCantines3T.get(); break;
    case "justificatifs cantines 4T": dossier1 = donnees.justificatifsCantines4T.get(); break;
    case "justificatifs cantines 5T": dossier1 = donnees.justificatifsCantines5T.get(); break;
    default: dossier1 = donnees.dossierAutre.get(); break;
  }

  if (folderExists(dossier1, description)) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText("Le dossier existe déjà. Vous avez peut-être déjà copié cet email. Sinon changez la description pour créer un autre dossier"))
      .build();
  }
  let dossier2 = dossier1.createFolder(description);

  // 2. Copier l'email en format PDF
  let files: ILink[] = saveMessageAsPDF(message, dossier2);

  // 3. Marquer l'email avec un tag 
  addLabelToSpecificMessage(messageId, typeEmail)
  // 4. Enlever le fichier de la boite de réception
  removeLabelToSpecificMessage(messageId, "Boîte de réception")
  removeLabelToSpecificMessage(messageId, "INBOX")

  Logs.log({
    typeEmail,
    description,
    messageId,
    sujetEmail,
    contenuEmail,
    piecesJointes: piecesJointes.map(p => p.getName() + " " + p.getSize())
  });
  output.push("Email \"" + sujetEmail + "\" copié dans le dossier \"" + getFolderPath(dossier1) + "\"");
  output.push("Dossier")
  output.push({ url: dossier2.getUrl(), text: dossier2.getName() })
  output.push("Fichiers")
  output.push(...files);
  GmailApp.refreshMessage(message);
  return textCard(output, { title: "Copie terminée" });

}

function folderExists(parentFolder: GoogleAppsScript.Drive.Folder, folderName: string): boolean {
  let folders = parentFolder.getFoldersByName(folderName);
  return folders.hasNext();
}


function getFolderPath(folder: GoogleAppsScript.Drive.Folder) {
  var path = folder.getName();
  while (folder.getParents().hasNext()) {
    folder = folder.getParents().next();
    path = folder.getName() + '/' + path;
  }
  return path;
}


function saveMessageAsPDF(msg: GoogleAppsScript.Gmail.GmailMessage, folder: GoogleAppsScript.Drive.Folder): ILink[] {
  var result: ILink[] = [];
  var html = "";
  var attachments = [];

  /* Append all the threads in a message in an HTML document */

  html += "De: " + msg.getFrom() + "<br />";
  html += "À: " + msg.getTo() + "<br />";
  html += "Date: " + msg.getDate() + "<br />";
  html += "Objet: " + msg.getSubject() + "<br />";
  html += "<hr />";
  html += msg.getBody().replace(/<img[^>]*>/g, "");
  html += "<hr />";

  var atts = msg.getAttachments();
  for (var a = 0; a < atts.length; a++) {
    attachments.push(atts[a]);
  }

  /* Save the attachment files and create links in the document's footer */
  if (attachments.length > 0) {
    var footer = "<strong>Fichiers attachés:</strong><ul>";
    for (var z = 0; z < attachments.length; z++) {
      var file = folder.createFile(attachments[z] as any);
      footer += "<li><a href='" + file.getUrl() + "'>" + (z + 1).toString() + " " + file.getName() + "</a></li>";
      result.push({ url: file.getUrl(), text: file.getName() })
    }
    html += footer + "</ul>";
  }

  /* Conver the Email Thread into a PDF File */
  var tempFile = DriveApp.createFile("temp.html", html, "text/html");
  let newFile = folder.createFile(tempFile.getAs("application/pdf")).setName(msg.getSubject() + ".pdf");

  result.unshift({ url: newFile.getUrl(), text: newFile.getName() })
  tempFile.setTrashed(true);
  return result;
}


function addLabelToSpecificMessage(messageId: string, labelName: string) {
  // Get or create the label
  var labelId = getOrCreateLabelId(labelName);

  // Apply the label to the message
  if (labelId) {
    Gmail!!.Users!!.Messages!!.modify({
      addLabelIds: [labelId],
      removeLabelIds: []
    }, 'me', messageId);
  } else {
    Logger.log("Label could not be found or created");
  }
}

function removeLabelToSpecificMessage(messageId: string, labelName: string) {
  // Get or create the label
  var labelId = getLabelId(labelName);
  if (labelId) {
    Gmail!!.Users!!.Messages!!.modify({
      removeLabelIds: [labelId]
    }, 'me', messageId);
  }
}

function getLabelId(labelName: string) {
  // List all labels and check if the label exists
  var labels = Gmail!!.Users!!.Labels!!.list('me').labels!!;
  for (var i = 0; i < labels.length; i++) {
    if (labels[i].name === labelName) {
      return labels[i].id;
    }
  }
  return null;
}


function getOrCreateLabelId(labelName: string) {
  let id = getLabelId(labelName);
  if (!id) {
    var newLabel = Gmail!!.Users!!.Labels!!.create({ name: labelName }, 'me');
    id = newLabel?.id;
  }
  return id;
}
