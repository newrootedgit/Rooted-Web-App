import pg from 'pg';

const connectionString = process.env.TIMESCALE_DATABASE_URL;

if (!connectionString) {
  console.warn('[TimescaleDB] TIMESCALE_DATABASE_URL not set — telemetry writes will fail until configured');
}

export const timescale = connectionString
  ? new pg.Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
    })
  : null;
