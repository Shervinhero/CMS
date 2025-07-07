import axios from 'axios';

// IMPORTANT: Replace with your actual Strapi URL if it's different
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
        // Log the raw response data from Strapi before processing
        console.log('--- Raw Strapi Response for Events (from api.js) ---', response.data);

        // Log the data array before filtering
        console.log('Events data array before filter:', response.data.data);

        return response.data.data
            .filter(item => {
                // Corrected: Check if item exists and has an id (attributes is not needed here)
                console.log('Filtern des Event-Elements:', item);
                const isValid = item && item.id; // Prüfen auf Element und dessen ID
                console.log('Ist Event-Element gültig (item && item.id)?', isValid);
                return isValid;
            })
            .map(item => {
                // Protokolliert jedes Element vor dem Mapping
                console.log('Mapping des Event-Elements:', item);
                const mappedItem = {
                    id: item.id,
                    // Korrigiert: Element direkt ausbreiten, da Attribute auf der obersten Ebene liegen
                    ...item,
                    // Korrigiert: Bild direkt vom Element zugreifen, nicht item.attributes
                    imageUrl: item.Image?.[0]?.url
                        ? `${item.Image[0].url.startsWith('http') ? '' : 'http://localhost:1337'}${item.Image[0].url}`
                        : null,
                    // Korrigiert: Orte direkt vom Element zugreifen, nicht item.attributes
                    locationName: item.locations?.[0]?.Name || 'N/A',
                    // Korrigiert: Organisator direkt vom Element zugreifen, nicht item.attributes
                    organizerName: item.organizer?.data?.attributes?.name || 'N/A',
                };
                console.log('Gemapptes Event-Element:', mappedItem);
                return mappedItem;
            });
    } catch (error) {
        console.error('Fehler beim Abrufen von Events:', error);
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
        // VORÜBERGEHENDER TEST: populate=* entfernen, um zu sehen, ob es den 404 behebt
        const response = await axios.get(`${STRAPI_URL}/events/${id}`); // populate=* entfernt

        // Protokolliert die gesamte Antwort von Strapi für einen einzelnen Event-Abruf
        console.log(`--- Rohdaten der Strapi-Antwort für Event-ID ${id} (von api.js fetchEventById) ---`, response);

        // Standard-Strapi-v4-Antwort für einen einzelnen Eintrag ist response.data.data
        const item = response.data.data;

        if (!item || !item.id) {
            console.log(`Event-ID ${id} nicht gefunden oder ungültige Elementstruktur in response.data.data. Element:`, item);
            return null;
        }

        return {
            id: item.id,
            ...item, // Element direkt ausbreiten, da seine Eigenschaften auf der obersten Ebene liegen
            // Hinweis: Wenn populate=* entfernt wird, sind verschachtelte Daten wie Image, locations, organizer
            // hier NICHT direkt verfügbar. Dies dient ausschließlich dem 404-Debugging.
            imageUrl: item.Image?.[0]?.url
                ? `${item.Image[0].url.startsWith('http') ? '' : 'http://localhost:1337'}${item.Image[0].url}`
                : null,
            locationName: item.locations?.[0]?.Name || 'N/A',
            organizerName: item.organizer?.data?.attributes?.name || 'N/A',
        };
    } catch (error) {
        console.error(`Fehler beim Abrufen von Event mit ID ${id}:`, error);
        if (error.response) {
            console.error('Axios-Fehler-Antwortdaten:', error.response.data);
            console.error('Axios-Fehler-Antwortstatus:', error.response.status);
            console.error('Axios-Fehler-Antwort-Header:', error.response.headers);
        } else if (error.request) {
            console.error('Axios-Fehler-Anfrage:', error.request);
        } else {
            console.error('Axios-Fehlermeldung:', error.message);
        }
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
        // Schritt 1: Registrieren des Benutzers mit grundlegenden Anmeldeinformationen
        const registerResponse = await axios.post(`${STRAPI_URL}/auth/local/register`, userData);
        const user = registerResponse.data.user;
        const jwt = registerResponse.data.jwt; // JWT für authentifizierte Anfragen abrufen

        // JWT und Benutzerinformationen im localStorage speichern für zukünftige authentifizierte Anfragen
        localStorage.setItem('jwt', jwt);
        localStorage.setItem('user', JSON.stringify(user));

        // Schritt 2: Wenn eine Behindertenkarte-Datei bereitgestellt wird, diese hochladen und mit dem Benutzer verknüpfen
        if (disabilityCardFile) {
            const formData = new FormData();
            formData.append('files', disabilityCardFile); // 'files' ist der Schlüssel, den Strapi für Dateiuploads erwartet

            // Datei hochladen
            const uploadResponse = await axios.post(`${STRAPI_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${jwt}` // Authentifizieren der Upload-Anfrage
                },
            });

            const uploadedFile = uploadResponse.data[0]; // Strapi-Upload gibt ein Array von Dateien zurück

            // Einen neuen Behindertenkarten-Eintrag erstellen und die Datei damit verknüpfen
            // Dies geht davon aus, dass Sie einen 'Disability Card'-Inhaltstyp in Strapi haben
            // und dieser ein 'document'-Feld vom Typ Media (Einzeldatei) hat.
            // WICHTIG: Wenn Ihr Behindertenkarten-Inhaltstyp andere ERFORDERLICHE Felder hat
            // (z.B. Number, status_1, IssuingCard, Expiry), MÜSSEN Sie diese hier
            // mit entsprechenden Daten einschließen oder sie in Strapi's Content-Type Builder OPTIONAL machen.
            const disabilityCardData = {
                data: {
                    document: uploadedFile.id, // ID der hochgeladenen Datei verknüpfen
                    // Beispiel, falls 'IssuingCard' erforderlich wäre:
                    // IssuingCard: "Automatisch generiert",
                    // Beispiel, falls 'status_1' erforderlich wäre:
                    // status_1: "ausstehend",
                }
            };

            const createDisabilityCardResponse = await axios.post(`${STRAPI_URL}/disability-cards`, disabilityCardData, {
                headers: {
                    'Authorization': `Bearer ${jwt}` // Authentifizieren der Anfrage
                },
            });

            const newDisabilityCardId = createDisabilityCardResponse.data.data.id;

            // Benutzerprofil aktualisieren, um den neuen Behindertenkarten-Eintrag zu verknüpfen
            await axios.put(`${STRAPI_URL}/users/${user.id}`, {
                disability_card: newDisabilityCardId // ID des Behindertenkarten-Eintrags verknüpfen
            }, {
                headers: {
                    'Authorization': `Bearer ${jwt}` // Authentifizieren der Anfrage
                },
            });
            console.log('Behindertenkarte hochgeladen und mit Benutzer verknüpft.');
        }

        return user;
    } catch (error) {
        console.error('Fehler während der Benutzerregistrierung oder Profilaktualisierung:', error.response ? error.response.data : error.message);
        throw error; // Erneut werfen, um von der Komponente behandelt zu werden
    }
};

/**
 * Meldet einen Benutzer bei Strapi an.
 * @param {string} identifier - E-Mail oder Benutzername des Benutzers.
 * @param {string} password - Passwort des Benutzers.
 * @returns {Object} Die angemeldeten Benutzerdaten und JWT.
 */
export const loginUser = async (identifier, password) => {
    try {
        const response = await axios.post(`${STRAPI_URL}/auth/local`, {
            identifier,
            password,
        });
        const { jwt, user } = response.data;

        // JWT und Benutzerinformationen im localStorage speichern für zukünftige authentifizierte Anfragen
        localStorage.setItem('jwt', jwt);
        localStorage.setItem('user', JSON.stringify(user));

        return { jwt, user };
    } catch (error) {
        console.error('Fehler beim Anmelden des Benutzers:', error.response ? error.response.data : error.message);
        throw error; // Erneut werfen, um von der Komponente behandelt zu werden
    }
};

/**
 * Meldet den aktuellen Benutzer ab, indem JWT und Benutzerinformationen aus dem localStorage entfernt werden.
 */
export const logoutUser = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
};

/**
 * Ruft alle Tickets von Strapi ab.
 * Populiert alle notwendigen Beziehungen und Komponenten mit `populate=*`.
 * @returns {Array} Ein Array von Ticket-Objekten.
 */
export const fetchTickets = async () => {
    try {
        // Verwenden Sie populate=*, um alle Beziehungen und Komponenten einzuschließen
        const response = await axios.get(`${STRAPI_URL}/tickets?populate=*`);
        // Protokolliert die Rohdaten der Strapi-Antwort für Tickets vor der Verarbeitung
        console.log('--- Rohdaten der Strapi-Antwort für Tickets (von api.js) ---', response.data);

        // Protokolliert das Daten-Array vor dem Filtern
        console.log('Tickets-Daten-Array vor dem Filtern:', response.data.data);

        return response.data.data
            .filter(item => {
                // Korrigiert: Prüfen, ob das Element existiert und eine ID hat (Attribute werden hier nicht benötigt)
                console.log('Filtern des Ticket-Elements:', item);
                const isValid = item && item.id; // Prüfen auf Element und dessen ID
                console.log('Ist Ticket-Element gültig (item && item.id)?', isValid);
                return isValid;
            })
            .map(item => {
                // Protokolliert jedes Element vor dem Mapping
                console.log('Mapping des Ticket-Elements:', item);
                const mappedItem = {
                    id: item.id,
                    // Korrigiert: Element direkt ausbreiten, da Attribute auf der obersten Ebene liegen
                    ...item,
                    // Event-Namen extrahieren, falls populär
                    eventName: item.event?.data?.attributes?.Name || 'N/A',
                    // Benutzer-Benutzernamen extrahieren, falls populär (Strapi's API verwendet oft 'users_permissions_user' für diese Beziehung)
                    userName: item.users_permissions_users?.[0]?.username || 'N/A', // Korrigierter Zugriff für users_permissions_users
                    // PRICE_TICKET ist eine Komponente, daher direkt verfügbar, falls durch '*' populär
                    priceTicket: item.PRICE_TICKET || {},
                    // REFUND_POLICY_TICKET ist eine Komponente, ihr Rich-Text-Block ist verschachtelt
                    refundPolicyBlock: item.REFUND_POLICY_TICKET?.RefundPolicyBlock || 'N/A',
                };
                console.log('Gemapptes Ticket-Element:', mappedItem);
                return mappedItem;
            });
    } catch (error) {
        console.error('Fehler beim Abrufen von Tickets:', error);
        return [];
    }
};

/**
 * Ruft ein einzelnes Ticket anhand seiner ID von Strapi ab.
 * @param {string} id - Die ID des Tickets.
 * @returns {Object|null} Das Ticket-Objekt oder null, falls nicht gefunden.
 */
export const fetchTicketById = async (id) => {
    try {
        const response = await axios.get(`${STRAPI_URL}/tickets/${id}?populate=*`);
        // Korrigiert: Element direkt zugreifen, nicht response.data.data
        const item = response.data; // Für einzelnen Abruf sind die Daten direkt das Element
        if (!item || !item.id) return null; // Korrigiert: Prüfen auf Element und dessen ID

        return {
            id: item.id,
            // Korrigiert: Element direkt ausbreiten
            ...item,
            eventName: item.event?.data?.attributes?.Name || 'N/A',
            userName: item.users_permissions_users?.[0]?.username || 'N/A', // Korrigierter Zugriff für users_permissions_users
            priceTicket: item.PRICE_TICKET || {},
            refundPolicyBlock: item.REFUND_POLICY_TICKET?.RefundPolicyBlock || 'N/A',
        };
    } catch (error) {
        console.error(`Fehler beim Abrufen von Ticket mit ID ${id}:`, error);
        return null;
    }
};

/**
 * Erstellt ein neues Ticket in Strapi.
 * @param {Object} ticketData - Objekt mit Ticket-Details.
 * @returns {Object} Die erstellten Ticket-Daten.
 */
export const createTicket = async (ticketData) => {
    try {
        const token = localStorage.getItem('jwt'); // JWT aus localStorage abrufen
        const headers = {};
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn('Kein JWT für authentifizierte Ticketerstellung gefunden. Stellen Sie sicher, dass der Benutzer angemeldet ist oder die öffentliche Ticketerstellung erlaubt ist.');
        }

        // Sicherstellen, dass verschachtelte Komponenten korrekt gesendet werden, falls sie Teil des Formulars sind
        const dataToSend = {
            data: {
                Status_2: ticketData.Status_2,
                Price: ticketData.Price, // Dies könnte ein einfaches Zahlenfeld sein, keine Komponente
                Format: ticketData.Format,
                Zone: ticketData.Zone,
                Seat: ticketData.Seat,
                Refund_Policy: ticketData.Refund_Policy, // Dies sollte Strapi Blocks JSON sein
                Ticket_Type: ticketData.Ticket_Type,
                PRICE_TICKET: ticketData.PRICE_TICKET, // Als Objekt für die Komponente senden
                REFUND_POLICY_TICKET: ticketData.REFUND_POLICY_TICKET, // Als Objekt für die Komponente senden
                event: ticketData.event, // Event-ID senden
                users_permissions_users: ticketData.users_permissions_users, // Benutzer-ID senden
            },
        };

        const response = await axios.post(`${STRAPI_URL}/tickets`, dataToSend, { headers });
        return {
            id: response.data.data.id,
            ...response.data.data.attributes,
        };
    } catch (error) {
        console.error('Fehler beim Erstellen des Tickets:', error.response ? error.response.data : error.message);
        throw error;
    }
};

/**
 * Ruft einen einzelnen Organisator anhand seiner ID von Strapi ab.
 * @param {string} id - Die ID des Organisators.
 * @returns {Object|null} Das Organisator-Objekt oder null, falls nicht gefunden.
 */
export const fetchOrganizerById = async (id) => {
    try {
        const response = await axios.get(`${STRAPI_URL}/organizers/${id}?populate=*`);
        const item = response.data.data;

        if (!item || !item.id) return null;

        // Verschachtelte Komponentendaten extrahieren
        const addressOrganizer = item.Address_Organizer || {};
        const contactOrganizer = item.Contact_Organizer || {};
        const contactOrganizerAddress = contactOrganizer.Address || {};

        return {
            id: item.id,
            ...item, // Attribute der obersten Ebene ausbreiten
            // Medien handhaben (angenommen, es ist ein einzelnes Bild für das Organisator-Logo/-Bild)
            mediaUrl: item.Media?.[0]?.url
                ? `${item.Media[0].url.startsWith('http') ? '' : 'http://localhost:1337'}${item.Media[0].url}`
                : null,
            // Felder von Address_Organizer
            addressOrganizerStreet: addressOrganizer.street || 'N/A',
            addressOrganizerNumber: addressOrganizer.number || 'N/A',
            addressOrganizerCity: addressOrganizer.city || 'N/A',
            addressOrganizerZipcode: addressOrganizer.zipcode || 'N/A',
            addressOrganizerCountry: addressOrganizer.country || 'N/A',
            // Felder von Contact_Organizer
            contactOrganizerLastName: contactOrganizer.LastName || 'N/A',
            contactOrganizerPhone: contactOrganizer.Phone || 'N/A',
            contactOrganizerEmailAddress: contactOrganizer.EmailAddress || 'N/A',
            contactOrganizerFirstName: contactOrganizer.FirstName || 'N/A',
            // Verschachtelte Adresse innerhalb von Contact_Organizer
            contactOrganizerAddressStreet: contactOrganizerAddress.street || 'N/A',
            contactOrganizerAddressNumber: contactOrganizerAddress.number || 'N/A',
            contactOrganizerAddressCity: contactOrganizerAddress.city || 'N/A',
            contactOrganizerAddressZipcode: contactOrganizerAddress.zipcode || 'N/A',
            contactOrganizerAddressCountry: contactOrganizerAddress.country || 'N/A',
        };
    } catch (error) {
        console.error(`Fehler beim Abrufen von Organisator mit ID ${id}:`, error);
        return null;
    }
};
