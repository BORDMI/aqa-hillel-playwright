import { expect, request, test } from '@playwright/test';
import { AuthApi } from '../src/api/AuthApi.js';
import { config } from '../src/config/env.js';

const CARS_URL = '/api/cars';
const AUDI = { carBrandId: 1, carModelId: 1 };
const CONTEXT_OPTIONS = {
  baseURL: config.baseURL,
  httpCredentials: config.httpCredentials,
};

let authorized;
let anonymous;

test.beforeAll(async () => {
  authorized = await request.newContext(CONTEXT_OPTIONS);
  await new AuthApi(authorized).signInAsExistingUser(config.user);

  anonymous = await request.newContext(CONTEXT_OPTIONS);
});

test.afterAll(async () => {
  await authorized.dispose();
  await anonymous.dispose();
});

test.describe('POST /api/cars', () => {
  test('Creates a car for the signed-in user', async () => {
    const car = { ...AUDI, mileage: 100 };

    const response = await authorized.post(CARS_URL, { data: car });

    expect(response.status()).toBe(201);

    const { status, data } = await response.json();
    expect(status).toBe('ok');
    expect(data).toMatchObject({ ...car, initialMileage: car.mileage, brand: 'Audi', model: 'TT' });

    await authorized.delete(`${CARS_URL}/${data.id}`);
  });

  test('Rejects the request of an unauthenticated user', async () => {
    const response = await anonymous.post(CARS_URL, { data: { ...AUDI, mileage: 100 } });

    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ status: 'error', message: 'Not authenticated' });
  });

  test('Rejects a not existing car brand', async () => {
    const response = await authorized.post(CARS_URL, { data: { ...AUDI, carBrandId: 999, mileage: 100 } });

    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ status: 'error', message: 'Brand not found' });
  });

  test('Rejects a mileage out of the allowed range', async () => {
    const response = await authorized.post(CARS_URL, { data: { ...AUDI, mileage: 1000000 } });

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({
      status: 'error',
      message: 'Mileage has to be from 0 to 999999',
    });
  });
});
