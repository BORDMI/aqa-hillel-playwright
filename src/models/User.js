import { faker } from '@faker-js/faker';

export class User {
  constructor() {
    this.name = faker.string.alpha({ length: { min: 2, max: 20 } });
    this.lastName = faker.string.alpha({ length: { min: 2, max: 20 } });
    this.email = `aqa-${faker.string.alphanumeric(10).toLowerCase()}@test.com`;
    this.password = `Aa1${faker.string.alphanumeric(7)}`;
    this.repeatPassword = this.password;
  }
}
