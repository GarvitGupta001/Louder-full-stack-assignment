import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <h1 className="text-3xl font-bold absolute top-1/2 left-1/2 -translate-1/2">
                Louder Full Stack Assignment
            </h1>
        </>
    );
}

export default App;
