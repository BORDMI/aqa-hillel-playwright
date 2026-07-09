import { expect, test } from '@playwright/test';
import { RegistrationForm } from '../src/pages/RegistrationForm.js';
import { Garage } from '../src/pages/Garage.js';
import { User } from '../src/models/User.js';

test.describe('Registration form', () => {
  let form;

  test.beforeEach(async ({ page }) => {
    form = new RegistrationForm(page);
    await form.open();
  });

  test.describe('Positive', () => {
    test('Registers a new user with valid data', async ({ page }) => {
      const user = new User();
      const garage = new Garage(page);

      await test.step('Fill the form with valid data', async () => {
        await form.fillForm(user);
      });

      await test.step('Check register button becomes enabled', async () => {
        await expect(form.selectors.registerButton).toBeEnabled();
      });

      await test.step('Submit and land in the Garage', async () => {
        await form.selectors.registerButton.click();
        await garage.expectLoaded();
      });
    });
  });

  test.describe('Negative', () => {
    test.describe('Name', () => {
      test('Empty field shows "required" error', async () => {
        await form.blur(form.selectors.name);
        await form.expectError(form.selectors.name, 'Name is required');
        await form.expectRedBorder(form.selectors.name);
      });

      test('Too short (1 char) shows length error', async () => {
        await form.selectors.name.fill('a');
        await form.blur(form.selectors.name);
        await form.expectError(form.selectors.name, 'Name has to be from 2 to 20 characters long');
        await form.expectRedBorder(form.selectors.name);
      });

      test('Too long (21 chars) shows length error', async () => {
        await form.selectors.name.fill('a'.repeat(21));
        await form.blur(form.selectors.name);
        await form.expectError(form.selectors.name, 'Name has to be from 2 to 20 characters long');
        await form.expectRedBorder(form.selectors.name);
      });

      test('Invalid data (digits/symbols) shows "invalid" error', async () => {
        await form.selectors.name.fill('12$$');
        await form.blur(form.selectors.name);
        await form.expectError(form.selectors.name, 'Name is invalid');
        await form.expectRedBorder(form.selectors.name);
      });
    });

    test.describe('Last name', () => {
      test('Empty field shows "required" error', async () => {
        await form.blur(form.selectors.lastName);
        await form.expectError(form.selectors.lastName, 'Last name is required');
        await form.expectRedBorder(form.selectors.lastName);
      });

      test('Wrong length (1 char) shows length error', async () => {
        await form.selectors.lastName.fill('a');
        await form.blur(form.selectors.lastName);
        await form.expectError(form.selectors.lastName, 'Last name has to be from 2 to 20 characters long');
        await form.expectRedBorder(form.selectors.lastName);
      });
    });

    test.describe('Email', () => {
      test('Empty field shows "required" error', async () => {
        await form.blur(form.selectors.email);
        await form.expectError(form.selectors.email, 'Email required');
        await form.expectRedBorder(form.selectors.email);
      });

      test('Invalid format shows "incorrect" error', async () => {
        await form.selectors.email.fill('not-an-email');
        await form.blur(form.selectors.email);
        await form.expectError(form.selectors.email, 'Email is incorrect');
        await form.expectRedBorder(form.selectors.email);
      });
    });

    test.describe('Password', () => {
      test('Too short shows the complexity rule error', async () => {
        await form.selectors.password.fill('Pass1');
        await form.blur(form.selectors.password);
        await form.expectError(
          form.selectors.password,
          'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter',
        );
        await form.expectRedBorder(form.selectors.password);
      });

      test('No digit/capital shows rule error', async () => {
        await form.selectors.password.fill('password');
        await form.blur(form.selectors.password);
        await form.expectError(
          form.selectors.password,
          'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter',
        );
        await form.expectRedBorder(form.selectors.password);
      });
    });

    test.describe('Re-enter password', () => {
      test('Empty field shows "required" error', async () => {
        await form.selectors.password.fill('Password1');
        await form.blur(form.selectors.repeatPassword);
        await form.expectError(form.selectors.repeatPassword, 'Re-enter password required');
        await form.expectRedBorder(form.selectors.repeatPassword);
      });

      test('Mismatch shows "do not match" error', async () => {
        await form.selectors.password.fill('Password1');
        await form.selectors.repeatPassword.fill('Password2');
        await form.blur(form.selectors.repeatPassword);
        await form.expectError(form.selectors.repeatPassword, 'Passwords do not match');
        await form.expectRedBorder(form.selectors.repeatPassword);
      });
    });

    test.describe('Form validation', () => {
      test('Register button is disabled while the form is invalid', async () => {
        await expect(form.selectors.registerButton).toBeDisabled();

        const user = new User();
        await form.selectors.name.fill(user.name);
        await form.selectors.lastName.fill(user.lastName);
        await expect(form.selectors.registerButton).toBeDisabled();
      });
    });
  });
});
