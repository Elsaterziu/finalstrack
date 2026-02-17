import { useState, useEffect } from "react";
import { FaLock, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import { changeMyPassword } from "../../api/profileApi";
import "../../styles/profile.css";


export default function ChangePasswordModal({ onClose }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [showCurrent, setShowCurrent] = useState(false);


    useEffect(() => {
        const esc = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", esc);
        return () => window.removeEventListener("keydown", esc);
    }, [onClose]);

    const submit = async () => {
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setSaving(true);
            setError(null);

            await changeMyPassword({
                currentPassword,
                newPassword,
            });

            onClose();
        } catch (e) {
            setError(e?.response?.data || "Failed to change password");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-sheet"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-sheet-header">
                    <h5>
                        <FaLock /> Change Password
                    </h5>
                    <button className="icon-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="modal-sheet-body">
                    {error && <div className="alert alert-danger">{error}</div>}

                    <label>Current Password</label>

                    <div className="password-field">
                        <input
                            type={showCurrent ? "text" : "password"}
                            className="form-control"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />

                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowCurrent(v => !v)}
                            tabIndex={-1}
                        >
                            {showCurrent ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>


                    <label className="mt-3">New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <label className="mt-3">Confirm New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <div className="modal-sheet-footer">
                    <button className="btn btn-light" onClick={onClose}>
                        Cancel
                    </button>

                    <button
                        className="btn btn-danger"
                        disabled={saving}
                        onClick={submit}
                    >
                        Change Password
                    </button>
                </div>
            </div>
        </div>
    );
}
