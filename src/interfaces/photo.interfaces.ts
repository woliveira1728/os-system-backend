export interface UploadPhotoBody {
  description?: string;
}

export interface PhotoUploadResponse {
  id: string;
  orderId: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  description?: string;
  createdAt: Date;
}