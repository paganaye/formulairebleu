const French = {
  // email_subject: "Objet",
  // email_body: "Message",
  // email_save_as_draft: "Sauver brouilon",
  // email_send: "Envoyer",
  // page_mailing: "Publipostage",
  // page_about: "A propos",
  // page_docs: "Document",
  // page_emails: "E-mails",
  // //  page_file_access_rights: "Droits d'accès aux fichiers",
  // page_files: "Fichiers",
  // page_sheets: "Google sheet",
  // recipient_email: "Email du destinaire",
  // recipient_name: "Nom du destinataire",
  // file_url: "URL du fichier",
  // homepage_title: "Bienvenue",
  company: 'Votre entreprise',

  homepage_dialog_title: '${company} - Bienvenue',
  mailing_dialog_title: '${company} - Publipostage',
  settings_dialog_title: '${company} - Paramètres',
  email_dialog_title: '${company} - eMail',
  not_found_dialog_title: 'Page inconnue',
  test_dialog_title: 'Test'
}

type Translatable = keyof typeof French;

//const company = T('company');

function T(t: Translatable): string {
  return French[t].replace('${company}', "company") ?? "**" + t + '**'
}

