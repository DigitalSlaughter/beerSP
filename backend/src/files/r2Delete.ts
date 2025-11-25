import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/r2client";

const bucket = process.env.R2_BUCKET_NAME!;

export async function deleteFromR2(key: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    await s3Client.send(command);
    console.log("Imagen eliminada de R2:", key);
  } catch (error) {
    console.error("Error eliminando archivo R2:", error);
  }
}
