import axios from "axios";
import useAuthStore from "src/store";
import "./style.css";

const instance = axios.create({
	baseURL: `${process.env.REACT_APP_BACK_URL}/api/v1`,
});

instance.interceptors.request.use(async (config) => {
	const accessToken = useAuthStore.getState().accessToken;

	if (accessToken !== null) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}
	config.headers["Accept-Language"] = "fa";
	return config;
});

instance.interceptors.response.use(
	(res) => {
		return res;
	},
	(error) => {
		if (error?.response?.status === 401) {
			const logout = useAuthStore.getState().logout;
			const userInfo = useAuthStore.getState().userInfo;
			let href = "/signin";
			if (userInfo?.is_staff === true || userInfo?.is_superuser === true) {
				href = "/admin/signin";
			}
			logout();
			window.location.href = href;
			return;
		}

		return Promise.reject(error);
	},
);

export default instance;
