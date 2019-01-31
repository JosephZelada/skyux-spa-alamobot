export class Entity {
  constructor(public id: string,
              public name: string,
              public slug: string,
              public watched: boolean) {
  }
}

export class CinemaEntity {
  constructor(public id: string,
              public name: string,
              public slug: string,
              public watched: boolean,
              public marketId: string) {
  }
}
