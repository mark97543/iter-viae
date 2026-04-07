//#region Imports
import {convertSecondsToHoursMinutes, convertMetersToMiles} from './ItemView.hooks'
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
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
            <h3>Budget: <br></br>${selectedTrip?.budget}</h3>
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

//#region Trip Stops Component
/**
 * Trip Stops Component
 * @param stops - The stops of the trip
 * @param editMode - Whether the trip is in edit mode
 * @param setStops - Function to set the stops of the trip
 * @param onDragEnd - Function to handle the end of a drag
 * @returns 
 */
export const TripStops = ({ stops, editMode, setStops, onDragEnd }: { stops: any[], editMode: boolean, setStops: (stops: any[]) => void, onDragEnd: (event: any) => void }) =>{

    return(
        <div>
            <h2>Stops</h2>
            <div>
                {editMode ? (
                    <TripStopsEdit stops={stops} setStops={setStops} onDragEnd={onDragEnd}/>
                ) : (
                    stops && stops.length > 0 ? (
                        <TripStopsDisplay stops={stops} />
                    ) : (
                        <p>No stops found for this trip.</p>
                    )
                )}
            </div>
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

//#region Trip Stops Display Component
/**
 * Trip Stops Display Component
 * @param stops - The stops of the trip
 * @returns 
 */
export const TripStopsDisplay = ({ stops }: { stops: any[] }) =>{
    const handleCopy = (stop: any) => {
        const textToCopy = `${stop.location ? `${stop.location}` : ''}`;
        navigator.clipboard.writeText(textToCopy);
    };

    const formatTime = (timeStr?: string) => {
        if (!timeStr) return "Not Set";
        return timeStr.split(':').slice(0, 2).join(':');
    };

    let currentDay = 1;

    return(
        <div className="stops-list">
            {stops.map((stop, index) => {
                const nextLegDay = stop.type === 'hotel' ? currentDay + 1 : currentDay;

                const card = (
                    <div key={stop.id || index}>
                        <div className="stop-card">
                            <div className="stop-card-type">
                                <img src={stopType.find((type) => type.value === stop.type)?.icon} alt={stop.type} />
                            </div>
                            <div className="stop-card-info">
                                <h3>{stop.stop_name}</h3>
                                <h3>
                                    <button className="location-button" onClick={() => handleCopy(stop)} title="Copy Info">
                                        {stop.location 
                                            ? stop.location.split(',').map((num: string) => parseFloat(num).toFixed(5)).join(', ')
                                            : "No Location"}
                                    </button>
                                </h3>
                                <h3 className="stop-card-note" style={{ whiteSpace: 'pre-wrap' }}>
                                    <b>Note: </b><i>{stop.note || "None"}</i> 
                                </h3>
                            </div>
                            <div className='stop-card-time'>
                                {stop.type === 'origin' ? null : <h3><b>Arrive: </b>&nbsp; &nbsp;<i>{formatTime(stop.arrive)}</i></h3>}
                                {stop.type === 'origin' || stop.type === 'hotel' || stop.type === 'end'? null : <h3><b>Break: </b>&nbsp; &nbsp;<i>{formatTime(stop.stay)}</i></h3>}
                                {stop.type === 'end' ? null : <h3><b>Depart: </b>&nbsp; <i>{formatTime(stop.depart)}</i></h3>}
                            </div>
                            <div className='stop-card-budget'>
                                <h3><b>Budget: </b>&nbsp; &nbsp;<i>{stop.budget ? `$${stop.budget}` : "$0"}</i></h3>
                            </div>
                        </div>
                        {stop.type !== 'end' ? (
                            <div className="stop-card-distance-time">
                                <h4><b>Travel Day: </b>&nbsp; &nbsp;<i>Day {nextLegDay}</i></h4>
                                <h4><b>Distance to Next Stop: </b>&nbsp; &nbsp;<i>{stop.distance_to_next_stop ? convertMetersToMiles(stop.distance_to_next_stop) : "Not Set"}</i></h4>
                                <h4><b>Time to Next Stop: </b>&nbsp; &nbsp;<i>{stop.time_to_next_stop ? convertSecondsToHoursMinutes(stop.time_to_next_stop) : "Not Set"}</i></h4>
                            </div>
                        ) : null}
                    </div>
                );

                if (stop.type === 'hotel') {
                    currentDay += 1;
                }

                return card;
            })}
        </div>
    )
}
//#endregion

//#region Sortable Stop Card
/**
 * Sortable Stop Card
 * @param stop - The stop to display
 * @param index - The index of the stop
 * @param stops - The stops of the trip
 * @param setStops - Function to set the stops of the trip
 * @returns 
 */
export const SortableStopCard = ({ stop, index, stops, setStops }: { stop: any, index: number, stops: any[], setStops: (stops: any[]) => void }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({id: stop.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 2 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="stop-card edit-mode">
            <div className="drag-handle" {...attributes} {...listeners}>
                <span className="material-symbols-outlined">drag_indicator</span>
            </div>
            <select 
                value={stop.type} 
                onChange={(e) => setStops(stops.map((s, i) => i === index ? { ...s, type: e.target.value } : s))}
                className="std-input stop-type-select"
            >
                {stopType.map((type) => (
                    <option key={type.value} value={type.value}>{type.type}</option>
                ))}
            </select>
            <div className="stop-card-info">
                <input
                    type="text"
                    placeholder="Stop Name"
                    value={stop.stop_name}
                    onChange={(e) => setStops(stops.map((s, i) => i === index ? { ...s, stop_name: e.target.value } : s))}
                    className="std-input stop-card-input"
                    onFocus={(e) => e.target.select()}
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={stop.location}
                    onChange={(e) => setStops(stops.map((s, i) => i === index ? { ...s, location: e.target.value } : s))}
                    className="std-input stop-card-input"
                    onFocus={(e) => e.target.select()}
                />
                <textarea
                    placeholder="Note"
                    value={stop.note}
                    onChange={(e) => setStops(stops.map((s, i) => i === index ? { ...s, note: e.target.value } : s))}
                    className="std-input stop-card-input note-input"
                    rows={5}
                    onFocus={(e) => e.target.select()}
                />
            </div>

            <div className="stop-budget-time-wrapper">
                <div className="stop-budget-input-container">
                    <span className="currency-symbol">$</span>
                    <input
                        type="number"
                        placeholder="Budget"
                        value={stop.budget || ''}
                        onChange={(e) => setStops(stops.map((s, i) => i === index ? { ...s, budget: e.target.value === '' ? null : Number(e.target.value) } : s))}
                        className="std-input stop-budget-input"
                        onFocus={(e) => e.target.select()}
                    />
                </div>
                <div className='stop-card-time'>
                    {stop.type === 'origin' || stop.type === 'hotel' ? (
                        <>
                            <label>Depart</label>
                            <input
                                type="time"
                                placeholder='depart'
                                value={stop.depart || ''}
                                onChange={(e) => setStops(stops.map((s, i) => i === index ? { ...s, depart: e.target.value } : s))}
                                className="std-input stop-card-input"
                                onFocus={(e) => e.target.select()}
                            />
                        </>
                    ) : stop.type === 'end' ? (
                        null
                    ) : (
                        <div className='stop-card-break'>
                            <label>Break</label>
                            <div className='stop-card-break-input'>
                                <input
                                    type="number"
                                    placeholder='hours'
                                    value={stop.stayHours || ''}
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setStops(stops.map((s, i) => {
                                            if (i !== index) return s;
                                        const h = val || '0';
                                        const m = s.stayMinutes ? String(s.stayMinutes) : '0';
                                        const totalStay = (val || s.stayMinutes) ? `${h.padStart(2, '0')}:${m.padStart(2, '0')}` : null;
                                        return { ...s, stayHours: val, stay: totalStay };
                                    }));
                                }}
                                className="std-input stop-card-break-input"
                                />
                                <span>H:</span>
                                <input
                                    type="number"
                                    placeholder='minutes'
                                    value={stop.stayMinutes || ''}
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setStops(stops.map((s, i) => {
                                            if (i !== index) return s;
                                            const h = s.stayHours ? String(s.stayHours) : '0';
                                            const m = val || '0';
                                            const totalStay = (s.stayHours || val) ? `${h.padStart(2, '0')}:${m.padStart(2, '0')}` : null;
                                            return { ...s, stayMinutes: val, stay: totalStay };
                                        }));
                                    }}
                                    className="std-input stop-card-break-input"
                                />
                                <span>M</span>
                            </div>
                            
                        </div>
                    )}
                    <button className='std-button stop-delete-button' onClick={() => setStops(stops.filter((_, i) => i !== index))}><img src="/delete.png" alt="Delete" /></button>
                </div>
            </div>



        </div>
    );
};
//#endregion

//#region Trip Stops Edit Component
/**
 * Trip Stops Edit Component
 * @param stops - The stops of the trip
 * @param setStops - Function to set the stops of the trip
 * @param onDragEnd - Function to handle the end of a drag
 * @returns 
 */
export const TripStopsEdit = ({ stops, setStops, onDragEnd }: { stops: any[], setStops: (stops: any[]) => void, onDragEnd: (event: any) => void }) =>{
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return(
        <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
        >
            <SortableContext 
                items={stops.map(s => s.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="stops-list-edit">
                    {stops && stops.length > 0 ? (
                        stops.map((stop, index) => (
                            <SortableStopCard 
                                key={stop.id} 
                                stop={stop} 
                                index={index} 
                                stops={stops} 
                                setStops={setStops} 
                            />
                        ))
                    ) : (
                        <p>No stops found for this trip.</p>
                    )}
                </div>
            </SortableContext>
            <button className='std-button add-stop-button' onClick={() => setStops([...stops, { id: Date.now(), stop_name: '', location: '', note: '', depart: '', stay: '', arrive: '', budget: null, type: 'stop' }])}>Add Stop</button>
        </DndContext>
    )
}
//#endregion

