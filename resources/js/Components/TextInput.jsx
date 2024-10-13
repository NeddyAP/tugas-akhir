const TextInput = ({ label, error, ...props }) => {
    return (
        <div className="mb-3">
            <label className="block text-gray-700 font-bold mb-2">{label}</label>
            <input class={`shadow appearance-none border rounded w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${error ? 'border-red-500' : ''}`} {...props} />
            {error && <p class="text-red-500 text-xs italic mt-2">{error}</p>}
        </div>
    );
}

export default TextInput;