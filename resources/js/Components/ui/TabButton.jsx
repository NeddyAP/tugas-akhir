import { memo } from 'react';

const TabButton = memo(({ 
    active, 
    onClick, 
    children,
    variant = 'underline' // 'underline' | 'solid'
}) => {
    const baseStyles = "whitespace-nowrap py-2 px-6 font-medium text-sm";
    
    const variants = {
        underline: `${baseStyles} border-b-2 ${
            active
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-white'
        }`,
        solid: `${baseStyles} ${
            active
                ? 'text-teal-600 bg-white border-t border-x border-gray-200'
                : 'text-gray-500 hover:text-gray-700 dark:text-white'
        } rounded-t-lg`
    };

    return (
        <button
            onClick={onClick}
            className={variants[variant]}
        >
            {children}
        </button>
    );
});

TabButton.displayName = 'TabButton';

export default TabButton;
