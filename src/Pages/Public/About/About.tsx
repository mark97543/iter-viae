import './About.css';
import { useAboutData } from './About.hook';
import { useEffect, useState } from 'react';


const About = () => {
    const { fetchMyData } = useAboutData();
    const [data, setData] = useState<any[]>([]);
    const [current, setCurrent]= useState<any>(null);

    useEffect(() => {
        const loadData = async () => {
            const result = await fetchMyData() || [];
            
            // Filter all data where item.status = closed to show in the list
            const pastProjects = result.filter((item: any) => item.status === 'closed');
            setData(pastProjects);

            // Set the current project based on status = open
            const currentProject = result.find((item: any) => item.status === 'open');
            setCurrent(currentProject);
        };
        loadData();


    }, []);

    console.log(data);

    return (
        <div className="AboutWrapper">
            <header className="hero-branding">
                <h1>About</h1>
            </header>

            <h3 className="version-info">
                Version {current?.version || 'Unknown'}
                <br />
                Codename {current?.project_name || 'Unknown'}    
            </h3>
            
            <main className="project-goals">

                    <div  className="project-item">
                        
                        <h2>Project Goals:</h2>
                        
                        {/* 2. Then map through the project_goals array inside the item */}
                        <ul>
                            {current?.goals?.map((goalItem:any, index:number) =>(
                                <li key={index}>
                                    {goalItem.open === true ? (<span>{goalItem.goal_name}</span>):(<s>{goalItem.goal_name}</s>)}
                                </li>
                            ))}
                        </ul>

                        <h2>Updates:</h2>

                        <ul>
                            {current?.updates?.map((updateItem:any, index:number) =>(
                                <li key={index}>
                                    {updateItem.update}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='past-projects'>
                        <h2>Past Projects:</h2>
                        
                        {data?.map((item:any, index:number)=>(
                            <div className='project-item-past' key={index}>
                                <h3>{item.project_name}</h3>
                                <p>Version {item.version}</p>
                                <h4>Goals:</h4>
                                <ul>
                                    {item?.goals?.map((goalItem:any, index:number) =>(
                                        <li key={index}>
                                            <span>{goalItem.goal_name}</span>
                                        </li>
                                    ))}
                                </ul>
                                <h4>Updates:</h4>
                                <ul>
                                    {item?.updates?.map((updateItem:any, index:number) =>(
                                        <li key={index}>
                                            <span>{updateItem.update}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
            </main>

        </div>
    );
};

export default About;

//TODO: We will need to reformat this to be more project oriented. 