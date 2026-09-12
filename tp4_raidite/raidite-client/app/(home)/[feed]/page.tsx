"use client";

import PostThumbnail from "@/app/_components/post-thumbnail";
import { Post } from "@/app/_types/post";
import { Comment } from "@/app/_types/comment";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HubContext } from "../layout";
import { useHub } from "@/app/_hooks/use-hub";
import { usePost } from "@/app/_hooks/use-post";

export default function Home() {

  // Hooks
  const params = useParams<{ feed: string }>();
  const hubAPI = useHub();
  const postAPI = usePost();

  // Contexts
  const { myHubs, setMyHubs } = useContext(HubContext);

  // États
  const [sorting, setSorting] = useState(params.feed == "popular" ? "popular" : "new");
  const [posts, setPosts] = useState<Post[]>([]);

  // Obtenir les publications et les hubs à afficher dans le layout et la page d'accueil
  useEffect(() => {

    fillHubsAndPosts();

  }, []);

  // Obtention des hubs et publications
  async function fillHubsAndPosts() {
    setMyHubs(await hubAPI.getUserHubs());

    if (['home', 'popular', 'explore'].includes(decodeURIComponent(params.feed))) {
      setPosts(await postAPI.getFeedPosts(decodeURIComponent(params.feed), params.feed == "popular" ? "popular" : "new"));
    }
    else {
      setPosts(await postAPI.searchPosts(decodeURIComponent(params.feed), "new"));
    }
  }

  // Requête pour obtenir à nouveau les publications, triées différemment
  async function sort() {

    const newSort = sorting == "new" ? "popular" : "new";
    setSorting(newSort);

    if (['home', 'popular', 'explore'].includes(decodeURIComponent(params.feed))) {
      setPosts(await postAPI.getFeedPosts(decodeURIComponent(params.feed), newSort));
    }
    else {
      setPosts(await postAPI.searchPosts(decodeURIComponent(params.feed), newSort));
    }

  }


  return (
    <div className="flex justify-center">
      <div className="w-2xl mt-3 p-3 rounded-xl">
        <div>
          <Select defaultValue={params.feed == "popular" ? "popular" : "new"} onValueChange={sort}>
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
        {posts.map(p =>
          <PostThumbnail key={p.id} post={p} showUser={false} />
        )}
      </div>
    </div>
  );
}
