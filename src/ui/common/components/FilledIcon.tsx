import Icon, { type IconProps } from "@mui/material/Icon";
import { styled } from "@mui/material/styles";

/** A Material UI Icon styled to display the Filled variant */
export const FilledIcon = styled(({ children, ...props }: IconProps) => (
  <Icon {...props}>{children}</Icon>
))({ fontVariationSettings: "'FILL' 1" });
