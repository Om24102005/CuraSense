import { execFileSync } from 'node:child_process';
import { E2E } from '../playwright.config';

/** Start every run from an empty database. */
export default async function globalSetup() {
  execFileSync('mongosh', ['--quiet', E2E.mongo, '--eval', 'db.dropDatabase()'], { stdio: 'ignore' });
}
