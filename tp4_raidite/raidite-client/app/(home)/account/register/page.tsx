"use client";

import OrangeButton from "@/app/_components/_mini-components/orange-button";
import { useAccount } from "@/app/_hooks/use-account";
import useInputBinding from "@/app/_hooks/use-input-binding";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {

    // Hooks
    const account = useAccount();
    const router = useRouter();

    // États
    const name = useInputBinding("");
    const email = useInputBinding("");
    const pass = useInputBinding("");
    const passCon = useInputBinding("");
    const [error, setError] = useState<string>("");

    // Tentative d'inscription
    async function tryRegister() {

        setError("");

        try {
            // Requête
            await account.register(name.value, email.value, pass.value, passCon.value);

            // Inscription réussie ? Redirection vers la page de connexion
            router.push("/account/login");
        }
        catch (e) {
            setError("L'inscription a échoué."); // Peut arriver si le pseudo est déjà utilisé
        }

    }

    return (

        <div className="flex justify-center">
            <div className="bg-white w-sm p-8 rounded-xl mt-5">
                <div className="text-xl font-bold text-center mb-3">Inscription</div>
                <div className="text-sm text-gray-600 text-center">Choisissez un nom d'utilisateur, une adresse courriel et un mot de passe.</div>
                <div className="mt-3 [&>*]:bg-gray-100 [&>*]:p-3 [&>*]:rounded-xl flex flex-col gap-3 [&>*]:focus:outline-none">
                    <input type="text" placeholder="Nom d'utilisateur" {...name} />
                    <input type="text" placeholder="Adresse courriel" {...email} />
                    <input type="password" placeholder="Mot de passe" {...pass} />
                    <input type="password" placeholder="Confirmer le mot de passe" {...passCon} />
                </div>
                <div className="text-red-500 pt-3">{error}</div>
                <hr className="mb-3 mt-1" />
                <div className="flex [&>*]:flex-1">
                    <OrangeButton fct={tryRegister}>S'inscrire</OrangeButton>
                </div>
            </div>
        </div>

    );

}