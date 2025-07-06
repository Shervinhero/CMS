import React, { useEffect, useState } from 'react';
import { fetchTickets } from '../api';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t } = useTranslation();

    useEffect(() => {
        const getTickets = async () => {
            try {
                const data = await fetchTickets();
                console.log('Fetched tickets data:', data);
                setTickets(data);
            } catch (err) {
                setError('Failed to load tickets.');
                console.error('Error fetching tickets:', err);
            } finally {
                setLoading(false);
            }
        };
        getTickets();
    }, []);

    if (loading) {
        return (
            <div className="text-center p-6 text-gray-700 dark:text-gray-300 text-lg font-medium">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
                {t('loadingTickets')}...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-6 text-red-600 dark:text-red-400 text-lg font-semibold bg-red-50 dark:bg-red-900 rounded-lg shadow-md">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h2 className="text-4xl font-extrabold text-center mb-10 text-indigo-700 dark:text-indigo-300">
                {t('tickets')}
            </h2>

            {tickets.length === 0 ? (
                <p className="text-center text-xl text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                    {t('noTicketsFound')}
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            className="bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-600 transform transition duration-300 hover:scale-103 hover:shadow-xl relative group"
                        >
                            {/* Optional: Link to ticket details if you create a TicketDetails component */}
                            {/* <Link to={`/tickets/${ticket.id}`} className="block"> */}
                            <div className="p-6">
                                <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-100">
                                    {ticket.Ticket_Type || t('ticket')} ID: {ticket.id}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                                    <strong>{t('eventName')}:</strong> {ticket.eventName}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                                    <strong>{t('userName')}:</strong> {ticket.userName}
                                </p>

                                <div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
                                    <p className="text-gray-700 dark:text-gray-200">
                                        <strong>{t('status')}:</strong> <span className={`font-semibold ${ticket.Status_2 === 'Valid' ? 'text-green-600' : 'text-red-600'}`}>{ticket.Status_2 || 'N/A'}</span>
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-200">
                                        <strong>{t('format')}:</strong> {ticket.Format || 'N/A'}
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-200">
                                        <strong>{t('zone')}:</strong> {ticket.Zone || 'N/A'}
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-200">
                                        <strong>{t('seat')}:</strong> {ticket.Seat || 'N/A'}
                                    </p>
                                </div>

                                {/* Price Details */}
                                {ticket.priceTicket && (
                                    <div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-4">
                                        <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">{t('priceDetails')}:</h4>
                                        <p className="text-gray-700 dark:text-gray-200">
                                            <strong>{t('basePrice')}:</strong> {ticket.priceTicket.base_price || '0'} {ticket.priceTicket.currency || 'USD'}
                                        </p>
                                        <p className="text-gray-700 dark:text-gray-200">
                                            <strong>{t('discount')}:</strong> {ticket.priceTicket.discount || '0'}%
                                        </p>
                                        <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                                            {t('finalPrice')}: {ticket.priceTicket.final_price || '0'} {ticket.priceTicket.currency || 'USD'}
                                        </p>
                                        {ticket.priceTicket.Reason && (
                                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                                ({t('reason')}: {ticket.priceTicket.Reason})
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Refund Policy */}
                                {ticket.refundPolicyBlock && (
                                    <div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-4">
                                        <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">{t('refundPolicy')}:</h4>
                                        {/* Render rich text content - you might need a markdown parser if it's complex markdown */}
                                        <div
                                            className="prose dark:prose-invert text-gray-700 dark:text-gray-300 text-sm"
                                            dangerouslySetInnerHTML={{ __html: ticket.refundPolicyBlock }}
                                        ></div>
                                    </div>
                                )}
                            </div>
                            {/* </Link> */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TicketList;
