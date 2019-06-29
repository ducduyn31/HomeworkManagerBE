export class DatabaseEntity {
  protected fillables: string[];
  protected forbidden: string[];

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
