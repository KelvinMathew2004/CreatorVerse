import { useRoutes } from 'react-router-dom'
import './App.css'
import Navbar from './components/NavBar';
import ColorPicker from './components/ColorPicker';
import CreatorDetails from './pages/CreatorDetails';
import EditCreator from './pages/EditCreator';
import NewCreator from './pages/NewCreator';
import HomePage from './pages/HomePage';

const App = () => {
  
  let element = useRoutes([
    {
      path: "/",
      element: <HomePage />
    },
    {
      path:"/creator/:id",
      element: <CreatorDetails />
    },
    {
      path:"/edit/:id",
      element: <EditCreator />
    },
    {
      path:"/new/:id?",
      element: <NewCreator />
    }
  ]);

  return (
    <div className="App">
      <Navbar />
      <ColorPicker />
      <main className="main-content">
        {element}
      </main>
    </div>
  )
}

export default App