//#region Imports
import {convertSecondsToHoursMinutes, convertMetersToMiles} from './ItemView.hooks'

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

    return(
        <div className='stop-table'>
            <table>
                <caption><h3>Stops</h3></caption>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>Stop Name</th>
                        <th>Location</th>
                        <th>Budget</th>
                    </tr>
                </thead>
                <tbody>
                    {stops.map((stop, index) => (
                        <tr key={index}>
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
                            <td>{editMode ? <input type="text" value={stop.stop_name || ''} onChange={(e) => setStops(stops.map((s, i) => i === index ? { ...s, stop_name: e.target.value } : s))} /> : stop.stop_name}</td>
                            <td>{editMode ? <input type="text" value={stop.location || ''} onChange={(e) => setStops(stops.map((s, i) => i === index ? { ...s, location: e.target.value } : s))} /> : formatLocation(stop.location)}</td>
                            <td>{editMode ? <input type="number" className="no-spinners" value={stop.budget || ''} onChange={(e)=>setStops(stops.map((s,i)=>i===index?{...s,budget:e.target.value}:s))}></input> : stop.budget != null ? Number(stop.budget).toFixed(2) : ''}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {editMode ? (
                <button className='std-button' onClick={() => setStops([...stops, {id: Date.now(), trip_id:selectedTrip.id, stop_name: 'New Stop', location: '', note: '', depart: '', stay: '', arrive: '', budget: null, type: 'waypoint'}])}>Add Stop</button>
            ) : (null)}
        </div>
    )
}

//#endregion
