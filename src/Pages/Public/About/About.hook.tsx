import {createDirectus, rest, readItems} from "@directus/sdk";

const directusURL = 'https://api.wade-usa.com';
const directus = createDirectus(directusURL).with(rest());

export const useAboutData = () => {
    const fetchMyData = async () => {
        try{
            const result = await directus.request(readItems("projects_v2", {
                fields: ['*', 'project_goals.*', 'updates.*']
            }));
            
            // Format data into an array to ensure we can sort it properly regardless of Directus response type
            const dataArray = Array.isArray(result) ? result : (result ? [result] : []);
            
            return dataArray;
        }catch(error){
            console.error("Error pulling data from Directus: [useAboutData]", error);
            return [];
        }
    }

    return {
        fetchMyData
    }
}
