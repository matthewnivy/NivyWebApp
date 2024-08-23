import React from "react";
import { Redirect } from "react-router-dom";

class MyErrorBoundaryExample extends React.Component {
  state = {
    error: null,
  };

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI.
    return { error: true };
  }

  render() {
    if (this.state.error) {
      // You can render any custom fallback UI
      return (
        <>
          <p>Something broke</p>
          <Redirect />
        </>
      );
    }
    return this.props.children;
  }
}

export default MyErrorBoundaryExample;
