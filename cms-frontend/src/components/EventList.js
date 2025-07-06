import React, { useEffect, useState } from 'react';
import { fetchEvents } from '../api';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t } = useTranslation();

    useEffect(() => {
        const getEvents = async () => {
            try {
                const data = await fetchEvents();
                console.log('Fetched events data (from api.js):', data);
                setEvents(data);
            } catch (err) {
                setError('Failed to load events.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getEvents();
    }, []);

    if (loading) return <div className="text-center p-4 text-gray-700 dark:text-gray-300">Loading events...</div>;
    if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;


    console.log('Events state before rendering:', events);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">{t('events')}</h2>
            {events.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400">{t('noEventFound')}</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => {
                        console.log('Rendering individual event:', event);
                        return (
                            <Link
                                to={`/events/${event.id}`}
                                key={event.id}
                                className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl block"
                            >
                                {event.imageUrl && (
                                    <img
                                        src={event.imageUrl}
                                        alt={event.Name}
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `https://placehold.co/600x400/cccccc/000000?text=No+Image`;
                                        }}
                                    />
                                )}
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{event.Name}</h3> {/* Using event.Name */}
                                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-2">{event.Description}</p> {/* Using event.Description */}
                                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                                        {t('eventDate')}: {event.Date ? new Date(event.Date).toLocaleDateString() : 'N/A'} {/* Using event.Date */}
                                    </p>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                                        {t('eventTime')}: {event.startTime ? new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'} {/* Using event.startTime */}
                                    </p>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                                        {t('eventLocation')}: {event.locationName}
                                    </p>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                                        {t('eventOrganizer')}: {event.organizerName}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default EventList;
