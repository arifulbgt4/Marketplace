import { unlink, mkdir, writeFile } from "fs/promises";
import { join, resolve, sep } from "path";
import { randomUUID } from "crypto";
import { ValidationError } from "src/lib/errors";

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const EXTENSIONS: Record<AllowedMimeType, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
};

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

  async save(
    file: MediaFile,
    directory: string = "general",
  ): Promise<MediaResult> {
    this.validateFile(file);
    const safeDirectory = this.safeRelativePath(directory);

    const ext = EXTENSIONS[file.mimeType as AllowedMimeType];
    const filename = `${randomUUID()}${ext}`;
    const relativePath = join(safeDirectory, filename);
    const fullPath = this.resolveInsideBase(relativePath);

    await mkdir(this.resolveInsideBase(safeDirectory), { recursive: true });
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
    const fullPath = this.resolveInsideBase(this.safeRelativePath(path));
    try {
      await unlink(fullPath);
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }

  getUrl(path: string): string {
    return `${this.baseUrl}/${this.safeRelativePath(path).replaceAll("\\", "/")}`;
  }

  validateFile(file: MediaFile): void {
    if (file.size > MAX_FILE_SIZE) {
      throw new ValidationError(
        `File size ${file.size} exceeds maximum of ${MAX_FILE_SIZE} bytes`,
      );
    }
    if (file.size !== file.buffer.length) {
      throw new ValidationError(
        "Declared file size does not match the uploaded content",
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimeType as AllowedMimeType)) {
      throw new ValidationError(`File type ${file.mimeType} is not allowed`);
    }
    if (!this.matchesSignature(file.buffer, file.mimeType as AllowedMimeType)) {
      throw new ValidationError(
        "File content does not match its declared type",
      );
    }
  }

  private matchesSignature(buffer: Buffer, mimeType: AllowedMimeType): boolean {
    if (mimeType === "image/jpeg")
      return (
        buffer.length >= 3 &&
        buffer[0] === 0xff &&
        buffer[1] === 0xd8 &&
        buffer[2] === 0xff
      );
    if (mimeType === "image/png") {
      const signature = [137, 80, 78, 71, 13, 10, 26, 10];
      return signature.every((byte, index) => buffer[index] === byte);
    }
    if (mimeType === "image/gif")
      return ["GIF87a", "GIF89a"].includes(
        buffer.subarray(0, 6).toString("ascii"),
      );
    return (
      buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP"
    );
  }

  private safeRelativePath(path: string): string {
    if (
      !path ||
      path.includes("\0") ||
      path.startsWith("/") ||
      path.startsWith("\\")
    ) {
      throw new ValidationError("Invalid media path");
    }
    const normalized = path.replaceAll("\\", "/");
    if (
      normalized
        .split("/")
        .some((part) => part === ".." || part === "." || part === "")
    ) {
      throw new ValidationError("Invalid media path");
    }
    return normalized;
  }

  private resolveInsideBase(path: string): string {
    const base = resolve(this.basePath);
    const target = resolve(base, path);
    if (target !== base && !target.startsWith(`${base}${sep}`)) {
      throw new ValidationError("Invalid media path");
    }
    return target;
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
    directory?: string,
  ): Promise<MediaResult> {
    return this.adapter.save(
      { buffer, originalName, mimeType, size: buffer.length },
      directory,
    );
  }
}

export const mediaService = new MediaService();
