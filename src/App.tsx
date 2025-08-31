import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router'
import AppShell from './components/layout/AppShell'
import AcademicYearsPage from './modules/academic-years/pages/AcademicYearsPage'
import ProgramsPage from './modules/programs/pages/ProgramsPage'
import UniversitiesPage from './pages/UniversitiesPage'
import FacultiesPage from './pages/FacultiesPage'
import CoursesPage from './pages/CoursesPage'

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
        <AppShell>
          <Routes>
            <Route path="/" element={<Navigate to="/academic-years" replace />} />
            <Route path="/academic-years" element={<AcademicYearsPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/universities" element={<UniversitiesPage />} />
            <Route path="/faculties" element={<FacultiesPage />} />
            <Route path="/courses" element={<CoursesPage />} />
          </Routes>
        </AppShell>
      </Router>
    </ThemeProvider>
  )
}

export default App
