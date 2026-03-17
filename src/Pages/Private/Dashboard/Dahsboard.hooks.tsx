import { useState, useCallback } from 'react';
import { createDirectus, rest, readItems, authentication } from '@directus/sdk';

const client = createDirectus('https://api.wade-usa.com')
  .with(rest())
  .with(authentication('json'));


/**
 * Hook to fetch trips from Directus
 * @returns {trips, loading, error, fetchTrips}
 */
export const useDashboardData = () => {
    const [trips, setTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTrips = useCallback(async (userId?: string) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('directus_token');
            if (token) {
                client.setToken(token);
            }
            
            const query: any = {};
            if (userId) {
                query.filter = {
                    user_created: {
                        _eq: userId
                    }
                };
            }
            
            const result = await client.request(readItems('trips_v2', query));
            
            const dataArray = Array.isArray(result) ? result : (result ? [result] : []);
            setTrips(dataArray);
            return dataArray;
        } catch (err: any) {
            console.error("Error pulling data from Directus: [useDashboardData]", err);
            setError(err.message || "Failed to fetch trips");
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        trips,
        loading,
        error,
        fetchTrips
    };
};

/**
 * Function to convert Minutes to Hours and Minutes
 * @param {number} minutes - The number of minutes to convert
 * @returns {hours: number, minutes: number}
 */
export const convertMinutesToHoursAndMinutes = (minutes: number) => {
    if (minutes === 0) {
        return { hours: 0, minutes: 0 };
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return { hours, minutes: remainingMinutes };
};
