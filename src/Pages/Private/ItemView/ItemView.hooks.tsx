import { useState, useCallback } from 'react';
import { createDirectus, rest, authentication, updateItem, readItems, createItem, deleteItem } from '@directus/sdk';

const client = createDirectus('https://api.wade-usa.com')
  .with(rest())
  .with(authentication('json'));

export const useItemViewData = () => {
    const [updating, setUpdating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const updateTrip = useCallback(async (tripId: string, payload: any) => {
        setUpdating(true);
        setError(null);
        try {
            const token = localStorage.getItem('directus_token');
            if (token) {
                client.setToken(token);
            }
            
            const result = await client.request(updateItem('trips_v2', tripId, payload));            
            return result;
        } catch (err: any) {
            console.error("Error updating trip in Directus: [useItemViewData]", err);
            setError(err.message || "Failed to update trip");
            throw err;
        } finally {
            setUpdating(false);
        }
    }, []);

    const fetchTrip = useCallback(async (tripId: string) => {
        setUpdating(true);
        setError(null);
        try {
            const token = localStorage.getItem('directus_token');
            if (token) {
                client.setToken(token);
            }
            const result = await client.request(readItems('trips_v2', {
                filter: { id: { _eq: tripId } }
            }));
            return result[0];
        } catch (err: any) {
            console.error("Error fetching trip from Directus: [useItemViewData]", err);
            setError(err.message || "Failed to fetch trip");
            throw err;
        } finally {
            setUpdating(false);
        }
    }, []);

    const fetchStops = useCallback(async (id: string) => {
        setUpdating(true);
        setError(null);
        try {
            const token = localStorage.getItem('directus_token');
            if (token) {
                client.setToken(token);
            }
            
            const result = await client.request(readItems('stop', {
                fields: ['*'],
                filter: {
                    trip_id: {
                        _eq: id
                    }
                },
                sort: ['sort']
            }));            
            
            // Split stay (hh:mm) into stayHours and stayMinutes for UI
            const processedStops = (result as any[]).map(stop => {
                if (stop.stay) {
                    const [hours, minutes] = stop.stay.split(':');
                    return { ...stop, stayHours: hours, stayMinutes: minutes };
                }
                return { ...stop, stayHours: '', stayMinutes: '' };
            });
            
            return processedStops;
        } catch (err: any) {
            console.error("Error fetching stops from Directus: [useItemViewData]", err);
            setError(err.message || "Failed to fetch stops");
            throw err;
        } finally {
            setUpdating(false);
        }
    }, []);

    const updateStopsOrder = useCallback(async (stops: any[], tripId: string) => {
        setUpdating(true);
        setError(null);
        try {
            const token = localStorage.getItem('directus_token');
            if (token) {
                client.setToken(token);
            }
            
            const promises = stops.map((stop, index) => {
                // Combine stayHours and stayMinutes into stay (hh:mm)
                const hours = stop.stayHours?.padStart(2, '0') || '00';
                const minutes = stop.stayMinutes?.padStart(2, '0') || '00';
                const stayCombined = (stop.stayHours || stop.stayMinutes) ? `${hours}:${minutes}` : null;

                const payload = {
                    sort: index + 1,
                    stop_name: stop.stop_name || null,
                    budget: stop.budget ? parseFloat(stop.budget) : null,
                    type: stop.type,
                    location: stop.location || null,
                    note: stop.note || null,
                    depart: stop.depart || null,
                    stay: stayCombined,
                    arrive: stop.arrive || null,
                    distance_to_next_stop: stop.distance_to_next_stop ?? null,
                    time_to_next_stop: stop.time_to_next_stop != null ? String(stop.time_to_next_stop) : null
                };

                // If stop ID is a generated timestamp (e.g. greater than 1,000,000,000,000) it means it is a newly added stop
                if (typeof stop.id === 'number' && stop.id > 1000000000000) {
                    return client.request(createItem('stop', {
                        ...payload,
                        trip_id: tripId
                    }));
                } else {
                    return client.request(updateItem('stop', stop.id, payload));
                }
            });
            
            await Promise.all(promises);
        } catch (err: any) {
            console.error("Error updating stops order in Directus: [useItemViewData]", err);
            setError(err.message || "Failed to update stops order");
            throw err;
        } finally {
            setUpdating(false);
        }
    }, []);

    const deleteStop = useCallback(async (stopId: string | number) => {
        setUpdating(true);
        setError(null);
        try {
            const token = localStorage.getItem('directus_token');
            if (token) {
                client.setToken(token);
            }
            await client.request(deleteItem('stop', stopId));
        } catch (err: any) {
            console.error("Error deleting stop in Directus:", err);
            setError(err.message || "Failed to delete stop");
            throw err;
        } finally {
            setUpdating(false);
        }
    }, []);

    const deleteTrip = useCallback(async (tripId: string | number) => {
        setUpdating(true);
        setError(null);
        try {
            const token = localStorage.getItem('directus_token');
            if (token) {
                client.setToken(token);
            }
            await client.request(deleteItem('trips_v2', tripId));
        } catch (err: any) {
            console.error("Error deleting trip in Directus:", err);
            setError(err.message || "Failed to delete trip");
            throw err;
        } finally {
            setUpdating(false);
        }
    }, []);

    return {
        updating,
        error,
        updateTrip,
        fetchStops,
        updateStopsOrder,
        fetchTrip,
        deleteStop,
        deleteTrip
    };
};

/**
 * Executes the mapbox api to pull distance and time between stops. Returns array with the stop number in order. 
 * This function allows infinate number of stops by breaking them up and takes in a array of the stop with lon,lat
 * Will need to flip then as they are in goolge format seperated by a coma. 
 * @param stops Array of stops to pull distance and time between. 
 * @returns Array of stops with distance and time between stops. 
 */
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const BASE_URL = 'https://api.mapbox.com/directions/v5/mapbox/driving';

export const getRouteData = async (stringCoordinates: string[]) => {
  // 1. Convert "lat,lng" strings to [lng, lat] arrays
  const formattedCoords = stringCoordinates.map(str => {
    const [lat, lng] = str.split(',').map(Number);
    return [lng, lat]; // Flip to Longitude, Latitude for Mapbox
  });

  //const MAX_PER_BATCH = 25;
  let allDistances = [];
  let allDurations = [];

  // 2. Batch and Fetch
  for (let i = 0; i < formattedCoords.length - 1; i += 24) {
    const batch = formattedCoords.slice(i, i + 25);
    
    // Create the semicolon-separated string Mapbox wants: "lng,lat;lng,lat"
    const coordString = batch.map(c => c.join(',')).join(';');
    
    const url = `${BASE_URL}/${coordString}?access_token=${MAPBOX_TOKEN}&annotations=distance,duration`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === 'Ok') {
        const legs = data.routes[0].legs;
        allDistances.push(...legs.map((l: { distance: number }) => l.distance)); // in meters
        allDurations.push(...legs.map((l: { duration: number }) => l.duration)); // in seconds
      }
    } catch (error) {
      console.error("Batching failed:", error);
    }
  }

  return { distances: allDistances, durations: allDurations };
};