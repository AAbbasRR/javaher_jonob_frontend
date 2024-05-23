import notify from "./toast";

export const handleError = ({ err, setError = null }) => {
	const response = err?.response?.data ?? {};

	if (Object.hasOwn(response, "detail") || Object.hasOwn(response, "non_field_errors")) {
		notify(response.detail, "error");
		notify(response?.non_field_errors?.[0], "error");
	} else {
		if (setError) {
			for (let key in response) {
				setError(key, {
					type: "custom",
					message: response[key],
				});
			}
		}
	}
};
