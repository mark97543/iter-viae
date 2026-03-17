import { useState } from 'react';
import { createDirectus, rest, authentication, updateItem } from '@directus/sdk';

const client = createDirectus('https://api.wade-usa.com')
  .with(rest())
  .with(authentication('json'));

export const useItemViewData = () => {
    const [updating, setUpdating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const updateTrip = async (tripId: string, payload: any) => {
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
    };

    return {
        updating,
        error,
        updateTrip
    };
};
