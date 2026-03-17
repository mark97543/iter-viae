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

export const TripStatistics = ({selectedTrip, editMode, tempStartDate, setTempStartDate}: {selectedTrip: any, editMode:boolean, tempStartDate: string, setTempStartDate: (tempStartDate: string) => void}) =>{
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
                <h3>Start Date: <br></br>{tempStartDate}</h3>
            )}
            <h3>Status: <br></br><span style={{ textTransform: 'capitalize' }}>{selectedTrip?.status}</span></h3>
        </div>
    )
}