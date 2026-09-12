"use client";

import OrangeButton from "@/app/_components/_mini-components/orange-button";
import { useAccount } from "@/app/_hooks/use-account";
import useInputBinding from "@/app/_hooks/use-input-binding";
import { AccountContext } from "../../layout";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {

    // Hooks
    const account = useAccount();
    const router = useRouter();

    // Contexts
    const { loggedIn, setLoggedIn, username, setUsername } = useContext(AccountContext);

    // États
    const name = useInputBinding("");
    const pass = useInputBinding("");
    const [error, setError] = useState<string>("");

    // Tentative de connexion
    async function tryConnect() {

        setError("");

        try {
            // Requête de connexion
            const data = await account.login(name.value, pass.value);

            // Mise à jour du AccountContext
            setLoggedIn(true);
            setUsername(data.username);

            // Retour vers la page d'accueil une fois connecté
            router.push("/");
        }
        catch (e) {
            setError("Nom d'utilisateur ou mot de passe erroné.")
        }


    }

    return (
        <div className="flex justify-center">
            <div className="bg-white w-sm p-8 rounded-xl mt-5">
                <div className="text-xl font-bold text-center mb-3">Connexion</div>
                <div className="text-sm text-gray-600 text-center">Saisissez votre nom d'utilisateur et votre mot de passe.</div>
                <div className="mt-3 [&>*]:bg-gray-100 [&>*]:p-3 [&>*]:rounded-xl flex flex-col gap-3 [&>*]:focus:outline-none">
                    <input type="text" placeholder="Nom d'utilisateur" {...name} />
                    <input type="password" placeholder="Mot de passe" {...pass} />
                </div>
                <div className="text-red-500 pt-3">{error}</div>
                <hr className="mb-3 mt-1" />
                <div className="flex [&>*]:flex-1">
                    <OrangeButton fct={tryConnect}>Se connecter</OrangeButton>
                </div>
            </div>
        </div>
    );


}