import Box from "@mui/material/Box";
import Typography, { type TypographyProps } from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import type { KeyedElement } from "~/ui/common/common.types";

export function TextList({
  values,
  ...props
}: {
  values: (KeyedElement<string> & { props?: TypographyProps })[];
} & TypographyProps) {
  const [t] = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        columnGap: t(($) => $.common.shouldSpaceJoinedList, {
          returnObjects: true,
        })
          ? "0.26rem"
          : undefined,
        justifyContent: "center",
      }}
    >
      {values.map((element, i, arr) => (
        <Typography key={element.key} {...props} {...element.props}>
          {element.element +
            (i !== arr.length - 1 ? t(($) => $.common.listJoin) : "")}
        </Typography>
      ))}
    </Box>
  );
}
