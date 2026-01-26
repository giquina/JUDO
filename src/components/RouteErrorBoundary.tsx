import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  /** Name of the route section for error context (e.g., "Member", "Coach", "Admin") */
  sectionName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * RouteErrorBoundary - Catches errors for individual route sections
 *
 * Unlike the global ErrorBoundary, this component:
 * - Only catches errors within a specific route section
 * - Allows retry without full page reload
 * - Preserves navigation to other sections
 */
export default class RouteErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error(`[RouteErrorBoundary${this.props.sectionName ? ` - ${this.props.sectionName}` : ""}] Error caught:`, {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    this.setState({ errorInfo });
  }

  private handleRetry = () => {
    // Reset error state to re-render children
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleGoHome = () => {
    // Navigate to home and reset state
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      const { sectionName } = this.props;
      const { error } = this.state;

      return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-xl">
                {sectionName
                  ? `Something went wrong in ${sectionName}`
                  : "Something went wrong"}
              </CardTitle>
              <CardDescription>
                An error occurred while loading this page. You can try again or return to the home page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <details className="group">
                  <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
                    View error details
                  </summary>
                  <pre className="mt-2 text-xs bg-muted p-3 rounded-lg overflow-auto max-h-40 whitespace-pre-wrap break-words">
                    <strong>Error:</strong> {error.message}
                    {error.stack && (
                      <>
                        {"\n\n"}
                        <strong>Stack trace:</strong>
                        {"\n"}
                        {error.stack}
                      </>
                    )}
                  </pre>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={this.handleRetry}
                  className="flex-1"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="flex-1"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
