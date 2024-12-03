import { useDarkMode } from "@/Contexts/DarkModeContext";
import { Moon, Sun } from "lucide-react";

const DarkModeToggle = () => {
    const { darkMode, toggleDarkMode } = useDarkMode();

    return (
        <button
            onClick={toggleDarkMode}
            className="p-2 mr-4 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
            {darkMode ? (
                <Sun className="w-5 h-5 text-white" />
            ) : (
                <Moon className="w-5 h-5 text-blank" />
            )}
        </button>
    );
};

export default DarkModeToggle;