"use client";

import { FileSearchCorner, House, Plus, Star, TrendingUp } from "lucide-react";
import { Hub } from "../_types/hub";
import Link from "next/link";
import { useContext, useState } from "react";
import { AccountContext, HubContext } from "../(home)/layout";
import { useRouter } from "next/navigation";
import { useHub } from "../_hooks/use-hub";
import { apiDomain } from "@/next.config";

export default function LeftBar() {

    // Hooks
    const useHubAPI = useHub();
    const router = useRouter();

    // Contexts
    const { myHubs, setMyHubs } = useContext(HubContext);
    const { loggedIn, setLoggedIn, username, setUsername } = useContext(AccountContext);
    // Visiter un hub cliqué
    function goToHub(hub: Hub) {

        router.push("/hub/" + hub.id);

    }
    // S'abonner / se désabonner d'un hub
    async function join(e: any, id: number) {

        e.stopPropagation();
        try {
            await useHubAPI.joinHub(id);
            const hubs = [...myHubs];
            const joinedHub: Hub = hubs.find(h => h.id == id);
            joinedHub.isJoined = !joinedHub.isJoined;

            setMyHubs(hubs);
        }
        catch (e) {
            console.log("Il faut être connecté pour joindre / quitter un forum");
        }

    }

    return (
        <div className="hidden lg:flex w-3xs bg-white border-r-gray-300 border-r-1 h-full fixed overflow-y-auto p-3 py-5 flex-col [&>*]:cursor-pointer">

            {/* Liens pour aller vers l'accueil avec des contenus variés */}
            <Link href="/home"><div className="p-2 px-4 rounded-full hover:bg-gray-100"><House className="inline h-[20px] align-text-top mr-3" />Accueil</div></Link>
            <Link href="/popular"><div className="p-2 px-4 rounded-full hover:bg-gray-100"><TrendingUp className="inline h-[20px] align-text-top mr-3" />Populaire</div></Link>
            <Link href="/explore"><div className="p-2 px-4 rounded-full hover:bg-gray-100"><FileSearchCorner className="inline h-[20px] align-text-top mr-3" />Explorer</div></Link>
           
            {/* Créer un nouveau hub (si on est connecté !) */}
            <Link href={loggedIn ? "/hub/create" : '/account/login'}><div className="p-2 px-4 rounded-full hover:bg-gray-100"><Plus className="inline h-[20px] align-text-top mr-3" />Créer un forum</div></Link>
            {

                /* Affichage des hubs */
                myHubs.length > 0 &&
                <div>
                    <hr className="my-3 mx-2" />
                    <div className="p-2 px-4 text-gray-600">Forums</div>
                    {
                        myHubs.map((h: Hub) =>
                            
                            <div key={h.id} className="p-1 px-2 mx-1 rounded-full hover:bg-gray-100 text-sm flex items-center" onClick={() => goToHub(h)}>
                                <img src={h.fileName ? apiDomain + "api/Hubs/HubImage/" + h.id : "/images/hubLogo.png"} alt={h.name} className="h-[32px] w-[32px] object-cover rounded-full inline mr-2" />
                                r/{h.name}
                                {loggedIn &&
                                    <div className="flex-1 flex justify-end pr-2"><Star onClick={(e) => join(e, h.id)} className="h-[20px]" fill={h.isJoined ? '#000' : 'none'} /></div>
                                }
                            </div>
                        )
                    }
                </div>
            }
        </div>
    );

}