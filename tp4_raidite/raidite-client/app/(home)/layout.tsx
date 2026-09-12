"use client";

import { Search } from "lucide-react";
import SearchBar from "../_components/_mini-components/search-bar";
import OrangeButton from "../_components/_mini-components/orange-button";
import Link from "next/link";
import AccountMenu from "../_components/_mini-components/account-menu";
import LeftBar from "../_components/left-bar";
import { createContext, useEffect, useState } from "react";
import { Hub } from "../_types/hub";
import { useHub } from "../_hooks/use-hub";

// Context pour les infos de l'utilisateur (pseudo et est-il connecté ?)
export const AccountContext = createContext<any>(null);

// Context pour la liste de hubs de l'utilisateur 
export const HubContext = createContext<any>(null);

export default function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {

    // Hooks
    const hubAPI = useHub();

    // États pour le AccountContext
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    
    // État pour le HubContext
    const [myHubs, setMyHubs] = useState<Hub[]>([]);

    // Remplir le AccountText si la page a été réactualisée et obtenir les hubs à afficher à gauche
    useEffect(() => {

        if(sessionStorage.getItem("token")) setLoggedIn(true);
        const jsonUsername = sessionStorage.getItem("username");
        if(jsonUsername) setUsername(jsonUsername);
        fillHubs();

    }, []);

    // Obtenir les hubs à afficher à gauche
    async function fillHubs(){

        setMyHubs(await hubAPI.getUserHubs());

    }

    return (
        <div>

            {/* Providers pour les deux contexts : ils sont acceptables dans TOUS les composants chargés par routage ! */}
            <AccountContext.Provider value={{ loggedIn, setLoggedIn, username, setUsername }}>
                <HubContext.Provider value={{ myHubs, setMyHubs }}>

                    <header className="w-full bg-white border-b-1 border-b-gray-300 flex justify-between fixed z-3">
                        <Link href="/home"><div className="text-orange-600 font-bold text-3xl p-3 tracking-tighter cursor-pointer">raidite</div></Link>
                        <div className="m-2 px-2 border-orange-600 border-1 rounded-full flex items-center hover:bg-gray-50 has-focus:bg-gray-50">
                            <span><Search className="h-[20px]" /></span>
                            <SearchBar />
                        </div>
                        <div className="flex items-center pr-2 gap-2">
                            {!loggedIn && <Link href="/account/login"><OrangeButton fct={null}>Connexion</OrangeButton></Link>}
                            <AccountMenu />
                        </div>
                    </header>
                    
                    <main className="pt-[61px]">
                        <LeftBar />
                        <div className="ml-0 lg:ml-[250px]">
                            {children}
                        </div>
                    </main>

                </HubContext.Provider>
            </AccountContext.Provider>
        </div>
    );


}