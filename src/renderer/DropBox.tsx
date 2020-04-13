import * as React from 'react';
import { Box } from '@material-ui/core';

interface DropBoxProps {
  onDrop: (file: File) => void;
}

interface DropBoxState {
  isDragging?: boolean;
}

export class DropBox extends React.Component<DropBoxProps, DropBoxState> {
  constructor(props: DropBoxProps) {
    super(props);
    this.state = {};
  }

  onDragEnter = (): void => {
    this.setState({isDragging: true});
  }

  onDragLeave = (): void => {
    this.setState({isDragging: false});
  }

  onDrop = (ev: React.DragEvent<HTMLElement>): void => {
    ev.preventDefault();
    this.setState({isDragging: false});
    const file: File = ev.dataTransfer?.files?.[0];
    if (!file) {
      return;
    }
    this.props.onDrop(file);
  }

  render(): React.ReactNode {
    return (
      <Box
        id='dropbox'
        bgcolor={this.state.isDragging ? 'rgba(121, 187, 231, 0.43)' : 'transparent'}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
        width='100%'
        height='100%'
      >
        {this.props.children}
      </Box>
    );
  }
}