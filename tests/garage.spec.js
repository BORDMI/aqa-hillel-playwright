import { expect, test } from '../src/fixtures/userGaragePage.js';
import { config } from '../src/config/env.js';

test.describe('Garage of the pre-authenticated user', () => {
  test('Storage state opens the Garage with no UI login', async ({ userGaragePage }) => {
    await test.step('Garage of a signed-in user is rendered', async () => {
      await expect(userGaragePage.selectors.heading).toBeVisible();
      await expect(userGaragePage.selectors.addCarButton).toBeVisible();
      await expect(userGaragePage.selectors.userMenuButton).toBeVisible();
    });

    await test.step('Header form the landing is not shown', async () => {
      await expect(userGaragePage.selectors.signInButton).toBeHidden();
    });
  });

  test('Profile opened from the Garage belongs to the configured user', async ({ userGaragePage }) => {
    const profile = await test.step('Go to the profile from the user menu', async () => {
      return userGaragePage.openProfile();
    });

    await test.step(`Profile shows ${config.user.name} ${config.user.lastName}`, async () => {
      await profile.expectUserName(config.user);
    });
  });

  test('Check user info on Edit profile form ', async ({ userGaragePage }) => {
    const profile = await userGaragePage.openProfile();

    await test.step('Profile shows the same user as logged in', async () => {
      await profile.expectUserName(config.user);
    });

    await test.step('Edit profile form is prefilled with that user data', async () => {
      await profile.openEditProfile();
      await profile.expectEditProfileFilledWith(config.user);
    });
  });
});
