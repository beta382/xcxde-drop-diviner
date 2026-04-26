import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import type { ReactNode } from "react";
import { FilledIcon } from "~/ui/common/components/FilledIcon";
import { useBreakpoint } from "~/ui/common/hooks";

export interface SettingProps {
  tooltip?: string;
}

export function Setting({
  tooltip,
  children,
}: SettingProps & {
  children: ReactNode;
}) {
  const breakpoint = useBreakpoint();

  return (
    <Stack
      direction="row"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {tooltip !== undefined && (
        <Tooltip
          title={tooltip}
          arrow
          placement={breakpoint !== "mobile" ? "left" : "right"}
          slotProps={
            breakpoint !== "mobile"
              ? undefined
              : {
                  popper: {
                    disablePortal: true,
                    sx: { maxWidth: "calc(100% - 52px)" },
                  },
                }
          }
        >
          <FilledIcon fontSize="small" sx={{ marginRight: 2 }}>
            info
          </FilledIcon>
        </Tooltip>
      )}
      {children}
    </Stack>
  );
}
