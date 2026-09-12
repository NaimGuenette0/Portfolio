"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar(){

    // Hooks
    const router = useRouter();

    // États
    const [query, setQuery] = useState<string>("");

    function search(){

        if(query == "") return;
        router.push("/" + encodeURIComponent(query));

    }

    return(
        <form onSubmit={(e) => { e.preventDefault(); search(); }}>
            <input className="w-md px-3 b-none outline-none" placeholder="Trouve tout et n'importe quoi" type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
        </form>
    );

}