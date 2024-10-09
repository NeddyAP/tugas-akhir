import { Link } from "@inertiajs/react";

const Button = ({ children, style, ...props }) => {
    return (
        <Link
            className={`px-6 py-2 rounded-md ${style ? style : 'text-white bg-teal-600 hover:bg-teal-700 transition-colors'}`}
            {...props}
        >
            {children}
        </Link>
    );
}

export default Button;