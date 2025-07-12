import React, { useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Chip,
    Stack,
    Autocomplete,
    useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { useSnackbar } from 'notistack';
import debounce from 'lodash/debounce';

import { createQuestion } from '../features/questions/questionSlice';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import RichTextEditor from '../components/editor/RichTextEditor';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Form validation schema
const schema = yup.object().shape({
    title: yup.string().required('Title is required').min(10, 'Title must be at least 10 characters'),
    tags: yup.array().min(1, 'At least one tag is required').max(5, 'Maximum 5 tags allowed'),
});

const AskQuestionPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const { enqueueSnackbar } = useSnackbar();

    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Create a debounced update function
    const debouncedUpdate = useCallback(
        debounce(html => {
            setContent(html);
        }, 300),
        []
    );

    // Initialize TipTap editor with optimized settings
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                history: {
                    depth: 10,
                    newGroupDelay: 500,
                },
            }),
            LinkExtension.configure({
                openOnClick: false,
            }),
            Image,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: '',
        onUpdate: ({ editor }) => {
            debouncedUpdate(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
                spellcheck: 'false',
            },
        },
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            title: '',
            tags: [],
        },
    });

    const onSubmit = async (data) => {
        if (!content) {
            enqueueSnackbar('Description is required', { variant: 'error' });
            return;
        }

        if (!isAuthenticated) {
            enqueueSnackbar('You must be logged in to ask a question', { variant: 'error' });
            navigate('/login');
            return;
        }

        try {
            setIsSubmitting(true);
            const questionData = {
                title: data.title,
                body: content,
                tags: data.tags,
            };

            const resultAction = await dispatch(createQuestion(questionData));
            if (createQuestion.fulfilled.match(resultAction)) {
                enqueueSnackbar('Question posted successfully!', { variant: 'success' });
                navigate(`/questions/${resultAction.payload._id}`);
                reset();
                editor.commands.setContent('');
            } else {
                enqueueSnackbar('Failed to post question', { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar('An error occurred', { variant: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitting) {
        return <LoadingSpinner fullPage text="Submitting your question..." />;
    }

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                Ask Question
            </Typography>

            <Paper
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                    p: 3,
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                }}
            >
                <Stack spacing={3}>
                    <Box>
                        <Typography variant="subtitle1" fontWeight={600} mb={1}>
                            Title
                        </Typography>
                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    placeholder="What's your question? Be specific."
                                    error={!!errors.title}
                                    helperText={errors.title?.message}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '8px',
                                        }
                                    }}
                                />
                            )}
                        />
                    </Box>

                    <Box>
                        <Typography variant="subtitle1" fontWeight={600} mb={1}>
                            Description
                        </Typography>
                        <RichTextEditor editor={editor} />
                        {!content && (
                            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                                Description is required
                            </Typography>
                        )}
                    </Box>

                    <Box>
                        <Typography variant="subtitle1" fontWeight={600} mb={1}>
                            Tags
                        </Typography>
                        <Controller
                            name="tags"
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    {...field}
                                    multiple
                                    freeSolo
                                    options={[]}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                label={option}
                                                {...getTagProps({ index })}
                                                sx={{
                                                    borderRadius: '12px',
                                                    backgroundColor: theme.palette.mode === 'dark'
                                                        ? 'rgba(255, 255, 255, 0.1)'
                                                        : 'rgba(0, 0, 0, 0.08)'
                                                }}
                                            />
                                        ))
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Add up to 5 tags"
                                            error={!!errors.tags}
                                            helperText={errors.tags?.message}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                }
                                            }}
                                        />
                                    )}
                                    onChange={(_, value) => field.onChange(value)}
                                />
                            )}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                            sx={{
                                minWidth: '100px',
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontWeight: 600,
                            }}
                        >
                            Submit
                        </Button>
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
};

export default AskQuestionPage; 