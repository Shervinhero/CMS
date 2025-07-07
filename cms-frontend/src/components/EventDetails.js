import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Import Link
import { fetchEventById } from '../api';
import { useTranslation } from 'react-i18next';

const EventDetails = () => {
    const { id } = useParams(); // Get the event ID from the URL
    const navigate = useNavigate(); // Initialize useNavigate hook
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t } = useTranslation();

    useEffect(() => {
        // Log the ID received from the URL
        console.log('Event ID from URL (useParams):', id);

        const getEvent = async () => {
            try {
                const data = await fetchEventById(id);
                // Add a console log here to see what data is received for a single event
                console.log('Fetched single event data:', data);
                if (data) {
                    setEvent(data);
                } else {
                    setError(t('noEventFound'));
                }
            } catch (err) {
                setError('Failed to load event details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) { // Only fetch if ID is available
            getEvent();
        } else {
            setError(t('noEventFound'));
            setLoading(false);
        }
    }, [id, t]); // Re-fetch if ID changes or translation changes

    if (loading) return <div className="text-center p-4 text-gray-700 dark:text-gray-300">Loading event details...</div>;
    if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;
    if (!event) return <div className="text-center p-4 text-gray-600 dark:text-gray-400">{t('noEventFound')}</div>;

    return (
        // Enhanced container styling with gradient, larger shadow, and rounded corners
        <div className="container mx-auto p-6 md:p-8 max-w-4xl bg-gradient-to-br from-indigo-50 dark:from-gray-900 to-white dark:to-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-indigo-100 dark:border-gray-700">
            <button // Styled button with enhanced hover and focus effects
                onClick={() => navigate('/')}
                className="mb-8 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
                {t('backToEvents')}
            </button>

            {event.imageUrl && (
                <div className="relative w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-xl mb-8 group">
                    <img
                        src={event.imageUrl.startsWith('http') ? event.imageUrl : `http://localhost:1337${event.imageUrl}`}
                        alt={event.Name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/800x400/cccccc/000000?text=No+Image`;
                        }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-white text-xl font-bold">{event.Name}</span>
                    </div>
                </div>
            )}

            <h2 className="text-5xl font-extrabold text-center mb-6 text-indigo-700 dark:text-indigo-300 leading-tight">
                {event.Name}
            </h2>
            <p className="text-xl text-gray-800 dark:text-gray-200 mb-8 leading-relaxed text-center">
                {event.Description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-gray-700 dark:text-gray-300 text-base">
                <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <p><strong>{t('eventDate')}:</strong> {event.Date ? new Date(event.Date).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p><strong>{t('eventTime')}:</strong> {event.startTime ? new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'} - {event.EndTime ? new Date(event.EndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</p>
                </div>
                <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <p><strong>{t('eventLocation')}:</strong> {event.locationName}</p>
                </div>
                <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m3 0h5M9 11h1m-1 4h1m-2 4h4m-4 0v-4m4 4v-4"></path></svg>
                    {/* Make organizer name a link if organizer data is available */}
                    {event.organizer?.data?.id ? (
                        <p>
                            <strong>{t('eventOrganizer')}:</strong>{' '}
                            <Link
                                to={`/organizers/${event.organizer.data.id}`}
                                className="text-indigo-600 hover:underline font-medium"
                            >
                                {event.organizerName}
                            </Link>
                        </p>
                    ) : (
                        <p><strong>{t('eventOrganizer')}:</strong> {event.organizerName}</p>
                    )}
                </div>
                {event.Website && (
                    <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V10m0 0l-7-7m7 7l-7-7m7 7H14"></path></svg>
                        <p>
                            <strong>{t('website')}:</strong>{' '}
                            <a href={event.Website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                                {event.Website}
                            </a>
                        </p>
                    </div>
                )}
                {event.MaxCap && (
                    <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h2a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v13a2 2 0 002 2h2m10-4h2m1-4h-2m-3 4h-2m-2 0H7m5 0v-4m-7 4h7v4H5a2 2 0 01-2-2v-2"></path></svg>
                        <p><strong>{t('maxCapacity')}:</strong> {event.MaxCap}</p>
                    </div>
                )}
                {event.eventType && (
                    <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0h7m-7 0h-4m4 0v-7a3 3 0 016 0v7m-6 0h6"></path></svg>
                        <p><strong>{t('eventType')}:</strong> {event.eventType}</p>
                    </div>
                )}
                {event.language && (
                    <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 018.67 15.91a16.002 16.002 0 005.622 2.765c.232.14.468.276.704.413M19 10V3m-2 2V3m-3 2h3m-3 0h-1M21 12a9 9 0 11-18 0z"></path></svg>
                        <p><strong>{t('language')}:</strong> {event.language}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventDetails;
