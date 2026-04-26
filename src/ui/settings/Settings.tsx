import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useBreakpoint } from "~/ui/common/hooks";
import { AdvancedSettings } from "~/ui/settings/AdvancedSettings";
import { BasicSettings } from "~/ui/settings/BasicSettings";
import { LootFinderSettings } from "~/ui/settings/LootFinderSettings";
import { SeedFinderSettings } from "~/ui/settings/SeedFinderSettings";
import { StateFinderSettings } from "~/ui/settings/StateFinderSettings";

const SETTINGS_DRAWER_WIDTH = "350px";

export function Settings({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [t] = useTranslation();

  const breakpoint = useBreakpoint();

  return (
    <Drawer
      elevation={4}
      open={open}
      anchor="right"
      onClose={onClose}
      sx={{
        width: SETTINGS_DRAWER_WIDTH,
        maxWidth: "100%",
      }}
      slotProps={{
        paper: {
          sx: {
            width: SETTINGS_DRAWER_WIDTH,
            maxWidth: "100%",
            boxSizing: "border-box",
            paddingBottom: "64px",
          },
        },
      }}
    >
      <Toolbar sx={{ position: "sticky", top: 0, zIndex: "2", padding: 0 }}>
        <Paper
          elevation={16}
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: "100%",
            paddingLeft: 2,
            paddingRight: 2,
            borderRadius: 0,
          }}
        >
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            {t(($) => $.settings.headerLabel)}
          </Typography>
          {breakpoint === "mobile" && (
            <IconButton size="large" edge="end" onClick={onClose}>
              <Icon fontSize="inherit">close</Icon>
            </IconButton>
          )}
        </Paper>
      </Toolbar>

      {/* Basic Settings */}
      <SettingsStack>
        <BasicSettings />
      </SettingsStack>

      {/* Advanced Settings */}
      <SettingsAccordion label={t(($) => $.settings.label.advanced)}>
        <SettingsStack>
          <AdvancedSettings />
        </SettingsStack>

        <Stack spacing={1}>
          {/* Seed Finder */}
          <SettingsAccordion
            label={t(($) => $.settings.label.seedFinder.header)}
            inner
          >
            <SettingsStack>
              <SeedFinderSettings />
            </SettingsStack>
          </SettingsAccordion>

          {/* State Finder */}
          <SettingsAccordion
            label={t(($) => $.settings.label.stateFinder.header)}
            inner
          >
            <SettingsStack>
              <StateFinderSettings />
            </SettingsStack>
          </SettingsAccordion>

          {/* Loot Finder */}
          <SettingsAccordion
            label={t(($) => $.settings.label.lootFinder.header)}
            inner
          >
            <SettingsStack>
              <LootFinderSettings />
            </SettingsStack>
          </SettingsAccordion>
        </Stack>
      </SettingsAccordion>
    </Drawer>
  );
}

function SettingsStack({ children }: { children: ReactNode }) {
  return (
    <Stack spacing={2} sx={{ padding: 2 }}>
      {children}
    </Stack>
  );
}

function SettingsAccordion({
  label,
  inner = false,
  children,
}: {
  label: string;
  inner?: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <Accordion disableGutters elevation={inner ? 12 : 8}>
        <AccordionSummary
          expandIcon={<Icon fontSize="large">keyboard_arrow_down</Icon>}
        >
          <Typography variant={inner ? "h6" : "h5"}>{label}</Typography>
        </AccordionSummary>

        <Divider />

        <AccordionDetails sx={{ padding: 0 }}>{children}</AccordionDetails>
      </Accordion>
    </>
  );
}
