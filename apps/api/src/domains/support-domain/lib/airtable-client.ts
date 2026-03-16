import { TRPCError } from '@trpc/server';
import { getSupportEnv } from '../../../lib/env.js';

export async function createAirtableRecord(fields: Record<string, unknown>) {
  const env = getSupportEnv();
  const url = `https://api.airtable.com/v0/${env.airtableBaseId}/${encodeURIComponent(env.airtableTableName)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.airtableToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: `AirTable error ${response.status}: ${body}`,
    });
  }

  return response.json();
}
