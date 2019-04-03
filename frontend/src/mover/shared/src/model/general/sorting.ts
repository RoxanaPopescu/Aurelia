export type SortingDirection = "Ascending" | "Descending";

/**
 * Represents the sorting map.
 */
export class SortingDirectionMap {
  public static readonly map = {
    Ascending: {
      name: "Ascending sorting",
      id: 1
    },
    Descending: {
      name: "Descending sorting",
      id: 2
    }
  };

  public constructor(status: keyof typeof SortingDirectionMap.map) {
    this.slug = status;
    Object.assign(this, SortingDirectionMap.map[status]);
  }

  public slug: keyof typeof SortingDirectionMap.map;
  public name: string;
  public id: number;
}
