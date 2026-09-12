import { apiDomain } from "@/next.config";
import { raidite } from "../raidite-interceptor";

export function useHub(){

    // Obtenir les forums auxquels l'utilisateur est abonné, plus quelques forums supplémentaires
    async function getUserHubs(){

        const x = await raidite.get(apiDomain + "api/Hubs/GetUserHubs");
        console.log(x.data);

        return x.data;

    }

    // Créer un forum
    async function postHub(formData: FormData){

        const x =  await raidite.post(apiDomain + "api/Hubs/PostHub", formData);
        console.log(x.data);

        return x.data;

    }
    // Obtenir les infos d'un forum
    async function getHub(id : number){

        const x = await raidite.get(apiDomain + "api/Hubs/GetHub/" + id);
        console.log(x.data);

        return x.data;

    }

    // Obtenir les publications d'un forum
    async function getHubPosts(id : number, sorting : string){

        const x = await raidite.get(apiDomain + "api/Posts/GetHubPosts/" + id + "/" + sorting);
        console.log(x.data);

        return x.data;

    }

    // Rejoindre / quitter un forum
    async function joinHub(id : number){

        const x = await raidite.put(apiDomain + "api/Hubs/ToggleJoinHub/" + id);
        console.log(x.data);

    }

    return { getHub, getUserHubs, postHub, getHubPosts, joinHub};

}