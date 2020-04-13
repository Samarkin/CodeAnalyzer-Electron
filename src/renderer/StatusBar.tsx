import * as React from "react";
import { Typography, Box } from "@material-ui/core";

interface StatusBarProps {
  text?: string;
  height?: string|number;
}

export class StatusBar extends React.Component<StatusBarProps, {}> {
  render(): React.ReactNode {
    return (
      <Box width='100%' bgcolor='#DFDFDF'>
        <Typography>
          {this.props.text}
        </Typography>
      </Box>
    );
  }
}