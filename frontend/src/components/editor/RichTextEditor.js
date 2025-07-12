import React, { useCallback, memo } from 'react';
import { EditorContent } from '@tiptap/react';
import {
    Box,
    Divider,
    IconButton,
    Paper,
    Tooltip,
    useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    FormatBold,
    FormatItalic,
    FormatListBulleted,
    FormatListNumbered,
    FormatQuote,
    Code,
    Image as ImageIcon,
    FormatAlignLeft,
    FormatAlignCenter,
    FormatAlignRight,
    FormatStrikethrough,
} from '@mui/icons-material';
import ImageUploader from './ImageUploader';

// Memoized button component to prevent unnecessary re-renders
const MenuButton = memo(({ onClick, isActive = null, disabled = false, title, children }) => (
    <Tooltip title={title}>
        <span>
            <IconButton
                onClick={onClick}
                color={isActive ? 'primary' : 'default'}
                disabled={disabled}
                size="small"
            >
                {children}
            </IconButton>
        </span>
    </Tooltip>
));

MenuButton.displayName = 'MenuButton';

const RichTextEditor = ({ editor }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Pre-define callback functions to avoid recreating them on each render
    // All hooks must be defined at the top level, before any conditional returns
    const toggleBold = useCallback(() => {
        if (!editor) return;
        editor.chain().focus().toggleBold().run();
    }, [editor]);

    const toggleItalic = useCallback(() => {
        if (!editor) return;
        editor.chain().focus().toggleItalic().run();
    }, [editor]);

    const toggleStrike = useCallback(() => {
        if (!editor) return;
        editor.chain().focus().toggleStrike().run();
    }, [editor]);

    const toggleBulletList = useCallback(() => {
        if (!editor) return;
        editor.chain().focus().toggleBulletList().run();
    }, [editor]);

    const toggleOrderedList = useCallback(() => {
        if (!editor) return;
        editor.chain().focus().toggleOrderedList().run();
    }, [editor]);

    const toggleBlockquote = useCallback(() => {
        if (!editor) return;
        editor.chain().focus().toggleBlockquote().run();
    }, [editor]);

    const toggleCodeBlock = useCallback(() => {
        if (!editor) return;
        editor.chain().focus().toggleCodeBlock().run();
    }, [editor]);

    const setAlignLeft = useCallback(() => {
        if (!editor) return;
        editor.chain().focus().setTextAlign('left').run();
    }, [editor]);

    const setAlignCenter = useCallback(() => {
        if (!editor) return;
        editor.chain().focus().setTextAlign('center').run();
    }, [editor]);

    const setAlignRight = useCallback(() => {
        if (!editor) return;
        editor.chain().focus().setTextAlign('right').run();
    }, [editor]);

    // Handle image upload
    const handleImageUploaded = useCallback((imageUrl) => {
        if (!editor || !imageUrl) return;
        editor.chain().focus().setImage({ src: imageUrl }).run();
    }, [editor]);

    // Return null if editor is not available
    if (!editor) {
        return null;
    }

    return (
        <Paper
            variant="outlined"
            sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '8px',
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    p: 1,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 0.5,
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                }}
            >
                <MenuButton
                    onClick={toggleBold}
                    isActive={editor.isActive('bold')}
                    title="Bold"
                >
                    <FormatBold fontSize="small" />
                </MenuButton>

                <MenuButton
                    onClick={toggleItalic}
                    isActive={editor.isActive('italic')}
                    title="Italic"
                >
                    <FormatItalic fontSize="small" />
                </MenuButton>

                <MenuButton
                    onClick={toggleStrike}
                    isActive={editor.isActive('strike')}
                    title="Strikethrough"
                >
                    <FormatStrikethrough fontSize="small" />
                </MenuButton>

                <Divider orientation="vertical" flexItem />

                <MenuButton
                    onClick={toggleBulletList}
                    isActive={editor.isActive('bulletList')}
                    title="Bullet List"
                >
                    <FormatListBulleted fontSize="small" />
                </MenuButton>

                <MenuButton
                    onClick={toggleOrderedList}
                    isActive={editor.isActive('orderedList')}
                    title="Numbered List"
                >
                    <FormatListNumbered fontSize="small" />
                </MenuButton>

                <Divider orientation="vertical" flexItem />

                <MenuButton
                    onClick={toggleBlockquote}
                    isActive={editor.isActive('blockquote')}
                    title="Quote"
                >
                    <FormatQuote fontSize="small" />
                </MenuButton>

                <MenuButton
                    onClick={toggleCodeBlock}
                    isActive={editor.isActive('codeBlock')}
                    title="Code Block"
                >
                    <Code fontSize="small" />
                </MenuButton>

                <Divider orientation="vertical" flexItem />

                <ImageUploader
                    onImageUploaded={handleImageUploaded}
                    buttonText={<ImageIcon fontSize="small" />}
                />

                {!isMobile && (
                    <>
                        <Divider orientation="vertical" flexItem />

                        <MenuButton
                            onClick={setAlignLeft}
                            isActive={editor.isActive({ textAlign: 'left' })}
                            title="Align Left"
                        >
                            <FormatAlignLeft fontSize="small" />
                        </MenuButton>

                        <MenuButton
                            onClick={setAlignCenter}
                            isActive={editor.isActive({ textAlign: 'center' })}
                            title="Align Center"
                        >
                            <FormatAlignCenter fontSize="small" />
                        </MenuButton>

                        <MenuButton
                            onClick={setAlignRight}
                            isActive={editor.isActive({ textAlign: 'right' })}
                            title="Align Right"
                        >
                            <FormatAlignRight fontSize="small" />
                        </MenuButton>
                    </>
                )}
            </Box>

            <EditorContent
                editor={editor}
                style={{
                    padding: theme.spacing(2),
                    minHeight: '200px',
                    '& .ProseMirror': {
                        outline: 'none',
                    },
                }}
            />
        </Paper>
    );
};

export default memo(RichTextEditor); 