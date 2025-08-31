#!/usr/bin/env bun

import { resetDatabase } from '@/lib/initDatabase';

async function runReset() {
  try {
    console.log('Starting database reset...');
    await resetDatabase();
    console.log('Database reset completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database reset failed:', error);
    process.exit(1);
  }
}

runReset();
