import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Chip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GavelIcon from '@mui/icons-material/Gavel';

interface ClauseExplainerProps {
  clauseContent: string;
}

// Helper function to determine the color of the risk chip
const getRiskColor = (risk: string): "error" | "warning" | "success" => {
  const lowerCaseRisk = risk.toLowerCase();
  if (lowerCaseRisk.includes('high')) return 'error';
  if (lowerCaseRisk.includes('medium')) return 'warning';
  return 'success';
}

export const ClauseExplainer: React.FC<ClauseExplainerProps> = ({ clauseContent }) => {
  // UPDATED: This more flexible regex handles variations in the AI's output,
  // such as optional "####" prefixes and different bullet point styles.
  const clauseRegex = /(?:####\s)?\*\*Title:\*\*([\s\S]*?)(?:\*\s*)?\*\*Plain English Explanation:\*\*([\s\S]*?)(?:\*\s*)?\*\*Risk Level:\*\*([\s\S]*?)(?=(?:####\s)?\*\*Title:\*\*|$)/g;
  const clauses = Array.from(clauseContent.matchAll(clauseRegex));

  if (clauses.length === 0) {
    return <Typography>Could not parse individual clauses from the analysis.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <GavelIcon sx={{ mr: 1 }} /> Key Clauses
      </Typography>
      {clauses.map((match, index) => {
        // The logic for extracting and displaying data remains the same.
        const title = match[1] ? match[1].trim() : "N/A";
        const explanation = match[2] ? match[2].trim() : "N/A";
        const risk = match[3] ? match[3].trim() : "Low";

        return (
          <Accordion key={index} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 'bold', flexGrow: 1 }}>{title}</Typography>
              <Chip label={risk.split(' ')[0]} color={getRiskColor(risk)} size="small" />
            </AccordionSummary>
            <AccordionDetails sx={{ borderTop: '1px solid #eee', pt: 2 }}>
              <Typography>{explanation}</Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

