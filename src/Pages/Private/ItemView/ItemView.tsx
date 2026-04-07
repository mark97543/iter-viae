import './ItemView.css'
import { useAppState } from '../../../Contexts/StateContext'
import { useState, useEffect, useRef } from 'react'
import { TripTitle, TripSummary, TripStatistics, StopTable } from './ItemView.html'
import { useItemViewData, getRouteData} from './ItemView.hooks'
import { useNavigate } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print';
import Print from './Print/Print';

const ItemView = () => {
    const navigate = useNavigate();
    const componentRef = useRef<HTMLDivElement>(null);
    const { trips, setTrips, selectedTrip, setSelectedTrip } = useAppState();
    const { updateTrip, fetchStops, updateStopsOrder, updating, fetchTrip, deleteStop, deleteTrip } = useItemViewData();
    const [editMode, setEditMode] = useState(false);
    const [stops, setStops] = useState<any[]>([]);
    const [originalStops, setOriginalStops] = useState<any[]>([]);
    const [tempTitle, setTempTitle] = useState(selectedTrip?.trip_title);
    const [tempSummary, setTempSummary] = useState(selectedTrip?.summary);
    const [tempStartDate, setTempStartDate] = useState(selectedTrip?.status_date);
    const [tempStatus, setTempStatus] = useState(selectedTrip?.status);
    const [cancelEvent, setCancelEvent] = useState(1); //cancel event listner 

    const onCancel = () => {
        setTempTitle(selectedTrip?.trip_title);
        setTempSummary(selectedTrip?.summary);
        setTempStartDate(selectedTrip?.status_date);
        setTempStatus(selectedTrip?.status);
        setStops(originalStops);
        setEditMode(false);
        setCancelEvent(cancelEvent + 1);
    }

    const onSave = async () => {
        if (!selectedTrip) return;

        try {
            // 1. Run Mapbox and pull in route data
            const stringCoordinates = stops.map(stop => stop.location);
            const routeData = await getRouteData(stringCoordinates);
            
            // 2. Prepare Data & Sum Budget
            const safeStartDate = tempStartDate === "" ? null : tempStartDate;
            const totalBudget = stops.reduce((acc, stop) => acc + (Number(stop.budget) || 0), 0);
            
            // Calculate end date based on hotels
            const numberOfHotels = stops.filter(stop => stop.type === 'hotel').length;
            let computedEndDate: string | null = safeStartDate;
            if (safeStartDate) {
                const [year, month, day] = safeStartDate.split('-').map(Number);
                const start = new Date(year, month - 1, day);
                start.setDate(start.getDate() + numberOfHotels);
                const newYear = start.getFullYear();
                const newMonth = String(start.getMonth() + 1).padStart(2, '0');
                const newDay = String(start.getDate()).padStart(2, '0');
                computedEndDate = `${newYear}-${newMonth}-${newDay}`;
            }

            // 3. Map Route Data (Legs) to the "Next Stop" Logic
            // Mapbox returns (N-1) legs for N stops.
            let cumulativeDepartureSeconds: number | null = null;

            const stopsWithRouteData = stops.map((stop, index) => {
                // Check if there is a leg available for this stop (Next Stop exists)
                // If we are at the very last stop, there is no "next" leg.
                const hasNextLeg = index < stops.length - 1;

                //Convert the stay to seconds from hh:mm text to seconds
                const stayParts = stop.stay ? stop.stay.split(':') : ['0', '0'];
                const stayInSeconds = (Number(stayParts[0]) * 3600) + (Number(stayParts[1] || 0) * 60);
                
                let arrivaltime: string | null = null;
                let departuretime: string | null = null;

                // 0. Fallback: Assure schedule starts calculating if it hasn't started yet
                if (cumulativeDepartureSeconds === null) {
                    if (stop.depart) {
                        const [h, m] = stop.depart.split(':').map(Number);
                        cumulativeDepartureSeconds = (h * 3600) + (m * 60);
                        if (stop.type !== 'origin' && stop.type !== 'hotel') {
                            const currentTotal = cumulativeDepartureSeconds;
                            const hStr = Math.floor(currentTotal / 3600) % 24;
                            const mStr = Math.floor((currentTotal % 3600) / 60);
                            arrivaltime = `${String(hStr).padStart(2, '0')}:${String(mStr).padStart(2, '0')}`;
                        }
                    } else {
                        cumulativeDepartureSeconds = 8 * 3600; // default 8:00 AM
                        if (stop.type !== 'origin' && stop.type !== 'hotel') {
                            arrivaltime = "08:00"; 
                        }
                    }
                }

                // 1. Calculate arrival time (if not initialized by step 0)
                if (stop.type !== 'origin' && index > 0) {
                    const travelTimeSeconds = routeData.durations[index - 1] || 0;
                    const totalArrivalSeconds = cumulativeDepartureSeconds + travelTimeSeconds;
                    
                    const aHours = Math.floor(totalArrivalSeconds / 3600) % 24;
                    const aMinutes = Math.floor((totalArrivalSeconds % 3600) / 60);
                    arrivaltime = `${String(aHours).padStart(2, '0')}:${String(aMinutes).padStart(2, '0')}`;
                    
                    // Set cumulative to arrival time before calculating the break offset
                    cumulativeDepartureSeconds = totalArrivalSeconds; 
                }

                // 2. Calculate departure time
                if (stop.type === 'hotel') {
                    // Hotel resets the schedule to its start time for the next leg
                    departuretime = stop.depart || "08:00";
                    const [hours, minutes] = (departuretime as string).split(':').map(Number);
                    cumulativeDepartureSeconds = (hours * 3600) + (minutes * 60);
                } else if (stop.type === 'origin') {
                    departuretime = stop.depart || "08:00";
                    const [hours, minutes] = (departuretime as string).split(':').map(Number);
                    cumulativeDepartureSeconds = (hours * 3600) + (minutes * 60);
                    arrivaltime = null; // origins strictly have no arrival
                } else if (stop.type === 'end') {
                    // end stop doesn't have a departure time that matters for the route
                    departuretime = null;
                } else {
                    // Regular stop - departure is arrival + stay
                    const currentBaseSeconds = cumulativeDepartureSeconds || (8 * 3600);
                    const totalDepartureSeconds = currentBaseSeconds + stayInSeconds;
                    const dHours = Math.floor(totalDepartureSeconds / 3600) % 24;
                    const dMinutes = Math.floor((totalDepartureSeconds % 3600) / 60);
                    departuretime = `${String(dHours).padStart(2, '0')}:${String(dMinutes).padStart(2, '0')}`;
                    cumulativeDepartureSeconds = totalDepartureSeconds;
                }

                const sHours = Math.floor(stayInSeconds / 3600);
                const sMinutes = Math.floor((stayInSeconds % 3600) / 60);
                const formattedStay = `${String(sHours).padStart(2, '0')}:${String(sMinutes).padStart(2, '0')}`;

                return {
                    ...stop,
                    distance_to_next_stop: hasNextLeg ? (routeData.distances[index] || 0) : 0,
                    time_to_next_stop: hasNextLeg ? (routeData.durations[index] || 0) : 0,
                    stay: formattedStay,
                    arrive: arrivaltime || stop.arrive,
                    depart: departuretime || stop.depart
                };
            });

            //3.5 Calculate total distance and time
            const totalDistance = stopsWithRouteData.reduce((acc, stop) => acc + (stop.distance_to_next_stop || 0), 0);
            const totalTime = stopsWithRouteData.reduce((acc, stop) => acc + (stop.time_to_next_stop || 0), 0);

            // 4. Update the Parent Trip Details
            const tripPayload = { 
                trip_title: tempTitle, 
                summary: tempSummary, 
                status_date: safeStartDate, 
                end_date: computedEndDate,
                status: tempStatus, 
                budget: totalBudget,
                distance: totalDistance, //This is in meters
                duration: totalTime //This is in seconds
            };
            
            await updateTrip(selectedTrip.id, tripPayload);

            // 5. Delete removed stops
            const currentStopIds = stops.map(s => s.id);
            const stopsToDelete = originalStops.filter(s => !currentStopIds.includes(s.id));
            
            for (const stop of stopsToDelete) {
                if (typeof stop.id !== 'number' || stop.id < 1000000000000) {
                    await deleteStop(stop.id);
                }
            }

            // 6. Save stops with the "Distance to Next" metadata
            await updateStopsOrder(stopsWithRouteData, selectedTrip.id);

            // 7. Refetch and Sync
            const refreshedTrip = await fetchTrip(selectedTrip.id);
            const refreshedStops = await fetchStops(selectedTrip.id);

            if (refreshedStops) {
                setStops(refreshedStops);
                setOriginalStops([...refreshedStops]);
            }
            
            const updatedTrip = { 
                ...selectedTrip, 
                trip_title: tempTitle, 
                summary: tempSummary, 
                status_date: safeStartDate, 
                end_date: computedEndDate,
                status: tempStatus, 
                budget: totalBudget, 
                duration: refreshedTrip?.duration || selectedTrip.duration,
                distance: refreshedTrip?.distance || selectedTrip.distance
            };
            
            setSelectedTrip(updatedTrip);

            const updatedTrips = trips.map((t: any) => t.id === selectedTrip.id ? updatedTrip : t);
            setTrips(updatedTrips);

            setEditMode(false);

        } catch (err) {
            console.error("Save Error:", err);
            alert("There was an error updating the trip. Please try again.");
        }
    };

    const onDeleteTrip = async () => {
        if (!selectedTrip) return;
        const confirmDelete = window.confirm("Are you sure you want to delete this trip and all its stops? This action cannot be undone.");
        if (!confirmDelete) return;

        try {
            await deleteTrip(selectedTrip.id);
            setTrips(trips.filter((t: any) => t.id !== selectedTrip.id));
            setSelectedTrip(null);
            setEditMode(false);
            navigate('/dashboard');
        } catch (err) {
            alert("There was an error deleting the trip. Please try again.");
        }
    };

    useEffect(() => {
        if (selectedTrip?.id && typeof fetchStops === 'function') {
            fetchStops(selectedTrip.id).then((data: any) => {
                if (data && Array.isArray(data)) {
                    setStops(data);
                } else if (data) {
                    setStops([data]);
                } else {
                    setStops([]);
                }
            }).catch(err => {
                console.error("Failed to fetch stops:", err);
                setStops([]);
            });
        }

    }, [selectedTrip?.id, fetchStops]);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `${selectedTrip?.trip_title || 'Trip'}_Itinerary`,
    });

    return (
        <div className='item-view-container'>
            <TripTitle tempTitle={tempTitle} editMode={editMode} setTempTitle={setTempTitle} />

            <div className="summary-container">
                <h2>Summary</h2>
                <TripSummary tempSummary={tempSummary} editMode={editMode} setTempSummary={setTempSummary} />
            </div>

            <div className="statistics-container">
                <h2>Statistics</h2>
                <TripStatistics
                    selectedTrip={selectedTrip}
                    editMode={editMode}
                    tempStartDate={tempStartDate}
                    setTempStartDate={setTempStartDate}
                    tempStatus={tempStatus}
                    setTempStatus={setTempStatus}
                />
            </div>

            <StopTable stops={stops} editMode={editMode} setStops={setStops} selectedTrip={selectedTrip}/>

            <div className='item-button-container'>
                {editMode ? (
                    <>
                        <button className='std-button' onClick={() => onSave()} disabled={updating}>
                            {updating ? 'Saving...' : 'Save Trip'}
                        </button>
                        <button className='std-button' onClick={() => onDeleteTrip()} disabled={updating}>Delete Trip</button>
                        <button className='std-button' onClick={() => onCancel()} disabled={updating}>Cancel</button>
                    </>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
                        <button className='std-button' onClick={() => { setEditMode(true); setOriginalStops([...stops]); }}>Edit Trip</button>
                        <button className='std-button' onClick={()=>handlePrint()}>Print Trip</button>
                    </div>
                )}


            </div>
            
            {/* Hidden Print Container */}
            <div style={{ display: 'none' }}>
                <div ref={componentRef}>
                    <Print />
                </div>
            </div>
        </div>
    )
}

export default ItemView

