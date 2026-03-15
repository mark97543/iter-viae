
export const DashStatus = ({status, date}: {status:string, date:string}) =>{

    const statusColor = () =>{
        switch(status){
            case 'draft':
                return 'yellow'
            case 'planned':
                return 'blue'
            case 'completed':
                return 'green'
            default:
                return 'gray'
        }
    }

    return(
        <div className="dash-status" style={{backgroundColor: statusColor()}}>
            {status === 'draft' && (
                <p className="draft-status">Draft</p>
            )}
            {status === 'planned' && (
                <p className="planned-status">Planned for {date}</p>
            )}
            {status === 'completed' && (
                <p className="completed-status">Completed on {date}</p>
            )}
            {status === null && (
                <p className="draft-status">Draft</p>
            )}
        </div>
    )
}