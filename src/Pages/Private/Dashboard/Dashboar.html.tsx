
export const DashStatus = ({status, date, end_date}: {status:string, date:string, end_date?: string}) =>{

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
                <p className="planned-status">Planned: {date}{end_date ? ` to ${end_date}` : ''}</p>
            )}
            {status === 'completed' && (
                <p className="completed-status">Completed: {date}{end_date ? ` to ${end_date}` : ''}</p>
            )}
            {status === null && (
                <p className="draft-status">Draft</p>
            )}
        </div>
    )
}