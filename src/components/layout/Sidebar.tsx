import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Box,
  Typography
} from '@mui/material'
import { Link, useLocation } from 'react-router'
import {
  CalendarToday,
  School,
  AccountBalance,
  BusinessCenter,
  MenuBook,
} from '@mui/icons-material'

const navigationItems = [
  { path: '/academic-years', label: 'Academic Years', icon: CalendarToday },
  { path: '/programs', label: 'Programs', icon: School },
  { path: '/universities', label: 'Universities', icon: AccountBalance },
  { path: '/faculties', label: 'Faculties', icon: BusinessCenter },
  { path: '/courses', label: 'Courses', icon: MenuBook },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
  variant?: 'permanent' | 'persistent' | 'temporary'
  width?: number
}

export default function Sidebar({ open, onClose, variant = 'permanent', width = 280 }: SidebarProps) {
  const location = useLocation()

  const sidebarContent = (
    <Box sx={{ width, height: '100%', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div" color="primary" fontWeight="bold">
          Academic Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          System Dashboard
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ flexGrow: 1, overflow: 'auto', overflowX: 'hidden' }}>
        <List sx={{ pt: 1 }}>
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={variant === 'temporary' ? onClose : undefined}
                  sx={{
                    mx: 1,
                    my: 0.5,
                    borderRadius: 1,
                    backgroundColor: isActive ? 'primary.main' : 'transparent',
                    color: isActive ? 'primary.contrastText' : 'inherit',
                    '&:hover': {
                      backgroundColor: isActive ? 'primary.dark' : 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? 'primary.contrastText' : 'inherit',
                      minWidth: 36,
                    }}
                  >
                    <Icon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 'medium' : 'regular',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Box>
    </Box>
  )

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          overflowX: 'hidden',
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  )
}