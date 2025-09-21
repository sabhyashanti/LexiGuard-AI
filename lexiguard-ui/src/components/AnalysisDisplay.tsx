import React from 'react';
import { Paper, Typography, Stack, Skeleton, Alert } from '@mui/material';
import { collection, query, onSnapshot, orderBy, limit } from "firebase/firestore";
import { db } from '../firebaseConfig';
import ReactMarkdown from 'react-markdown';
import { RiskRadar } from './RiskRadar';
import { ClauseExplainer } from './ClauseExplainer';
import Chatbot from './Chatbot'; // NEW: Import the Chatbot component

interface AnalysisDisplayProps {
  userId: string;
}

// Your robust parsing function remains unchanged.
const getContent = (text: string, startHeading: string, endHeading?: string): string => {
    const startIndex = text.indexOf(startHeading);
    if (startIndex === -1) return "";

    const contentStartIndex = startIndex + startHeading.length;
    let endIndex;

    if (endHeading) {
        endIndex = text.indexOf(endHeading, contentStartIndex);
        if (endIndex === -1) endIndex = text.length;
    } else {
        endIndex = text.length;
    }

    return text.substring(contentStartIndex, endIndex).trim();
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ userId }) => {
  const [analysisText, setAnalysisText] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Your data fetching and state logic remains unchanged.
  React.useEffect(() => {
    if (!userId) { setIsLoading(false); return; }
    const q = query(collection(db, `users/${userId}/analyses`), orderBy("createdAt", "desc"), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
          const latestText = snapshot.docs[0].data().analysisText;
          setAnalysisText(latestText);
      } else {
        setAnalysisText(null);
      }
      setIsLoading(false);
    }, () => setIsLoading(false));
    return () => unsubscribe();
  }, [userId]);

  // Your loading and empty states remain unchanged.
  if (isLoading) {
    return <Stack spacing={4}><Skeleton variant="rectangular" height={100} /><Skeleton variant="rectangular" height={200} /><Skeleton variant="rectangular" height={200} /></Stack>;
  }

  if (!analysisText) {
    return (
      <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px dashed #ccc' }}>
        <Typography variant="h6">Your Document Analysis Will Appear Here</Typography>
      </Paper>
    );
  }

  // Your parsing logic remains unchanged.
  const summaryContent = getContent(analysisText, "### 1. Overall Summary", "### 2. Key Clauses");
  const clauseContent = getContent(analysisText, "### 2. Key Clauses", "### 3. Your Obligations");
  const obligationsContent = getContent(analysisText, "### 3. Your Obligations", "### 4. Red Flags");
  const riskContent = getContent(analysisText, "### 4. Red Flags");
  
  const disclaimerContent = `Hello, I'm Lexi, your AI legal assistant. I've analyzed this document to help you understand its key aspects in plain English. My goal is to demystify the legal jargon and highlight what's most important for you.

Please note, this analysis is for informational purposes and is not a substitute for professional legal advice.`;

  return (
    <Stack spacing={4}>
      {/* All your existing analysis sections remain unchanged. */}
      <Alert severity="warning">{disclaimerContent}</Alert>

      <Paper elevation={2} sx={{ p: 3 }}>
        {/* UPDATED: Color styling re-added */}
        <Typography variant="h5" gutterBottom sx={{ color: 'primary.dark' }}>
          Overall Summary
        </Typography>
        <ReactMarkdown>{summaryContent || "Summary not available."}</ReactMarkdown>
      </Paper>
      <Paper elevation={2} sx={{ p: 3 }}>
        <ClauseExplainer clauseContent={clauseContent} />
      </Paper>
      <Paper elevation={2} sx={{ p: 3 }}>
        {/* UPDATED: Color styling re-added */}
        <Typography variant="h5" gutterBottom sx={{ color: 'primary.dark' }}>
          Your Obligations
        </Typography>
        <ReactMarkdown>{obligationsContent || "Obligations not available."}</ReactMarkdown>
      </Paper>
      <Paper elevation={2} sx={{ p: 3 }}>
        <RiskRadar riskContent={riskContent} />
      </Paper>

      {/* NEW: The Chatbot component is added at the end */}
      {/* It receives the full analysis text to provide context for answers. */}
      <Chatbot fullDocumentText={analysisText} />
    </Stack>
  );
};

export default AnalysisDisplay;

