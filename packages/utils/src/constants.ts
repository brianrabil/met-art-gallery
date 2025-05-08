import path from "node:path";

export const MONOREPO_ROOT_DIR = path.resolve(import.meta.dir, "../../..");
export const APPS_DIR = path.resolve(MONOREPO_ROOT_DIR, "apps");
export const PACKAGES_DIR = path.resolve(MONOREPO_ROOT_DIR, "packages");
export const UTILS_DIR = path.resolve(PACKAGES_DIR, "utils");
export const WEB_DIR = path.resolve(APPS_DIR, "web");
