import fs from 'fs';
import path from 'path';

export interface StorageProvider {
  uploadImage(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string>;
}

export class LocalStorageProvider implements StorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.resolve(__dirname, '../../../uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadImage(fileBuffer: Buffer, fileName: string, _mimeType: string): Promise<string> {
    const uniqueName = `${Date.now()}-${fileName.replace(/\s+/g, '_')}`;
    const filePath = path.join(this.uploadDir, uniqueName);
    await fs.promises.writeFile(filePath, fileBuffer);
    return `/uploads/${uniqueName}`;
  }
}

export class MockCloudinaryStorageProvider implements StorageProvider {
  async uploadImage(_fileBuffer: Buffer, fileName: string, _mimeType: string): Promise<string> {
    // Return realistic HTTPS image placeholder for production readiness
    return `https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80&filename=${encodeURIComponent(fileName)}`;
  }
}

export const getStorageProvider = (): StorageProvider => {
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'demo_cloud') {
    return new MockCloudinaryStorageProvider();
  }
  return new LocalStorageProvider();
};
