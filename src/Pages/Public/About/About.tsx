import './About.css';
import { useAboutData } from './About.hook';
import { useEffect, useState } from 'react';


const About = () => {
    const { fetchMyData } = useAboutData();
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const result = await fetchMyData();
            // Make sure data is always an array, even if Directus returns a single object
            setData(Array.isArray(result) ? result : (result ? [result] : []));
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
                Version 0.0.1
                <br />
                Codename Primus    
            </h3>
            
            <main className="project-goals">
                {/* 1. First map through the main data array */}
                {data.map((item) => (
                    <div key={item.id} className="project-item">
                        
                        <h2>Project Goals:</h2>
                        
                        {/* 2. Then map through the project_goals array inside the item */}
                        <ul>
                            {item.project_goals?.map((goalItem: any, index: number) => (
                                <li key={index}>
                                    {goalItem.completed === 'no' ? (<span>{goalItem.goal}</span>):(<s>{goalItem.goal}</s>)}
                                </li>
                            ))}
                        </ul>

                        <h2>Updates:</h2>
                        <ul className="updates-list">
                            {item.updates?.slice(0, 20).map((updateItem: any, index: number) => (
                                <li key={index} className="update-item">
                                    {updateItem.date} - {updateItem.update}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </main>

        </div>
    );
};

export default About;