import React from 'react';

interface Props {
  children: React.ReactNode;
  content: React.ReactNode;
}
interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state = {
    hasError: false,
  };

  constructor(props: Props) {
    super(props);
  }

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    const { hasError } = this.state;
    return hasError
      ? this.props.content || <div>Content Load Failed</div>
      : this.props.children;
  }
}
