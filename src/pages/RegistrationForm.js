import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

const HOME_URL = '/';
const INVALID_BORDER_COLOR = 'rgb(220, 53, 69)';

export class RegistrationForm extends BasePage {
  selectors = {
    heading: this._page.getByRole('dialog').getByRole('heading', { name: 'Registration' }),
    signUpButton: this._page.getByRole('button', { name: 'Sign up' }),
    registerButton: this._page.getByRole('dialog').getByRole('button', { name: 'Register' }),
    name: this._page.locator('#signupName'),
    lastName: this._page.locator('#signupLastName'),
    email: this._page.locator('#signupEmail'),
    password: this._page.locator('#signupPassword'),
    repeatPassword: this._page.locator('#signupRepeatPassword'),
  };

  constructor(page) {
    super(page, HOME_URL);
  }

  async open() {
    await super.open();
    await this.selectors.signUpButton.click();
    await expect(this.selectors.heading).toBeVisible();
  }

  async fillForm(user) {
    await this.selectors.name.fill(user.name);
    await this.selectors.lastName.fill(user.lastName);
    await this.selectors.email.fill(user.email);
    await this.selectors.password.fill(user.password);
    await this.selectors.repeatPassword.fill(user.repeatPassword);
  }

  async blur(input) {
    await input.focus();
    await input.blur();
  }

  async expectError(input, text) {
    const error = this._page.locator('.form-group', { has: input }).locator('.invalid-feedback');
    await expect(error).toHaveText(text);
  }

  async expectRedBorder(input) {
    await expect(input).toHaveClass(/is-invalid/);
    await expect(input).toHaveCSS('border-color', INVALID_BORDER_COLOR);
  }
}
