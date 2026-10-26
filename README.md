# lashess-priir

Beauty salon management application for **lashess-priir**. The application uses a real Firebase project only. Synthetic records and fixture previews are disabled.

## Setup

1. Install locked dependencies with npm ci.
2. Fill .env.local using your actual Firebase project's web configuration and server credentials. .env.example lists the required keys; cloud values are intentionally blank.
3. Set SALON_ID=lashess-priir and APP_ORIGIN to the application origin.
4. Enable the required Firebase Authentication providers, Firestore and Storage. See [Firebase setup](docs/FIREBASE_SETUP.md).
5. Run npm run dev, or npm run build followed by npm start.

Do not invent project IDs or credentials. The application cannot authenticate or load cloud records until actual Firebase configuration is supplied. No default Firebase project is selected in .firebaserc; deployment requires an explicit verified project ID.

## Quality

npm run typecheck, npm run lint, npm run test:foundation, npm test, npm run build and npm run test:visual.
npm run test:rules runs an isolated local rules-test harness, never the application or salon database.

## Implementation status

The application foundation is still in progress. Unfinished business modules show an unavailable state, not fabricated records. Existing screen components are retained while their real-data integrations are completed. Configuration changes do not establish a working cloud deployment.

See [architecture](docs/ARCHITECTURE.md), [API conventions](docs/API_CONVENTIONS.md), [route mapping](docs/ROUTE_MAP.md) and [migration status](docs/MIGRATION_STATUS.md).
