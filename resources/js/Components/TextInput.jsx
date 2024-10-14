const TextInput = ({ label, error, ...props }) => {
    return (
        <div className="mb-3">
            <label className="block mb-2 font-bold text-gray-700">{label}</label>
            <input className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`} {...props} />
            {error && <p className="mt-2 text-xs italic text-red-500">{error}</p>}
        </div>
    );
}

export default TextInput;