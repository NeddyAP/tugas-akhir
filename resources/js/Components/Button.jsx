import { Link } from "@inertiajs/react";

const Button = ({ children, style, href }) => {
    return (
        <Link
            className={`px-6 py-2 rounded-md ${style ? style : 'text-white bg-teal-600 hover:bg-teal-700 transition-colors'}`}
            href={href}
        >
            {children}
        </Link>
    );
}

export default Button;