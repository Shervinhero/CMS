import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrganizerById } from '../api';
import { useTranslation } from 'react-i18next';

const OrganizerDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [organizer, setOrganizer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t } = useTranslation();

    useEffect(() => {
        console.log('Organizer ID from URL (useParams):', id);

        const getOrganizerDetails = async () => {
            try {
                const data = await fetchOrganizerById(id);
                console.log('Fetched single organizer data:', data);
                if (data) {
                    setOrganizer(data);
                } else {
                    setError(t('noOrganizerFound'));
                }
            } catch (err) {
                setError('Failed to load organizer details.');
                console.error('Error fetching organizer details in component:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            getOrganizerDetails();
        } else {
            setError(t('noOrganizerFound'));
            setLoading(false);
        }
    }, [id, t]);

    if (loading) {
        return (
            <div className="text-center p-6 text-gray-700 dark:text-gray-300 text-lg font-medium">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
                {t('loadingOrganizer')}... {/* Add this to your i18n translation files */}
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

    if (!organizer) {
        return (
            <div className="text-center p-6 text-gray-600 dark:text-gray-400 text-xl bg-white dark:bg-gray-700 rounded-lg shadow-md">
                {t('noOrganizerFound')}
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            {/* Corrected button syntax: onClick attribute is now inside the <button> tag */}
            <button
                onClick={() => navigate(-1)} // Go back to the previous page
                className="mb-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300"
            >
                {t('back')} {/* Add 'back' to your i18n translation files */}
            </button>

            {organizer.mediaUrl && (
                <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-md mb-6">
                    <img
                        src={organizer.mediaUrl.startsWith('http') ? organizer.mediaUrl : `http://localhost:1337${organizer.mediaUrl}`}
                        alt={organizer.Name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/800x400/cccccc/000000?text=No+Image`;
                        }}
                    />
                </div>
            )}

            <h2 className="text-4xl font-extrabold text-center mb-4 text-indigo-700 dark:text-indigo-300">
                {organizer.Name || 'N/A'}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 text-center">
                {organizer.Description || 'N/A'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-300">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">{t('generalInfo')}</h3>
                    <p><strong>{t('type')}:</strong> {organizer.Type || 'N/A'}</p>
                    <p><strong>{t('website')}:</strong> {organizer.Website ? <a href={organizer.Website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{organizer.Website}</a> : 'N/A'}</p>
                    <p><strong>{t('address')}:</strong> {organizer.Address || 'N/A'}</p>
                    <p><strong>{t('contactMail')}:</strong> {organizer.Contact_Mail || 'N/A'}</p>
                    <p><strong>{t('contactPhone')}:</strong> {organizer.Contact_Phone || 'N/A'}</p>
                </div>

                {/* Address_Organizer Component Details */}
                {(organizer.addressOrganizerStreet !== 'N/A' || organizer.addressOrganizerCity !== 'N/A') && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">{t('organizerAddress')}</h3>
                        <p><strong>{t('street')}:</strong> {organizer.addressOrganizerStreet}</p>
                        <p><strong>{t('number')}:</strong> {organizer.addressOrganizerNumber}</p>
                        <p><strong>{t('city')}:</strong> {organizer.addressOrganizerCity}</p>
                        <p><strong>{t('zipcode')}:</strong> {organizer.addressOrganizerZipcode}</p>
                        <p><strong>{t('country')}:</strong> {organizer.addressOrganizerCountry}</p>
                    </div>
                )}

                {/* Contact_Organizer Component Details */}
                {(organizer.contactOrganizerFirstName !== 'N/A' || organizer.contactOrganizerEmailAddress !== 'N/A') && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm col-span-1 md:col-span-2">
                        <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">{t('contactPerson')}</h3>
                        <p><strong>{t('firstName')}:</strong> {organizer.contactOrganizerFirstName}</p>
                        <p><strong>{t('lastName')}:</strong> {organizer.contactOrganizerLastName}</p>
                        <p><strong>{t('phone')}:</strong> {organizer.contactOrganizerPhone}</p>
                        <p><strong>{t('emailAddress')}:</strong> {organizer.contactOrganizerEmailAddress}</p>

                        {/* Nested Address within Contact_Organizer */}
                        {(organizer.contactOrganizerAddressStreet !== 'N/A' || organizer.contactOrganizerAddressCity !== 'N/A') && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">{t('contactAddress')}</h4>
                                <p><strong>{t('street')}:</strong> {organizer.contactOrganizerAddressStreet}</p>
                                <p><strong>{t('number')}:</strong> {organizer.contactOrganizerAddressNumber}</p>
                                <p><strong>{t('city')}:</strong> {organizer.contactOrganizerAddressCity}</p>
                                <p><strong>{t('zipcode')}:</strong> {organizer.contactOrganizerAddressZipcode}</p>
                                <p><strong>{t('country')}:</strong> {organizer.contactOrganizerAddressCountry}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrganizerDetails;
