import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

const GARAGE_URL = '/panel/garage';

export class Garage extends BasePage {
  selectors = {
    heading: this._page.getByRole('heading', { name: 'Garage' }),
  };

  constructor(page) {
    super(page, GARAGE_URL);
  }

  async expectLoaded() {
    await this._page.waitForURL(`**${this._url}`);
    await expect(this.selectors.heading).toBeVisible();
  }
}
