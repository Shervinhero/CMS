import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { useTranslation } from 'react-i18next';
import { logoutUser } from './api';


import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import TicketList from './components/TicketList';
import OrganizerDetails from './components/OrganizerDetails';


const AppContent = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);


    useEffect(() => {
        const storedJwt = localStorage.getItem('jwt');
        const storedUser = localStorage.getItem('user');
        if (storedJwt && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user data:", e);
                logoutUser();
            }
        }
    }, []);

    const handleLogin = (loggedInUser) => {
        setUser(loggedInUser);
    };

    const handleLogout = () => {
        logoutUser();
        setUser(null);
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-950 dark:to-gray-800 text-gray-900 dark:text-gray-100 font-sans flex flex-col">
            {/* Navigation Bar - Enhanced with deeper shadow and rounded bottom */}
            <nav className="bg-white dark:bg-gray-800 shadow-xl rounded-b-lg p-4 mb-8">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                    <div className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-4 md:mb-0 transform hover:scale-105 transition duration-300">
                        CMS Frontend
                    </div>
                    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
                        <ul className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-6">
                            <li>
                                <Link
                                    to="/"
                                    className="relative text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-300 font-medium text-lg py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                >
                                    {t('events')}
                                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            </li>
                            {/* Link to Tickets */}
                            <li>
                                <Link
                                    to="/tickets"
                                    className="relative text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-300 font-medium text-lg py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                >
                                    {t('tickets')}
                                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            </li>
                            {user ? (
                                <>
                                    <li>
                                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-lg px-2 py-1 rounded-md bg-indigo-50 dark:bg-indigo-900 dark:bg-opacity-30">
                                            {t('welcome')}, {user.username}
                                        </span>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition duration-200 font-medium text-lg bg-transparent border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-30 cursor-pointer"
                                        >
                                            {t('logout')}
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link
                                            to="/register"
                                            className="relative text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-300 font-medium text-lg py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                        >
                                            {t('registerAccount')}
                                            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/login"
                                            className="relative text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-300 font-medium text-lg py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                        >
                                            {t('login')}
                                            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                        {/* Language Switcher Component */}
                        <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-full p-1 shadow-inner">
                            <span className="font-medium text-sm ml-1">{t('language')}:</span>
                            <button
                                onClick={() => i18n.changeLanguage('en')}
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition duration-300 ${
                                    i18n.language === 'en' ? 'bg-indigo-600 text-white shadow-md' : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                {t('english')}
                            </button>
                            <button
                                onClick={() => i18n.changeLanguage('fa')}
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition duration-300 ${
                                    i18n.language === 'fa' ? 'bg-indigo-600 text-white shadow-md' : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                {t('DE')}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Area - Added padding and rounded corners */}
            <main className="flex-grow p-6 md:p-8 bg-white dark:bg-gray-800 rounded-lg shadow-inner mx-4 md:mx-auto max-w-7xl">
                <Routes>
                    <Route path="/" element={<EventList />} />
                    <Route path="/events/:id" element={<EventDetails />} />
                    <Route path="/register" element={<RegisterForm onRegisterSuccess={() => navigate('/login')} />} />
                    <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
                    <Route path="/tickets" element={<TicketList />} /> {/* Route for TicketList */}
                    <Route path="/organizers/:id" element={<OrganizerDetails />} /> {/* NEW: Route for OrganizerDetails */}
                </Routes>
            </main>

            {/* Footer - Enhanced with subtle shadow and darker background */}
            <footer className="bg-gray-200 dark:bg-gray-900 text-gray-600 dark:text-gray-400 p-4 text-center text-sm mt-8 shadow-inner">
                &copy; {new Date().getFullYear()} CMS Frontend. All rights reserved.
            </footer>
        </div>
    );
};


const App = () => (
    <I18nextProvider i18n={i18n}>
        <Router>
            <AppContent />
        </Router>
    </I18nextProvider>
);

export default App;
