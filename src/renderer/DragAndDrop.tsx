import * as React from 'react';

export class DragAndDrop extends React.Component {
  componentDidMount(): void {
    // Handle files dragged-n-dropped onto the browser window, so that Electron doesn't leave the page and
    // load that file natively instead.
    document.ondragover = document.ondrop = (event): void => {
      event.preventDefault();
    };
  }

  componentWillUnmount(): void {
    document.ondragover = document.ondrop = null;
  }

  render(): React.ReactNode {
    return <></>;
  }
}