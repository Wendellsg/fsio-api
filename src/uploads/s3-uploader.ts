/* eslint-disable no-var */
import { S3 } from 'aws-sdk';
import 'dotenv/config';

const s3 = new S3({
  accessKeyId: process.env.S3_BUCKET_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_BUCKET_SECRET_ACCESS_KEY,
  region: process.env.S3_BUCKET_REGION,
  signatureVersion: 'v4',
});

export const s3Uploader: (
  file: Express.Multer.File,
  folder: string,
) => Promise<string> = async (file, folder) => {
  const key = `${Date.now().toString()}.${file.mimetype.split('/')[1]}`;
  const params = {
    Bucket: `${process.env.S3_BUCKET_NAME}/${folder}`,
    Key: key,
    Body: file.buffer,
  };

  const res = await s3.upload(params).promise();
  return res.Location;
};

export const s3Delete: (key: string) => Promise<void> = async (key) => {
  const params = {
    Bucket: `${process.env.S3_BUCKET_NAME}`,
    Key: key,
  };

  await s3.deleteObject(params).promise();
};

export const s3PreSignedUrl: (key: string) => Promise<string> = async (key) => {
  const params = {
    Bucket: `${process.env.S3_BUCKET_NAME}`,
    Key: key,
    Expires: 60,
  };

  const res = s3.getSignedUrlPromise('putObject', params);
  return res;
};
