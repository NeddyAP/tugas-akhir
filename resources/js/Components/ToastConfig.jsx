import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
};

export const Toast = () => <ToastContainer {...toastConfig} />;
