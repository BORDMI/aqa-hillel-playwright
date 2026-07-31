import { expect } from '@playwright/test';

const SIGN_IN_URL = '/api/auth/signin';
const SIGN_UP_URL = '/api/auth/signup';

export class AuthApi {
  constructor(request) {
    this._request = request;
  }

  signIn(user) {
    return this._request.post(SIGN_IN_URL, {
      data: {
        email: user.email,
        password: user.password,
        remember: false,
      },
    });
  }

  signUp(user) {
    return this._request.post(SIGN_UP_URL, {
      data: {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        repeatPassword: user.password,
      },
    });
  }

  async signInAsExistingUser(user) {
    let response = await this.signIn(user);

    if (!response.ok()) {
      const signUpResponse = await this.signUp(user);
      expect(
        signUpResponse.ok(),
        `Failed to register ${user.email}: ${await signUpResponse.text()}`,
      ).toBeTruthy();
      response = await this.signIn(user);
    }

    expect(response.ok(), `Failed to sign in as ${user.email}: ${await response.text()}`).toBeTruthy();
    return (await response.json()).data;
  }
}
