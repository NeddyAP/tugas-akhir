const TextInput = ({ label, error, ...props }) => {
    return (
        <div className="mb-3">
            <label className="block mb-2 font-bold text-gray-700">{label}</label>
            <input className={`shadow appearance-none border rounded w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${error ? 'border-red-500' : ''}`} {...props} />
            {error && <p className="mt-2 text-xs italic text-red-500">{error}</p>}
        </div>
    );
}

export default TextInput;