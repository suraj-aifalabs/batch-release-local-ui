import { Provider } from "react-redux";
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router.tsx';
import ErrorBoundary from './utils/ErrorBoundary'
import { store } from './store/configStore.tsx'
import './App.css'
import './index.css'


function App() {

  return (
    <Provider store={store}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </Provider>
  )
}

export default App
