import './Dashboard.css'
import {useEffect, useState} from 'react';
import {useDashboardData, convertMinutesToHoursAndMinutes, createNewTrip} from './Dahsboard.hooks';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../../Contexts/StateContext';
import { useAuth } from '../../../Contexts/AuthContext';
import { DashStatus } from './Dashboar.html';

const Dashboard = () => {
    const { fetchTrips } = useDashboardData();
    const navigate = useNavigate();
    const { trips, setTrips, setSelectedTrip } = useAppState();
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

    const handleNewTrip = () => {
        if (user && user.id) {
            createNewTrip(user.id).then((result) => {
                if (result.tripId) {
                    setSelectedTrip({
                        id: result.tripId,
                        user_created: user.id,
                        status: 'draft',
                        status_date: new Date().toISOString(),
                        trip_title: 'New Trip',
                        summary: '',
                        budget: 0,
                        duration: 0,
                        distance: 0,
                        
                    });
                    navigate(`/trip/${result.tripId}`);
                }
            });
        }
    }

    return (
        <div className="dashboard">
            <h1>Select a Trip</h1>
            <div className='dashboard-search-container'>
                <input 
                    type="text" 
                    className='std-input search-input' 
                    placeholder="Search" 
                    value={searchTerm}
                    onChange={handleSearch}
                    onFocus={(e) => e.target.select()}
                />
                <button className='std-button new-trip-button' onClick={handleNewTrip}>New Trip</button>
            </div>


            <div className='dashboard-grid'>
                {filteredTrips.map((trip) => {
                    return (
                        <div key={trip.id} className="trip-card" onClick={() => {
                            setSelectedTrip(trip);
                            navigate(`/trip/${trip.id}`);
                        }}>
                            <h2>{trip.trip_title}</h2>
                            <div className="trip-stats">
                                {/* TODO: Need to make sure trip stats are saved after calculation */}
                                <p><b>Budget</b> <br/>${trip.budget || '0.00'}</p>
                                <p><b>Duration</b> <br/>{convertMinutesToHoursAndMinutes(trip.duration).hours}h {convertMinutesToHoursAndMinutes(trip.duration).minutes}m</p>
                                <p><b>Distance</b> <br/>{trip.distance || '0'}mi</p>                                
                            </div>
                            <p className='trip-summary'>{trip.summary}</p>
                            <DashStatus status={trip.status} date={trip.status_date}/>
                        </div>
                    )
                })}
            </div>  

        </div>
    )
}

export default Dashboard


