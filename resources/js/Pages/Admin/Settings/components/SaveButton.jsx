import React from "react";
import PropTypes from "prop-types";

const SaveButton = React.memo(({ processing }) => (
    <button
        type="submit"
        disabled={processing}
        className={`
            w-full sm:w-auto px-4 py-2 rounded-lg text-white font-medium
            ${
                processing
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            }
            transition-colors duration-200
        `}
    >
        {processing ? (
            <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
                Saving...
            </span>
        ) : (
            "Save Settings"
        )}
    </button>
));

SaveButton.propTypes = {
    processing: PropTypes.bool.isRequired,
};

export default SaveButton;
