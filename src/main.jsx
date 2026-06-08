import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { ThemeProvider } from './context/ThemeContext'
import { ProgressProvider } from './context/ProgressContext'
import { LanguageProvider } from './context/LanguageContext'
import './styles/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <ThemeProvider>
        <LanguageProvider>
          <ProgressProvider>
            <App />
          </ProgressProvider>
        </LanguageProvider>
      </ThemeProvider>
    </HashRouter>
  </StrictMode>
)
