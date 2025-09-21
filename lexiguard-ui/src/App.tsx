import React, { useState, useEffect } from 'react';
import { auth } from './firebaseConfig';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, User, signOut } from 'firebase/auth';
import { AppBar, Toolbar, Typography, Button, Container, Box, CssBaseline, Tabs, Tab, Select, MenuItem, FormControl, InputLabel, Alert, SelectChangeEvent, Paper, Stack } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme'; // Import the theme we created
import { FileUpload } from './components/FileUpload';
import AnalysisDisplay from './components/AnalysisDisplay';
import { TextInput } from './components/TextInput';

// Define the roles for each document type
const documentRoles: Record<string, string[]> = {
  "Rental Agreement": ["Tenant", "Landlord"],
  "Loan Agreement": ["Borrower", "Lender"],
  "Employment Contract": ["Employee", "Employer"],
  "Service Contract": ["Client", "Service Provider"],
  "NDA": ["Disclosing Party", "Receiving Party", "Mutual"],
  "General Document": ["Party A", "Party B", "Neutral Reviewer"],
};

// Your existing application logic is moved into this AppContent component
function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [documentType, setDocumentType] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleDocTypeChange = (event: SelectChangeEvent) => {
    setDocumentType(event.target.value);
    setSelectedRole(""); // Reset role when type changes
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };
  
  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  const LoginScreen = () => (
    <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography variant="h4" gutterBottom>Welcome to LexiGuard</Typography>
        <Typography sx={{mb: 3}}>Your personal AI legal assistant.</Typography>
        <Button variant="contained" size="large" onClick={signInWithGoogle}>
          Sign In with Google
        </Button>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={1} color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: '"Georgia", serif', fontWeight: 700 }}>
            LexiGuard 🏛️
          </Typography>
          {user && <Button color="inherit" onClick={handleSignOut}>Sign Out</Button>}
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ mt: 4, mb: 4 }}>
        {!user ? <LoginScreen /> : (
          <Stack spacing={4}>
            <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Welcome, {user.displayName}!
                </Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>1. Select Your Role for Contextual Analysis</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel id="doc-type-label">Document Type</InputLabel>
                    <Select
                      labelId="doc-type-label"
                      value={documentType}
                      label="Document Type"
                      onChange={handleDocTypeChange}
                    >
                      {Object.keys(documentRoles).map(type => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl fullWidth disabled={!documentType}>
                    <InputLabel id="role-label">Your Role</InputLabel>
                    <Select
                      labelId="role-label"
                      value={selectedRole}
                      label="Your Role"
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      {documentType && documentRoles[documentType].map(role => (
                        <MenuItem key={role} value={role}>{role}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
            </Paper>
            
            <Paper variant="outlined" sx={{ p: 3, opacity: selectedRole ? 1 : 0.6 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>2. Provide the Document</Typography>
                {!selectedRole && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Please select a document type and your role to enable analysis.
                  </Alert>
                )}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={currentTab} onChange={handleTabChange} textColor="secondary" indicatorColor="secondary">
                    <Tab label="Upload a File" disabled={!selectedRole} />
                    <Tab label="Paste Text" disabled={!selectedRole} />
                  </Tabs>
                </Box>
                
                <Box sx={{ pt: 3 }}>
                  {currentTab === 0 && (
                      <FileUpload role={selectedRole} disabled={!selectedRole} />
                  )}
                  {currentTab === 1 && (
                    <TextInput role={selectedRole} disabled={!selectedRole} />
                  )}
                </Box>
            </Paper>

            {/* The AnalysisDisplay will only show for the File Upload tab */}
            {currentTab === 0 && user &&
              <AnalysisDisplay userId={user.uid} />
            }
          </Stack>
        )}
      </Container>
    </Box>
  );
}

// The main App component now simply applies the theme to the AppContent
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

