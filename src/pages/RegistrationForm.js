import { expect } from '@playwright/test';

const INVALID_BORDER_COLOR = 'rgb(220, 53, 69)';

export class RegistrationForm {
  constructor(page) {
    this._page = page;
    this.selectors = {
      heading: page.getByRole('dialog').getByRole('heading', { name: 'Registration' }),
      signUpButton: page.getByRole('button', { name: 'Sign up' }),
      registerButton: page.getByRole('dialog').getByRole('button', { name: 'Register' }),
      name: page.locator('#signupName'),
      lastName: page.locator('#signupLastName'),
      email: page.locator('#signupEmail'),
      password: page.locator('#signupPassword'),
      repeatPassword: page.locator('#signupRepeatPassword'),
    };
  }

  async open() {
    await this._page.goto('/');
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
