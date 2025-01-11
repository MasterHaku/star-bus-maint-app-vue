import axios from "axios";

class UtilsApi{
    url:string;

    constructor(){
        this.url = "https://data.explore.star.fr/api/explore/v2.1/catalog/datasets/";
    }

    
    async performRequest(endpoint:string, offset:number,limit:number, id?:number, dataValue?: string): Promise<string[]> {

        let finalurl =""
        let data: string[] = [];
        if(offset == 0 && limit == 0){
            finalurl = this.url+endpoint;
        }
        else if(id !== undefined && dataValue !== undefined){
            finalurl =  this.url+endpoint+"?select=*&where="+dataValue+"%3D"+id+"&limit=100";
        }
        else{
            finalurl = this.url+endpoint+"?limit="+limit+"&offset="+offset;
        }

        
        console.log(finalurl)
        try {
            const response = await axios.get(finalurl);
            data = response.data.results; // Stocke les données dans `data`
            console.log(data)
        } catch (error) {
         console.log(error);   
        }
        return data;

    }
}

export default new UtilsApi();
