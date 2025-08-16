// Client-side database using IndexedDB for persistent storage
class MockDB {
  private dbName = "mock-by-dit"
  private version = 1
  private db: IDBDatabase | null = null

  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object stores
        if (!db.objectStoreNames.contains("users")) {
          db.createObjectStore("users", { keyPath: "id" })
        }
        if (!db.objectStoreNames.contains("projects")) {
          const projectStore = db.createObjectStore("projects", { keyPath: "id" })
          projectStore.createIndex("userId", "userId", { unique: false })
        }
        if (!db.objectStoreNames.contains("mocks")) {
          const mockStore = db.createObjectStore("mocks", { keyPath: "id" })
          mockStore.createIndex("projectId", "projectId", { unique: false })
        }
        if (!db.objectStoreNames.contains("tests")) {
          const testStore = db.createObjectStore("tests", { keyPath: "id" })
          testStore.createIndex("projectId", "projectId", { unique: false })
        }
        if (!db.objectStoreNames.contains("logs")) {
          const logStore = db.createObjectStore("logs", { keyPath: "id" })
          logStore.createIndex("projectId", "projectId", { unique: false })
          logStore.createIndex("timestamp", "timestamp", { unique: false })
        }
        if (!db.objectStoreNames.contains("organizations")) {
          db.createObjectStore("organizations", { keyPath: "id" })
        }
        if (!db.objectStoreNames.contains("subscriptions")) {
          const subStore = db.createObjectStore("subscriptions", { keyPath: "id" })
          subStore.createIndex("userId", "userId", { unique: false })
        }
      }
    })
  }

  async get<T>(storeName: string, key: string): Promise<T | null> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readonly")
      const store = transaction.objectStore(storeName)
      const request = store.get(key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || null)
    })
  }

  async getAll<T>(storeName: string, indexName?: string, indexValue?: any): Promise<T[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readonly")
      const store = transaction.objectStore(storeName)

      let request: IDBRequest
      if (indexName && indexValue !== undefined) {
        const index = store.index(indexName)
        request = index.getAll(indexValue)
      } else {
        request = store.getAll()
      }

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || [])
    })
  }

  async put<T>(storeName: string, data: T): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.put(data)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async delete(storeName: string, key: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.delete(key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
}

export const db = new MockDB()
