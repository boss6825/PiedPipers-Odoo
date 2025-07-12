import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Typography,
    Pagination,
    Stack,
    Divider,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    useMediaQuery,
    Paper,
    Menu,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    Add as AddIcon,
    ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import {
    getQuestions,
    selectQuestions,
    selectQuestionsLoading,
    selectFilters,
    selectPagination,
    setFilters,
    setPage,
} from '../features/questions/questionSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Initialize dayjs plugins
dayjs.extend(relativeTime);

const HomePage = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const questions = useSelector(selectQuestions);
    const isLoading = useSelector(selectQuestionsLoading);
    const filters = useSelector(selectFilters);
    const pagination = useSelector(selectPagination);

    const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState(null);

    useEffect(() => {
        dispatch(getQuestions({
            page: pagination.page,
            limit: pagination.limit,
            sort: filters.sort,
            tags: filters.tags,
            searchTerm: filters.searchTerm,
        }));
    }, [dispatch, pagination.page, filters.sort, filters.tags, filters.searchTerm]);

    const handleSortChange = (sort) => {
        dispatch(setFilters({ sort }));
        handleFilterMenuClose();
    };

    const handlePageChange = (event, value) => {
        dispatch(setPage(value));
    };

    const handleFilterMenuOpen = (event) => {
        setFilterMenuAnchorEl(event.currentTarget);
    };

    const handleFilterMenuClose = () => {
        setFilterMenuAnchorEl(null);
    };

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 }
            }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    component={RouterLink}
                    to="/questions/ask"
                    sx={{
                        fontWeight: 'bold',
                        textTransform: 'none',
                        borderRadius: '16px',
                        px: 3
                    }}
                >
                    Ask New question
                </Button>

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    width: { xs: '100%', sm: 'auto' }
                }}>
                    <Button
                        variant={filters.sort === 'newest' ? 'contained' : 'outlined'}
                        color="primary"
                        onClick={() => handleSortChange('newest')}
                        sx={{
                            textTransform: 'none',
                            borderRadius: '16px'
                        }}
                    >
                        Newest
                    </Button>

                    <Button
                        variant={filters.sort === 'unanswered' ? 'contained' : 'outlined'}
                        color="primary"
                        onClick={() => handleSortChange('unanswered')}
                        sx={{
                            textTransform: 'none',
                            borderRadius: '16px'
                        }}
                    >
                        Unanswered
                    </Button>

                    <Button
                        endIcon={<ExpandMoreIcon />}
                        onClick={handleFilterMenuOpen}
                        sx={{
                            textTransform: 'none',
                            borderRadius: '16px'
                        }}
                    >
                        more
                    </Button>

                    <Menu
                        anchorEl={filterMenuAnchorEl}
                        open={Boolean(filterMenuAnchorEl)}
                        onClose={handleFilterMenuClose}
                    >
                        <MenuItem onClick={() => handleSortChange('popular')}>Most Popular</MenuItem>
                        <MenuItem onClick={() => handleSortChange('active')}>Most Active</MenuItem>
                        <MenuItem onClick={() => handleSortChange('voted')}>Most Voted</MenuItem>
                    </Menu>
                </Box>
            </Box>

            {isLoading ? (
                <LoadingSpinner text="Loading questions..." />
            ) : questions.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 5 }}>
                    <Typography variant="h6">No questions found</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Be the first to ask a question!
                    </Typography>
                </Box>
            ) : (
                <Stack spacing={2}>
                    {questions.map((question) => (
                        <Card key={question._id} sx={{
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                            overflow: 'visible'
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography
                                        variant="h6"
                                        component={RouterLink}
                                        to={`/questions/${question._id}`}
                                        sx={{
                                            textDecoration: 'none',
                                            color: 'primary.main',
                                            fontWeight: 600,
                                            '&:hover': { textDecoration: 'underline' }
                                        }}
                                    >
                                        {question.title}
                                    </Typography>

                                    <Chip
                                        label={`${question.answerCount || 0} ans`}
                                        color={question.answerCount > 0 ? "primary" : "default"}
                                        sx={{
                                            fontWeight: 'bold',
                                            borderRadius: '12px'
                                        }}
                                    />
                                </Box>

                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {question.body?.length > 150
                                        ? `${question.body.substring(0, 150)}...`
                                        : question.body}
                                </Typography>

                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
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

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {question.user?.username || 'Anonymous'}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary">
                                        {dayjs(question.createdAt).fromNow()}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            )}

            {pagination.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={pagination.totalPages}
                        page={pagination.page}
                        onChange={handlePageChange}
                        color="primary"
                        shape="rounded"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}
        </Box>
    );
};

export default HomePage; 