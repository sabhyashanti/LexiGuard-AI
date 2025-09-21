import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import { getFunctions, httpsCallable } from 'firebase/functions';
import ReactMarkdown from 'react-markdown';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface ChatbotProps {
  // We need the full document text to give the AI context for answering questions
  fullDocumentText: string | null;
}

const Chatbot: React.FC<ChatbotProps> = ({ fullDocumentText }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAskQuestion = async () => {
    if (!question.trim() || !fullDocumentText) {
      setError("Please type a question. The chatbot needs the document analysis to be present to answer questions accurately.");
      return;
    }
    setIsLoading(true);
    setError('');
    setAnswer('');

    try {
      const functions = getFunctions();
      const answerQuestionCallable = httpsCallable(functions, 'answerQuestion');
      const result: any = await answerQuestionCallable({
        // Pass both the original document text and the user's question to the backend
        documentText: fullDocumentText,
        question: question,
      });
      setAnswer(result.data.answer);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred while asking the question.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <HelpOutlineIcon sx={{ mr: 1 }} /> Ask a Follow-up Question
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          label="e.g., 'What happens if I'm late with my rent?'"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleAskQuestion()}
        />
        <Button variant="contained" onClick={handleAskQuestion} disabled={isLoading || !fullDocumentText}>
          {isLoading ? <CircularProgress size={24} /> : 'Ask'}
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {answer && (
        <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
          <ReactMarkdown>{answer}</ReactMarkdown>
        </Box>
      )}
    </Paper>
  );
};

export default Chatbot;

