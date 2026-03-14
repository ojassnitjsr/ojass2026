/**
 * Central model registry.
 *
 * Importing this file ensures ALL Mongoose models are registered before any
 * query or populate() call runs. This is critical in serverless environments
 * (e.g. Vercel) where each edge/serverless function gets an isolated module
 * context — a function that only imports `Team` won't have `Event` registered,
 * causing "Schema hasn't been registered for model 'Event'" errors on .populate().
 *
 * This file is imported inside `lib/mongodb.ts` so that models are registered
 * automatically alongside every database connection.
 */

import './Event';
import './User';
import './Team';
import './Notification';
import './PushSubscription';
import './ContactUs';
import './Media';
