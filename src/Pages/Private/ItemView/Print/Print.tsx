import './Print.css'
import { useAppState } from '../../../../Contexts/StateContext'
import { useState, useEffect } from 'react'
import {useItemViewData} from '../ItemView.hooks'
import { convertSecondsToHoursMinutes, convertMetersToMiles } from '../ItemView.hooks'

const Print = ({}: {}) => {
    const {selectedTrip}=useAppState();
    const { fetchStops } = useItemViewData();
    const [stops, setStops] = useState<any[]>([]);
    const STOPSIZE =4; //How many stops per page

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
            }).catch((err:any) => {
                console.error("Failed to fetch stops:", err);
                setStops([]);
            });
        }
    }, [selectedTrip?.id, fetchStops]);

    const NoteLines = ({ count }: { count: number }) => {
        const lines = Array.from({ length: count });

        return (
            <div className='print-notes-section'>
                <h3 className='print-notes-header' style={{ fontSize: '14pt', margin: 0 }}>Notes</h3>
                {lines.map((_, i) => (
                <div 
                    key={i} 
                    className="print-note-lines" 
                    style={{ borderBottomStyle: 'dotted' }} // Dotted looks cleaner for handwriting
                />
                ))}
            </div>  
        );
    };

    //Chunck array
    const chunckArray = (arr: any[], size: number)=>{
        return Array.from({length:Math.ceil(arr.length/size)},(v,i)=>
        arr.slice(i*size, i*size+size)
        )
    }

    const pages = chunckArray(stops, STOPSIZE);



    return (
        <div className='print-container'>
            <div className='print-page cover-page'>
                <h3>{selectedTrip?.trip_title}</h3>
                <h4><i>{selectedTrip?.status_date}</i> To <i>{selectedTrip?.end_date}</i></h4>
                <div className='print-cover-stats'>
                    <div className='print-cover-stats-item'>
                        <span className='print-cover-stats-label'>Budget</span>
                        <span className='print-cover-stats-value'>${selectedTrip?.budget || 0}</span>
                    </div>
                    <div className='print-cover-stats-item'>
                        <span className='print-cover-stats-label'>Duration</span>
                        <span className='print-cover-stats-value'>{convertSecondsToHoursMinutes(selectedTrip?.duration)}</span>
                    </div>
                    <div className='print-cover-stats-item'>
                        <span className='print-cover-stats-label'>Distance</span>
                        <span className='print-cover-stats-value'>{convertMetersToMiles(selectedTrip?.distance)}</span>
                    </div>
                    <div className='print-cover-stats-item'>
                        <span className='print-cover-stats-label'>Stops</span>
                        <span className='print-cover-stats-value'>{stops.length}</span>
                    </div>
                </div>
                <h4 style={{marginTop: '10px', fontSize: '12pt'}}><b>Summary</b></h4>
                <div className='print-cover-summary'>
                    <h4>{selectedTrip?.summary || "No summary provided."}</h4>
                </div>
                 <NoteLines count={10} />
                
                <div className='page-number'>
                    <h4><i>Page 1</i></h4>
                </div>       
            </div>
            {pages.map((pageItems, pageIndex)=>(
                <div className='print-page' key={pageIndex}>
                    <h3>Stops</h3>   
                    {pageItems.map((Items, itemIndex)=>{
                        const absoluteIndex = pageIndex * STOPSIZE + itemIndex;
                        return (
                        <div className='print-stop' key={itemIndex}>
                            <div className='print-stop-card'>
                                <div className='print-stop-top'>
                                    <div className='print-stop-main'>
                                        <h4 className='print-stop-name'>{Items.stop_name}</h4>
                                        <span className='print-stop-budget'>
                                            <strong>Budget:</strong> ${Items.budget || 0}
                                        </span>
                                        <span className='print-stop-gps' style={{ fontSize: '9pt', color: '#666', marginTop: '2px' }}>
                                            <strong>GPS:</strong> {typeof Items.location === 'string' ? Items.location.split(',').map((l: string) => { const n = parseFloat(l.trim()); return isNaN(n) ? l.trim() : n.toFixed(5); }).join(', ') : Items.location}
                                        </span>
                                    </div>
                                    <div className='print-stop-times'>
                                        <span><strong>Arrive:</strong> {Items.arrive ? Items.arrive.split(':').slice(0, 2).join(':') : '--:--'}</span>
                                        <span><strong>Break:</strong> {Items.stay || '--:--'}</span>
                                        <span><strong>Depart:</strong> {Items.depart ? Items.depart.split(':').slice(0, 2).join(':') : '--:--'}</span>
                                    </div>
                                </div>
                                {Items.note && (
                                    <div className='print-stop-notes'>
                                        <strong>Notes:</strong> {Items.note}
                                    </div>
                                )}
                            </div>
                            <div className="print-line-container">
                                <div className="print-line"></div>
                                {absoluteIndex !== stops.length - 1 ? <span className='print-line-text'>Next Stop: {convertMetersToMiles(Items.distance_to_next_stop)} <i>{convertSecondsToHoursMinutes(Items.time_to_next_stop)}</i></span>:<span className='print-line-text'>End</span>}
                                <div className="print-line"></div>
                            </div>
                        </div>
                    )})}

                    <div className='page-number'>
                        <h4><i>Page {pageIndex + 2}</i></h4>
                    </div>
                </div>
            ))}
            <div className='print-page cover-page-notes'>
                <NoteLines count={30} />
                <div className='page-number'>
                    <h4><i>Page {pages.length + 2}</i></h4>
                </div>
            </div>
        </div>
    )
}

export default Print