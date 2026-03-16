export const isProd = () => process.env.NODE_ENV === 'production';

export function getSupportEnv() {
  const airtableToken = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;
  const airtableBaseId = process.env.AIRTABLE_BASE_ID;
  const airtableTableName = process.env.AIRTABLE_TABLE_NAME ?? 'Tickets';
  const s3Bucket = process.env.SUPPORT_S3_BUCKET;
  const s3Region = process.env.SUPPORT_S3_REGION ?? 'us-west-2';
  const s3AccessKeyId = process.env.SUPPORT_S3_ACCESS_KEY_ID;
  const s3SecretAccessKey = process.env.SUPPORT_S3_SECRET_ACCESS_KEY;

  if (!airtableToken || !airtableBaseId || !s3Bucket || !s3AccessKeyId || !s3SecretAccessKey) {
    throw new Error(
      'Missing required support env vars: AIRTABLE_PERSONAL_ACCESS_TOKEN, AIRTABLE_BASE_ID, SUPPORT_S3_BUCKET, SUPPORT_S3_ACCESS_KEY_ID, SUPPORT_S3_SECRET_ACCESS_KEY'
    );
  }

  return { airtableToken, airtableBaseId, airtableTableName, s3Bucket, s3Region, s3AccessKeyId, s3SecretAccessKey };
}
