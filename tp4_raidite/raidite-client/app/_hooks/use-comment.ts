import { apiDomain } from "@/next.config";
import { raidite } from "../raidite-interceptor";

export function useComment(){

    // Posivoter
    async function upvote(commentId : number){

        const x = await raidite.put(apiDomain + "api/Comments/UpvoteComment/" + commentId);
        console.log(x.data);

    }

    // Négavoter
    async function downvote(commentId : number){

        const x = await raidite.put(apiDomain + "api/Comments/DownvoteComment/" + commentId);
        console.log(x.data);

    }

    // Créer un commentaire
   async function postComment(parentCommentId: number, commentText: string, images: File[] = []){

    const formData = new FormData();
    formData.append("text", commentText);
    let i = 1;
    for (const image of images) {
        formData.append("image" + i, image);
        i++;
    } 

    const x = await raidite.post(
        apiDomain + "api/Comments/PostComment/" + parentCommentId,
        formData
    );
    console.log(x.data);
    return x.data;
}

    // Modifier un commentaire
    async function editComment(commentId : number, text : string){

        const x = await raidite.put(apiDomain + "api/Comments/PutComment/" + commentId, { text : text});
        console.log(x.data);

        return x.data;

    }

    // Supprimer un commentaire
    async function deleteComment(commentId : number){

        const x = await raidite.delete(apiDomain + "api/Comments/DeleteComment/" + commentId);
        console.log(x.data);

    }

    async function reportComment(commentId : number){
         const x = await raidite.put(apiDomain + "api/Comments/ReportComment/" + commentId);
         console.log(x.data);



    }

    async function deletePicture(pictureId : number){
        const x = await raidite.delete(apiDomain + "api/Comments/DeletePicture/" + pictureId);
        console.log(x.data);



    }

    async function getReportedComments() {
    const x = await raidite.get(apiDomain + "api/Comments/GetReportedComments");
    console.log(x.data);
    return x.data;
   }
    

    return { postComment, editComment, deleteComment, upvote, downvote, reportComment, deletePicture, getReportedComments };

}