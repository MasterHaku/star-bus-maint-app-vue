import axios from "axios";

class UtilsApi{
    url:string;

    constructor(){
        this.url = "https://data.explore.star.fr/api/explore/v2.1/catalog/datasets/";
    }

    
    async performRequest(endpoint:string, offset:number,limit:number): Promise<string[]> {


        let data: string[] = [];
        const finalurl = this.url+endpoint+"?limit="+limit+"&offset="+offset;
        try {
            const response = await axios.get(finalurl);
            data = response.data.results; // Stocke les données dans `data`

        } catch (error) {
         console.log(error);   
        }
        return data;

    }
}

export default new UtilsApi();
//https://data.explore.star.fr/api/explore/v2.1/catalog/datasets/tco-bus-materiel-vehicules-td/records