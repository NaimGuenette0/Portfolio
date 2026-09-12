import { apiDomain } from "@/next.config";
import { raidite } from "../raidite-interceptor";


export function usePost() {

    // Obtenir une liste de publication à afficher sur la page d'accueil
    async function getFeedPosts(feed: string, sorting: string) {

        const x = await raidite.get(apiDomain + "api/Posts/GetPosts/" + feed + "/" + sorting);
        console.log(x.data);

        return x.data;

    }

    // Recherche les publications qui contiennent un texte demandé
    async function searchPosts(query: string, sorting: string) {

        const x = await raidite.get(apiDomain + "api/Posts/SearchPosts/" + query + "/" + sorting);
        console.log(x.data);

        return x.data

    }

    // Créer une publication
    async function postPost(hubId: string, formData: FormData) {

        const x = await raidite.post(apiDomain + "api/Posts/PostPost/" + hubId, formData);
        console.log(x.data);

        return x.data;

    }

    // Obtenir une publication et ses commentaires
    async function getFullPost(postId: number, sorting: string) {

        const x = await raidite.get(apiDomain + "api/Posts/GetFullPost/" + postId + "/" + sorting);
        console.log(x.data);

        return x.data;

    }


    async function savePost(postId : number){
        const x = await raidite.put(apiDomain + "api/Posts/SavePost/" + postId)
        console.log(x.data)
        return x.data
    }

    async function getSavedPosts(){
        const x = await raidite.get(apiDomain + "api/Posts/GetPostFavoris")
        console.log(x.data)
        return x.data

    }

    return { getFeedPosts, searchPosts, postPost, getFullPost, savePost, getSavedPosts };

}