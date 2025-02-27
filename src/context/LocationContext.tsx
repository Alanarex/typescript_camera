import { createContext, useState, useContext, ReactNode } from 'react';

interface LocationData {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
}

interface LocationContextProps {
    locationData: LocationData | null;
    setLocationData: (data: LocationData) => void;
}

const LocationContext = createContext<LocationContextProps | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
    const [locationData, setLocationData] = useState<LocationData | null>(null);

    return (
        <LocationContext.Provider value={{ locationData, setLocationData }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
};
