import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VisitorForm from './components/VisitorForm';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

export const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<VisitorForm />} />
                <Route path="/login" element={<AdminLogin />} />
                <Route
                    path="/admin"
                    element={
                        <PrivateRoute>
                            <AdminDashboard />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
