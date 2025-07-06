import React, { useState } from 'react';
import { registerUser } from '../api';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const RegisterForm = ({ onRegisterSuccess }) => { // Accept onRegisterSuccess prop
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [disabilityCardFile, setDisabilityCardFile] = useState(null);
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
            await registerUser({ username, email, password }, disabilityCardFile);
            setMessage(t('registrationSuccess'));
            setUsername('');
            setEmail('');
            setPassword('');
            setDisabilityCardFile(null);
            if (document.getElementById('disability-card-upload')) {
                document.getElementById('disability-card-upload').value = '';
            }

            if (onRegisterSuccess) {
                onRegisterSuccess();
            }
        } catch (error) {
            setMessage(t('registrationError') + (error.response?.data?.error?.message ? ` ${error.response.data.error.message}` : ''));
            setIsError(true);
            console.error('Registration error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">{t('registerAccount')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('username')}
                    </label>
                    <input
                        type="text"
                        id="username"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('email')}
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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

                {/* Field for Disability Card Upload */}
                <div>
                    <label htmlFor="disability-card-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('disabilityCard')} ({t('uploadDocument')})
                    </label>
                    <input
                        type="file"
                        id="disability-card-upload"
                        className="mt-1 block w-full text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-700 dark:file:text-indigo-50"
                        onChange={(e) => setDisabilityCardFile(e.target.files[0])}
                        accept="image/*,application/pdf"
                    />
                </div>

                {/* Comments on other relationships (companions, tickets) */}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('noteOnRelationships')}: {t('companionsAndTicketsInfo')}
                </p>

                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? t('registering') : t('register')}
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

export default RegisterForm;
