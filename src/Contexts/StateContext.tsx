import { createContext, useContext, useState, type ReactNode } from 'react';

// Define the shape of our global state
interface StateContextType {
    trips: any[];
    setTrips: React.Dispatch<React.SetStateAction<any[]>>;
    selectedTrip: any | null;
    setSelectedTrip: React.Dispatch<React.SetStateAction<any | null>>;
}

// Create the context
const StateContext = createContext<StateContextType | undefined>(undefined);

// Provider Component
export const StateProvider = ({ children }: { children: ReactNode }) => {
    const [trips, setTrips] = useState<any[]>([]);
    const [selectedTrip, setSelectedTrip] = useState<any | null>(null);

    return (
        <StateContext.Provider value={{ trips, setTrips, selectedTrip, setSelectedTrip }}>
            {children}
        </StateContext.Provider>
    );
};

// Custom Hook to use the state
export const useAppState = () => {
    const context = useContext(StateContext);
    if (!context) {
        throw new Error("useAppState must be used within a StateProvider");
    }
    return context;
};
