
import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error);
    console.error("Error details:", errorInfo);

    this.setState({ error, errorInfo });

    // Optional: Send error details to a monitoring service (e.g., Sentry, LogRocket)
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
          <h2>Something went wrong.</h2>
          <p>
            <strong>Error:</strong> {this.state.error?.toString()}
          </p>
          <details
            style={{
              whiteSpace: "pre-wrap",
              textAlign: "left",
              margin: "auto",
              maxWidth: "600px",
            }}
          >
            {this.state.errorInfo?.componentStack}
          </details>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
