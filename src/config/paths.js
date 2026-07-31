import { fileURLToPath, URL } from 'url';

export const STORAGE_STATE = fileURLToPath(new URL('../../playwright/.auth/user.json', import.meta.url));
