import { Link } from "@inertiajs/react";

export default function SecondaryButton({
    type = "button",
    className = "",
    disabled,
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            type={type}
            className={
                `rounded-lg border-2 text-center text-md mr-2 inline-flex items-center justify-center border-transparent bg-gray-300 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-black transition duration-150 ease-in-out hover:bg-gray-200 focus:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-500 ${
                    disabled && "opacity-25"
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </Link>
    );
}
