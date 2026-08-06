import { expect, test } from '@playwright/test';
import { STORAGE_STATE } from '../src/config/paths.js';
import { Profile } from '../src/pages/Profile.js';
import { config } from '../src/config/env.js';

test.use({ storageState: STORAGE_STATE });

test('Profile page renders the mocked GET /api/users/profile response', async ({ page }) => {
  const mocked = { name: 'Stanislav', lastName: 'Taran' };
  const profile = new Profile(page);

  expect(`${mocked.name} ${mocked.lastName}`)
    .not.toEqual(`${config.user.name} ${config.user.lastName}`);

  await profile.mockProfileResponse(mocked);
  await profile.open();
  await profile.expectLoaded();

  await profile.expectUserName(mocked);
});
