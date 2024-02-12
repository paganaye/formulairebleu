interface IUser {
  email: string;
  admin?: boolean;
  AA?: string;
}

interface IDonnees {
  annee: number;
  racineDrive: string;
}

interface IAA {
  AA: string;
  nomCourt: string;
  nomDossier: string;
}

class LazyDriveFolder {
  private folder: GoogleAppsScript.Drive.Folder | undefined
  constructor(readonly path: string) {
  }
  get(): GoogleAppsScript.Drive.Folder {
    if (!this.folder) {
      let donnees = Donnees.get();
      let folders = this.path.split('/');
      let folder = donnees.racineDrive;

      for (var i = 0; i < folders.length; i++) {
        var folderName = donnees.substitute(folders[i]);
        var nextFolders = folder.getFoldersByName(folderName);

        if (nextFolders.hasNext()) {
          folder = nextFolders.next();
        } else {
          folder = folder.createFolder(folderName);
        }
        this.folder = folder;
      }
    }
    return this.folder!;
  }
}

class Donnees {
  static instance: Donnees;
  classeur: GoogleAppsScript.Spreadsheet.Spreadsheet;
  donnees: IDonnees;
  membres: IUser[];
  AAs: IAA[];
  user: IUser;
  AA: any;
  racineDrive: GoogleAppsScript.Drive.Folder

  racineAnneeAA = new LazyDriveFolder("{AA}/COMPTABILITE {AA}/{annee} {AA}");
  compteBancaires = new LazyDriveFolder("{AA}/COMPTABILITE {AA}/{annee} {AA}/{annee} {AA} comptes bancaires")
  justificatifsCantines = new LazyDriveFolder("{AA}/COMPTABILITE {AA}/{annee} {AA}/{annee} {AA} justificatifs cantines")
  justificatifsCantines1T = new LazyDriveFolder("{AA}/COMPTABILITE {AA}/{annee} {AA}/{annee} {AA} justificatifs cantines/{AA} cantines 1T {annee}")
  justificatifsCantines2T = new LazyDriveFolder("{AA}/COMPTABILITE {AA}/{annee} {AA}/{annee} {AA} justificatifs cantines/{AA} cantines 2T {annee}")
  justificatifsCantines3T = new LazyDriveFolder("{AA}/COMPTABILITE {AA}/{annee} {AA}/{annee} {AA} justificatifs cantines/{AA} cantines 3T {annee}")
  justificatifsCantines4T = new LazyDriveFolder("{AA}/COMPTABILITE {AA}/{annee} {AA}/{annee} {AA} justificatifs cantines/{AA} cantines 4T {annee}")
  justificatifsCantines5T = new LazyDriveFolder("{AA}/COMPTABILITE {AA}/{annee} {AA}/{annee} {AA} justificatifs cantines/{AA} cantines 5T {annee}")
  piecesComptables = new LazyDriveFolder("{AA}/COMPTABILITE {AA}/{annee} {AA}/{annee} {AA} pièces comptables")
  dossierAutre = new LazyDriveFolder("{AA}/COMPTABILITE {AA}/{annee} {AA}/{annee} {AA} autre")

  private constructor() {
    const LIBRARY_DATA_ID = "1zBe_1IGoPKgAyffPm-KHwOSN27EKXQQ525W5vT8Gsz4";
    this.classeur = SpreadsheetApp.openById(LIBRARY_DATA_ID);
    this.donnees = this.litVariables(this.getSheetByName("Données"));
    this.membres = this.litFeuille(this.getSheetByName("Membres"));
    this.AAs = this.litFeuille(this.getSheetByName("AAs"));
    let userEmail = Session.getActiveUser().getEmail();
    this.user = (userEmail && this.membres.find(m => m.email == userEmail)) || { email: userEmail };
    this.AA = (this.user.AA && this.AAs.find(aa => aa.AA == this.user.AA)) || { AA: "" };
    this.racineDrive = DriveApp.getFolderById(this.donnees.racineDrive);
  }

  substitute(formula: string) {
    return formula.replace(/\{(\w+)\}/g, (match, key) => {
      return (this.donnees as any)[key]
        ?? (this.AA as any)[key]
        ?? (this.user as any)[key]
        ?? ("{" + key + "}");
    });
  }
  static get() {
    return Donnees.instance ?? (Donnees.instance = new Donnees());
  }

  getSheetByName(nomFeuille: string): GoogleAppsScript.Spreadsheet.Sheet {
    let result = this.classeur.getSheetByName(nomFeuille);
    if (!result) throw Error(`La feuille ${nomFeuille} n'existe pas.`);
    return result!!
  }

  litVariables<T>(feuille: GoogleAppsScript.Spreadsheet.Sheet): T {
    // ici on retourne un seul objet avec le nom dans la colonne A
    let donnees = feuille.getDataRange().getValues();
    let result: any = {};
    for (let i = 0; i < donnees.length; i++) {
      let nomVariable = donnees[i][0];
      let valeur = donnees[i][1];
      result[nomVariable] = valeur;
    }
    return result as T;
  }

  litFeuille<T>(feuille: GoogleAppsScript.Spreadsheet.Sheet): T[] {
    // ici on retourne un tableau d'objet avec les nom dans la ligne 1
    let donnees = feuille.getDataRange().getValues();
    let result = [];

    let colonnes = donnees[0];
    for (let i = 1; i < donnees.length; i++) {
      let objetMembre: any = {};

      for (let j = 0; j < colonnes.length; j++) {
        let nomVariable = colonnes[j];
        let valeur = donnees[i][j];
        objetMembre[nomVariable] = valeur;
      }

      result.push(objetMembre);
    }

    return result;
  }

}


