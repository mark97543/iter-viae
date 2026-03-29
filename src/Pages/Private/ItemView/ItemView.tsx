import './ItemView.css'
import { useAppState } from '../../../Contexts/StateContext'
import { useState, useEffect } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { TripTitle, TripSummary, TripStatistics, TripStops } from './ItemView.html'
import { useItemViewData } from './ItemView.hooks'
import { useNavigate } from 'react-router-dom'

const ItemView = () => {
    const navigate = useNavigate();
    const { trips, setTrips, selectedTrip, setSelectedTrip } = useAppState();
    const { updateTrip, fetchStops, updateStopsOrder, updating, fetchTrip, deleteStop, deleteTrip } = useItemViewData();
    const [editMode, setEditMode] = useState(false);
    const [stops, setStops] = useState<any[]>([]);
    const [originalStops, setOriginalStops] = useState<any[]>([]);
    const [tempTitle, setTempTitle] = useState(selectedTrip?.trip_title);
    const [tempSummary, setTempSummary] = useState(selectedTrip?.summary);
    const [tempStartDate, setTempStartDate] = useState(selectedTrip?.status_date);
    const [tempStatus, setTempStatus] = useState(selectedTrip?.status);

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setStops((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const onCancel = () => {
        setTempTitle(selectedTrip?.trip_title);
        setTempSummary(selectedTrip?.summary);
        setTempStartDate(selectedTrip?.status_date);
        setTempStatus(selectedTrip?.status);
        setStops(originalStops);
        setEditMode(false);
    }

    const onSave = async () => {
        if (!selectedTrip) return;
        try {
            const safeStartDate = tempStartDate === "" ? null : tempStartDate;

            //Sum Budget Items 
            const totalBudget = stops.reduce((acc, stop) => acc + (Number(stop.budget) || 0), 0);
            
            //Create Payload for Data
            const payload = { trip_title: tempTitle, summary: tempSummary, status_date: safeStartDate, status: tempStatus, budget: totalBudget };

            // Update trip details
            await updateTrip(selectedTrip.id, payload);

            // Delete stops that were removed during editing
            const currentStopIds = stops.map(s => s.id);
            const stopsToDelete = originalStops.filter(s => !currentStopIds.includes(s.id));
            
            for (const stop of stopsToDelete) {
                // Ensure we don't try to delete a locally generated temp stop just in case
                if (typeof stop.id !== 'number' || stop.id < 1000000000000) {
                    await deleteStop(stop.id);
                }
            }

            // Save new stops order and details
            await updateStopsOrder(stops, selectedTrip.id);

            // Refetch fresh data to compute backend calculations for duration and arrive/depart fields
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
                status: tempStatus, 
                budget: totalBudget, 
                duration: refreshedTrip?.duration || selectedTrip.duration 
            };
            
            setSelectedTrip(updatedTrip);

            const updatedTrips = trips.map((t: any) => t.id === selectedTrip.id ? updatedTrip : t);
            setTrips(updatedTrips);

            setEditMode(false);
        } catch (err) {
            alert("There was an error updating the trip. Please try again.");
        }
    }

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

            <TripStops stops={stops} editMode={editMode} setStops={setStops} onDragEnd={handleDragEnd} />

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
                    <button className='std-button' onClick={() => { setEditMode(true); setOriginalStops([...stops]); }}>Edit Trip</button>
                )}


            </div>
        </div>
    )
}

export default ItemView