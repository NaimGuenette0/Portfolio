"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Post } from "../_types/post";
import CommentStats from "./_mini-components/comment-stats";
import { useRouter } from "next/navigation";
import { apiDomain } from "@/next.config";
import { useEffect, useState } from "react";
import { Hub } from "../_types/hub";
import { useHub } from "../_hooks/use-hub";

export default function PostThumbnail(props: { post: Post, showUser: boolean }) {

    // Hooks
    const router = useRouter();

    // Simple constante pour raccourcir l'accès à props.post
    const post = props.post;
     const useHubAPI = useHub();
    // Visiter la publication cliquée
    function visitPost() {

        router.push("/post/" + post.id);

    }
    async function getHub()
    {
        const x = await useHubAPI.getHub(post.hubId);
        setHub(x)
    }
    const [hub, setHub] = useState<Hub |null>(null);
    useEffect(() => {
        getHub()
    }, []); 
    return (

        <div>
            <hr className="my-2" />
            {post && post.mainComment &&
                <div className="px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer flex " onClick={visitPost}>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm">

                            {/* Affichage de l'avatar de l'auteur OU de l'icône du forum, selon la situation */}
                            {props.showUser ?
                                <Avatar size="sm">
                                    <AvatarImage src="/images/avatar.png" alt="Placeholder" />
                                </Avatar> :
                                <img src={hub?.fileName != null ? apiDomain + "api/Hubs/HubImage/" + hub.id : "/images/hubLogo.png"} alt={post.hubName} className="h-[24px] w-[24px] object-cover rounded-full inline" />
                            }
                            
                            <div className="font-bold">{props.showUser ? ('u/' + post.mainComment.username) : ('r/' + post.hubName)} •</div>
                            <div>{new Date(post.mainComment.date).toLocaleString("fr")}</div>
                        </div>
                        <div className="text-xl font-bold my-2">{post.title}</div>
                        <div className="text-sm">{post.mainComment.text.substring(0, Math.min(post.mainComment.text.length, 200))}</div>
                        <CommentStats comment={post.mainComment} />
                    </div>
                    {
                        <div className="h-[120px]">
                            {
                                post.mainComment.pictureIds.length != 0 && 
                                <img src={apiDomain + "api/Comments/GetPicture/thumbnail/" + post.mainComment.pictureIds[0]} className="h-full max-w-[150px] object-cover rounded-lg" alt="Miniature" />
                            }
                            
                        </div>

                    }
                </div>
            }

        </div>

    );

}