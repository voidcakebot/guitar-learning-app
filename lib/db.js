import { neon } from '@neondatabase/serverless';

const connectionString =
  process.env.GUITAR_POSTGRES_URL ||
  process.env.GUITAR_DATABASE_URL ||
  process.env.GUITAR_POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  '';

export function getSql() {
  if (!connectionString) {
    throw new Error('Database connection string is not configured');
  }

  return neon(connectionString);
}
