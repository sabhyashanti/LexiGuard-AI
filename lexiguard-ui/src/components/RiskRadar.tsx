import React from 'react';
import { Box, Typography, Alert, Stack } from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';

interface RiskRadarProps {
  riskContent: string;
}

export const RiskRadar: React.FC<RiskRadarProps> = ({ riskContent }) => {
  // This logic looks for simple bullet points (* or -)
  // which matches the actual output from the AI.
  const flags = riskContent
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('*') || line.startsWith('-'));

  if (flags.length === 0) {
    // This message will now only appear if the section is truly empty.
    return <Alert severity="success">No specific red flags were identified in this section.</Alert>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <FlagIcon sx={{ mr: 1 }} /> Red Flags
      </Typography>
      <Stack spacing={1}>
        {/* We now treat every bullet point from this section as a high-risk "error" alert. */}
        {flags.map((flagText, index) => (
          <Alert key={index} severity="error">
            {/* This removes the bullet point for a cleaner display */}
            {flagText.substring(1).trim()}
          </Alert>
        ))}
      </Stack>
    </Box>
  );
};

