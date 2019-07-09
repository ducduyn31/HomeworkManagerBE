import { EntityStatus } from '../constants/entity-status';

export class DatabaseEntity {
  protected fillables: string[];
  protected forbidden: string[];

  public deletedAt: Date;
  public status: EntityStatus;

  constructor(data?: any, fillables?: string[], forbidden?: string[]) {
    this.fillables = fillables || [];
    this.forbidden = forbidden || [];

    if (data) {
      this.forbidden.forEach((key: string) => {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          delete data[key];
        }
      });
      this.fillables.forEach((key: string) => (this[key] = data[key]));
    }
  }
}
