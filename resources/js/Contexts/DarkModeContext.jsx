import React, { createContext, useContext, useEffect, useState } from "react";

const DarkModeContext = createContext();

const useDarkMode = () => useContext(DarkModeContext);

export const DarkModeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const isDark = localStorage.getItem("darkMode") === "true";
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add("dark");
        }
    }, []);

    const toggleDarkMode = () => {
        setDarkMode((prev) => {
            const newValue = !prev;
            localStorage.setItem("darkMode", newValue);
            document.documentElement.classList.toggle("dark");
            return newValue;
        });
    };

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};

export { useDarkMode };
