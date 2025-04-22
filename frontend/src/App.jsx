import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import LoginForm from './components/auth/Login'
import { Toaster } from './components/ui/sonner'
import Routes from './routing/routes'

function App() {

  return (
    <>
      <Routes />
      <Toaster />
    </>
  )
}

export default App
