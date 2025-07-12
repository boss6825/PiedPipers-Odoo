import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Menu,
    MenuItem,
    useMediaQuery,
    InputBase,
    alpha,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Divider,
    ListItemIcon,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    Search as SearchIcon,
    Menu as MenuIcon,
    AccountCircle,
    Close as CloseIcon,
    ImageOutlined,
    QuestionAnswer,
    Home,
} from '@mui/icons-material';
import { logout, selectIsAuthenticated } from '../../features/auth/authSlice';
import {
    selectNotifications,
    selectNotificationsLoading
} from '../../features/notifications/notificationSlice';
import { setFilters } from '../../features/questions/questionSlice';
import ThemeToggle from '../common/ThemeToggle';
import NotificationList from '../notifications/NotificationList';
import NotificationBadge from '../notifications/NotificationBadge';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const isAuthenticated = useSelector(selectIsAuthenticated);
    const notifications = useSelector(selectNotifications);
    const notificationsLoading = useSelector(selectNotificationsLoading);

    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotificationMenuOpen = (event) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setNotificationAnchorEl(null);
    };

    const handleToggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleLogout = () => {
        dispatch(logout());
        handleMenuClose();
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            dispatch(setFilters({ searchTerm }));
            navigate('/');
        }
    };

    return (
        <>
            <AppBar position="static" color="default" elevation={1}>
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleToggleMobileMenu}
                            sx={{ mr: 1 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        sx={{
                            textDecoration: 'none',
                            color: 'inherit',
                            fontWeight: 700,
                            flexGrow: { xs: 1, md: 0 },
                            mr: { md: 4 },
                        }}
                    >
                        StackIt
                    </Typography>

                    {!isMobile && (
                        <>
                            <Box
                                component="form"
                                onSubmit={handleSearch}
                                sx={{
                                    position: 'relative',
                                    borderRadius: theme.shape.borderRadius,
                                    backgroundColor: alpha(theme.palette.common.white, 0.15),
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.common.white, 0.25),
                                    },
                                    marginRight: theme.spacing(2),
                                    marginLeft: 0,
                                    width: '100%',
                                    maxWidth: '400px',
                                    [theme.breakpoints.up('sm')]: {
                                        marginLeft: theme.spacing(3),
                                        width: 'auto',
                                    },
                                }}
                            >
                                <Box sx={{ padding: theme.spacing(0, 2), height: '100%', position: 'absolute', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <SearchIcon />
                                </Box>
                                <InputBase
                                    placeholder="Search…"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    sx={{
                                        color: 'inherit',
                                        padding: theme.spacing(1, 1, 1, 0),
                                        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                                        transition: theme.transitions.create('width'),
                                        width: '100%',
                                    }}
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </Box>

                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/guide/image-upload"
                                startIcon={<ImageOutlined />}
                                sx={{ mr: 2 }}
                            >
                                Image Guide
                            </Button>

                            <Box sx={{ flexGrow: 1 }} />
                        </>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ThemeToggle />

                        {isAuthenticated ? (
                            <>
                                <NotificationBadge onClick={handleNotificationMenuOpen} />

                                <IconButton
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-haspopup="true"
                                    onClick={handleProfileMenuOpen}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                            </>
                        ) : (
                            !isMobile && (
                                <>
                                    <Button color="inherit" component={RouterLink} to="/login">
                                        Login
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        component={RouterLink}
                                        to="/register"
                                        sx={{ ml: 1 }}
                                    >
                                        Register
                                    </Button>
                                </>
                            )
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Profile Menu */}
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleMenuClose}>
                    Profile (Coming Soon)
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>

            {/* Notifications Menu */}
            <Menu
                anchorEl={notificationAnchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(notificationAnchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    style: {
                        maxHeight: '400px',
                        width: '350px',
                    },
                }}
            >
                <NotificationList
                    notifications={notifications}
                    loading={notificationsLoading}
                    onClose={handleMenuClose}
                />
            </Menu>

            {/* Mobile Drawer */}
            <Drawer
                anchor="left"
                open={mobileMenuOpen}
                onClose={handleToggleMobileMenu}
            >
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            Menu
                        </Typography>
                        <IconButton onClick={handleToggleMobileMenu}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Divider />
                    <List>
                        <ListItem button component={RouterLink} to="/" onClick={handleToggleMobileMenu}>
                            <ListItemIcon>
                                <Home />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItem>
                        <ListItem button component={RouterLink} to="/questions/ask" onClick={handleToggleMobileMenu}>
                            <ListItemIcon>
                                <QuestionAnswer />
                            </ListItemIcon>
                            <ListItemText primary="Ask Question" />
                        </ListItem>
                        <ListItem button component={RouterLink} to="/guide/image-upload" onClick={handleToggleMobileMenu}>
                            <ListItemIcon>
                                <ImageOutlined />
                            </ListItemIcon>
                            <ListItemText primary="Image Upload Guide" />
                        </ListItem>
                    </List>
                    <Divider />
                    {isAuthenticated ? (
                        <List>
                            <ListItem button onClick={handleToggleMobileMenu}>
                                <ListItemText primary="Profile (Coming Soon)" />
                            </ListItem>
                            <ListItem button onClick={() => { handleLogout(); handleToggleMobileMenu(); }}>
                                <ListItemText primary="Logout" />
                            </ListItem>
                        </List>
                    ) : (
                        <List>
                            <ListItem button component={RouterLink} to="/login" onClick={handleToggleMobileMenu}>
                                <ListItemText primary="Login" />
                            </ListItem>
                            <ListItem button component={RouterLink} to="/register" onClick={handleToggleMobileMenu}>
                                <ListItemText primary="Register" />
                            </ListItem>
                        </List>
                    )}
                </Box>
            </Drawer>
        </>
    );
};

export default Header; 