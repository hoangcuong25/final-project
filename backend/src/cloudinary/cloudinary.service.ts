import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryResponse } from "./cloudinary-response";
const streamifier = require("streamifier");

@Injectable()
export class CloudinaryService {
  //  Hàm upload hỗ trợ cả ảnh và video
  uploadFile(
    file: Express.Multer.File,
    folder = "uploads",
    resourceType: "auto" | "image" | "video" = "auto"
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType, //  quan trọng: cho phép video/mp4
        },
        (error, result) => {
          if (error) return reject(error);
          if (result) return resolve(result);
          reject(new Error("Upload result is undefined"));
        }
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
