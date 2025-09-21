import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytes } from "firebase/storage";
import { auth, storage } from '../firebaseConfig';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';

// The component now accepts a 'disabled' prop
interface FileUploadProps {
  role: string;
  disabled: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ role, disabled }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file || disabled) return;

    const currentUser = auth.currentUser;
    if (!currentUser) {
      setError("You must be logged in to upload a file.");
      return;
    }

    const storageRef = ref(storage, `uploads/${currentUser.uid}/${file.name}`);
    
    setUploading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const metadata = { customMetadata: { role } };
      await uploadBytes(storageRef, file, metadata);
      setSuccess('File uploaded! Analysis will begin shortly.');
    } catch (err) {
      console.error("Upload failed:", err);
      setError("File upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled, // Pass disabled state to the dropzone hook
    accept: { 
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg']
    },
    multiple: false,
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: '2px dashed',
        // Change appearance when disabled
        borderColor: disabled ? 'grey.400' : '#ccc',
        backgroundColor: disabled ? 'grey.100' : (isDragActive ? '#f0f0f0' : '#fafafa'),
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: '40px',
        textAlign: 'center',
        borderRadius: '8px',
        transition: 'background-color 0.2s ease-in-out',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Uploading...</Typography>
        </>
      ) : (
        <Typography color={disabled ? 'text.secondary' : 'text.primary'}>
          {disabled
            ? 'Please select your role above to enable uploads'
            : (isDragActive
              ? 'Drop the file here...'
              : 'Drag & drop a PDF, PNG, or JPG file here')}
        </Typography>
      )}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};