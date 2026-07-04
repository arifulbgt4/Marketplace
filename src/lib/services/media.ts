import { unlink, mkdir, writeFile } from "fs/promises";
import { join, extname } from "path";
import { randomUUID } from "crypto";
import { ValidationError } from "src/lib/errors";

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface MediaFile {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface MediaResult {
  url: string;
  path: string;
  mimeType: string;
  size: number;
  originalName: string;
}

export interface MediaStorageAdapter {
  save(file: MediaFile, directory?: string): Promise<MediaResult>;
  delete(path: string): Promise<void>;
  getUrl(path: string): string;
}

export class LocalMediaAdapter implements MediaStorageAdapter {
  private readonly basePath: string;
  private readonly baseUrl: string;

  constructor(basePath?: string, baseUrl?: string) {
    this.basePath = basePath ?? join(process.cwd(), "public", "uploads");
    this.baseUrl = baseUrl ?? "/uploads";
  }

  async save(file: MediaFile, directory: string = "general"): Promise<MediaResult> {
    this.validateFile(file);

    const ext = extname(file.originalName) || ".bin";
    const filename = `${randomUUID()}${ext}`;
    const relativePath = join(directory, filename);
    const fullPath = join(this.basePath, relativePath);

    await mkdir(join(this.basePath, directory), { recursive: true });
    await writeFile(fullPath, new Uint8Array(file.buffer));

    return {
      url: `${this.baseUrl}/${relativePath}`,
      path: relativePath,
      mimeType: file.mimeType,
      size: file.size,
      originalName: file.originalName,
    };
  }

  async delete(path: string): Promise<void> {
    const fullPath = join(this.basePath, path);
    try {
      await unlink(fullPath);
    } catch {
      // File not found is acceptable
    }
  }

  getUrl(path: string): string {
    return `${this.baseUrl}/${path}`;
  }

  validateFile(file: MediaFile): void {
    if (file.size > MAX_FILE_SIZE) {
      throw new ValidationError(
        `File size ${file.size} exceeds maximum of ${MAX_FILE_SIZE} bytes`
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimeType as AllowedMimeType)) {
      throw new ValidationError(`File type ${file.mimeType} is not allowed`);
    }
  }
}

export class MediaService {
  private adapter: MediaStorageAdapter;

  constructor(adapter?: MediaStorageAdapter) {
    this.adapter = adapter ?? new LocalMediaAdapter();
  }

  setAdapter(adapter: MediaStorageAdapter): void {
    this.adapter = adapter;
  }

  async upload(file: MediaFile, directory?: string): Promise<MediaResult> {
    return this.adapter.save(file, directory);
  }

  async remove(path: string): Promise<void> {
    return this.adapter.delete(path);
  }

  getUrl(path: string): string {
    return this.adapter.getUrl(path);
  }

  async uploadFromBuffer(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    directory?: string
  ): Promise<MediaResult> {
    return this.adapter.save(
      { buffer, originalName, mimeType, size: buffer.length },
      directory
    );
  }
}

export const mediaService = new MediaService();
