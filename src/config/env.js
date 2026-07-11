import dotenv from 'dotenv';
import { fileURLToPath, URL } from 'url';

dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) });

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const config = {
  baseURL: required('BASE_URL'),
  httpCredentials: {
    username: required('HTTP_CREDENTIALS_USERNAME'),
    password: required('HTTP_CREDENTIALS_PASSWORD'),
  },
};
