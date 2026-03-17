

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