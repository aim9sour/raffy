import type { BookInput, LibraryBook } from "@/lib/book-schema";
import type { EntityType, EntityUpdateInput, EntityView } from "@/components/entity-manager";

export type LibrarySnapshot = {
  books: LibraryBook[];
  entities: EntityView[];
};

export type OfflineOperation =
  | { id: string; type: "create-book"; localId: string; payload: BookInput }
  | { id: string; type: "update-book"; remoteId: string; payload: BookInput }
  | { id: string; type: "delete-book"; remoteId: string }
  | {
      id: string;
      type: "create-entity";
      localId: string;
      payload: { type: EntityType; name: string };
    }
  | { id: string; type: "update-entity"; remoteId: string; payload: EntityUpdateInput }
  | { id: string; type: "delete-entity"; remoteId: string };

const SNAPSHOT_KEY = "shelfwise.library.snapshot";
const QUEUE_KEY = "shelfwise.library.offlineQueue";

export function createLocalId(prefix = "local") {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}_${id}`;
}

export function isLocalId(id: string) {
  return id.startsWith("local_");
}

export function readCachedLibrarySnapshot(): LibrarySnapshot | null {
  return readJson<LibrarySnapshot>(SNAPSHOT_KEY);
}

export function cacheLibrarySnapshot(snapshot: LibrarySnapshot) {
  writeJson(SNAPSHOT_KEY, snapshot);
}

export function readOfflineQueue() {
  return readJson<OfflineOperation[]>(QUEUE_KEY) ?? [];
}

export function replaceOfflineQueue(queue: OfflineOperation[]) {
  writeJson(QUEUE_KEY, queue);
}

export function enqueueOfflineOperation(operation: OfflineOperation) {
  replaceOfflineQueue([...readOfflineQueue(), operation]);
}

export function removeQueuedCreate(localId: string) {
  replaceOfflineQueue(
    readOfflineQueue().filter(
      (operation) =>
        !(
          (operation.type === "create-book" || operation.type === "create-entity") &&
          operation.localId === localId
        ),
    ),
  );
}

export function updateQueuedCreate(localId: string, payload: BookInput) {
  replaceOfflineQueue(
    readOfflineQueue().map((operation) =>
      operation.type === "create-book" && operation.localId === localId
        ? { ...operation, payload }
        : operation,
    ),
  );
}

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(key);
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}
