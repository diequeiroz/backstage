import React, { createRef } from 'react';

interface GrafanaIframeProps {
  src: string,
  message?: Message
}

interface Message {
  timerange: {
    from: Date,
    to: Date,
  }
}

class GrafanaIframe extends React.Component<GrafanaIframeProps> {

  ref: React.RefObject<HTMLIFrameElement>;

  constructor(props: GrafanaIframeProps) {
    super(props);
    this.ref = createRef<HTMLIFrameElement>();
  }

  render() {
    if (this.props && this.props.message) {
      if (this.ref.current != null && this.ref.current.contentWindow != null) {
        this.ref.current.contentWindow.postMessage(this.props.message, "http://localhost:7007")
      }
    }
    return <iframe ref={this.ref} src={this.props.src} width="100%" height="450" frameBorder="0" />
  }

}

export { GrafanaIframe }
export type { Message }