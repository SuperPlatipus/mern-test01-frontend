import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Test from './pages/Test';
// Context

import { useAuthContext } from './hooks/useAuthContext';

// Components
import Navbar from './components/Navbar';


function App() {

  const { user } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route
              path="/test"
              element={ user ? <Test/> : <Navigate to="/login" />}
            />
            <Route
              path="/"
              element={ user ? <Home /> : <Navigate to="/login" /> }
            />
            <Route
              path="/login"
              element={ !user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={ !user ? <Signup/> : <Navigate to="/" />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
