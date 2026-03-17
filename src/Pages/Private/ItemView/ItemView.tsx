import './ItemView.css'
import { useAppState } from '../../../Contexts/StateContext'
import { useState, useEffect } from 'react'
import { TripTitle, TripSummary, TripStatistics, TripStops } from './ItemView.html'
import { useItemViewData } from './ItemView.hooks'

const ItemView = () => {
    const { trips, setTrips, selectedTrip, setSelectedTrip } = useAppState();
    const { updateTrip, fetchStops, updating } = useItemViewData();
    const [editMode, setEditMode] = useState(false);
    const [stops, setStops] = useState<any[]>([]);
    const [tempTitle, setTempTitle] = useState(selectedTrip?.trip_title);
    const [tempSummary, setTempSummary] = useState(selectedTrip?.summary);
    const [tempStartDate, setTempStartDate] = useState(selectedTrip?.status_date);
    const [tempStatus, setTempStatus] = useState(selectedTrip?.status);

    const onCancel = () =>{
        setTempTitle(selectedTrip?.trip_title);
        setTempSummary(selectedTrip?.summary);
        setTempStartDate(selectedTrip?.status_date);
        setTempStatus(selectedTrip?.status);
        setEditMode(false);
    }

    const onSave = async () =>{
        if (!selectedTrip) return;
        try {
            const safeStartDate = tempStartDate === "" ? null : tempStartDate;
            const payload = { trip_title: tempTitle, summary: tempSummary, status_date: safeStartDate, status: tempStatus };
            await updateTrip(selectedTrip.id, payload);
            
            const updatedTrip = {...selectedTrip, trip_title: tempTitle, summary: tempSummary, status_date: safeStartDate, status: tempStatus };
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

            <TripStops stops={stops} editMode={editMode} setStops={setStops}/>

            <div className='item-button-container'>
                {editMode ? (
                    <>
                    <button className='std-button' onClick={() => onSave()} disabled={updating}>
                        {updating ? 'Saving...' : 'Save Trip'}
                    </button>
                    <button className='std-button'>Delete Trip</button>
                    <button className='std-button' onClick={() => onCancel()} disabled={updating}>Cancel</button>
                    </>
                ):(
                    <button className='std-button' onClick={() => setEditMode(true)}>Edit Trip</button>
                )}
                
                
            </div>
        </div>
    )
}

export default ItemView