import { AfterInsert, AfterLoad, AfterUpdate } from 'typeorm';

export class CommonEntity {
  id: unknown;

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  private fixPkNumberic() {
    this.id = Number(this.id);
  }
}
