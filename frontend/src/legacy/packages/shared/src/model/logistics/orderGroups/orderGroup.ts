import { MatchingCriterias } from "./matchingCriterias";

export class OrderGroup {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    console.log(data.matchingCriterias)
    this.matchingCriterias = data.matchingCriteria.map(
      criteria => new MatchingCriterias(criteria)
    );
  }

  public id: string;
  public name: string;
  public matchingCriterias: MatchingCriterias[];
}
