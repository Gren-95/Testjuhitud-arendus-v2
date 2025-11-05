// Jest setup fail - loeb .env faili enne testide käivitamist
import { config } from 'dotenv';
import { resolve } from 'path';

// Leia .env fail projekti juurkaustast
config({ path: resolve(process.cwd(), '.env') });

