"use client";

import PostThumbnail from "@/app/_components/post-thumbnail";
import { Post } from "@/app/_types/post";
import { Comment } from "@/app/_types/comment";
import { Hub } from "@/app/_types/hub";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Image } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useHub } from "@/app/_hooks/use-hub";
import { AccountContext, HubContext } from "../../layout";
import Link from "next/link";
import { apiDomain } from "@/next.config";

export default function FullHub() {

    // Hooks
    const params = useParams<{ id: string }>();
    const useHubAPI = useHub();

    // Contexts
    const { myHubs, setMyHubs } = useContext(HubContext);
    const { loggedIn, setLoggedIn, username, setUsername } = useContext(AccountContext);

    // États
    const [posts, setPosts] = useState<Post[]>([]);
    const [hub, setHub] = useState<Hub | null>(null);
    const [error, setError] = useState("");
    const [sorting, setSorting] = useState("new");
    const [imageBlob, setImageBlob] = useState<string | null>(null);

    // Demander les publications du hub lors du chargement
    useEffect(() => {

        const hubId = Number.parseInt(params.id);

        if (isNaN(hubId)) {
            setError("Le paramètre de route reçu n'est pas un nombre entier positif.");
            return;
        }

        fillPosts(hubId);

    }, []);
    // Obtenir les publications du hub et les infos de base du hub
    async function fillPosts(hubId: number) {
        try {
            const hub = await useHubAPI.getHub(hubId);
            setHub(hub);

            const posts = await useHubAPI.getHubPosts(hubId, "new");
            setPosts(posts);
        }
        catch (e) {
            setError("Il n'existe aucun hub avec cet id");
        }

    }

    // Redemander les publications au hub au serveur avec un tri différent
    async function sort() {

        const newSort = sorting == "new" ? "popular" : "new";
        setSorting(newSort);
        if (hub != null) {
            const posts = await useHubAPI.getHubPosts(hub.id, newSort);
            setPosts(posts);
        }


    }

    // S'abonner ou se désabonner du hub
    async function join() {

        if (hub == null) return;
        try {
            // Requête
            await useHubAPI.joinHub(hub.id);

            // Mise à jour de la page et du layout immédiat
            const hubs = [...myHubs];
            const joinedHub: Hub = hubs.find(h => h.id == hub.id);
            joinedHub.isJoined = !joinedHub.isJoined;
            setHub({ ...hub, isJoined: !hub.isJoined });
            setMyHubs(hubs);
        }
        catch (e) {
            console.log("Il faut être connecté pour joindre / quitter un forum");
        }


    }

    return (
        <div className="flex justify-center">
            {
                hub &&
                <div className="w-2xl py-4">
                    <div className="flex items-center gap-2">
                        <div>
                            <img src={hub.fileName ? apiDomain + "api/Hubs/HubImage/" + params.id : "/images/hubLogo.png"} alt={hub.name} className="rounded-full h-[64px] w-[64px] object-cover" />
                            
                        </div>
                        <div className="text-2xl font-bold">r/{hub.name}</div>
                        <div className="flex-1"></div>
                        <button className="border-gray-500 border-1 p-1 pl-2 pr-3 rounded-full bg-white cursor-pointer hover:border-gray-800">
                            <Link href={!loggedIn ? '/account/login' : ('/post/create/' + hub.id + "/" + hub.name)}>
                                <Plus className="inline align-text-bottom h-[20px]" />
                                Créer une publication
                            </Link>
                        </button>

                        {loggedIn &&
                            <button className="border-gray-500 border-1 p-1 px-3 rounded-full bg-white cursor-pointer hover:border-gray-800" onClick={join}>{hub.isJoined ? 'Se désabonner' : 'Rejoindre'}</button>
                        }

                    </div>
                    <div className="mt-5">
                        <Select defaultValue="new" onValueChange={sort} value={sorting}>
                            <SelectTrigger className="text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectGroup>
                                    <SelectItem value="popular" className="text-xs">Meilleurs</SelectItem>
                                    <SelectItem value="new" className="text-xs">Récents</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="text-red-500">{error}</div>
                    {posts.map(p =>
                        <PostThumbnail key={p.id} post={p} showUser={true} />
                    )}
                    {
                        posts.length == 0 &&
                        <div className="my-2 ml-2 text-sm">Il n'y a aucune publication dans ce forum pour le moment.</div>
                    }
                </div>
            }
        </div>
    );

}