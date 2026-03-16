import './ItemView.css'
import { useAppState } from '../../../Contexts/StateContext'
import {convertMinutesToHoursAndMinutes} from '../Dashboard/Dahsboard.hooks'
import { useState } from 'react'
import { TripTitle } from './ItemView.html'

const ItemView = () => {
    const { selectedTrip, setSelectedTrip } = useAppState();
    const [editMode, setEditMode] = useState(false);
    const [tempTitle, setTempTitle] = useState(selectedTrip?.trip_title);

    const onCancel = () =>{
        setTempTitle(selectedTrip?.trip_title);
        setEditMode(false);
    }

    const onSave = () =>{
        setSelectedTrip({...selectedTrip, trip_title: tempTitle});
        setEditMode(false);
    }

    return (
        <div className='item-view-container'>
            <TripTitle tempTitle={tempTitle} editMode={editMode} setTempTitle={setTempTitle} />

            <div className="summary-container">
                <h2>Summary</h2>
                <p>{selectedTrip?.summary}</p>
            </div>

            <div className="statistics-container">
                <h2>Statistics</h2>
                <div className='statistics'>
                    <h3>Budget: <br></br>${selectedTrip?.budget}</h3>
                    <h3>Duration: <br></br>{convertMinutesToHoursAndMinutes(selectedTrip?.duration || 0).hours}h {convertMinutesToHoursAndMinutes(selectedTrip?.duration || 0).minutes}m</h3>
                    <h3>Distance: <br></br>{selectedTrip?.distance}mi</h3>
                    <h3>Start Date: <br></br>{selectedTrip?.status_date}</h3>
                    <h3>Status: <br></br><span style={{ textTransform: 'capitalize' }}>{selectedTrip?.status}</span></h3>
                </div>
            </div>


            {/* TODO: Need to add Trip Notes (This is in DB as WELL will be WYSIWYG) */}
            {/* TODO: Need to add Trip Banner  */}
            {/* TODO: Need to add Edit Button and Edit page  */}

            <div className='item-button-container'>
                {editMode ? (
                    <>
                    <button className='std-button' onClick={() => onSave()}>Save Trip</button>
                    <button className='std-button'>Delete Trip</button>
                    <button className='std-button' onClick={() => onCancel()}>Cancel</button>
                    </>
                ):(
                    <button className='std-button' onClick={() => setEditMode(true)}>Edit Trip</button>
                )}
                
                
            </div>
        </div>
    )
}

export default ItemView