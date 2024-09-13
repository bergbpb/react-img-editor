import React from 'react'

import { render } from 'react-dom'
import App from './components/App'
import { AppContextProvider } from './store'

const root = document.getElementById('root')

render(
    <AppContextProvider>
        <App />
    </AppContextProvider>,

    root
)
