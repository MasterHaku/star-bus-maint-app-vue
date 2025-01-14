import axios from "axios";

class UtilsApi{
    StarURL:string;
    CitediaURL:string;

    constructor(){
        this.StarURL = "https://data.explore.star.fr/api/explore/v2.1/catalog/datasets/";
        this.CitediaURL = "https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/"
    }

    
    /**
     * 
     * @param service 
     * @param endpoint 
     * @param offset 
     * @param limit 
     * @param id 
     * @param dataValue 
     * @returns 
     */
    async performRequest(service: 'Star' | 'Citédia' ,endpoint:string, offset:number,limit:number, id?:number, dataValue?: string): Promise<string[]> {

        let serv = "";
        let finalurl =""
        let data: string[] = [];

        if(service == 'Star'){
            serv = this.StarURL;
        }else if(service == 'Citédia'){
            serv = this.CitediaURL;
        }else{
            serv = this.StarURL;
        }
            

        if(offset == 0 && limit == 0){
            finalurl = serv+endpoint;
        }
        else if(id !== undefined && dataValue !== undefined){
            finalurl =  serv+endpoint+"?select=*&where="+dataValue+"%3D"+id+"&limit=100";
        }
        else{
            finalurl = serv+endpoint+"?limit="+limit+"&offset="+offset;
        }

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
