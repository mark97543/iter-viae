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
                <h3>{selectedTrip?.trip_title}</h3>
                <h4>Planned: {selectedTrip?.planned_date}</h4>
                <div className='mobile-view-next-stop-card-content'>
                    {selectedTrip?.summary}
                </div>
                
            </div>
            <div className='mobile-view-stats'>
                <h3>Stats</h3>
                <div className='mobile-view-stats-content'>
                    <h4>Budget: ${selectedTrip?.budget}</h4>
                    <h4>Duration: {convertSecondsToHoursMinutes(selectedTrip?.duration)}</h4> 
                    <h4 className='mobile-view-stats-content-distance'>Distance: {convertMetersToMiles(selectedTrip?.distance)}</h4>
                </div>
            </div>
        </div>
    )
}

//Remaining cards HTML
const Cards = ({stops, cardNumber}: {stops: any[], cardNumber: number})=>{
    const stop = stops[cardNumber-1]
    return(
        <div className='mobile-view-cards'>
            <div key={stop?.id} className='mobile-view-card '>
                <h3>{stop?.stop_name}</h3>
                {cardNumber !== 1 ? <h4>Arrival: {stop?.arrive}</h4> : null}
                {cardNumber !== 1 && cardNumber !== stops.length ? <h4>Break: {stop?.stay}</h4> : null}
                <h4 
                    onClick={() => { if(stop?.location) navigator.clipboard.writeText(stop.location) }}
                >
                    Location: {stop?.location ? stop.location.split(',').map((num: string) => parseFloat(num).toFixed(5)).join(', ') : 'Not Set'}
                </h4>
                <p style={{textAlign: 'center'}}><i>Touch to copy location</i></p>
                <h4>Notes:</h4>
                <h4 className='mobile-view-card-notes'>{stop?.note ? stop.note : 'No Notes'}</h4>
            </div>
            <div className='mobile-view-stats-normal'>
                <h3>Next Stop</h3>
                <div className='mobile-view-stats-content-stops'>
                    <h4>Departure: {stop?.depart}</h4>
                    <h4>Distance: {convertMetersToMiles(stop?.distance_to_next_stop)}</h4>
                    <h4>Duration: {convertSecondsToHoursMinutes(stop?.time_to_next_stop)}</h4>
                </div>
                <button className='std-button google-maps-button'>Directions to Next Stop</button>
            </div>
            
        </div>
    )
}

