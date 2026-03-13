import {createDirectus, rest, readItems} from "@directus/sdk";

const directusURL = 'https://api.wade-usa.com';
const directus = createDirectus(directusURL).with(rest());

export const useAboutData = () => {
    const fetchMyData = async () => {
        try{
            const result = await directus.request(readItems("project_notes"));
            return result;
        }catch(error){
            console.error("Error pulling data from Directus: [useAboutData]", error);
        }
    }

    return {
        fetchMyData
    }
}
