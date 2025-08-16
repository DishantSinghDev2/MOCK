// Enhanced browser storage utilities for optimal UX
class StorageManager {
  // Local storage for persistent data
  setLocal<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn("[v0] LocalStorage failed:", error)
    }
  }

  getLocal<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.warn("[v0] LocalStorage read failed:", error)
      return null
    }
  }

  removeLocal(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn("[v0] LocalStorage remove failed:", error)
    }
  }

  // Session storage for temporary data
  setSession<T>(key: string, value: T): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn("[v0] SessionStorage failed:", error)
    }
  }

  getSession<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.warn("[v0] SessionStorage read failed:", error)
      return null
    }
  }

  removeSession(key: string): void {
    try {
      sessionStorage.removeItem(key)
    } catch (error) {
      console.warn("[v0] SessionStorage remove failed:", error)
    }
  }

  // Cookie utilities
  setCookie(name: string, value: string, days = 30): void {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
  }

  getCookie(name: string): string | null {
    const nameEQ = name + "="
    const ca = document.cookie.split(";")
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === " ") c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  }

  removeCookie(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
  }

  // Cache with TTL
  private cache = new Map<string, { value: any; expires: number }>()

  setCache<T>(key: string, value: T, ttlSeconds = 300): void {
    const expires = Date.now() + ttlSeconds * 1000
    this.cache.set(key, { value, expires })
  }

  getCache<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.expires) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  clearCache(): void {
    this.cache.clear()
  }

  // Optimistic updates
  optimisticUpdate<T>(key: string, updateFn: (current: T | null) => T): T {
    const current = this.getLocal<T>(key)
    const updated = updateFn(current)
    this.setLocal(key, updated)
    return updated
  }
}

export const storage = new StorageManager()
