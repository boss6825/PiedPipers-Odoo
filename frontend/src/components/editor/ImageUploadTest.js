import React, { useState, useCallback } from 'react';
import { Box, Typography, Button, Paper, Card, CardMedia, CircularProgress, Alert } from '@mui/material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useSnackbar } from 'notistack';

import ImageUploader from './ImageUploader';
import useImageUpload from '../../hooks/useImageUpload';

const ImageUploadTest = () => {
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const { enqueueSnackbar } = useSnackbar();

    // Use our custom hook
    const { uploadImage, isUploading, error, uploadedImageUrl: hookImageUrl } = useImageUpload();

    // Initialize editor with image extension
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
        ],
        content: '<p>Upload an image to see it here!</p>',
    });

    const handleImageUploaded = useCallback((imageUrl) => {
        if (imageUrl) {
            setUploadedImageUrl(imageUrl);

            // Insert image into editor
            if (editor) {
                editor.chain().focus().setImage({ src: imageUrl }).run();
            }

            enqueueSnackbar('Image uploaded successfully!', { variant: 'success' });
        }
    }, [editor, enqueueSnackbar]);

    const handleFileChange = useCallback(async (event) => {
        const file = event.target.files[0];
        if (file) {
            await uploadImage(file, (imageUrl) => {
                if (editor) {
                    editor.chain().focus().setImage({ src: imageUrl }).run();
                }
                enqueueSnackbar('Image uploaded successfully!', { variant: 'success' });
            });
        }
    }, [uploadImage, editor, enqueueSnackbar]);

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Image Upload Test
            </Typography>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Method 1: Using ImageUploader Component
                </Typography>
                <ImageUploader onImageUploaded={handleImageUploaded} />
            </Box>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Method 2: Using useImageUpload Hook Directly
                </Typography>
                <Button
                    variant="contained"
                    component="label"
                    disabled={isUploading}
                    startIcon={isUploading ? <CircularProgress size={20} /> : null}
                >
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />
                </Button>

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}

                {hookImageUrl && (
                    <Box sx={{ mt: 2 }}>
                        <Card sx={{ maxWidth: 500 }}>
                            <CardMedia
                                component="img"
                                image={hookImageUrl}
                                alt="Uploaded image"
                                sx={{ maxHeight: 300, objectFit: 'contain' }}
                            />
                        </Card>
                    </Box>
                )}
            </Box>

            {(uploadedImageUrl || hookImageUrl) && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Uploaded Image
                    </Typography>
                    <Card sx={{ maxWidth: 500 }}>
                        <CardMedia
                            component="img"
                            image={uploadedImageUrl || hookImageUrl}
                            alt="Uploaded image"
                            sx={{ maxHeight: 300, objectFit: 'contain' }}
                        />
                    </Card>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Image URL: {uploadedImageUrl || hookImageUrl}
                    </Typography>
                </Box>
            )}

            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Editor with Image
                </Typography>
                <Paper sx={{ p: 2 }}>
                    {editor && <EditorContent editor={editor} />}
                </Paper>
            </Box>
        </Box>
    );
};

export default ImageUploadTest; 