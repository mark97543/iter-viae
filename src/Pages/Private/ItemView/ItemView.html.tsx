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


