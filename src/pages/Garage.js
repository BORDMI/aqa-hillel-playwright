import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { Profile } from './Profile.js';

const GARAGE_URL = '/panel/garage';

export class Garage extends BasePage {
  selectors = {
    heading: this._page.getByRole('heading', { name: 'Garage' }),
    addCarButton: this._page.getByRole('button', { name: 'Add car' }),
    userMenuButton: this._page.locator('#userNavDropdown'),
    userMenuProfileLink: this._page.locator('.dropdown-menu').getByRole('link', { name: 'Profile', exact: true }),
    signInButton: this._page.getByRole('button', { name: 'Sign In' }),
  };

  constructor(page) {
    super(page, GARAGE_URL);
  }

  async open() {
    await super.open();
    await this.expectLoaded();
  }

  async expectLoaded() {
    await this._page.waitForURL(`**${this._url}`);
    await expect(this.selectors.heading).toBeVisible();
  }

  async openProfile() {
    await this.selectors.userMenuButton.click();
    await this.selectors.userMenuProfileLink.click();

    const profile = new Profile(this._page);
    await profile.expectLoaded();
    return profile;
  }
}
