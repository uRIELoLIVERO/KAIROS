import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import './index.css';


const theme = createTheme({
  typography: {
    fontFamily: 'Noto Sans JP, sans-serif',
    h1: {
      fontSize: '4rem',
      fontWeight: 700
    },
    h2: {
      fontSize: '3.5rem',
      fontWeight: 700
    },
    h3: {
      fontSize: '3rem',
      fontWeight: 600
    },
    h4: {
      fontSize: '2.5rem',
      fontWeight: 600
    },
    h5: {
      fontSize: '2rem',
      fontWeight: 500
    },
    h6: {
      fontSize: '1.5rem',
      fontWeight: 500
    },
    subtitle1: {
      fontSize: '1.125rem',
      fontWeight: 400
    },
    subtitle2: {
      fontSize: '1rem',
      fontWeight: 400
    },
    md: {
      fontSize: '0.875rem',
      fontWeight: 400
    },
    sm: {
      fontSize: '0.75rem',
      fontWeight: 400
    },
    xs : {
      fontSize: '0.5rem',
      fontWeight: 400
    }
  },
  palette: {
    primary: {
      main: '#63A247' 
    },
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <App /> 
      </ThemeProvider>
  </StrictMode>,
)
