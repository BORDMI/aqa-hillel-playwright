import { test as base } from '@playwright/test';
import { STORAGE_STATE } from '../config/paths.js';
import { Garage } from '../pages/Garage.js';

export { expect } from '@playwright/test';

export const test = base.extend({
  storageState: STORAGE_STATE,

  userGaragePage: async ({ page }, use) => {
    const garage = new Garage(page);
    await garage.open();

    await use(garage);
  },
});
