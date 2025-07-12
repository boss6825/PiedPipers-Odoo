import React, { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    CircularProgress,
    IconButton,
    Badge
} from '@mui/material';
import { PhotoCamera, Close, AddPhotoAlternate } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
import useImageUpload from '../../hooks/useImageUpload';

const ImageUploader = ({
    onImageUploaded,
    buttonText = "Upload Image",
    variant = "contained",
    color = "primary",
    size = "medium",
    fullWidth = false
}) => {
    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState('');

    const isAuthenticated = useSelector(selectIsAuthenticated);
    const { uploadImage, isUploading, error, reset } = useImageUpload();

    const handleOpen = () => {
        if (!isAuthenticated) {
            return;
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedFile(null);
        setPreview('');
        reset();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return;
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            return;
        }

        setSelectedFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            return;
        }

        const imageUrl = await uploadImage(selectedFile, onImageUploaded);
        if (imageUrl) {
            handleClose();
        }
    };

    // Determine if buttonText is a string or a component
    const isTextString = typeof buttonText === 'string';

    return (
        <>
            <Button
                variant={variant}
                color={color}
                startIcon={isTextString ? <AddPhotoAlternate /> : null}
                onClick={handleOpen}
                size={size}
                fullWidth={fullWidth}
                sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 500,
                }}
            >
                {buttonText}
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Upload Image
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Box sx={{ mb: 2 }}>
                        <Button
                            variant="contained"
                            component="label"
                            fullWidth
                            sx={{ mb: 2, py: 1.5, borderRadius: '8px' }}
                            startIcon={<PhotoCamera />}
                        >
                            Select Image from Your Device
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleFileChange}
                            />
                        </Button>

                        {error && (
                            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                {error}
                            </Typography>
                        )}

                        {preview && (
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <img
                                    src={preview}
                                    alt="Preview"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '300px',
                                        objectFit: 'contain'
                                    }}
                                />
                            </Box>
                        )}
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClose} disabled={isUploading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpload}
                        variant="contained"
                        color="primary"
                        disabled={!selectedFile || isUploading}
                        startIcon={isUploading ? <CircularProgress size={20} /> : null}
                        sx={{ borderRadius: '8px', textTransform: 'none' }}
                    >
                        {isUploading ? 'Uploading...' : 'Upload'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ImageUploader; 