import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4 as DarkModeIcon, Brightness7 as LightModeIcon } from '@mui/icons-material';
import { toggleTheme, selectThemeMode } from '../../features/theme/themeSlice';

const ThemeToggle = ({ size = 'medium', tooltip = true }) => {
    const dispatch = useDispatch();
    const themeMode = useSelector(selectThemeMode);

    const handleToggle = () => {
        dispatch(toggleTheme());
    };

    const button = (
        <IconButton
            onClick={handleToggle}
            color="inherit"
            size={size}
            aria-label={themeMode === 'dark' ? 'Toggle light mode' : 'Toggle dark mode'}
        >
            {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
    );

    return tooltip ? (
        <Tooltip title={themeMode === 'dark' ? 'Light mode' : 'Dark mode'}>
            {button}
        </Tooltip>
    ) : (
        button
    );
};

export default ThemeToggle; 