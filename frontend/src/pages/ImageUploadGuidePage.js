import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Divider,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Alert,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stepper,
    Step,
    StepLabel,
    useTheme
} from '@mui/material';
import {
    CloudUpload,
    Image as ImageIcon,
    Check,
    InsertPhoto,
    Edit,
    AddPhotoAlternate
} from '@mui/icons-material';

import ImageUploader from '../components/editor/ImageUploader';
import useImageUpload from '../hooks/useImageUpload';

const ImageUploadGuidePage = () => {
    const theme = useTheme();
    const [uploadedImages, setUploadedImages] = useState([]);
    const { isUploading, error } = useImageUpload();

    const handleImageUploaded = (imageUrl) => {
        if (imageUrl) {
            setUploadedImages(prev => [...prev, imageUrl]);
        }
    };

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
                Image Upload Guide
            </Typography>

            <Typography variant="body1" paragraph>
                This guide will help you understand how to upload and include images in your questions and answers.
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, mb: 4, borderRadius: '12px' }}>
                        <Typography variant="h5" gutterBottom fontWeight={600}>
                            How to Upload Images
                        </Typography>

                        <Stepper activeStep={-1} orientation="vertical" sx={{ mb: 4 }}>
                            <Step>
                                <StepLabel>
                                    <Typography variant="subtitle1" fontWeight={500}>
                                        Find the "Upload Image" button
                                    </Typography>
                                </StepLabel>
                                <Box sx={{ ml: 4, my: 2 }}>
                                    <Typography variant="body2" paragraph>
                                        Look for the "Upload Image" button next to the editor when creating a question or answer.
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <ImageUploader
                                            onImageUploaded={handleImageUploaded}
                                            buttonText="Upload Image"
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            ← This is what the button looks like
                                        </Typography>
                                    </Box>
                                </Box>
                            </Step>

                            <Step>
                                <StepLabel>
                                    <Typography variant="subtitle1" fontWeight={500}>
                                        Select an image from your device
                                    </Typography>
                                </StepLabel>
                                <Box sx={{ ml: 4, my: 2 }}>
                                    <Typography variant="body2" paragraph>
                                        Click the "Select Image from Your Device" button and choose an image file.
                                        Supported formats include JPG, PNG, GIF, and WebP.
                                    </Typography>
                                    <Alert severity="info" sx={{ mb: 2 }}>
                                        Maximum file size: 10MB
                                    </Alert>
                                </Box>
                            </Step>

                            <Step>
                                <StepLabel>
                                    <Typography variant="subtitle1" fontWeight={500}>
                                        Upload and insert the image
                                    </Typography>
                                </StepLabel>
                                <Box sx={{ ml: 4, my: 2 }}>
                                    <Typography variant="body2" paragraph>
                                        After selecting your image, click the "Upload" button. Once uploaded,
                                        the image will be automatically inserted into your question or answer at the current cursor position.
                                    </Typography>
                                </Box>
                            </Step>
                        </Stepper>

                        <Alert severity="success" icon={<Check />} sx={{ mb: 4 }}>
                            That's it! Your image is now part of your question or answer.
                        </Alert>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h6" gutterBottom>
                            Tips for Using Images Effectively
                        </Typography>

                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <ImageIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Use clear, relevant images"
                                    secondary="Make sure your images directly relate to your question or answer"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <Edit color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Add context around images"
                                    secondary="Don't rely solely on images - add explanatory text before and after"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <AddPhotoAlternate color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Optimize image size"
                                    secondary="Crop images to show only the relevant parts"
                                />
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: '12px', height: '100%' }}>
                        <Typography variant="h6" gutterBottom fontWeight={600}>
                            Try It Out
                        </Typography>

                        <Typography variant="body2" paragraph>
                            Upload an image below to test the functionality:
                        </Typography>

                        <Box sx={{ mb: 3 }}>
                            <ImageUploader
                                onImageUploaded={handleImageUploaded}
                                buttonText="Upload Test Image"
                                fullWidth={true}
                            />
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {isUploading && (
                            <Alert severity="info" sx={{ mb: 2 }}>
                                Uploading your image...
                            </Alert>
                        )}

                        <Typography variant="subtitle2" gutterBottom sx={{ mt: 4 }}>
                            Your Uploaded Images:
                        </Typography>

                        {uploadedImages.length > 0 ? (
                            <Grid container spacing={2}>
                                {uploadedImages.map((url, index) => (
                                    <Grid item xs={12} key={index}>
                                        <Card sx={{ borderRadius: '8px', overflow: 'hidden' }}>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={url}
                                                alt={`Uploaded image ${index + 1}`}
                                                sx={{ objectFit: 'contain', bgcolor: theme.palette.mode === 'dark' ? '#333' : '#f5f5f5' }}
                                            />
                                            <CardContent sx={{ py: 1 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Image {index + 1} - Successfully uploaded
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Box sx={{
                                p: 3,
                                textAlign: 'center',
                                border: `1px dashed ${theme.palette.divider}`,
                                borderRadius: '8px',
                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                            }}>
                                <CloudUpload color="disabled" sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="body2" color="text.secondary">
                                    No images uploaded yet
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ImageUploadGuidePage; 