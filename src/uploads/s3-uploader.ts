/* eslint-disable no-var */
import * as s3 from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import 'dotenv/config';

const client = new s3.S3Client({
  region: process.env.S3_BUCKET_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_BUCKET_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_BUCKET_SECRET_ACCESS_KEY || '',
  },
});

export const s3Delete: (key: string) => Promise<void> = async (key) => {
  const command = new s3.DeleteObjectCommand({
    Bucket: `${process.env.AWS_S3_BUCKET_NAME}`,
    Key: key,
  });

  try {
    await client.send(command);
  } catch (err) {
    console.error(err);
  }
};

export const createPresigned = ({ key }: { key: string }) => {
  const command = new s3.PutObjectCommand({
    Bucket: `${process.env.S3_BUCKET_NAME}`,
    Key: key,
  });
  return getSignedUrl(client, command, { expiresIn: 3600 });
};
