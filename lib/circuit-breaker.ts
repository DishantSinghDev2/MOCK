interface CircuitBreakerOptions {
  failureThreshold: number
  resetTimeout: number
  monitoringPeriod: number
}

type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN"

export class CircuitBreaker {
  private state: CircuitState = "CLOSED"
  private failureCount = 0
  private lastFailureTime = 0
  private successCount = 0

  constructor(private options: CircuitBreakerOptions) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailureTime < this.options.resetTimeout) {
        throw new Error("Circuit breaker is OPEN")
      }
      this.state = "HALF_OPEN"
      this.successCount = 0
    }

    try {
      const result = await operation()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess() {
    this.failureCount = 0
    if (this.state === "HALF_OPEN") {
      this.successCount++
      if (this.successCount >= 3) {
        this.state = "CLOSED"
      }
    }
  }

  private onFailure() {
    this.failureCount++
    this.lastFailureTime = Date.now()

    if (this.failureCount >= this.options.failureThreshold) {
      this.state = "OPEN"
    }
  }

  getState(): CircuitState {
    return this.state
  }
}
