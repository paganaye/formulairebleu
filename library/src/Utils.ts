console.log("Utils.ts")

// "use strict";
class Utils {
  static rawVariableName(str: string) {
    return str
      .normalize('NFD') // Normalize the string to decompose accents
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
      .toLowerCase() // Convert to lower case
      .replace(/[^0-9a-z]/g, ''); // Remove all characters that are not 0-9 or a-z
  }

  static getIdFromUrl(url: string): string {
    if (typeof url !== 'string') throw Error("Invalid url type " + typeof url)
    let result = url.match(/[-\w]{25,}/);
    if (!result) throw Error("Invalid document url " + url);
    return result.toString();
  }

  static userString(user: GoogleAppsScript.Drive.User) {
    if (!user) return null;
    let email = user.getEmail();
    let name = user.getName();
    if (name) {
      return `${name} <${email}>`;
    } else {
      return email;
    }
  }

  static emailToString(user: IEmailAddress): string {
    let email = user.email;
    let name = user.name;
    if (name) {
      return `${name} <${email}>`;
    } else {
      return email;
    }
  }

  static emailsToString(emails: IEmailAddress[]): string {
    return emails.map(e => this.emailToString(e)).join(';')
  }

  static userStrings(users: GoogleAppsScript.Drive.User[]): string[] {
    if (!users) return [];
    return users.map(u => this.userString(u)).filter(u => Boolean(u)) as string[];
  }
}


(globalThis as any).Utils = Utils;
