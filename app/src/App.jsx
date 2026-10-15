import React, { useState } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TranslateIcon from '@mui/icons-material/Translate';
import StyleIcon from '@mui/icons-material/Style';
import Dashboard from './pages/Dashboard.jsx';
import Lessons from './pages/Lessons.jsx';
import LessonDetail from './pages/LessonDetail.jsx';
import Dictionary from './pages/Dictionary.jsx';
import Practice from './pages/Practice.jsx';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/lessons', label: 'Lessons', icon: <MenuBookIcon /> },
  { to: '/dictionary', label: 'Dictionary', icon: <TranslateIcon /> },
  { to: '/practice', label: 'Word Practice', icon: <StyleIcon /> },
];

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const nav = (
    <List>
      {NAV_ITEMS.map((item) => (
        <ListItem key={item.to} disablePadding>
          <ListItemButton
            component={NavLink}
            to={item.to}
            selected={location.pathname === item.to}
            onClick={() => setDrawerOpen(false)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2, display: { md: 'none' } }}
            aria-label="open navigation"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            English Learning
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: 240 } }}
      >
        {nav}
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        {nav}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/lessons/:id" element={<LessonDetail />} />
          <Route path="/dictionary" element={<Dictionary />} />
          <Route path="/practice" element={<Practice />} />
        </Routes>
      </Box>
    </Box>
  );
}