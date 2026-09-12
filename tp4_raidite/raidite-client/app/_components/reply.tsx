"use client";

import { Image } from "lucide-react";
import { useContext, useRef, useState } from "react";
import { useComment } from "../_hooks/use-comment";
import { PostContext } from "../(home)/post/[id]/page";
import { Comment } from "../_types/comment";
import { Post } from "../_types/post";
import { useRouter } from "next/navigation";
import { AccountContext } from "../(home)/layout";

export default function Reply(props: { parentCommentId: number }) {

    // Hooks
    const commentAPI = useComment();
    const router = useRouter();

    // Contexts
    const { post, setPost } = useContext(PostContext);
    const { loggedIn, setLoggedIn, username, setUsername } = useContext(AccountContext);

    // États
    const [error, setError] = useState("");
    const [toggleFile, setToggleFile] = useState<boolean>(false);
    const [text, setText] = useState("");
   const myFileInput = useRef<HTMLInputElement>(null);
    // On tente de créer le commentaire et de l'ajouter dans la page immédiatement.
    async function tryPostComment() {

        setError("");
        
        // Pas connecté ? Va te connecter !
        if(!loggedIn){
            router.push("/account/login");
            return;
        }

        // Rien écrit ? Écris quelque chose.
        if (text.length == 0) {
            setError("Veuillez fournir un texte de taille appropriée.");
            return;
        }

        try {
            // Lancement de la requête
            const newComment: Comment = await commentAPI.postComment(props.parentCommentId, text, Array.from(myFileInput.current?.files ?? []));

            // Code pour mettre à jour la page automatiquement (ajouter le commentaire dans la page)
            const editedPost : Post = {...post};
            addToParentComment(editedPost, editedPost.mainComment!, newComment);

            setText("");
        }
        catch (e) {
            setError("Veuillez fournir un texte de taille appropriée.");
        }

    }

    // Code pour la mise à jour de la page (ajouter le commentaire dans la page)
    function addToParentComment(post : Post, comment : Comment, newComment : Comment){

        if(comment.id == props.parentCommentId){
            comment.subComments.push(newComment);
            comment.subCommentTotal += 1;
            setPost(post);
            return;
        }
        for(let c of comment.subComments){
            addToParentComment(post, c, newComment);
        }

    }
  


    return (

        <div className="border-1 border-gray-400 my-2 p-2 rounded-2xl">

            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Rejoindre la conversation" className="resize-y w-full outline-none p-2 min-h-[40px] text-sm"></textarea>
            
            <div className="flex justify-end mt-1 [&>*]:p-1 [&>*]:px-2 [&>*]:text-xs [&>*]:cursor-pointer gap-1">
              
                <button className="bg-gray-200 hover:bg-gray-300 rounded-full" onClick={() => { setToggleFile(!toggleFile) }}><Image className="p-0.5" /></button>
                
                {toggleFile &&
                    <div className="bg-gray-200 hover:bg-gray-300 rounded-full flex items-center">
                        <input ref={myFileInput} type="file" accept="images/*" multiple />
                    </div>
                }

                <button className="bg-orange-600 hover:bg-orange-700 text-white rounded-full font-bold" onClick={tryPostComment}>Commentaire</button>
            </div>

            { error != "" &&
                <div className="my-2 text-red-500">{error}</div>
            }

        </div>

    );

}