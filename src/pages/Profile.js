import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

const PROFILE_URL = '/panel/profile';
const PROFILE_API_URL = '**/api/users/profile';

const PROFILE_DATA_DEFAULTS = {
  userId: 1,
  photoFilename: 'default-user.png',
  name: 'John',
  lastName: 'Dou',
};

export class Profile extends BasePage {
  selectors = {
    heading: this._page.getByRole('heading', { name: 'Profile', exact: true }),
    userName: this._page.locator('.profile_name'),
    editProfileButton: this._page.getByRole('button', { name: 'Edit profile' }),
    editProfileDialogHeading: this._page.getByRole('dialog').getByRole('heading', { name: 'Edit profile' }),
    editProfileName: this._page.locator('#editProfileName'),
    editProfileLastName: this._page.locator('#editProfileLastName'),
  };

  constructor(page) {
    super(page, PROFILE_URL);
  }

  async mockProfileResponse(profile = {}) {
    await this._page.route(PROFILE_API_URL, route => route.fulfill({
      json: { status: 'ok', data: { ...PROFILE_DATA_DEFAULTS, ...profile } },
    }));
  }

  async expectLoaded() {
    await this._page.waitForURL(`**${this._url}`);
    await expect(this.selectors.heading).toBeVisible();
  }

  async expectUserName(user) {
    await expect(this.selectors.userName).toHaveText(`${user.name} ${user.lastName}`);
  }

  async openEditProfile() {
    await this.selectors.editProfileButton.click();
    await expect(this.selectors.editProfileDialogHeading).toBeVisible();
  }

  async expectEditProfileFilledWith(user) {
    await expect(this.selectors.editProfileName).toHaveValue(user.name);
    await expect(this.selectors.editProfileLastName).toHaveValue(user.lastName);
  }
}
