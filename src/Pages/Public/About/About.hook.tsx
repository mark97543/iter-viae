import {createDirectus, rest, readItems} from "@directus/sdk";

const directusURL = 'https://api.wade-usa.com';
const directus = createDirectus(directusURL).with(rest());

export const useAboutData = () => {
    const fetchMyData = async () => {
        try{
            const result = await directus.request(readItems("project_notes"));
            
            // Format data into an array to ensure we can sort it properly regardless of Directus response type
            const dataArray = Array.isArray(result) ? result : (result ? [result] : []);
            
            // Ensure updates are sorted by date
            dataArray.forEach((item: any) => {
                if (item.updates && Array.isArray(item.updates)) {
                    // b - a sorts newest to oldest. Flip to a - b if you need oldest to newest.
                    item.updates.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
                }
            });

            return result;
        }catch(error){
            console.error("Error pulling data from Directus: [useAboutData]", error);
        }
    }

    return {
        fetchMyData
    }
}
