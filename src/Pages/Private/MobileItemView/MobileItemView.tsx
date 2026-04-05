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
    },[cardNumber])

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
                <h3>{selectedTrip.trip_title}</h3>
                <h4>Planned: {selectedTrip.status_date}</h4>
                <div className='mobile-view-next-stop-card-content'>
                    {selectedTrip.summary}
                </div>
                
            </div>
            <div className='mobile-view-stats'>
                <h3>Stats</h3>
                <div className='mobile-view-stats-content'>
                    <h4>Budget: ${selectedTrip.budget}</h4>
                    <h4>Duration: {convertSecondsToHoursMinutes(selectedTrip.duration)}</h4> 
                    <h4 className='mobile-view-stats-content-distance'>Distance: {convertMetersToMiles(selectedTrip.distance)}</h4>
                </div>
                <button className='std-button google-maps-button'>Directions to Next Stop</button>
            </div>
        </div>
    )
}

