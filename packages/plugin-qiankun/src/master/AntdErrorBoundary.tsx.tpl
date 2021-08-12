import React from 'react';
import { Result, Button } from 'antd';

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
      ? this.props.content || (
          <Result
            status="500"
            title="load web page failed"
            subTitle="please refresh the page and try again"
            extra={
              <Button onClick={() => window.location.reload()} type="primary">
                refresh
              </Button>
            }
          />
        )
      : this.props.children;
  }
}
