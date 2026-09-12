"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ArrowBigDown, ArrowBigUp, CircleMinus, CirclePlus, Ellipsis, Flag, MessageCircle, SquarePen, Trash2, X } from "lucide-react";
import { Comment } from "../_types/comment";
import Reply from "./reply";
import { useContext, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useComment } from "../_hooks/use-comment";
import { AccountContext } from "../(home)/layout";
import { useRouter } from "next/navigation";
import { apiDomain } from "@/next.config";

export default function CommentBox(props: { comment: Comment, isSubComment: boolean, showSubComments: boolean }) {

    // Hooks
    const commentAPI = useComment();
    const router = useRouter();

    // Contexts
    const { loggedIn, setLoggedIn, username, setUsername } = useContext(AccountContext);

    // États
    const [comment, setComment] = useState<Comment>(props.comment); // Le commentaire affiché par ce composant
    const [toggleReply, setToggleReply] = useState<boolean>(false);
    const [editedText, setEditedText] = useState<string>("");
    const [toggleEdit, setToggleEdit] = useState<boolean>(false);
    const [toggleVisibility, setToggleVisibility] = useState<boolean>(true);
    const [feedback, setFeedback] = useState("");

    // Supprimer le commentaire
    async function deleteComment() {

        await commentAPI.deleteComment(comment.id);
        setComment(new Comment(0, "Commentaire supprimé.", new Date(), null, 0, 0, false, false, comment.subCommentTotal, comment.isAuthor, comment.subComments, []));

    }

    // Modifier le commentaire
    async function edit() {

        setComment(await commentAPI.editComment(comment.id, editedText));
        setToggleEdit(false);

    }

    async function report() {

        // Pas connecté ? Connecte-toi !
        if (!loggedIn) {
            router.push("/account/login");
            return;
        }

        setFeedback("");

        // Requête pour signaler appelée ici !
        await commentAPI.reportComment(comment.id);



        setFeedback("Signalement complété.");

    }

    // Supprimer une image, individuellement
    async function deletePicture(id: number) {

        setFeedback("");

        // Requête pour supprimer l'image appelée ici !
        commentAPI.deletePicture(id)



        // Code pour retirer immédiatement l'image de la page
        const newComment = { ...comment };
        newComment.pictureIds = newComment.pictureIds.filter(p => p != id);
        setComment(newComment);

    }

    // Posivote
    async function upvote() {

        // Pas connecté ? Connecte-toi !
        if (!loggedIn) {
            router.push("/account/login");
            return;
        }

        // Requête et mise à jour de la page
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
    async function downvote() {

        // Pas connecté ? Connecte-toi !
        if (!loggedIn) {
            router.push("/account/login");
            return;
        }

        // Requête et mise à jour de la page
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

        <div className="mt-5 flex gap-2 relative">

            {/* Ligne verticale à gauche du commentaire et avatar */}
            {
                props.isSubComment &&
                <div className="absolute w-[25px] h-[25px] rounded-bl-full border-l-1 border-b-1 border-gray-300 left-[-24px] top-[-8px] z-[-1]"></div>
            }


            <div className="text-sm justify-center flex-col flex">

                {/* Avatar de l'utilisateur */}
                {toggleVisibility &&
                    <Avatar>
                        <AvatarImage src={apiDomain + "api/Users/Avatar/" + username} alt="Avatar" />
                    </Avatar>
                }
                {toggleVisibility &&
                    <div className="flex-1 w-[10px] m-auto cursor-pointer flex justify-center hover:[&>*]:bg-gray-800" onClick={() => setToggleVisibility(!toggleVisibility)}>
                        <div className="w-[1px] h-full bg-gray-300"></div>
                    </div>
                }
                {
                    toggleVisibility ? <div className="m-auto cursor-pointer" onClick={() => setToggleVisibility(!toggleVisibility)}><CircleMinus className="h-[16px]" /></div>
                        : <div className="m-auto cursor-pointer" onClick={() => setToggleVisibility(!toggleVisibility)}><CirclePlus className="h-[16px]" /></div>
                }

            </div>

            <div className="flex-1">

                {/* Nom d'utilisateur et date de création */}
                <div className="flex items-center gap-2 text-sm py-1.5">
                    <div className="font-bold">{comment.username ?? 'supprimé'}{comment.username != null && ' •'}</div>
                    {comment.username != null &&
                        <div>{new Date(comment.date).toLocaleString("fr")}</div>
                    }
                </div>


                {toggleVisibility &&
                    <div>

                        {/* Texte et images du commentaire */}
                        {toggleEdit ?
                            <input type="text" value={editedText} onChange={(e) => setEditedText(e.target.value)} className="w-full p-2 text-sm border-1 border-gray-200 rounded-full bg-white px-3 outline-none" />
                            :
                            <div className="py-1">{comment.text}</div>
                        }
                        <div className="overflow-x-auto overflow-y-clip w-full whitespace-nowrap">
                          {comment.pictureIds.map(id =>
                           <a key={id} target="_blank" href={apiDomain+"api/Comments/GetPicture/full/" + id} className="relative inline-block">
                             <img key={id} src={apiDomain + "api/Comments/GetPicture/thumbnail/" + id} alt="Image" className="h-[100px] inline mr-1" />
                             {comment.isAuthor && 
                               <div className="text-white bg-black/50 p-1 absolute top-0 right-1 z-2" onClick={(e) => { e.preventDefault(); e.stopPropagation(); deletePicture(id); }}><X /></div>
                             }
                           </a>
                           )}

                         
                          

                        </div>

                        {comment.username != null &&
                            <div className="flex items-center gap-2 mt-2">

                                {/* Upvote et downvote */}
                                <div className="bg-gray-200 flex items-center rounded-full gap-1 text-sm">
                                    <ArrowBigUp onClick={upvote} className="h-[20px] hover:bg-gray-300 p-1 rounded-full box-content cursor-pointer" fill={comment.upvoted ? '#f54900' : 'none'} color={comment.upvoted ? '#f54900' : '#000'} />
                                    {comment.upvotes - comment.downvotes}
                                    <ArrowBigDown onClick={downvote} className="h-[20px] hover:bg-gray-300 p-1 rounded-full box-content cursor-pointer" fill={comment.downvoted ? '#f54900' : 'none'} color={comment.downvoted ? '#f54900' : '#000'} />
                                </div>

                                {/* Bouton pour afficher la boîte de rédaction pour répondre */}
                                <div className="bg-gray-200 flex items-center rounded-full p-1 pl-2 pr-3 gap-1 text-sm hover:bg-gray-300 cursor-pointer" onClick={() => setToggleReply(!toggleReply)}>
                                    <MessageCircle className="h-[18px] box-content" />
                                    Répondre
                                </div>

                                {/* Menu déroulant pour modifier / supprimer / signaler */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="p-1 rounded-full cursor-pointer bg-gray-200 hover:bg-gray-300 focus:outline-none"><Ellipsis className="h-[20px]" /></button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-fit" align="end">
                                        <DropdownMenuGroup className="[&>*]:cursor-pointer">

                                            {/* ↓ Les trois options sont ci-dessous ↓ */}

                                            {comment.isAuthor && <DropdownMenuItem onClick={() => setToggleEdit(!toggleEdit)}><SquarePen />Modifier</DropdownMenuItem>}
                                            <DropdownMenuItem onClick={deleteComment}><Trash2 />Supprimer</DropdownMenuItem>
                                           {!comment.isAuthor && <DropdownMenuItem onClick={report}><Flag />Signaler</DropdownMenuItem>}

                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {toggleEdit &&
                                    <button className="bg-orange-600 hover:bg-orange-700 text-white p-1 px-2 cursor-pointer text-sm rounded-full" onClick={edit}>Modifier</button>
                                }
                                {feedback != "" &&
                                    <div className="text-green-600 text-sm" onClick={() => setFeedback("")}>{feedback}</div>
                                }
                            </div>
                        }

                        {/* Sous-commentaires */}
                        {props.showSubComments && toggleReply && <Reply parentCommentId={comment.id} />}
                        {
                            comment.subComments && comment.subComments.map(c =>
                                <CommentBox key={c.id} comment={c} isSubComment={true} showSubComments={props.showSubComments} />
                            )
                        }
                    </div>
                }
            </div>
        </div>

    );

}