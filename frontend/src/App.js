import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
// import Dashboard from './pages/Dashboard';
import PrivateRoute from './routes/PrivateRoute';
import { Navigate } from 'react-router-dom';
import DashboardTmp from './pages/DashboardTmp';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Admin from './pages/Admin';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardTmp />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<Admin />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
