import React, { useEffect, useState } from 'react';
import { fetchArticles } from '../api';
import { useTranslation } from 'react-i18next';

const ArticleList = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t } = useTranslation();

    useEffect(() => {
        const getArticles = async () => {
            try {
                const data = await fetchArticles();
                setArticles(data);
            } catch (err) {
                setError('Failed to load articles.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getArticles();
    }, []);

    if (loading) return <div className="text-center p-4 text-gray-700">Loading articles...</div>;
    if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">{t('articles')}</h2>
            {articles.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400">{t('noArticles')}</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <div
                            key={article.id}
                            className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
                        >
                            {article.imageUrl && (
                                <img
                                    src={article.imageUrl}
                                    alt={article.title}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `https://placehold.co/600x400/cccccc/000000?text=No+Image`; // Placeholder
                                    }}
                                />
                            )}
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{article.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">{article.content}</p>
                                {/* You can add a link to a detail page here if needed */}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ArticleList;
