import './ItemView.css'
import { useAppState } from '../../../Contexts/StateContext'
import { useState, useEffect } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { TripTitle, TripSummary, TripStatistics, TripStops } from './ItemView.html'
import { useItemViewData } from './ItemView.hooks'

const ItemView = () => {
    const { trips, setTrips, selectedTrip, setSelectedTrip } = useAppState();
    const { updateTrip, fetchStops, updateStopsOrder, updating } = useItemViewData();
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

            // Save stops order and names
            await updateStopsOrder(stops);

            const updatedTrip = { ...selectedTrip, trip_title: tempTitle, summary: tempSummary, status_date: safeStartDate, status: tempStatus, budget: totalBudget };
            setSelectedTrip(updatedTrip);

            const updatedTrips = trips.map((t: any) => t.id === selectedTrip.id ? updatedTrip : t);
            setTrips(updatedTrips);

            setEditMode(false);
        } catch (err) {
            alert("There was an error updating the trip. Please try again.");
        }
    }

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
                        <button className='std-button'>Delete Trip</button>
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