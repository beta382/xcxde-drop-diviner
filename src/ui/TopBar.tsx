import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import XcxIcon from "~/assets/icons/Game_Logo.svg?react";
import GitHubIcon from "~/assets/icons/GitHub_Invertocat_White.svg?react";
import { FilledIcon } from "~/ui/common/components/FilledIcon";
import { useBreakpoint } from "~/ui/common/hooks";
import { Settings } from "~/ui/settings/Settings";

export function TopBar() {
  const breakpoint = useBreakpoint();

  const [t] = useTranslation();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <AppBar position="sticky" elevation={16}>
        <Toolbar>
          <SvgIcon component={XcxIcon} inheritViewBox fontSize="large" />
          {breakpoint !== "mobile" ? (
            <Typography
              variant="h4"
              sx={{
                flexGrow: 1,
                marginLeft: 2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {t(($) => $.shortTitle)}
            </Typography>
          ) : (
            <Box sx={{ flexGrow: 1 }}></Box>
          )}
          <Stack direction="row" spacing={1}>
            <IconButton
              size="large"
              href="https://docs.google.com/document/d/1LSj02XSdihvrqijTrckVvidrTGUe163ufec1_EYR6C0"
              target="_blank"
              rel="noreferrer"
            >
              <Icon fontSize="inherit">developer_guide</Icon>
            </IconButton>
            <IconButton
              size="large"
              href="https://github.com/beta382/xcxde-drop-diviner"
              target="_blank"
              rel="noreferrer"
              sx={{ width: "52px" }}
            >
              <SvgIcon
                component={GitHubIcon}
                inheritViewBox
                sx={{ fontSize: "24px" }}
              />
            </IconButton>
            <IconButton
              size="large"
              onClick={() => {
                setIsSettingsOpen(true);
              }}
              sx={{ marginRight: "-12px!important" }}
            >
              <FilledIcon fontSize="inherit">settings</FilledIcon>
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Settings
        open={isSettingsOpen}
        onClose={() => {
          setIsSettingsOpen(false);
        }}
      />
    </>
  );
}
