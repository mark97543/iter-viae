import { useState, useCallback } from 'react';
import { createDirectus, rest, authentication, updateItem, readItems, createItem } from '@directus/sdk';

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
                    arrive: stop.arrive || null
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

    return {
        updating,
        error,
        updateTrip,
        fetchStops,
        updateStopsOrder,
        fetchTrip
    };
};

