// const lettersRegexp = /^[A-Za-z]+$/;
const numberRegexp = /^[0-9]+$/;
const containerNumberRegexp = /\d/;
const zipOrZipRangeRegexp = /^\d{4}(-\d{4})?$/gm;
// tslint:disable-next-line:max-line-length
const emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default class Validation {
  static numbersOnly(s: string): boolean {
    return numberRegexp.test(s);
  }

  static email(s: string): boolean {
    return emailRegexp.test(s);
  }

  static containsNumber(s: string): boolean {
    let result = containerNumberRegexp.test(s);
    return result;
  }

  static zipOrZipRange(s: string): boolean {
    let result = zipOrZipRangeRegexp.test(s);
    return result;
  }
}
