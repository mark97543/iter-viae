import { useState, useCallback } from 'react';
import { createDirectus, rest, authentication, updateItem, readItems } from '@directus/sdk';

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

    const updateStopsOrder = useCallback(async (stops: any[]) => {
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

                return client.request(updateItem('stop', stop.id, {
                    sort: index + 1,
                    stop_name: stop.stop_name,
                    budget: stop.budget ? parseFloat(stop.budget) : null,
                    type: stop.type,
                    location: stop.location,
                    note: stop.note,
                    depart: stop.depart,
                    stay: stayCombined,
                    arrive: stop.arrive
                }));
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
        updateStopsOrder
    };
};

