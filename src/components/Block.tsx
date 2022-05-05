import React from "react";
import {
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import colors from "../constants/colors";
import { Block as BlockType } from "../types/Block";

type Props = {
  blocks: BlockType[]
};

const BoxSummaryContent = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "100%",
});

const BoxInfo = styled(Box)({
  backgroundColor: colors.gray,
  marginBottom: 6,
  padding: 6,
  paddingLeft: 10,
  borderRadius: '4px'
});

const TypographyIndentifier = styled(Typography)({
  fontSize: 12,
  fontWeight: 600,
  color: colors.blue,
  lineHeight: 1.5,
});

const TypographyBlockDescription = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  color: colors.text,
  lineHeight: 2,
}));

const Block: React.FC<Props> = ({ blocks }) => {
  return (
    <BoxSummaryContent>
      {
        blocks.map(block => (
          <BoxInfo key={block?.id}>
            <TypographyIndentifier>
              {('000' + block?.attributes?.index).slice(-3)}
            </TypographyIndentifier>
            <TypographyBlockDescription variant="subtitle1">
              {block?.attributes?.data}
            </TypographyBlockDescription>
          </BoxInfo>

        ))
      }
    </BoxSummaryContent>
  );
};

export default Block;
