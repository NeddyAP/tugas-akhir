import { memo } from "react";

const TabButton = memo(
    ({ active, onClick, children, variant = "underline" }) => {
        const styles = {
            base: "whitespace-nowrap py-2 px-6 font-medium text-sm",
            underline: {
                active: "border-teal-500 text-teal-600",
                inactive:
                    "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-white",
            },
            solid: {
                active: "text-teal-600 bg-white border-t border-x border-gray-200",
                inactive: "text-gray-500 hover:text-gray-700 dark:text-white",
            },
        };

        const variantClass =
            variant === "underline" ? "border-b-2" : "rounded-t-lg";
        const activeClass = styles[variant][active ? "active" : "inactive"];

        return (
            <button
                type="button"
                onClick={onClick}
                className={`${styles.base} ${variantClass} ${activeClass}`}
            >
                {children}
            </button>
        );
    }
);

TabButton.displayName = "TabButton";

export default TabButton;
