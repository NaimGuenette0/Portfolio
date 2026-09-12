"use client";

export default function OrangeButton(props : { children: React.ReactNode, fct : any }){

    return(
        <button className="bg-orange-600 hover:bg-orange-700 p-2 px-4 text-white rounded-full font-bold cursor-pointer" onClick={props.fct}>{props.children}</button>
    );

}