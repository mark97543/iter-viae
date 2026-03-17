import {convertMinutesToHoursAndMinutes} from '../Dashboard/Dahsboard.hooks'

export const TripTitle = ({tempTitle, editMode, setTempTitle}: {tempTitle: string, editMode:boolean, setTempTitle: (tempTitle: string) => void}) => {
    return (
        <div>
            {editMode ? (
                <input 
                    type="text" 
                    placeholder="Trip Title" 
                    value={tempTitle} 
                    onChange={(e) => setTempTitle(e.target.value)} 
                    className="std-input title-input"    
                />
            ) : (
                <h1>{tempTitle}</h1>
            )}
        </div>       
    )
}

export const TripSummary = ({tempSummary, editMode, setTempSummary}: {tempSummary: string, editMode:boolean, setTempSummary: (tempSummary: string) => void}) => {
    return (
        <div>
            {editMode ? (
                <textarea
                    placeholder="Trip Summary"
                    value={tempSummary}
                    onChange={(e) => setTempSummary(e.target.value)}
                    className="std-input summary-input"
                />
            ) : (
                <p>{tempSummary}</p>
            )}
        </div>
    )
}

export const TripStatistics = ({selectedTrip, editMode, tempStartDate, setTempStartDate, tempStatus, setTempStatus}: {selectedTrip: any, editMode:boolean, tempStartDate: string, setTempStartDate: (tempStartDate: string) => void, tempStatus: string, setTempStatus: (tempStatus: string) => void}) =>{
    return(
        <div className='statistics'>
            <h3>Budget: <br></br>${selectedTrip?.budget}</h3>
            <h3>Duration: <br></br>{convertMinutesToHoursAndMinutes(selectedTrip?.duration || 0).hours}h {convertMinutesToHoursAndMinutes(selectedTrip?.duration || 0).minutes}m</h3>
            <h3>Distance: <br></br>{selectedTrip?.distance}mi</h3>
            {editMode ? (
                <input 
                    type="date" 
                    value={tempStartDate} 
                    onChange={(e) => setTempStartDate(e.target.value)} 
                    className="std-input date-input"    
                />
                
            ) : (
                <h3>Start Date: <br></br>{tempStartDate || "Not Set"}</h3>
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

export const TripStops = ({ stops, editMode, setStops }: { stops: any[], editMode: boolean, setStops: (stops: any[]) => void }) =>{

    return(
        <div>
            <h2>Stops</h2>
            <div>
                {stops && stops.length > 0 ? (
                    editMode ? (
                        <TripStopsEdit stops={stops} setStops={setStops}/>
                    ) : (
                        <TripStopsDisplay stops={stops} />
                    )
                ) : (
                    <p>No stops found for this trip.</p>
                )}
            </div>
        </div>
    )
}

export const TripStopsDisplay = ({ stops }: { stops: any[] }) =>{
    return(
        stops.map((stop, index) => (
            <div key={stop.id || index} className="stop-card">
                <h3>{stop.stop_name}</h3>
            </div>
        ))
    )
}

export const TripStopsEdit = ({ stops, setStops }: { stops: any[], setStops: (stops: any[]) => void }) =>{
    return(
        <div>

            {stops && stops.length > 0 ? (
                stops.map((stop, index) => (
                    <div key={stop.id || index} className="stop-card">
                        <input
                            type="text"
                            value={stop.stop_name}
                            onChange={(e) => setStops(stops.map((stop, index) => index === 0 ? { ...stop, stop_name: e.target.value } : stop))}
                            className="std-input stop-card-input"
                        />
                    </div>
                ))
            ) : (
                <p>No stops found for this trip.</p>
            )}

        </div>
    )
}