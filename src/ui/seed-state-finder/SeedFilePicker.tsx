import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import {
  useTransition,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useTranslation } from "react-i18next";
import type { AsyncReturnType } from "type-fest";
import { readSeedFileHeader } from "~/common/util/seed-file-search";
import { FilledIcon } from "~/ui/common/components/FilledIcon";
import { TextList } from "~/ui/common/components/TextList";
import { useBreakpoint } from "~/ui/common/hooks";

export interface SeedFile {
  file: File;
  header: AsyncReturnType<typeof readSeedFileHeader>;
}

function toHexString(value: number): string {
  return value.toString(16).padStart(8, "0").toUpperCase();
}

export function SeedFilePicker({
  seedFile,
  disabled,
  onChangeSeedFile,
}: {
  seedFile: SeedFile | undefined;
  disabled: boolean;
  onChangeSeedFile: Dispatch<SetStateAction<typeof seedFile>>;
}) {
  const [t] = useTranslation();

  const breakpoint = useBreakpoint();

  const [, startPeekSeedFileTransition] = useTransition();

  function handleFileSelect(evt: ChangeEvent<HTMLInputElement>) {
    const files = evt.target.files;

    if (files === null || files.length === 0) {
      return;
    }

    const nextFile = files[0];

    startPeekSeedFileTransition(async () => {
      const nextHeader = await readSeedFileHeader(nextFile);
      startPeekSeedFileTransition(() => {
        onChangeSeedFile({ file: nextFile, header: nextHeader });
      });
    });
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ mobile: 12, tablet: 4, desktop: 3 }}>
        <Button
          variant="contained"
          fullWidth
          component="label"
          disabled={disabled}
          startIcon={<FilledIcon>file_open</FilledIcon>}
          sx={{ textAlign: "center" }}
        >
          {t(($) => $.seedStateFinder.seedFilePicker.selectFileButton)}
          <VisuallyHiddenInput type="file" onChange={handleFileSelect} />
        </Button>
      </Grid>
      <Grid
        size={{ mobile: 12, tablet: 8, desktop: 3 }}
        sx={{ display: "flex", alignItems: "center" }}
      >
        <Typography
          color={seedFile !== undefined ? undefined : "textDisabled"}
          sx={{
            textWrap: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {seedFile !== undefined
            ? t(($) => $.seedStateFinder.seedFilePicker.selectedFileLabel, {
                file: seedFile.file.name,
              })
            : t(($) => $.seedStateFinder.seedFilePicker.noFileSelectedLabel)}
        </Typography>
      </Grid>
      <Grid
        size={{ mobile: 12, desktop: 6 }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: breakpoint !== "desktop" ? "center" : undefined,
        }}
      >
        {seedFile !== undefined ? (
          seedFile.header.type === "result" ? (
            <TextList
              values={[
                {
                  element: t(
                    ($) =>
                      $.seedStateFinder.seedFilePicker.fileHeaderLabel.seeds,
                    {
                      startSeed: toHexString(seedFile.header.value.startSeed),
                      stopSeed: toHexString(seedFile.header.value.stopSeed),
                    },
                  ),
                  key: 0,
                },
                {
                  element: t(
                    ($) =>
                      $.seedStateFinder.seedFilePicker.fileHeaderLabel.state,
                    {
                      state: seedFile.header.value.state,
                    },
                  ),
                  key: 1,
                },
              ]}
            />
          ) : (
            <Typography
              color="error"
              sx={{
                textAlign: breakpoint !== "desktop" ? "center" : undefined,
              }}
            >
              {(() => {
                switch (seedFile.header.error) {
                  case "prematureEof":
                    return t(
                      ($) =>
                        $.seedStateFinder.seedFilePicker.fileHeaderErrorLabel
                          .cannotLoad,
                    );
                  case "badMagic":
                    return t(
                      ($) =>
                        $.seedStateFinder.seedFilePicker.fileHeaderErrorLabel
                          .badType,
                    );
                  case "oldMagic":
                    return t(
                      ($) =>
                        $.seedStateFinder.seedFilePicker.fileHeaderErrorLabel
                          .oldFile,
                    );
                  default:
                    return seedFile.header.error satisfies never;
                }
              })()}
            </Typography>
          )
        ) : (
          <Typography color="textDisabled">
            {t(($) => $.seedStateFinder.seedFilePicker.noFileHeaderLabel)}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
