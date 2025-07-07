USER NAME AND PASSWORD FOR LOGIN: shervinnn,,,,,,,,369369
# CMS
CMS Project
This repository contains a Content Management System (CMS) project, consisting of a Strapi backend and a React frontend application.

Table of Contents
Project Overview

Prerequisites

Local Setup Instructions

1. Clone the Repository

2. Set Up the Strapi Backend

3. Set Up the React Frontend

Important Notes

Strapi Admin Panel Credentials

Frontend User Credentials

Strapi Permissions

Internationalization (i18n)

Troubleshooting: Event Details Not Working (404 Error)

Current Project Status

Project Overview
This project demonstrates a full-stack application using:

Strapi v4: As the headless CMS backend for managing content (Events, Organizers, Tickets, etc.).

React: As the frontend framework for building the user interface.

Prerequisites
Before you begin, ensure you have the following installed on your local machine:

Git: For cloning the repository.

Download from: https://git-scm.com/

Node.js (LTS version recommended) & npm (Node Package Manager): Required to run both Strapi and React applications.

Download from: https://nodejs.org/ (npm is included with Node.js)

Local Setup Instructions
Follow these steps to get the project running on your local machine.

1. Clone the Repository
Open your terminal or Git Bash and navigate to the directory where you want to store the project (e.g., C:\Users\YourUser\Documents\Projects). Then, clone the repository:

cd C:/Users/Dell/IdeaProjects # Or your preferred projects directory
git clone https://github.com/Shervinhero/CMS.git
cd CMS



2. Set Up the Strapi Backend
The Strapi backend is located in the cms-strapi directory.

Navigate to the backend directory:

cd cms-strapi



Install dependencies:
This command downloads all necessary Node.js packages for the Strapi application.

npm install



Start the Strapi server:

npm run develop



First-time setup: If this is your first time running Strapi for this project, a browser tab will automatically open (http://localhost:1337/admin). You will be prompted to create your first administrator account. Please follow the on-screen instructions to set up your admin username and password.

Keep this terminal window open; the Strapi server needs to remain running.

3. Set Up the React Frontend
The React frontend is located in the cms-frontend directory.

Open a NEW terminal or command prompt window. (Keep the Strapi terminal running in the background).

Navigate to the frontend directory:

cd ../cms-frontend # Go back one level, then into cms-frontend
# Alternatively, if in the root CMS directory: cd cms-frontend



Install dependencies:
This command downloads all necessary Node.js packages for the React application.

npm install



Start the React development server:

npm start



This will typically open a new browser tab automatically at http://localhost:3000/.

Keep this terminal window open as well.

Important Notes
Strapi Admin Panel Credentials
URL: http://localhost:1337/admin

Credentials: You will create these yourself the first time you run npm run develop for the Strapi backend. Please use credentials you can remember for grading purposes.

Frontend User Credentials
The frontend includes user registration and login functionality.

No default frontend user credentials are provided. You will need to register a new user through the frontend's /register page (http://localhost:3000/register) to test authenticated features.

Strapi Permissions
For the frontend to properly fetch and display data, ensure the correct permissions are set in your Strapi admin panel:

Go to http://localhost:1337/admin.

Navigate to Settings (bottom left) > Roles (under Users & Permissions Plugin) > Public.

Under Permissions, expand the following content types and ensure both find and findOne are CHECKED:

Event

Organizer

Ticket

User (for basic user data access if needed by frontend, though users-permissions handles most auth)

Disability Card (if you have this content type and need public access)

Click the Save button at the top right after making any changes.

Internationalization (i18n)
If your Strapi project has Internationalization enabled, ensure that any content (e.g., Events) you want to display in the frontend is published in the English (en) locale. If content is only published in other locales (e.g., Persian), it will not appear when the frontend requests the English version, potentially leading to "Not Found" errors.

You can change the locale of a content entry in the Strapi content editing screen (top right corner).

Troubleshooting: Event Details Not Working (404 Error)
If you can see events in the list on the homepage (http://localhost:3000/) but get a "404 Not Found" error when clicking on an event to view its details, this indicates an issue with the Strapi backend's ability to serve that specific event.

Common Causes & Solutions:

Event Not Published:

Cause: The specific event you are trying to view is in "Draft" status in Strapi. Public API endpoints will not return draft content.

Solution: Log in to your Strapi admin panel (http://localhost:1337/admin), go to Content Manager > Event, find the event by its numerical ID, and change its STATUS to "Published". Remember to click Save.

Incorrect Locale (Language):

Cause: Your Strapi project might have Internationalization (i18n) enabled, and the event is only published in a locale different from what your frontend is requesting (e.g., published in Persian, but frontend requests English).

Solution: On the event's detail page in Strapi's Content Manager, use the language selector (usually in the top right). Select the locale that your frontend is configured to use (e.g., "English (en)"). If the event is not published in that locale, publish it for that locale.

Permissions Not Fully Applied:

Cause: Although you might have checked permissions, sometimes changes don't fully propagate.

Solution: Double-check Settings > Roles > Public > Permissions > Event and ensure both find and findOne are CHECKED. Uncheck, re-check, and save to force the update.

After making any changes in Strapi, always restart both your Strapi backend (npm run develop) and your React frontend (npm start) for changes to take effect.

Current Project Status
Here's an overview of the current functionality:

What's NOT working:

Event Details Page: When you click on an event from the list, the page to show its full details is not loading correctly.

What IS working:

Event List Display: The main page successfully shows a list of events.

Language Changing: You can switch the language of the application (e.g., between English and Persian).

User Registration: New users can sign up for an account.

User Login: Registered users can log in.

User Logout: Users can log out of their accounts.

Ticket List Display: The page showing a list of tickets is working.

Article List Display: If you have articles, the page displaying them is working.

Article Form: You can add new articles.

Organizer Details Display: When you click on an organizer's name from an event (once the event details page is working), their details page should display.
