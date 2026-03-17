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
            return result as any[];
        } catch (err: any) {
            console.error("Error fetching stops from Directus: [useItemViewData]", err);
            setError(err.message || "Failed to fetch stops");
            throw err;
        } finally {
            setUpdating(false);
        }
    }, []);

    return {
        updating,
        error,
        updateTrip,
        fetchStops
    };
};

