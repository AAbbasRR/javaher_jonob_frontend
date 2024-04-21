export const passwordValidator = function (value) {
	const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
	return pattern.test(value);
};

export const MobileNumberValidator = function (value) {
	const pattern = /^{?(0?9[0-9]{9,9}}?)$/;
	return pattern.test(value);
};
