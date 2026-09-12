"use client";

import CommentStats from "@/app/_components/_mini-components/comment-stats";
import { Post } from "../../../_types/post";
import { Comment } from "@/app/_types/comment";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowLeft, Ellipsis, Flag, Save, SaveOff, SquarePen, Trash2, X } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
import Reply from "@/app/_components/reply";
import CommentBox from "@/app/_components/comment-box";
import { usePost } from "@/app/_hooks/use-post";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiDomain } from "@/next.config";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useComment } from "@/app/_hooks/use-comment";
import { AccountContext } from "../../layout";
import { Hub } from "@/app/_types/hub";
import { useHub } from "@/app/_hooks/use-hub";

export const PostContext = createContext<any>(null);

export default function FullPost() {

    // Hooks
    const params = useParams<{ id: string }>();
    const postAPI = usePost();
    const router = useRouter();
    const commentAPI = useComment();
    const [hub, setHub] = useState<Hub | null>(null);
    const useHubApi = useHub();
    // Contexts
    const { loggedIn, setLoggedIn, username, setUsername } = useContext(AccountContext);

    // États
    const [error, setError] = useState("");
    const [feedback, setFeedback] = useState("");
    const [sorting, setSorting] = useState("new");
    const [editedText, setEditedText] = useState("");
    const [toggleEdit, setToggleEdit] = useState<boolean>(false);
    const [post, setPost] = useState<Post | null>(null); // La publication à afficher

    // Obtenir la publication en entier (inclut ses commentaires) au chargement de la page
    useEffect(() => {

        const postId = Number.parseInt(params.id);

        if (isNaN(postId)) {
            setError("Le paramètre de route reçu n'est pas un nombre entier positif.");
            return;
        }

        fillPost(postId);

    }, []);

    // Obtenir la publication
    async function fillPost(postId: number) {

        try {
            const post = await postAPI.getFullPost(postId, "new");
            setPost(post);
            setEditedText(post.mainComment!.text);
            const hub = await useHubApi.getHub(post.hubId);
            setHub(hub);
        }
        catch (e) {
            setError("Aucune publication trouvée.");
        }

    }

    // Trier les commentaires différemment
    function sortComments() {

        if (post == null || post.mainComment == null || post.mainComment.subComments == null) return;

        setSorting(sorting == "new" ? "popular" : "new");
        const sortedPost: Post = { ...post };
        sortedPost.mainComment!.subComments = sortedPost.mainComment?.subComments.sort((b, a) => sorting == "new" ? ((a.upvotes - a.downvotes) - (b.upvotes - b.downvotes)) : (new Date(a.date).getTime() - new Date(b.date).getTime()))!;
        setPost(sortedPost);

    }

    // Supprimer une image du commentaire principal de la publication, individuellement
    async function deletePicture(id: number) {

        // Appeler la requête à partir d'ici
        await commentAPI.deletePicture(id);

        // Mise à jour immédiate de la page
        const newPost = { ...post! };
         newPost.mainComment!.pictureIds = newPost.mainComment!.pictureIds.filter(p => p != id);
        setPost(newPost);

    }

    // Supprimer le commentaire principal de la publication
    async function deletePost() {

        // Appeler la requête à partir d'ici
        commentAPI.deleteComment(post!.mainComment!.id);

        // Il n'y avait aucun commentaire ? On quitte la page car le post va se faire supprimer.
        if (post!.mainComment!.subCommentTotal == 0) {
            router.push("/hub/" + post?.hubId);
        }

        // Il y avait des commentaires ? On met à jour l'affichage de la page
        else {
            setPost({
                ...post!, title: "Publication supprimée", mainComment:
                    new Comment(post!.mainComment!.id, "", new Date(), null, 0, 0, false, false, post!.mainComment!.subCommentTotal, post!.mainComment!.isAuthor, post!.mainComment!.subComments, [])
            });
        }
       

    }

    // Modifier le texte du commentaire principal de la publication
    async function edit() {

        // Requête
        await commentAPI.editComment(post!.mainComment!.id, editedText);

        // Mise à jour immédiate de la page
        const editedPost: Post = { ...post!, mainComment: { ...post!.mainComment!, text: editedText } };
        setPost(editedPost);
        setToggleEdit(false);

    }

    async function report() {

        setFeedback("");

        // Appeler la requête à partir d'ici



        setFeedback("Signalement complété");

    }

    async function save(postId: number) {

        setFeedback("");

        // Appeler la requête à partir d'Ici
        if(loggedIn)
        {
            const newPost = await postAPI.savePost(postId);
            console.log(newPost);
            router.push("/post/" + post?.id);
            setPost(newPost)
            // Trouver quelque chose pour remplacer le false avec une condition valide
            setFeedback(post?.isSaved ? "Publication retirée des sauvegardes." : "Publication sauvegardée.");
        }
        else
        {
            router.push("/account/login")
        }
    }

    return (
        <div className="flex justify-center">
            <div className="w-[36px] mt-4.5">
                <Link href={post ? '/hub/' + post.hubId : '/'}>
                    <ArrowLeft className="bg-gray-200 hover:bg-gray-300 h-[36px] w-[36px] p-2 rounded-full cursor-pointer" />
                </Link>
            </div>
            {error != "" &&
                <div className="w-2xl p-2 mt-4 text-red-500">{error}</div>
            }
            {
                post && post.mainComment &&
                <div className="w-2xl p-2 mt-2">
                    <div className="flex mb-1 items-center">

                        {/* Icône du forum, nom du forum et nom d'utilisateur de l'auteur */}
                        <img src={hub?.fileName ? apiDomain + "api/Hubs/HubImage/" + post.hubId : "/images/hubLogo.png"} alt={post.hubName} className="h-[36px] w-[36px] object-cover rounded-full inline mr-2" />
                        <div>
                            <div className="text-sm font-bold">
                                r/{post.hubName} •
                                <span className="text-xs font-normal text-gray-500 ml-1">{new Date(post.mainComment.date).toLocaleString("fr")}</span>
                            </div>
                            <div className="text-sm">{post.mainComment.username}</div>
                        </div>

                        <div className="flex-1"></div>

                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-2 rounded-full cursor-pointer hover:bg-gray-200 focus:outline-none"><Ellipsis /></button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-fit" align="end">

                                    {/* Menu déroulant pour modifier, supprimer, signaler et sauvegarder la publication */}
                                    <DropdownMenuGroup className="[&>*]:cursor-pointer">
                                        {post.mainComment.isAuthor && <DropdownMenuItem onClick={() => setToggleEdit(!toggleEdit)}><SquarePen />Modifier</DropdownMenuItem>}
                                        {
                                            post.mainComment.isAuthor && <DropdownMenuItem onClick={deletePost}><Trash2 />Supprimer</DropdownMenuItem>
                                        }
                                        
                                        <DropdownMenuItem onClick={report}><Flag />Signaler</DropdownMenuItem>
                                        {
                                            post.isSaved ? <DropdownMenuItem onClick={() => save(post.id)}><SaveOff /> Retirer</DropdownMenuItem>:
                                            <DropdownMenuItem onClick={() => save(post.id)}><Save /> Sauvegarder</DropdownMenuItem>
                                        }
                                    </DropdownMenuGroup>

                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div className="text-2xl font-bold">{post.title}</div>
                    {
                        toggleEdit ?
                            <textarea rows={4} value={editedText} onChange={(e) => setEditedText(e.target.value)} className="border-gray-300 border-1 p-2 rounded-xl w-full resize-none outline-none"></textarea>
                            : <div>{post.mainComment.text}</div>
                    }
                    {
                        toggleEdit &&
                        <button className="bg-orange-600 hover:bg-orange-700 text-white rounded-full text-sm p-2 cursor-pointer mb-2" onClick={edit}>Modifier</button>
                    }
                    <div className="overflow-x-auto overflow-y-clip w-full whitespace-nowrap mt-1">
                        {
                            post.mainComment.pictureIds.map(i =>
                                <a key={i} target="_blank" href={`${apiDomain}api/Comments/GetPicture/full/${i}`} className="relative inline-block">
                                <img key = {i} src={`${apiDomain}api/Comments/GetPicture/thumbnail/${i}`} alt="Image" className="h-[100px] inline mr-1" />
                                  {post.mainComment!.isAuthor &&
                                    <div className="text-white bg-black/50 p-1 absolute top-0 right-1 z-2" onClick={(e) => {e.preventDefault(); e.stopPropagation();deletePicture(i);}}><X /></div>
                                    }
                                </a>
                            )
                        }   
                    </div>

                    {feedback != "" &&
                        <div className="w-2xl mt-4 text-green-600">{feedback}</div>
                    }
                    <CommentStats comment={post.mainComment} />

                    <PostContext.Provider value={{ post, setPost }}>
                        <Reply parentCommentId={post.mainComment.id} />
                        <div className="mt-5">
                            <Select defaultValue="new" onValueChange={sortComments} value={sorting}>
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

                        {/* Affichage des commentaires */}
                        {
                            post.mainComment.subComments &&
                            post.mainComment.subComments.map(c =>
                                <CommentBox key={c.id} comment={c} isSubComment={false} showSubComments={true} />
                            )
                        }
                    </PostContext.Provider>
                </div>
            }

            <div className="w-[50px]"></div>
        </div>
    );

}