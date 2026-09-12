import { useState } from "react";

// Hook utilisé pour le two-way binding à de nombreux endroits dans le projet
export default function useInputBinding(startValue : string){

    const [value, setValue] = useState(startValue);

    return {value : value, onChange : (e : any) => setValue(e.target.value)};

}