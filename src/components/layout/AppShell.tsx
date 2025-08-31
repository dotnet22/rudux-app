import { useState } from 'react'
import { Box, Toolbar, useTheme, useMediaQuery } from '@mui/material'
import TopNavigation from './TopNavigation'
import Sidebar from './Sidebar'

interface AppShellProps {
  children: React.ReactNode
}

const DRAWER_WIDTH = 280

export default function AppShell({ children }: AppShellProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleDrawerClose = () => {
    setMobileOpen(false)
  }

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      <TopNavigation 
        onMenuClick={handleDrawerToggle}
        showMenuButton={isMobile}
      />
      
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar
          open={true}
          onClose={() => {}}
          variant="permanent"
          width={DRAWER_WIDTH}
        />
      )}
      
      {/* Mobile Sidebar */}
      {isMobile && (
        <Sidebar
          open={mobileOpen}
          onClose={handleDrawerClose}
          variant="temporary"
          width={DRAWER_WIDTH}
        />
      )}
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          backgroundColor: 'grey.50',
          overflow: 'hidden',
        }}
      >
        <Toolbar />
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            minHeight: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
            width: '100%',
            overflow: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}