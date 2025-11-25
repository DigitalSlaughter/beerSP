import multer from "multer";
import multerS3 from "multer-s3";
import { s3Client } from "./r2client";

const bucketName = process.env.R2_BUCKET_NAME!;

export const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: bucketName,
    key: (req, file, cb) => {
      const timestamp = Date.now();
      cb(null, `${timestamp}_${file.originalname}`);
    },
  }),
});

