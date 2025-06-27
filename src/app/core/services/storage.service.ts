import { Injectable } from '@angular/core';

export enum StorageType {
  LOCAL = 'localStorage',
  SESSION = 'sessionStorage',
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private currentStorageType: StorageType = StorageType.SESSION;

  constructor() {}

  /**
   * Set the storage type to use for subsequent operations
   * @param type - StorageType.LOCAL for localStorage or StorageType.SESSION for sessionStorage
   */
  setStorageType(type: StorageType): void {
    this.currentStorageType = type;
  }

  /**
   * Get the current storage type being used
   */
  getCurrentStorageType(): StorageType {
    return this.currentStorageType;
  }

  /**
   * Get the appropriate storage instance based on current storage type
   */
  private getStorage(): Storage | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return this.currentStorageType === StorageType.LOCAL
      ? window.localStorage
      : window.sessionStorage;
  }

  /**
   * Store an item in the current storage
   * @param key - The key to store the item under
   * @param value - The value to store (will be JSON stringified)
   */
  setItem(key: string, value: any): void {
    const storage = this.getStorage();
    if (storage) {
      try {
        const serializedValue =
          typeof value === 'string' ? value : JSON.stringify(value);
        storage.setItem(key, serializedValue);
      } catch (error) {
        console.error(
          `Error storing item in ${this.currentStorageType}:`,
          error
        );
      }
    }
  }

  /**
   * Retrieve an item from the current storage
   * @param key - The key to retrieve
   * @returns The stored value or null if not found
   */
  getItem(key: string): string | null {
    const storage = this.getStorage();
    if (storage) {
      try {
        return storage.getItem(key);
      } catch (error) {
        console.error(
          `Error retrieving item from ${this.currentStorageType}:`,
          error
        );
      }
    }
    return null;
  }

  /**
   * Retrieve and parse a JSON item from the current storage
   * @param key - The key to retrieve
   * @returns The parsed object or null if not found or invalid JSON
   */
  getItemAsObject<T>(key: string): T | null {
    const item = this.getItem(key);
    if (item) {
      try {
        return JSON.parse(item) as T;
      } catch (error) {
        console.error(
          `Error parsing JSON item from ${this.currentStorageType}:`,
          error
        );
      }
    }
    return null;
  }

  /**
   * Remove an item from the current storage
   * @param key - The key to remove
   */
  removeItem(key: string): void {
    const storage = this.getStorage();
    if (storage) {
      try {
        storage.removeItem(key);
      } catch (error) {
        console.error(
          `Error removing item from ${this.currentStorageType}:`,
          error
        );
      }
    }
  }

  /**
   * Clear all items from the current storage
   */
  clear(): void {
    const storage = this.getStorage();
    if (storage) {
      try {
        storage.clear();
      } catch (error) {
        console.error(`Error clearing ${this.currentStorageType}:`, error);
      }
    }
  }

  /**
   * Check if a key exists in the current storage
   * @param key - The key to check
   */
  hasItem(key: string): boolean {
    return this.getItem(key) !== null;
  }

  /**
   * Get all keys from the current storage
   */
  getAllKeys(): string[] {
    const storage = this.getStorage();
    if (storage) {
      try {
        const keys: string[] = [];
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          if (key) keys.push(key);
        }
        return keys;
      } catch (error) {
        console.error(
          `Error getting keys from ${this.currentStorageType}:`,
          error
        );
      }
    }
    return [];
  }

  /**
   * Get the length (number of items) in the current storage
   */
  getLength(): number {
    const storage = this.getStorage();
    return storage ? storage.length : 0;
  }
}
