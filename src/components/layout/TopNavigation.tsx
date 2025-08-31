import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material'
import { Menu as MenuIcon, Notifications, AccountCircle } from '@mui/icons-material'

interface TopNavigationProps {
  onMenuClick: () => void
  showMenuButton?: boolean
}

export default function TopNavigation({ onMenuClick, showMenuButton = false }: TopNavigationProps) {
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'background.paper',
        color: 'text.primary',
        boxShadow: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
      elevation={0}
    >
      <Toolbar>
        {showMenuButton && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'medium' }}>
          Academic Management System
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="large" color="inherit">
            <Notifications />
          </IconButton>
          <IconButton size="large" color="inherit">
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}