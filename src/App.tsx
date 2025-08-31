import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router'
import AcademicYearsPage from './pages/AcademicYearsPage'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/academic-years" replace />} />
          <Route path="/academic-years" element={<AcademicYearsPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
