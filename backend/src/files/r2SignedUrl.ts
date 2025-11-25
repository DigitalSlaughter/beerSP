import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../config/r2client";

const bucket = process.env.R2_BUCKET_NAME!;

export async function generateSignedUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key
  });

  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 60 * 60 * 24 // 24 horas
  });

  return signedUrl;
}
