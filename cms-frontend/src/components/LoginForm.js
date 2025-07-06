import React, { useState } from 'react';
import { loginUser } from '../api'; // Import the new loginUser function
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'; // For redirection

const LoginForm = ({ onLogin }) => { // onLogin prop to notify App.js
    const [identifier, setIdentifier] = useState(''); // Can be email or username
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        setLoading(true);

        try {
            const { user, jwt } = await loginUser(identifier, password);
            setMessage(t('loginSuccess'));
            // Optionally clear fields
            setIdentifier('');
            setPassword('');

            if (onLogin) {
                onLogin(user, jwt);
            }
            navigate('/');
        } catch (error) {
            setMessage(t('loginError') + (error.response?.data?.error?.message ? ` ${error.response.data.error.message}` : ''));
            setIsError(true);
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">{t('loginAccount')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('emailOrUsername')}
                    </label>
                    <input
                        type="text"
                        id="identifier"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('password')}
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? t('loggingIn') : t('login')}
                </button>
            </form>
            {message && (
                <div className={`mt-4 p-3 rounded-md text-center text-sm ${isError ? 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100' : 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100'}`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default LoginForm;
