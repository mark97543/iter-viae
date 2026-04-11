import './Dashboard.css'
import {useEffect, useState} from 'react';
import {useDashboardData, createNewTrip} from './Dahsboard.hooks';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../../Contexts/StateContext';
import { useAuth } from '../../../Contexts/AuthContext';
import { DashStatus } from './Dashboar.html';
import {convertMetersToMiles} from '../ItemView/ItemView.hooks';
import { useIsMobile } from '../../../hooks/mobileview';
import { convertSecondsToHoursMinutes } from '../ItemView/ItemView.hooks';

const Dashboard = () => {
    const { fetchTrips } = useDashboardData();
    const navigate = useNavigate();
    const { trips, setTrips, setSelectedTrip } = useAppState();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [sliderType, setSliderType] = useState<'distance' | 'duration'>('distance');
    const [sliderValue, setSliderValue] = useState(2000); 
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['draft', 'planned', 'completed']);
    const [filteredTrips, setFilteredTrips] = useState(trips);
    const isMobile = useIsMobile();



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

    useEffect(() => {
        let filtered = trips.filter((trip) => 
            trip.trip_title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sliderType === 'distance') {
            filtered = filtered.filter((trip) => (trip.distance / 1609.34) <= sliderValue);
        } else if (sliderType === 'duration') {
            filtered = filtered.filter((trip) => (trip.duration / 3600) <= sliderValue);
        }

        filtered = filtered.filter((trip) => selectedStatuses.includes(trip.status));

        setFilteredTrips(filtered);
    }, [searchTerm, sliderType, sliderValue, selectedStatuses, trips]);

    const handleStatusToggle = (status: string) => {
        setSelectedStatuses(prev => 
            prev.includes(status) 
                ? prev.filter(s => s !== status) 
                : [...prev, status]
        );
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
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
                        end_date: null,
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
                <div className='search-main-group'>
                    <input 
                        type="text" 
                        className='std-input search-input' 
                        placeholder="Search trips..." 
                        value={searchTerm}
                        onChange={handleSearch}
                        onFocus={(e) => e.target.select()}
                    />
                    {!isMobile &&
                        <button className='std-button new-trip-button' onClick={handleNewTrip}>New Trip</button>
                    }
                </div>

                <div className='search-filters-group'>
                    <div className='status-filters'>
                        <label className='filter-group-label'>Show Status:</label>
                        <div className='checkbox-group'>
                            {['draft', 'planned', 'completed'].map((status) => (
                                <label key={status} className="checkbox-container">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedStatuses.includes(status)}
                                        onChange={() => handleStatusToggle(status)}
                                    />
                                    <span className="checkbox-label">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className='dashboard-search-sliders'>
                    <div className='slider-control-group'>
                        <label className='slider-label'>
                            {sliderType === 'distance' ? `Max Distance: ${sliderValue} mi` : `Max Duration: ${sliderValue} hrs`}
                        </label>
                        <div className='slider-input-wrapper'>
                            <select 
                                className='std-input slider-select'
                                value={sliderType}
                                onChange={(e) => {
                                    const val = e.target.value as 'distance' | 'duration';
                                    setSliderType(val);
                                    setSliderValue(val === 'distance' ? 2000 : 50);
                                }}
                            >
                                <option value="distance">Distance</option>
                                <option value="duration">Time</option>
                            </select>
                            <input 
                                type="range" 
                                className='range-input'
                                min="0" 
                                max={sliderType === 'distance' ? 2000 : 50} 
                                step={sliderType === 'distance' ? 50 : 1}
                                value={sliderValue} 
                                onChange={(e) => setSliderValue(parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>


            <div className='dashboard-grid'>
                {filteredTrips.map((trip) => {
                    return (
                        <div key={trip.id} className="trip-card" onClick={() => {
                            setSelectedTrip(trip);
                            if (isMobile) {
                                navigate(`/trip_mobile/${trip.id}`);
                            } else {
                                navigate(`/trip/${trip.id}`);
                            }
                        }}>
                            <h2>{trip.trip_title}</h2>
                            <div className="trip-stats">
                                <p><b>Budget</b> <br/>${trip.budget || '0.00'}</p>
                                <p><b>Duration</b> <br/>{convertSecondsToHoursMinutes(trip.duration)}</p>
                                <p><b>Distance</b> <br/>{convertMetersToMiles(trip.distance) || '0mi'}</p>                                
                            </div>
                            <p className='trip-summary'>{trip.summary}</p>
                            <DashStatus status={trip.status} date={trip.status_date} end_date={trip.end_date}/>
                        </div>
                    )
                })}
            </div>  

        </div>
    )
}

export default Dashboard


