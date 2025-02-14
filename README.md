I considered this a real project, so I chose to automate the calculations and updates to improve the UX.

Desktop only

## How to run

npm ci
npm run (dev | build | test)

## ENVs used

VITE_MAPBOX_KEY=YOUR_MAPBOX_KEY
VITE_VENUES_API=https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues

## Libraries choice

- React Query for handing network requests and caching static data
- Jotai for simplifying communication between components
- mapbox + @turf/length for calculating the distance and providing better UX
