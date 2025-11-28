"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

/**
 * Error Boundary Props
 */
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Error Boundary State
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the app.
 *
 * Features:
 * - Catches rendering errors, lifecycle errors, and constructor errors
 * - Displays user-friendly error message in Malay
 * - Logs errors to console for debugging
 * - Does not expose technical stack traces to users
 * - Allows graceful recovery with page reload option
 * - Event details remain visible even when errors occur
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <ComponentThatMightThrow />
 * </ErrorBoundary>
 * ```
 *
 * Or with custom fallback:
 * ```tsx
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <ComponentThatMightThrow />
 * </ErrorBoundary>
 * ```
 *
 * Note: Error boundaries only catch errors in components below them in the tree.
 * They do not catch errors in:
 * - Event handlers (use try-catch instead)
 * - Asynchronous code (use try-catch instead)
 * - Server-side rendering
 * - Errors thrown in the error boundary itself
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  /**
   * Update state when an error is caught
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Log error information for debugging
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log to console for debugging (server-side or client-side)
    console.error("[Error Boundary] Caught an error:", {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });

    // In production, you might want to log to an error monitoring service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    // if (process.env.NODE_ENV === 'production') {
    //   errorMonitoringService.logError(error, errorInfo);
    // }
  }

  /**
   * Reset error boundary state
   */
  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  /**
   * Reload the page to recover from error
   */
  handleReload = (): void => {
    window.location.reload();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-4">
          <Card className="border-baby-blue-light shadow-lg max-w-2xl w-full">
            <CardHeader className="border-b border-baby-blue-light/30 bg-red-50">
              <div className="flex items-center justify-center gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <CardTitle className="text-2xl font-semibold text-baby-blue-dark text-center">
                  Ralat Tidak Dijangka
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
                <p className="text-center text-baby-blue-dark font-medium">
                  Kami mengalami masalah teknikal yang tidak dijangka.
                </p>
                <p className="text-center text-baby-blue-dark text-sm">
                  Aplikasi telah menemui ralat semasa memuatkan halaman ini.
                </p>
              </div>

              <div className="border-t border-baby-blue-light/30 pt-4 space-y-4">
                <p className="text-center text-baby-blue-dark text-sm">
                  Sila cuba muat semula halaman untuk menyelesaikan masalah ini.
                </p>

                <div className="flex justify-center">
                  <button
                    onClick={this.handleReload}
                    className="bg-baby-blue hover:bg-baby-blue-dark text-white font-medium py-2 px-6 rounded-lg transition-colors"
                  >
                    Muat Semula Halaman
                  </button>
                </div>
              </div>

              <div className="text-center text-xs text-baby-blue-dark/70">
                Kami mohon maaf atas kesulitan ini. Jika masalah berterusan, sila hubungi penganjur.
              </div>

              {/* Show error details in development only */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="mt-6 p-4 bg-gray-100 rounded border border-gray-300">
                  <p className="text-xs font-mono text-gray-700 mb-2">
                    <strong>Development Error Details:</strong>
                  </p>
                  <p className="text-xs font-mono text-red-600 break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based alternative for functional components
 * Note: This is a wrapper around the class-based ErrorBoundary
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ErrorBoundary>
 *       <MyComponent />
 *     </ErrorBoundary>
 *   );
 * }
 * ```
 */
export function ErrorBoundaryWrapper({
  children,
  fallback,
}: ErrorBoundaryProps) {
  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
}
