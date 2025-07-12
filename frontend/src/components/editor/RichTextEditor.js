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
    Link,
    Image,
    FormatAlignLeft,
    FormatAlignCenter,
    FormatAlignRight,
    InsertEmoticon,
    FormatStrikethrough,
} from '@mui/icons-material';

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

    if (!editor) {
        return null;
    }

    // Pre-define callback functions to avoid recreating them on each render
    const toggleBold = useCallback(() => {
        editor.chain().focus().toggleBold().run();
    }, [editor]);

    const toggleItalic = useCallback(() => {
        editor.chain().focus().toggleItalic().run();
    }, [editor]);

    const toggleStrike = useCallback(() => {
        editor.chain().focus().toggleStrike().run();
    }, [editor]);

    const toggleBulletList = useCallback(() => {
        editor.chain().focus().toggleBulletList().run();
    }, [editor]);

    const toggleOrderedList = useCallback(() => {
        editor.chain().focus().toggleOrderedList().run();
    }, [editor]);

    const toggleBlockquote = useCallback(() => {
        editor.chain().focus().toggleBlockquote().run();
    }, [editor]);

    const toggleCodeBlock = useCallback(() => {
        editor.chain().focus().toggleCodeBlock().run();
    }, [editor]);

    const setAlignLeft = useCallback(() => {
        editor.chain().focus().setTextAlign('left').run();
    }, [editor]);

    const setAlignCenter = useCallback(() => {
        editor.chain().focus().setTextAlign('center').run();
    }, [editor]);

    const setAlignRight = useCallback(() => {
        editor.chain().focus().setTextAlign('right').run();
    }, [editor]);

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