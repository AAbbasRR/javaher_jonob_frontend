import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "src/store";
import { Username } from "./components/Username";
import style from "./style.module.scss";

const SignIn = () => {
	const navigate = useNavigate();
	const { accessToken } = useAuthStore();

	useEffect(() => {
		if (accessToken) {
			navigate("/dashboard");
		}
	}, [accessToken]);

	return (
		<div className={style.wrapper}>
			<div className={style.logo}>{/* <img src={logo} alt='logo' /> */}</div>

			<div className={style.main}>
				<div className={style.header}>
					<div className={style.title}>
						ورود به حساب مدیریت
					</div>

					<span className={style.message}>خوش آمدید.</span>
				</div>

				<Username />
			</div>
		</div>
	);
};

export default SignIn;
