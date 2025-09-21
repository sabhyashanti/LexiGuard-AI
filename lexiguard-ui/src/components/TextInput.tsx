import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress, Typography, Card, CardContent } from '@mui/material';
import { httpsCallable } from 'firebase/functions';
// CORRECTED: Import the 'functions' instance from the central config file
import { functions } from '../firebaseConfig';

// Initialize the callable function once
const analyzeTextCallable = httpsCallable(functions, 'analyzeText');

// The component now accepts 'role' and 'disabled' props
interface TextInputProps {
  role: string;
  disabled: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({ role, disabled }) => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (text.trim().length < 20) {
      setError('Please enter at least 20 characters of text to analyze.');
      return;
    }
    setLoading(true);
    setError('');
    setAnalysis('');

    try {
      // UPDATED: Pass the selected role along with the text
      const result: any = await analyzeTextCallable({ text, role });
      setAnalysis(result.data.analysis);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ opacity: disabled ? 0.6 : 1 }}>
      <TextField
        fullWidth
        multiline
        rows={10}
        variant="outlined"
        label={disabled ? "Please select your role above" : "Paste or type your legal text here"}
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{ mb: 2 }}
        disabled={disabled} // Pass the disabled prop to the text field
      />
      <Button variant="contained" onClick={handleAnalyze} disabled={loading || disabled}>
        {loading ? <CircularProgress size={24} /> : 'Analyze Text'}
      </Button>
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      {analysis && (
        <Card variant="outlined" sx={{ mt: 4, backgroundColor: '#f9f9f9' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>📜 Document Analysis</Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>{analysis}</Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
