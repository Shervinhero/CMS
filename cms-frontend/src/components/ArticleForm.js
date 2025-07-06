import React, { useState } from 'react';
import { createArticle } from '../api';
import { useTranslation } from 'react-i18next';

const ArticleForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        setLoading(true);

        try {
            await createArticle({ title, content }, image);
            setMessage(t('articleAddedSuccess'));
            setTitle('');
            setContent('');
            setImage(null);
            // Clear file input visually
            if (document.getElementById('image-upload')) {
                document.getElementById('image-upload').value = '';
            }
        } catch (error) {
            setMessage(t('errorAddingArticle'));
            setIsError(true);
            console.error('Form submission error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">{t('addArticle')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('title')}
                    </label>
                    <input
                        type="text"
                        id="title"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('content')}
                    </label>
                    <textarea
                        id="content"
                        rows="4"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('image')} ({t('uploadDocument')})
                    </label>
                    <input
                        type="file"
                        id="image-upload"
                        className="mt-1 block w-full text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-700 dark:file:text-indigo-50"
                        onChange={(e) => setImage(e.target.files[0])}
                        accept="image/*" // Only allow image files
                    />
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : t('submit')}
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

export default ArticleForm;
