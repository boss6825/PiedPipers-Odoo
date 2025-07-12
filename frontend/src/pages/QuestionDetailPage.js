import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Chip,
    Divider,
    Button,
    Card,
    CardContent,
    IconButton,
    Stack,
    Paper,
    useMediaQuery,
    Breadcrumbs,
    Link,
    Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    ThumbUp,
    ThumbDown,
    ArrowUpward,
    ArrowDownward,
    NavigateNext,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { useSnackbar } from 'notistack';
import debounce from 'lodash/debounce';

import {
    getQuestionById,
    selectQuestion,
    selectQuestionsLoading,
    addAnswer,
} from '../features/questions/questionSlice';
import { selectIsAuthenticated, selectUser } from '../features/auth/authSlice';
import RichTextEditor from '../components/editor/RichTextEditor';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ImageUploader from '../components/editor/ImageUploader';

// Initialize dayjs plugins
dayjs.extend(relativeTime);

const QuestionDetailPage = () => {
    const { questionId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { enqueueSnackbar } = useSnackbar();

    const question = useSelector(selectQuestion);
    const isLoading = useSelector(selectQuestionsLoading);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const currentUser = useSelector(selectUser);

    const [answerContent, setAnswerContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Create a debounced update function
    const debouncedUpdate = useCallback(
        debounce(html => {
            setAnswerContent(html);
        }, 300),
        []
    );

    // Initialize TipTap editor for answer with optimized settings
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

    useEffect(() => {
        if (questionId) {
            dispatch(getQuestionById(questionId));
        }
    }, [dispatch, questionId]);

    const handleSubmitAnswer = async () => {
        if (!answerContent.trim()) {
            enqueueSnackbar('Answer content cannot be empty', { variant: 'error' });
            return;
        }

        if (!isAuthenticated) {
            enqueueSnackbar('You must be logged in to submit an answer', { variant: 'error' });
            navigate('/login');
            return;
        }

        try {
            setIsSubmitting(true);
            const resultAction = await dispatch(addAnswer({
                questionId,
                answerContent
            }));

            if (addAnswer.fulfilled.match(resultAction)) {
                enqueueSnackbar('Answer submitted successfully!', { variant: 'success' });
                editor.commands.setContent('');
                setAnswerContent('');
            } else {
                enqueueSnackbar('Failed to submit answer', { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar('An error occurred', { variant: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <LoadingSpinner fullPage text="Loading question..." />;
    }

    if (!question) {
        return (
            <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="h5">Question not found</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    The question you're looking for might have been removed or doesn't exist.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to="/"
                    sx={{ mt: 3, borderRadius: '8px' }}
                >
                    Back to Home
                </Button>
            </Box>
        );
    }

    // Get answers from the question object
    const answers = question.answers || [];

    return (
        <Box>
            <Breadcrumbs
                separator={<NavigateNext fontSize="small" />}
                aria-label="breadcrumb"
                sx={{ mb: 2 }}
            >
                <Link component={RouterLink} to="/" underline="hover" color="inherit">
                    Home
                </Link>
                <Typography color="text.primary">Question</Typography>
            </Breadcrumbs>

            <Card sx={{
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                mb: 4
            }}>
                <CardContent sx={{ p: 3 }}>
                    <Typography variant="h5" component="h1" gutterBottom fontWeight={600}>
                        {question.title}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Asked by {question.user?.username || 'Anonymous'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {dayjs(question.createdAt).fromNow()}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <div dangerouslySetInnerHTML={{ __html: question.description || question.body }} />

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, mt: 3 }}>
                        {question.tags && question.tags.map((tag, index) => (
                            <Chip
                                key={index}
                                label={tag}
                                size="small"
                                sx={{
                                    borderRadius: '12px',
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? 'rgba(255, 255, 255, 0.1)'
                                        : 'rgba(0, 0, 0, 0.08)'
                                }}
                            />
                        ))}
                    </Box>
                </CardContent>
            </Card>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                    {answers.length} Answers
                </Typography>

                {answers.length > 0 ? (
                    <Stack spacing={2}>
                        {answers.map((answer) => (
                            <Card
                                key={answer._id || answer.id}
                                sx={{
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            mr: 1
                                        }}>
                                            <IconButton size="small" color="primary">
                                                <ArrowUpward fontSize="small" />
                                            </IconButton>
                                            <Typography variant="body2" fontWeight="bold">
                                                {answer.voteCount || answer.votes || 0}
                                            </Typography>
                                            <IconButton size="small">
                                                <ArrowDownward fontSize="small" />
                                            </IconButton>
                                        </Box>

                                        <Box sx={{ flexGrow: 1 }}>
                                            <div dangerouslySetInnerHTML={{ __html: answer.content }} />

                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mt: 2
                                            }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    {answer.user?.username || 'Anonymous'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {dayjs(answer.createdAt).fromNow()}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
                        <Typography variant="body1">No answers yet. Be the first to answer!</Typography>
                    </Box>
                )}
            </Box>

            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                        Submit Your Answer
                    </Typography>
                    <Tooltip title="Upload an image to include in your answer">
                        <Box>
                            <ImageUploader
                                onImageUploaded={(imageUrl) => {
                                    if (editor && imageUrl) {
                                        editor.chain().focus().setImage({ src: imageUrl }).run();
                                    }
                                }}
                                buttonText="Upload Image"
                                variant="contained"
                                color="primary"
                                size="medium"
                            />
                        </Box>
                    </Tooltip>
                </Box>

                <Paper
                    sx={{
                        p: 3,
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    }}
                >
                    <RichTextEditor editor={editor} />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmitAnswer}
                            disabled={isSubmitting || !answerContent.trim()}
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
                </Paper>
            </Box>
        </Box>
    );
};

export default QuestionDetailPage; 