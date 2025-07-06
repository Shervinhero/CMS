import axios from 'axios';


const STRAPI_URL = 'http://localhost:1337/api';

/**
 * Fetches all events from Strapi.
 * Assumes Strapi has an 'event' content type.
 * Populates related fields like image, location, and organizer.
 * @returns {Array} An array of event objects.
 */
export const fetchEvents = async () => {
    try {
        const response = await axios.get(`${STRAPI_URL}/events?populate=*`);

        console.log('--- Raw Strapi Response for Events (from api.js) ---', response.data);


        console.log('Events data array before filter:', response.data.data);

        return response.data.data
            .filter(item => {

                console.log('Filtering event item:', item);
                const isValid = item && item.id;
                console.log('Is event item valid (item && item.id)?', isValid);
                return isValid;
            })
            .map(item => {

                console.log('Mapping event item:', item);
                const mappedItem = {
                    id: item.id,

                    ...item,

                    imageUrl: item.Image?.[0]?.url
                        ? `${item.Image[0].url.startsWith('http') ? '' : 'http://localhost:1337'}${item.Image[0].url}`
                        : null,

                    locationName: item.locations?.[0]?.Name || 'N/A',

                    organizerName: item.organizer?.data?.attributes?.name || 'N/A',
                };
                console.log('Mapped event item:', mappedItem);
                return mappedItem;
            });
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
};

/**
 * Fetches a single event by its ID from Strapi.
 * @param {string} id - The ID of the event.
 * @returns {Object|null} The event object or null if not found.
 */
export const fetchEventById = async (id) => {
    try {
        const response = await axios.get(`${STRAPI_URL}/events/${id}?populate=*`);

        const item = response.data.data;


        if (!item || !item.id) return null;

        return {
            id: item.id,

            ...item,
            imageUrl: item.Image?.[0]?.url
                ? `${item.Image[0].url.startsWith('http') ? '' : 'http://localhost:1337'}${item.Image[0].url}`
                : null,
            locationName: item.locations?.[0]?.Name || 'N/A',
            organizerName: item.organizer?.data?.attributes?.name || 'N/A',
        };
    } catch (error) {
        console.error(`Error fetching event with ID ${id}:`, error);
        return null;
    }
};

/**
 * Registers a new user in Strapi, optionally handling a disability card file upload.
 * IMPORTANT: Strapi's default /auth/local/register endpoint does NOT support custom fields or file uploads directly.
 * This function performs a two-step process:
 * 1. Registers the user (username, email, password).
 * 2. If registration is successful and a file is provided, uploads the file and then updates the user's profile
 * to link the uploaded disability card.
 * @param {Object} userData - Object containing username, email, and password.
 * @param {File} [disabilityCardFile] - Optional file object for the disability card.
 * @returns {Object} The registered user data.
 */
export const registerUser = async (userData, disabilityCardFile = null) => {
    try {

        const registerResponse = await axios.post(`${STRAPI_URL}/auth/local/register`, userData);
        const user = registerResponse.data.user;
        const jwt = registerResponse.data.jwt;


        localStorage.setItem('jwt', jwt);
        localStorage.setItem('user', JSON.stringify(user));


        if (disabilityCardFile) {
            const formData = new FormData();
            formData.append('files', disabilityCardFile);


            const uploadResponse = await axios.post(`${STRAPI_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${jwt}`
                },
            });

            const uploadedFile = uploadResponse.data[0];


            const disabilityCardData = {
                data: {
                    document: uploadedFile.id,

                }
            };

            const createDisabilityCardResponse = await axios.post(`${STRAPI_URL}/disability-cards`, disabilityCardData, {
                headers: {
                    'Authorization': `Bearer ${jwt}`
                },
            });

            const newDisabilityCardId = createDisabilityCardResponse.data.data.id;


            await axios.put(`${STRAPI_URL}/users/${user.id}`, {
                disability_card: newDisabilityCardId
            }, {
                headers: {
                    'Authorization': `Bearer ${jwt}`
                },
            });
            console.log('Disability card uploaded and linked to user.');
        }

        return user;
    } catch (error) {
        console.error('Error during user registration or profile update:', error.response ? error.response.data : error.message);
        throw error;
    }
};

/**
 * Logs in a user with Strapi.
 * @param {string} identifier - User's email or username.
 * @param {string} password - User's password.
 * @returns {Object} The logged-in user data and JWT.
 */
export const loginUser = async (identifier, password) => {
    try {
        const response = await axios.post(`${STRAPI_URL}/auth/local`, {
            identifier,
            password,
        });
        const { jwt, user } = response.data;


        localStorage.setItem('jwt', jwt);
        localStorage.setItem('user', JSON.stringify(user));

        return { jwt, user };
    } catch (error) {
        console.error('Error logging in user:', error.response ? error.response.data : error.message);
        throw error;
    }
};

/**
 * Logs out the current user by removing JWT and user info from localStorage.
 */
export const logoutUser = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
};

/**
 * Fetches all tickets from Strapi.
 * Populates all necessary relations and components using `populate=*`.
 * @returns {Array} An array of ticket objects.
 */
export const fetchTickets = async () => {
    try {

        const response = await axios.get(`${STRAPI_URL}/tickets?populate=*`);

        console.log('--- Raw Strapi Response for Tickets (from api.js) ---', response.data);


        console.log('Tickets data array before filter:', response.data.data);

        return response.data.data
            .filter(item => {

                console.log('Filtering ticket item:', item);
                const isValid = item && item.id;
                console.log('Is ticket item valid (item && item.id)?', isValid);
                return isValid;
            })
            .map(item => {

                console.log('Mapping ticket item:', item);
                const mappedItem = {
                    id: item.id,

                    ...item,

                    eventName: item.event?.data?.attributes?.Name || 'N/A',

                    userName: item.users_permissions_users?.[0]?.username || 'N/A', // Corrected access for users_permissions_users

                    priceTicket: item.PRICE_TICKET || {},

                    refundPolicyBlock: item.REFUND_POLICY_TICKET?.RefundPolicyBlock || 'N/A',
                };
                console.log('Mapped ticket item:', mappedItem);
                return mappedItem;
            });
    } catch (error) {
        console.error('Error fetching tickets:', error);
        return [];
    }
};

/**
 * Fetches a single ticket by its ID from Strapi.
 * @param {string} id - The ID of the ticket.
 * @returns {Object|null} The ticket object or null if not found.
 */
export const fetchTicketById = async (id) => {
    try {
        const response = await axios.get(`${STRAPI_URL}/tickets/${id}?populate=*`);

        const item = response.data;
        if (!item || !item.id) return null;

        return {
            id: item.id,

            ...item,
            eventName: item.event?.data?.attributes?.Name || 'N/A',
            userName: item.users_permissions_users?.[0]?.username || 'N/A',
            priceTicket: item.PRICE_TICKET || {},
            refundPolicyBlock: item.REFUND_POLICY_TICKET?.RefundPolicyBlock || 'N/A',
        };
    } catch (error) {
        console.error(`Error fetching ticket with ID ${id}:`, error);
        return null;
    }
};

/**
 * Creates a new ticket in Strapi.
 * @param {Object} ticketData - Object containing ticket details.
 * @returns {Object} The created ticket data.
 */
export const createTicket = async (ticketData) => {
    try {
        const token = localStorage.getItem('jwt');
        const headers = {};
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn('No JWT found for authenticated ticket creation. Ensure user is logged in or public ticket creation is allowed.');
        }


        const dataToSend = {
            data: {
                Status_2: ticketData.Status_2,
                Price: ticketData.Price,
                Format: ticketData.Format,
                Zone: ticketData.Zone,
                Seat: ticketData.Seat,
                Refund_Policy: ticketData.Refund_Policy,
                Ticket_Type: ticketData.Ticket_Type,
                PRICE_TICKET: ticketData.PRICE_TICKET,
                REFUND_POLICY_TICKET: ticketData.REFUND_POLICY_TICKET,
                event: ticketData.event,
                users_permissions_users: ticketData.users_permissions_users,
            },
        };

        const response = await axios.post(`${STRAPI_URL}/tickets`, dataToSend, { headers });
        return {
            id: response.data.data.id,
            ...response.data.data.attributes,
        };
    } catch (error) {
        console.error('Error creating ticket:', error.response ? error.response.data : error.message);
        throw error;
    }
};

/**
 * Fetches a single organizer by its ID from Strapi.
 * @param {string} id - The ID of the organizer.
 * @returns {Object|null} The organizer object or null if not found.
 */
export const fetchOrganizerById = async (id) => {
    try {
        const response = await axios.get(`${STRAPI_URL}/organizers/${id}?populate=*`);
        const item = response.data.data;

        if (!item || !item.id) return null;


        const addressOrganizer = item.Address_Organizer || {};
        const contactOrganizer = item.Contact_Organizer || {};
        const contactOrganizerAddress = contactOrganizer.Address || {};

        return {
            id: item.id,
            ...item,

            mediaUrl: item.Media?.[0]?.url
                ? `${item.Media[0].url.startsWith('http') ? '' : 'http://localhost:1337'}${item.Media[0].url}`
                : null,

            addressOrganizerStreet: addressOrganizer.street || 'N/A',
            addressOrganizerNumber: addressOrganizer.number || 'N/A',
            addressOrganizerCity: addressOrganizer.city || 'N/A',
            addressOrganizerZipcode: addressOrganizer.zipcode || 'N/A',
            addressOrganizerCountry: addressOrganizer.country || 'N/A',

            contactOrganizerLastName: contactOrganizer.LastName || 'N/A',
            contactOrganizerPhone: contactOrganizer.Phone || 'N/A',
            contactOrganizerEmailAddress: contactOrganizer.EmailAddress || 'N/A',
            contactOrganizerFirstName: contactOrganizer.FirstName || 'N/A',

            contactOrganizerAddressStreet: contactOrganizerAddress.street || 'N/A',
            contactOrganizerAddressNumber: contactOrganizerAddress.number || 'N/A',
            contactOrganizerAddressCity: contactOrganizerAddress.city || 'N/A',
            contactOrganizerAddressZipcode: contactOrganizerAddress.zipcode || 'N/A',
            contactOrganizerAddressCountry: contactOrganizerAddress.country || 'N/A',
        };
    } catch (error) {
        console.error(`Error fetching organizer with ID ${id}:`, error);
        return null;
    }
};
