import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const SOURCE_ROOT = path.resolve(process.cwd(), "src");
const MODULE_ROOT = path.join(SOURCE_ROOT, "modules");
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);

const IMPORT_PATTERN =
  /(?:import|export)\s+(?:[^"'`]*?\s+from\s+)?["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)/g;

function listSourceFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return listSourceFiles(entryPath);
    }

    return SOURCE_EXTENSIONS.has(path.extname(entry.name)) ? [entryPath] : [];
  });
}

function readImportSpecifiers(filePath: string): string[] {
  const source = fs.readFileSync(filePath, "utf8");

  return Array.from(source.matchAll(IMPORT_PATTERN), (match) => match[1] ?? match[2]);
}

function moduleNameFor(filePath: string): string | undefined {
  const relativePath = path.relative(MODULE_ROOT, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return undefined;
  }

  return relativePath.split(path.sep)[0];
}

function boundaryViolation(importerPath: string, specifier: string): string | undefined {
  const aliasMatch = specifier.match(/^src\/modules\/([^/]+)(?:\/(.+))?$/);

  if (aliasMatch?.[2]) {
    return `deep module import "${specifier}"; import from "src/modules/${aliasMatch[1]}"`;
  }

  if (!specifier.startsWith(".")) {
    return undefined;
  }

  const resolvedImport = path.resolve(path.dirname(importerPath), specifier);
  const targetModule = moduleNameFor(resolvedImport);

  if (!targetModule) {
    return undefined;
  }

  const importerModule = moduleNameFor(importerPath);

  if (importerModule !== targetModule) {
    return `relative cross-module import "${specifier}"; import from "src/modules/${targetModule}"`;
  }

  return undefined;
}

describe("module boundary convention", () => {
  it("classifies public, internal, and forbidden imports", () => {
    const catalogFile = path.join(MODULE_ROOT, "catalog", "application", "read.ts");
    const orderFile = path.join(MODULE_ROOT, "order", "application", "place.ts");
    const apiFile = path.join(SOURCE_ROOT, "app", "api", "catalog", "route.ts");

    expect(boundaryViolation(orderFile, "src/modules/catalog")).toBeUndefined();
    expect(boundaryViolation(catalogFile, "../domain/product")).toBeUndefined();
    expect(boundaryViolation(apiFile, "src/modules/catalog/repository/product")).toContain(
      "deep module import",
    );
    expect(boundaryViolation(orderFile, "../../catalog/domain/product")).toContain(
      "relative cross-module import",
    );
  });

  it("requires a public entry point for every concrete module directory", () => {
    const missingEntryPoints = fs
      .readdirSync(MODULE_ROOT, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
      .filter((entry) => !fs.existsSync(path.join(MODULE_ROOT, entry.name, "index.ts")))
      .map((entry) => `src/modules/${entry.name}/index.ts`);

    expect(missingEntryPoints).toEqual([]);
  });

  it("does not bypass a module public API anywhere in src", () => {
    const violations = listSourceFiles(SOURCE_ROOT).flatMap((filePath) =>
      readImportSpecifiers(filePath).flatMap((specifier) => {
        const violation = boundaryViolation(filePath, specifier);

        if (!violation) {
          return [];
        }

        return [`${path.relative(process.cwd(), filePath)}: ${violation}`];
      }),
    );

    expect(violations).toEqual([]);
  });
});
