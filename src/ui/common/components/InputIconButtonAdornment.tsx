import Icon from "@mui/material/Icon";
import type { IconButtonProps } from "@mui/material/IconButton";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import type { Except } from "type-fest";
import { FilledIcon } from "~/ui/common/components/FilledIcon";
import { useBreakpoint } from "~/ui/common/hooks";

/**
 * A component with an IconButton and a Tooltip intended to be inserted as an
 * adornment to Material UI's TextField and the like.
 *
 * @param props Component props
 * @param props.position Whether this adornment is a start or end adornment
 * @param props.tooltip The tooltip text. If falsy, or if disabled is passed,
 *   the tooltip will be suppressed
 * @param props.filledIcon Whether the icon should display as filled or not (if
 *   supported)
 * @param props.children The chidren of the inner Icon (generally the icon name)
 * @param props.props Other props to pass through to the Material UI IconButton
 * @returns The component
 */
export function InputIconButtonAdornment({
  position = "end",
  tooltip,
  filledIcon = false,
  children,
  ...props
}: {
  position?: "start" | "end";
  tooltip?: string;
  filledIcon?: boolean;
} & Except<
  IconButtonProps,
  "size" // because we hardcode the negative margins
>) {
  const breakpoint = useBreakpoint();

  return (
    <InputAdornment
      position={position}
      sx={position === "end" ? { paddingRight: 0 } : { paddingLeft: 0 }}
    >
      <Tooltip
        title={!(props.disabled ?? false) ? tooltip : undefined}
        placement={breakpoint === "desktop" ? "bottom" : "top"}
        arrow
      >
        <span style={{ marginLeft: "-12px", marginRight: "-12px" }}>
          <IconButton {...props}>
            {filledIcon ? (
              <FilledIcon>{children}</FilledIcon>
            ) : (
              <Icon>{children}</Icon>
            )}
          </IconButton>
        </span>
      </Tooltip>
    </InputAdornment>
  );
}
