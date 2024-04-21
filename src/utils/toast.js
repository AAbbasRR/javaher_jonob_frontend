import { toast } from "react-toastify";

const notify = (message, type = "info") => {
	switch (type) {
		case "success":
			toast.success(message);
			break;
		case "warning":
			toast.warning(message);
			break;
		case "error":
			toast.error(message);
			break;
		default:
			toast.info(message);
	}
};

export default notify;
