const TextInput = ({ label, error, ...props }) => {
    return (
        <div className="mb-3">
            <label className="form-label">{label}</label>
            <input className={`form-control ${error ? 'is-invalid' : ''}`} {...props} />
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
}

export default TextInput;