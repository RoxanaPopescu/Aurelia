import { Passage } from "./";

export class Journey {
  public passages: Passage[];

  // tslint:disable-next-line:no-any
  constructor(json: any) {
    this.passages = json.passages.map(passage => new Passage(passage));
  }
}
