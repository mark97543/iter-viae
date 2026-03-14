import './Dashboard.css'
import {useEffect, useState} from 'react';
import {useDashboardData, convertMinutesToHoursAndMinutes} from './Dahsboard.hooks';
import { useAppState } from '../../../Contexts/StateContext';
import { useAuth } from '../../../Contexts/AuthContext';

const Dashboard = () => {
    const { fetchTrips } = useDashboardData();
    const { trips, setTrips } = useAppState();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTrips, setFilteredTrips] = useState(trips);


    useEffect(() => {
        if (user && user.id) {
            fetchTrips(user.id).then((data) => {
                if (data) {
                    setTrips(data);
                    setFilteredTrips(data);
                }
            });
        }
    }, [user?.id]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setFilteredTrips(trips.filter((trip) => trip.trip_title.toLowerCase().includes(e.target.value.toLowerCase())));
    };


    return (
        <div className="dashboard">
            <h1>Select a Trip</h1>
            <input 
                type="text" 
                className='std-input search-input' 
                placeholder="Search" 
                value={searchTerm}
                onChange={handleSearch}
            />

            <div className='dashboard-grid'>
                {filteredTrips.map((trip) => {
                    return (
                        <div key={trip.id} className="trip-card">
                            <h2>{trip.trip_title}</h2>
                            <div className="trip-stats">
                                {/* TODO: Need to make sure trip stats are saved after calculation */}
                                <p><b>Budget</b> <br/>${trip.budget || '0.00'}</p>
                                <p><b>Duration</b> <br/>{convertMinutesToHoursAndMinutes(trip.duration).hours}h {convertMinutesToHoursAndMinutes(trip.duration).minutes}m</p>
                                <p><b>Distance</b> <br/>{trip.distance || '0'}mi</p>                                
                            </div>
                            <p className='trip-summary'>{trip.summary}</p>
                        </div>
                    )
                })}
            </div>  

        </div>
    )
}

export default Dashboard

//TODO: Need to Create New Trip Button 
//TODO: Need to Create Sliders to Filter Distances and Times 
//TODO: Need to make Sort for Completed Trips 
//TODO: Need to filter for draft trips
//TODO: Need to Filter For Planned Trips  