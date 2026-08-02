import { test as setup } from '@playwright/test';
import { AuthApi } from '../src/api/AuthApi.js';
import { config } from '../src/config/env.js';
import { STORAGE_STATE } from '../src/config/paths.js';

setup('Sign in via API and save the storage state', async ({ request }) => {
  await setup.step(`Sign in as ${config.user.email}`, async () => {
    await new AuthApi(request).signInAsExistingUser(config.user);
  });

  await setup.step(`Save the storage state to ${STORAGE_STATE}`, async () => {
    await request.storageState({ path: STORAGE_STATE });
  });
});
