import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import Dashboard from '@/pages/Dashboard'
import Upload from '@/pages/Upload'
import Learning from '@/pages/Learning'
import CardSets from '@/pages/CardSets'
import Settings from '@/pages/Settings'
import { loadSets, saveSets } from '@/services/storage'

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [cardSets, setCardSets] = useState([])
  const [darkMode, setDarkMode] = useState(true)
  const [activeSet, setActiveSet] = useState(null)
  const [loading, setLoading] = useState(false)

  // Load data on mount
  useEffect(() => {
    const saved = loadSets()
    setCardSets(saved)

    // Check for dark mode preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const savedDarkMode = localStorage.getItem('darkMode')
    const isDark = savedDarkMode !== null ? JSON.parse(savedDarkMode) : prefersDark
    setDarkMode(isDark)
    applyTheme(isDark)
  }, [])

  // Save sets to localStorage when they change
  useEffect(() => {
    saveSets(cardSets)
  }, [cardSets])

  const applyTheme = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(isDark))
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    applyTheme(!darkMode)
  }

  const handleAddSet = (newSet) => {
    const setWithId = {
      ...newSet,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    }
    setCardSets([setWithId, ...cardSets])
    setCurrentPage('cardsets')
  }

  const handleUpdateSet = (id, updatedSet) => {
    setCardSets(cardSets.map(set => set.id === id ? { ...set, ...updatedSet } : set))
  }

  const handleDeleteSet = (id) => {
    setCardSets(cardSets.filter(set => set.id !== id))
    if (activeSet?.id === id) {
      setActiveSet(null)
    }
  }

  const handleStartLearning = (set) => {
    setActiveSet(set)
    setCurrentPage('learning')
  }

  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className={`min-h-screen bg-dark-950 text-white transition-colors duration-300 ${darkMode ? 'dark' : 'light'}`}>
      <Navigation 
        currentPage={currentPage} 
        onNavigate={handleNavigate}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <main className="pt-20 pb-20 min-h-screen">
        {currentPage === 'dashboard' && (
          <Dashboard 
            cardSets={cardSets}
            onNavigate={handleNavigate}
            onStartLearning={handleStartLearning}
          />
        )}
        {currentPage === 'upload' && (
          <Upload 
            onSetCreated={handleAddSet}
            loading={loading}
            setLoading={setLoading}
          />
        )}
        {currentPage === 'learning' && (
          <Learning 
            cardSet={activeSet}
            onNavigate={handleNavigate}
          />
        )}
        {currentPage === 'cardsets' && (
          <CardSets 
            cardSets={cardSets}
            onUpdateSet={handleUpdateSet}
            onDeleteSet={handleDeleteSet}
            onStartLearning={handleStartLearning}
          />
        )}
        {currentPage === 'settings' && (
          <Settings 
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
            cardSets={cardSets}
          />
        )}
      </main>
    </div>
  )
}
