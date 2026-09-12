"use client";

import { AccountContext } from "@/app/(home)/layout";
import { useComment } from "@/app/_hooks/use-comment";
import { Comment } from "@/app/_types/comment";
import { ArrowBigDown, ArrowBigUp, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

export default function CommentStats(props: { comment: Comment }) {

    // Hooks
    const commentAPI = useComment();
    const router = useRouter();

    // Contexts
    const { loggedIn, setLoggedIn, username, setUsername } = useContext(AccountContext);

    // États
    const [comment, setComment] = useState<Comment>(props.comment);

    // Posivote
    async function upvote(e: any) {

        e.stopPropagation(); // Éviter d'appeler un autre onClick dans un élément parent

        // Pas connecté ? Connecte-toi !
        if (!loggedIn) {
            router.push("/account/login");
            return;
        }

        // Mise à jour immédiate de la page
        await commentAPI.upvote(comment.id);
        setComment({
            ...comment,
            upvoted: !comment.upvoted,
            downvoted: false,
            upvotes: comment.upvotes + (comment.upvoted ? -1 : 1),
            downvotes: comment.downvotes + (comment.downvoted ? -1 : 0)
        });

    }

    // Négavote
    async function downvote(e: any) {

        e.stopPropagation(); // Éviter d'appeler un autre onClick dans un élément parent

        // Pas connecté ? Connecte-toi !
        if (!loggedIn) {
            router.push("/account/login");
            return;
        }

        // Mise à jour immédiate de la page
        await commentAPI.downvote(comment.id);
        setComment({
            ...comment,
            upvoted: false,
            downvoted: !comment.downvoted,
            upvotes: comment.upvotes + (comment.upvoted ? -1 : 0),
            downvotes: comment.downvotes + (comment.downvoted ? -1 : 1)
        });

    }

    return (
        <div className="flex items-center gap-2">
            <div className="bg-gray-200 flex items-center rounded-full gap-1 text-sm mt-2">
                <ArrowBigUp onClick={(e) => upvote(e)} className="h-[20px] hover:bg-gray-300 p-1 rounded-full box-content cursor-pointer" fill={comment.upvoted ? '#f54900' : 'none'} color={comment.upvoted ? '#f54900' : '#000'} />
                {comment.upvotes - comment.downvotes}
                <ArrowBigDown onClick={(e) => downvote(e)} className="h-[20px] hover:bg-gray-300 p-1 rounded-full box-content cursor-pointer" fill={comment.downvoted ? '#f54900' : 'none'} color={comment.downvoted ? '#f54900' : '#000'} />
            </div>
            <div className="bg-gray-200 flex items-center rounded-full p-1 pl-2 pr-3 gap-1 text-sm mt-2 hover:bg-gray-300 cursor-pointer">
                <MessageCircle className="h-[18px] box-content" />
                {comment.subCommentTotal}
            </div>
        </div>
    );

}