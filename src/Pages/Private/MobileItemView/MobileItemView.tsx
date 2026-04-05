import './MobileItemView.css'
import { useState, useEffect } from 'react'
import {useAppState} from '../../../Contexts/StateContext'
import {convertMetersToMiles, useItemViewData, convertSecondsToHoursMinutes} from '../ItemView/ItemView.hooks'

const MobileItemView = () =>{

    const {selectedTrip } = useAppState()
    const {fetchStops} = useItemViewData()
    const [cardNumber, setCardNumber] = useState(0)
    const [disableForward, setDisableForward] = useState(false)
    const [disableBack, setDisableBack] = useState(true)
    const [stops, setStops] = useState<any[]>([])

    useEffect(()=>{
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

    },[])

    useEffect(()=>{
        if(cardNumber === 0){
            setDisableBack(true)
        }else{
            setDisableBack(false)
        }
        if(cardNumber === stops.length ){
            setDisableForward(true)
        }else{
            setDisableForward(false)
        }
    },[cardNumber, stops])

    const handleForward = () =>{
        setCardNumber(cardNumber + 1)
    }

    const handleBack = () =>{
        setCardNumber(cardNumber - 1)
    }

    return(
        <div className="mobile-view-wrapper">
            <button className="std-button back-button" onClick={()=>handleBack()} disabled={disableBack}>Back</button>
            {cardNumber === 0 ? <CardZero selectedTrip={selectedTrip}/> : null}
            {cardNumber > 0 ? <Cards stops={stops} cardNumber={cardNumber}/> : null}
            <button className="std-button forward-button" onClick={()=>handleForward()} disabled={disableForward}>Forward</button>
        </div>
    )
}

export default MobileItemView


//Card Zero HTML
const CardZero =({selectedTrip}: {selectedTrip: any})=>{
    return(
        <div className='mobile-view-card-zero'>
            <div className='mobile-view-next-stop-card'>
                <h2>Overview</h2>
                <h3>{selectedTrip?.trip_title}</h3>
                <h4>Planned: <span>{selectedTrip?.planned_date || 'Not Set'}</span></h4>
                <div className='mobile-view-next-stop-card-content'>
                    {selectedTrip?.summary || 'No summary provided.'}
                </div>
                
            </div>
            <div className='mobile-view-stats'>
                <h3>Trip Stats</h3>
                <div className='mobile-view-stats-content'>
                    <h4>Budget: <span>${selectedTrip?.budget || 0}</span></h4>
                    <h4>Duration: <span>{convertSecondsToHoursMinutes(selectedTrip?.duration || 0)}</span></h4> 
                    <h4>Distance: <span>{convertMetersToMiles(selectedTrip?.distance || 0)}</span></h4>
                </div>
            </div>
        </div>
    )
}

//Remaining cards HTML
const Cards = ({stops, cardNumber}: {stops: any[], cardNumber: number})=>{
    const stop = stops[cardNumber-1]

    const googleMaps = (location:any) =>{
        const url = `https://www.google.com/maps?saddr=&daddr=${location}`;
        window.open(url, '_blank')
    }

    const formatTime = (timeStr?: string) => {
        if (!timeStr) return "Not Set";
        return timeStr.split(':').slice(0, 2).join(':');
    };

    return(
        <div className='mobile-view-cards'>
            <div key={stop?.id} className='mobile-view-card '>
                <h2>Stop {cardNumber}</h2>
                <h3>{stop?.stop_name || 'Unnamed'}</h3>
                {cardNumber !== 1 ? <h4>Arrival: <span>{formatTime(stop?.arrive)}</span></h4> : null}
                {cardNumber !== 1 && cardNumber !== stops.length ? <h4>Break: <span>{formatTime(stop?.stay)}</span></h4> : null}
                
                <div style={{ height: '8px' }} /> {/* Visual spacer */}

                <h4 
                    onClick={() => { if(stop?.location) navigator.clipboard.writeText(stop.location) }}
                    style={{ cursor: 'pointer' }}
                >
                    Location: 
                    <span style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                        {stop?.location ? stop.location.split(',').map((num: string) => parseFloat(num).toFixed(5)).join(', ') : 'Not Set'}
                    </span>
                </h4>
                <p className='location-copy-hint'>Touch coordinates to copy</p>
                
                {stop?.note && (
                    <div className='mobile-view-card-notes'>
                        {stop.note}
                    </div>
                )}
            </div>
            
            {(cardNumber !== stops.length) && (
                <div className='mobile-view-stats-normal'>
                    <h3>To Next Stop</h3>
                    <div className='mobile-view-stats-content-stops'>
                        <h4>Departure: <span>{formatTime(stop?.depart)}</span></h4>
                        <h4>Distance: <span>{convertMetersToMiles(stop?.distance_to_next_stop)}</span></h4>
                        <h4>Duration: <span>{convertSecondsToHoursMinutes(stop?.time_to_next_stop)}</span></h4>
                    </div>
                    <button className='std-button google-maps-button' onClick={()=>googleMaps(stop?.location)}>Get Directions</button>
                </div>
            )}
            
        </div>
    )
}

