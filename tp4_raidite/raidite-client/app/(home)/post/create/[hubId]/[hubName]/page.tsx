"use client";

import OrangeButton from "@/app/_components/_mini-components/orange-button";
import { useHub } from "@/app/_hooks/use-hub";
import useInputBinding from "@/app/_hooks/use-input-binding";
import { usePost } from "@/app/_hooks/use-post";
import { Hub } from "@/app/_types/hub";
import { Post } from "@/app/_types/post";
import { apiDomain } from "@/next.config";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function CreatePost() {

    // Hooks
    const params = useParams<{ hubId: string, hubName : string }>();
    const router = useRouter();
    const postAPI = usePost();
    const useHubAPI = useHub();
    // États
    const title = useInputBinding("");
    const text = useInputBinding("");
    const [error, setError] = useState("");
    const fileInput = useRef<HTMLInputElement>(null);
    async function tryPostPost() {

        setError("");

        // Titre trop grand, titre vide ou texte vide ? Erreur !
        if (title.value.length > 200 || title.value.length == 0 || text.value.length == 0) {
            setError("Veuillez fournir un titre et un texte de tailles appropriées.");
            return;
        }
        //Créer le FormData
        if(fileInput.current == null){
            console.log("Référence vide ou élément HTML non visible")
            return;
        }
        if(fileInput.current.files == null){
            console.log("Aucun fichier")
            return;
        }

        const formData = new FormData();
        let i= 1;
        for(let f of fileInput.current.files)
        {
            formData.append("images" + i, f);
            i++;
        }
        //Ajout du titre et du texte dans le FormData
        formData.append("title", title.value);
        formData.append("text", text.value);
        try {
            // Requête
            const newPost: Post = await postAPI.postPost(params.hubId, formData);

            // Publication créée ? On la visite
            router.push("/post/" + newPost.id);
        }
        catch (e) {
            setError("Veuillez fournir un titre et un texte de taille appropriée.");
        }

    }
    async function getHub()
    {
        const x = await useHubAPI.getHub(Number.parseInt(params.hubId));
        setHub(x)
    }
    const [hub, setHub] = useState<Hub |null>(null);
    useEffect(() => {
        getHub()
    }, []); 
    return (

        <div className="flex justify-center">
            <div className="w-xl mt-4 bg-white p-5 rounded-3xl">
                <div className="text-xl font-bold">Créer une publication</div>

                {/* Nom et icône du forum */}
                <Link href={'/hub/' + params.hubId}>
                    <div className="flex mt-2 mb-4 items-center">
                        <img src={hub?.fileName ? apiDomain + "api/Hubs/HubImage/" + hub.id : "/images/hubLogo.png"} alt="Hub" className="h-[28px] rounded-full inline mr-2" />
                        <div>r/{params.hubName}</div>
                    </div>
                </Link>

                {/* Forumaire pour créer une publication */}
                <input type="text" placeholder="Titre" className="border-gray-300 border-1 p-2 rounded-xl w-full outline-none" {...title} />
                <div className={'text-right text-sm pr-3 mb-3 ' + (title.value.length <= 200 ? 'text-gray-600' : 'text-red-600')}>{title.value.length}/200</div>
                
                <textarea {...text} rows={4} placeholder="Corps du texte" className="border-gray-300 border-1 p-2 rounded-xl w-full resize-none outline-none"></textarea>
                
                <input type="file" ref={fileInput} multiple accept="images/*" className="border-gray-300 text-gray-500 border-1 p-2 rounded-xl w-full mt-3 cursor-pointer" />
                
                <div className="text-red-500 text-sm mt-2">{error}</div>
                <div className="flex justify-end mt-3">
                    <OrangeButton fct={tryPostPost}>Publier</OrangeButton>
                </div>
            </div>
        </div>

    );

}