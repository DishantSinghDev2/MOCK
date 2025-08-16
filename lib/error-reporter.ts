interface ErrorReport {
  id: string
  timestamp: Date
  level: "error" | "warning" | "info"
  message: string
  stack?: string
  context: Record<string, any>
  userId?: string
  sessionId?: string
}

class ErrorReporter {
  private errors: ErrorReport[] = []
  private maxErrors = 1000

  report(error: Error | string, context: Record<string, any> = {}, level: "error" | "warning" | "info" = "error") {
    const report: ErrorReport = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      level,
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      context,
      userId: context.userId,
      sessionId: context.sessionId || this.getSessionId(),
    }

    this.errors.unshift(report)
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors)
    }

    this.persistError(report)

    if (level === "error") {
      this.sendAlert(report)
    }

    console.error("[ErrorReporter]", report)
  }

  private persistError(error: ErrorReport) {
    try {
      const stored = JSON.parse(localStorage.getItem("error_reports") || "[]")
      stored.unshift(error)
      localStorage.setItem("error_reports", JSON.stringify(stored.slice(0, 100)))
    } catch (e) {
      console.warn("Failed to persist error report:", e)
    }
  }

  private sendAlert(error: ErrorReport) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("systemAlert", {
          detail: {
            type: "error",
            severity: "high",
            message: error.message,
            timestamp: error.timestamp,
            context: error.context,
          },
        }),
      )
    }
  }

  private getSessionId(): string {
    if (typeof window === "undefined") return "server"

    let sessionId = sessionStorage.getItem("session_id")
    if (!sessionId) {
      sessionId = Math.random().toString(36).substr(2, 9)
      sessionStorage.setItem("session_id", sessionId)
    }
    return sessionId
  }

  getErrors(level?: "error" | "warning" | "info"): ErrorReport[] {
    return level ? this.errors.filter((e) => e.level === level) : this.errors
  }

  clearErrors() {
    this.errors = []
    localStorage.removeItem("error_reports")
  }

  measurePerformance<T>(operation: string, fn: () => T): T {
    const start = performance.now()
    try {
      const result = fn()
      const duration = performance.now() - start

      if (duration > 1000) {
        // Log slow operations
        this.report(
          `Slow operation: ${operation} took ${duration.toFixed(2)}ms`,
          {
            operation,
            duration,
            performance: true,
          },
          "warning",
        )
      }

      return result
    } catch (error) {
      const duration = performance.now() - start
      this.report(error as Error, {
        operation,
        duration,
        performance: true,
      })
      throw error
    }
  }

  async measureAsync<T>(operation: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    try {
      const result = await fn()
      const duration = performance.now() - start

      if (duration > 2000) {
        // Log slow async operations
        this.report(
          `Slow async operation: ${operation} took ${duration.toFixed(2)}ms`,
          {
            operation,
            duration,
            performance: true,
            async: true,
          },
          "warning",
        )
      }

      return result
    } catch (error) {
      const duration = performance.now() - start
      this.report(error as Error, {
        operation,
        duration,
        performance: true,
        async: true,
      })
      throw error
    }
  }
}

export const errorReporter = new ErrorReporter()

if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    errorReporter.report(event.error || event.message, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      type: "javascript_error",
    })
  })

  window.addEventListener("unhandledrejection", (event) => {
    errorReporter.report(event.reason, {
      type: "unhandled_promise_rejection",
    })
  })
}
