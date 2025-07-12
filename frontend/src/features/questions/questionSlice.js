import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ENDPOINTS } from '../../config/api';

const initialState = {
    questions: [],
    question: null,
    isLoading: false,
    isSuccess: false,
    error: null,
    filters: {
        sort: 'newest',
        tags: [],
        searchTerm: '',
    },
    pagination: {
        page: 1,
        limit: 10,
        totalPages: 1,
        totalQuestions: 0,
    },
};

// Get all questions
export const getQuestions = createAsyncThunk(
    'questions/getAll',
    async ({ page = 1, limit = 10, sort = 'newest', tags = [], searchTerm = '' }, thunkAPI) => {
        try {
            let queryString = `?page=${page}&limit=${limit}`;

            if (sort) {
                queryString += `&sort=${sort}`;
            }

            if (tags.length > 0) {
                queryString += `&tag=${tags[0]}`; // Backend expects a single tag
            }

            if (searchTerm) {
                queryString += `&keyword=${searchTerm}`;
            }

            const response = await axios.get(`${ENDPOINTS.QUESTIONS}${queryString}`);
            return {
                questions: response.data.questions,
                page: response.data.page,
                limit: response.data.limit || limit,
                totalPages: response.data.pages,
                totalQuestions: response.data.total || response.data.questions.length,
            };
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Something went wrong';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get question by ID
export const getQuestionById = createAsyncThunk(
    'questions/getById',
    async (id, thunkAPI) => {
        try {
            const response = await axios.get(`${ENDPOINTS.QUESTIONS}/${id}`);
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Something went wrong';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Create new question
export const createQuestion = createAsyncThunk(
    'questions/create',
    async (questionData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.post(ENDPOINTS.QUESTIONS, {
                title: questionData.title,
                description: questionData.body,
                tags: questionData.tags,
            }, config);

            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Something went wrong';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update question
export const updateQuestion = createAsyncThunk(
    'questions/update',
    async ({ id, questionData }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.put(`${ENDPOINTS.QUESTIONS}/${id}`, questionData, config);
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Something went wrong';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Delete question
export const deleteQuestion = createAsyncThunk(
    'questions/delete',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.delete(`${ENDPOINTS.QUESTIONS}/${id}`, config);
            return id;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Something went wrong';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Add answer to question
export const addAnswer = createAsyncThunk(
    'questions/addAnswer',
    async ({ questionId, answerContent }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.post(
                `${ENDPOINTS.ANSWERS}/questions/${questionId}/answers`,
                { content: answerContent },
                config
            );

            return { questionId, answer: response.data };
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Something went wrong';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const questionSlice = createSlice({
    name: 'questions',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.error = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        setPage: (state, action) => {
            state.pagination.page = action.payload;
        },
        clearQuestion: (state) => {
            state.question = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getQuestions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getQuestions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.questions = action.payload.questions;
                state.pagination = {
                    page: action.payload.page,
                    limit: action.payload.limit,
                    totalPages: action.payload.totalPages,
                    totalQuestions: action.payload.totalQuestions,
                };
            })
            .addCase(getQuestions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(getQuestionById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getQuestionById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.question = action.payload;
            })
            .addCase(getQuestionById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(createQuestion.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createQuestion.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.questions.unshift(action.payload);
            })
            .addCase(createQuestion.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(updateQuestion.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateQuestion.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.questions = state.questions.map((question) =>
                    question._id === action.payload._id ? action.payload : question
                );
                if (state.question && state.question._id === action.payload._id) {
                    state.question = action.payload;
                }
            })
            .addCase(updateQuestion.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(deleteQuestion.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteQuestion.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.questions = state.questions.filter(
                    (question) => question._id !== action.payload
                );
            })
            .addCase(deleteQuestion.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(addAnswer.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addAnswer.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                if (state.question && state.question._id === action.payload.questionId) {
                    // If the question has no answers array yet, create one
                    if (!state.question.answers) {
                        state.question.answers = [];
                    }
                    // Add the new answer
                    state.question.answers.push(action.payload.answer);
                    // Update answer count
                    state.question.answerCount = state.question.answers.length;
                }
            })
            .addCase(addAnswer.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { reset, setFilters, setPage, clearQuestion } = questionSlice.actions;
export const selectQuestions = (state) => state.questions.questions;
export const selectQuestion = (state) => state.questions.question;
export const selectQuestionsLoading = (state) => state.questions.isLoading;
export const selectQuestionsError = (state) => state.questions.error;
export const selectFilters = (state) => state.questions.filters;
export const selectPagination = (state) => state.questions.pagination;

export default questionSlice.reducer; 