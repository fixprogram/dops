I considered this a real project, so I chose to automate the calculations and updates to improve the UX.

Desktop only

## How to run

npm ci
npm run (dev | build | test)

## Libraries choice

- React Query for handing network requests and caching static data
- Jotai for simplifying communication between components
- mapbox + @turf/length for calculating the distance and providing better UX
