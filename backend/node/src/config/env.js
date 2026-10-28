import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// backend/node/src/config -> backend/.env (shared with the Python AI gateway)
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

export const JWT_SECRET     = process.env.JWT_SECRET     || 'super_secret_neural_key_2026';
export const PYTHON_AI_URL  = process.env.PYTHON_AI_URL  || 'http://localhost:8000';
export const GATEWAY_SECRET = process.env.GATEWAY_SECRET || '';
export const MONGODB_URI    = process.env.MONGODB_URI;
export const PORT           = process.env.PORT || 5001;
