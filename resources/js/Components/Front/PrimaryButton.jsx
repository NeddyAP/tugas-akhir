import { Link } from "@inertiajs/react";

export default function PrimaryButton({
    className = "",
    disabled,
    children,
    href,
    ...props
}) {
    const classes = `rounded-lg border-2 text-center text-md mr-2 inline-flex items-center justify-center border-transparent bg-teal-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-teal-700 focus:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-teal-900 ${
        disabled && "opacity-25"
    } ${className}`;

    return href ? (
        <Link href={href} className={classes}>
            {children}
        </Link>
    ) : (
        <button {...props} className={classes} disabled={disabled}>
            {children}
        </button>
    );
}
