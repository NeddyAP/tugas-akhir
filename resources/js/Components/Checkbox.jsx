const Checkbox = ({ label, checked, onChange }) => {
    return (
        <div className="form-check">
            <input
                type="checkbox"
                className="form-check-input"
                checked={checked}
                onChange={onChange}
            />
            <label className="form-check-label">{label}</label>
        </div>
    );
}

export default Checkbox;