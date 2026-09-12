"use client";

import OrangeButton from "@/app/_components/_mini-components/orange-button";
import { useHub } from "@/app/_hooks/use-hub";
import useInputBinding from "@/app/_hooks/use-input-binding";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { HubContext } from "../../layout";

export default function CreateHub() {

    // Hooks
    const hubAPI = useHub();
    const router = useRouter();
    const fileInput = useRef<HTMLInputElement>(null);
    // Cpmtexts
    const hubContext = useContext(HubContext);
    const [file, setFile] = useState(null);
    // États
    const [error, setError] = useState("");
    const title = useInputBinding("");
    
    const [imageBlob, setImageBlob] = useState<string | null>(null);
    function previewImage(e: any)
    {
        if(e.target.files && e.target.files[0])
        {
            if(imageBlob)
            {
                URL.revokeObjectURL(imageBlob)
            }
            setImageBlob(URL.createObjectURL(e.target.files[0]))
        }
        else{
            setImageBlob(null)
        }
    }

    async function tryCreateHub() {

        // Titre trop court ou long ? Erreur
        if (title.value.length == 0 || title.value.length > 15) {
            setError("La taille de ce titre n'est pas valdie.");
            return;
        }

        setError("");

        try {
            if(fileInput.current == null)
            {
                console.log("Référence vide ou élément HTML non visible dans la page")
                return
            }
            if(fileInput.current.files == null){
                console.log("L'input est vide");
                return;
            }
            const formData = new FormData();
            const file = fileInput.current.files[0];
            formData.append("image", file)
            formData.append("titre", title.value)
            // Requête
            const newHub = await hubAPI.postHub(formData);

            // Mise à jour du layout avec le nouveau hub
            hubContext.setMyHubs([newHub, ...hubContext.myHubs]);

            // On va visiter le nouveau hub
            router.push("/hub/" + newHub.id);
        }
        catch (e) {
            setError("Une erreur est survenue. Un forum avec ce nom existe peut-être déjà ?");
        }

    }

    return (

        <div className="flex justify-center">
            <div className="block bg-white rounded-xl w-lg p-4 mt-5">
                
                <div className="text-xl font-bold">Nouveau forum</div>
                <div className="text-sm text-gray-600 mt-1 mb-4">Choisir un titre <s>et une icône</s> pour ton forum.</div>
                <input className="bg-gray-100 p-3 px-4 rounded-2xl mb-0 w-full outline-none" type="text" placeholder="Nom du forum" {...title} />
                <div className="flex justify-between mb-2">
                    <div className="text-sm text-red-600 mb-2">{error}</div>
                    <div className={'text-sm pr-3 ' + (title.value.length <= 15 ? 'text-gray-600' : 'text-red-600')}>{title.value.length}/15</div>
                </div>
                {/*Changer quand on fini GetPicture*/}
                    {
                        imageBlob != null ? <img src={imageBlob} className="rounded-lg mb-2 m-auto h-[200px]" alt="" /> :
                        <img src="/images/avatarPlaceholder.png" alt="Icône choisie" className="rounded-lg mb-2 m-auto h-[200px]" />
                    }
                    <input ref={fileInput} onChange={previewImage} className="bg-gray-100 p-3 px-4 rounded-2xl mb-3 w-full text-gray-500" type="file" accept="images/*" />
                <div className="[&>*]:w-full">
                    <OrangeButton fct={tryCreateHub}>Créer le forum</OrangeButton>
                </div>

            </div>
        </div>

    );

}