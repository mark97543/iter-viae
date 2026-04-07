//#region Imports
import {convertSecondsToHoursMinutes, convertMetersToMiles} from './ItemView.hooks'
import { Fragment } from 'react'

//#endregion

//#region Trip Title Component
/**
 * Trip Title Component
 * @param tempTitle - The title of the trip
 * @param editMode - Whether the trip is in edit mode
 * @param setTempTitle - Function to set the title of the trip
 * @returns 
 */
export const TripTitle = ({tempTitle, editMode, setTempTitle}: {tempTitle: string, editMode:boolean, setTempTitle: (tempTitle: string) => void}) => {
    return (
        <div className='trip-title-container'>
            {editMode ? (
                <input 
                    type="text" 
                    placeholder="Trip Title" 
                    value={tempTitle} 
                    onChange={(e) => setTempTitle(e.target.value)} 
                    className="std-input title-input"  
                    onFocus={(e) => e.target.select()}  
                />
            ) : (
                <h1>{tempTitle}</h1>
            )}
        </div>       
    )
}
//#endregion

//#region Trip Summary Component
/**
 * Trip Summary Component
 * @param tempSummary - The summary of the trip
 * @param editMode - Whether the trip is in edit mode
 * @param setTempSummary - Function to set the summary of the trip
 * @returns 
 */
export const TripSummary = ({tempSummary, editMode, setTempSummary}: {tempSummary: string, editMode:boolean, setTempSummary: (tempSummary: string) => void}) => {
    return (
        <div>
            {editMode ? (
                <textarea
                    placeholder="Trip Summary"
                    value={tempSummary}
                    onChange={(e) => setTempSummary(e.target.value)}
                    className="std-input summary-input"
                    onFocus={(e) => e.target.select()}
                />
            ) : (
                <p style={{ whiteSpace: 'pre-wrap' }}>{tempSummary}</p>
            )}
        </div>
    )
}
//#endregion

//#region Trip Statistics Component
/**
 * Trip Statistics Component
 * @param selectedTrip - The selected trip
 * @param editMode - Whether the trip is in edit mode
 * @param tempStartDate - The start date of the trip
 * @param setTempStartDate - Function to set the start date of the trip
 * @param tempStatus - The status of the trip
 * @param setTempStatus - Function to set the status of the trip
 * @returns 
 */
export const TripStatistics = ({selectedTrip, editMode, tempStartDate, setTempStartDate, tempStatus, setTempStatus}: {selectedTrip: any, editMode:boolean, tempStartDate: string, setTempStartDate: (tempStartDate: string) => void, tempStatus: string, setTempStatus: (tempStatus: string) => void}) =>{
    return(
        <div className='statistics'>
            <h3>Budget: <br></br>${selectedTrip?.budget != null ? Number(selectedTrip.budget).toFixed(2) : '0.00'}</h3>
            <h3>Duration: <br></br>{convertSecondsToHoursMinutes(selectedTrip?.duration || 0)}</h3>
            <h3>Distance: <br></br>{convertMetersToMiles(selectedTrip?.distance || 0)}</h3>
            {editMode ? (
                <input 
                    type="date" 
                    value={tempStartDate} 
                    onChange={(e) => setTempStartDate(e.target.value)} 
                    className="std-input date-input"    
                    onFocus={(e) => e.target.select()}
                />
                
            ) : (
                <h3>Start Date: <br></br>{tempStartDate || "Not Set"}</h3>
            )}
            {editMode ? (
                <h3>End Date: <br></br><i>(Computed on save)</i></h3>
            ) : (
                <h3>End Date: <br></br>{selectedTrip?.end_date || "Not Set"}</h3>
            )}
            {editMode ? (
                <div>
                   <select 
                        value={tempStatus} 
                        onChange={(e) => setTempStatus(e.target.value)}
                        className="std-input status-select"
                        style={{ marginTop: '0.5rem', width: '100%', textTransform: 'capitalize' }}
                    >
                        <option value="draft">Draft</option>
                        <option value="planned">Planned</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            ) : (
                <h3>Status: <br></br><span style={{ textTransform: 'capitalize' }}>{selectedTrip?.status}</span></h3>
            )}
        </div>
    )
}
//#endregion

//#region Stop Type
/**
 * Stop Type
 * @param type - The type of the stop
 * @param value - The value of the stop
 * @param icon - The icon of the stop
 * @returns 
 */
const stopType = [
    {
        type: 'Waypoint',
        value: 'waypoint',
        icon: '/TypeIcons/waypoint.png'
    },
    {
        type: 'Origin',
        value: 'origin',
        icon:'/TypeIcons/origin.png'
    },
    {
        type: 'Gas',
        value: 'gas',
        icon: '/TypeIcons/gas.png'
    },
    {
        type: 'Food',
        value: 'food',
        icon: '/TypeIcons/food.png'
    },
    {
        type: 'Activity',
        value: 'activity',
        icon: '/TypeIcons/activity.png'
    },
    {
        type:'Hotel',
        value: 'hotel',
        icon: '/TypeIcons/hotel.png'
    },
    {
        type: 'End',
        value: 'end',
        icon: '/TypeIcons/end.png'
    }
]
//#endregion

//#region StopTable
/**
 * StopTable
 * @param stops - The stops of the trip
 * @param editMode - Whether the trip is in edit mode
 * @param setStops - Function to set the stops of the trip
 * @returns 
 */
export const StopTable = ({stops, editMode, setStops, selectedTrip}:{stops: any[], editMode: boolean, setStops: (stops: any[]) => void, selectedTrip: any}) =>{


    const moveStop = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index > 0) {
            const newStops = [...stops];
            [newStops[index - 1], newStops[index]] = [newStops[index], newStops[index - 1]];
            setStops(newStops);
        } else if (direction === 'down' && index < stops.length - 1) {
            const newStops = [...stops];
            [newStops[index + 1], newStops[index]] = [newStops[index], newStops[index + 1]];
            setStops(newStops);
        }
    };

    const formatLocation = (loc: string) => {
        if (!loc) return '';
        const parts = loc.split(',');
        if (parts.length === 2) {
            const lat = parseFloat(parts[0]);
            const lng = parseFloat(parts[1]);
            if (!isNaN(lat) && !isNaN(lng)) {
                return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            }
        }
        return loc;
    };

    const stopTypeDropdown = (stop: any, index: number) => {
        return (
            <select 
                value={stop.type} 
                onChange={(e) => setStops(stops.map((s, i) => i === index ? { ...s, type: e.target.value } : s))}
                className="std-input type-select"
                style={{ marginTop: '0.5rem', width: '100%', textTransform: 'capitalize' }}
            >
                {stopType.map((type) => (
                    <option key={type.value} value={type.value}>{type.type}</option>
                ))}
            </select>
        )
    }

    const stayChangeHandeler = (index:number, type:'hours'|'minutes', value:string) => {
        setStops(stops.map((s, i) => {
            if (i === index) {
                const currentH = (s.stay || '').split(':')[0] || '';
                const currentM = (s.stay || '').split(':')[1] || '';
                return { ...s, stay: type === 'hours' ? `${value}:${currentM}` : `${currentH}:${value}` };
            }
            return s;
        }));
    }

    return (
        <div style={{ width: '100%' }}>
            <h3>Stops</h3>
            <div className='stop-table'>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Type</th>
                            <th>Stop Name</th>
                            <th>Location</th>
                            <th>Budget</th>
                            <th>Arrival</th>
                            <th>Break</th>
                            <th>Depart</th>
                            {editMode && <th></th>}
                        </tr>
                    </thead>
                    <tbody>
                    {stops.map((stop, index) => (
                        <Fragment key={index}>
                            <tr className={`stop-group-row ${index % 2 === 0 ? 'stop-row-even' : 'stop-row-odd'} stop-row-start`}>
                                <td>
                                    {editMode ? (
                                        <div style={{ display: 'flex', gap: '0.25rem', flexDirection: 'column', alignItems: 'center' }}>
                                            <button 
                                                type="button" 
                                                onClick={() => moveStop(index, 'up')} 
                                                disabled={index === 0}
                                                style={{ padding: '0 0.4rem', cursor: index === 0 ? 'not-allowed' : 'pointer', fontSize: '0.8rem' }}
                                            >
                                                ▲
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => moveStop(index, 'down')} 
                                                disabled={index === stops.length - 1}
                                                style={{ padding: '0 0.4rem', cursor: index === stops.length - 1 ? 'not-allowed' : 'pointer', fontSize: '0.8rem' }}
                                            >
                                                ▼
                                            </button>
                                        </div>
                                    ) : (
                                        stop.sort || index + 1
                                    )}
                                </td>
                                <td>{editMode ? stopTypeDropdown(stop, index) : <img src={stopType.find((t) => t.value === stop.type)?.icon} alt={stop.type} />}</td>
                                <td>{editMode ? <input type="text" placeholder="Stop Name" value={stop.stop_name || ''} onChange={(e) => setStops(stops.map((s, i) => i === index ? { ...s, stop_name: e.target.value } : s))} /> : stop.stop_name}</td>
                                <td>{editMode ? <input type="text" placeholder="Location (lat,lng)" value={stop.location || ''} onChange={(e) => setStops(stops.map((s, i) => i === index ? { ...s, location: e.target.value } : s))} /> : <span style={{ cursor: 'pointer', color: 'var(--color-text)' }} title="Click to copy location" onClick={() => navigator.clipboard.writeText(stop.location || '')}>{formatLocation(stop.location)}</span>}</td>
                                <td>{editMode ? <input type="number" placeholder="Budget" className="no-spinners" value={stop.budget || ''} onChange={(e)=>setStops(stops.map((s,i)=>i===index?{...s,budget:e.target.value}:s))}></input> : '$' + (stop.budget != null ? Number(stop.budget).toFixed(2) : '0.00')}</td>
                                <td>{editMode || stop.type==='origin' ? null : (stop.arrive ? stop.arrive.substring(0, 5) : null)}</td>
                                <td>{editMode && stop.type!=='origin' && stop.type !=='hotel' && stop.type !=='end' ? 
                                    <div style={{display:'flex', gap: '0.2rem', alignItems: 'center'}}>
                                        <input type='text' className="no-spinners std-input" value={(stop.stay || '').split(':')[0] || ''} onChange={(e) => stayChangeHandeler(index, 'hours', e.target.value)} placeholder='HH'/> H
                                        <input type='text' className="no-spinners std-input" value={(stop.stay || '').split(':')[1] || ''} onChange={(e) => stayChangeHandeler(index, 'minutes', e.target.value)} placeholder='MM'/> M
                                    </div> : stop.type!=='origin' && stop.type !=='hotel' && stop.type !=='end' ? stop.stay || null : null}
                                </td>
                                <td>{editMode && (stop.type==='origin' || stop.type ==='hotel') ? <input type='time' value={stop.depart ? stop.depart.substring(0, 5) : ''} onChange={(e)=>setStops(stops.map((s,i)=>i===index?{...s,depart:e.target.value}:s))} style={{ width: '6rem' }}/>: (stop.depart ? stop.depart.substring(0, 5) : null)}</td>
                                {editMode && (
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to completely remove this stop?')) {
                                                    setStops(stops.filter((_, i) => i !== index));
                                                }
                                            }}
                                            style={{ padding: '0.2rem', cursor: 'pointer', background: 'none', border: 'none' }}
                                            title="Delete Stop"
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '1.4rem', color: 'red' }}>delete</span>
                                        </button>
                                    </td>
                                )}
                            </tr>   
                            <tr className={`stop-group-row ${index % 2 === 0 ? 'stop-row-even' : 'stop-row-odd'} ${stop.type === 'end' ? 'stop-row-end' : ''}`}>
                                <td colSpan={editMode ? 9 : 8} style={{ paddingTop: '0.2rem' }}>
                                    {editMode ? (
                                        <textarea 
                                            placeholder="Notes (Max 5 lines)..." 
                                            rows={5} 
                                            style={{ width: '100%', marginTop: '0.2rem', resize: 'vertical' }} 
                                            value={stop.note || ''} 
                                            onChange={(e) => {
                                                const truncatedText = e.target.value.split('\n').slice(0, 5).join('\n');
                                                setStops(stops.map((s, i) => i === index ? { ...s, note: truncatedText } : s));
                                            }} 
                                        />
                                    ) : (
                                        stop.note ? <div style={{ fontSize: '0.9rem', color: 'var(--color-text-dim)', whiteSpace: 'pre-wrap' }}>{stop.note}</div> : null
                                    )}
                                </td>
                            </tr>
                            {stop.type!=='end' ? (
                                <tr className={`stop-group-row ${index % 2 === 0 ? 'stop-row-even' : 'stop-row-odd'} stop-row-end`}>
                                    <td colSpan={editMode ? 9 : 8} style={{ padding: 0 }}>
                                        <div className="distance-time-summary">
                                            <span><strong>Distance:</strong> {convertMetersToMiles(stop.distance_to_next_stop)}</span>
                                            <span><strong>Drive Time:</strong> {convertSecondsToHoursMinutes(stop.time_to_next_stop)}</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : null}
                        </Fragment>
                    ))}
                </tbody>
            </table>
            {editMode ? (
                <button className='std-button' onClick={() => setStops([...stops, {id: Date.now(), trip_id:selectedTrip.id, stop_name: 'New Stop', location: '', note: '', depart: '', stay: '', arrive: '', budget: null, type: 'waypoint'}])} style={{ marginTop: '1rem' }}>Add Stop</button>
            ) : null}
            </div>
        </div>
    )
}



//#endregion
