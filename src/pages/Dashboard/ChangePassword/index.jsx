import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { Input } from "src/components/Input";
import { handleError } from "src/utils/api-error-handling";
import axios from "src/utils/axios";
import IconButton from "@mui/material/IconButton";
import notify from "src/utils/toast";
import { translate } from "src/utils/translate";
import { object, ref, string } from "yup";
import IconEyeClose from "src/assets/icons/icon-eye-close.svg";
import IconEyeOpen from "src/assets/icons/icon-eye-open.svg";
import style from "./style.module.scss";

const schema = () =>
	object({
		old_password: string().required(translate.errors.required),
		new_password: string().required(translate.errors.required),
		new_re_password: string().required(translate.errors.required).oneOf([ref('new_password'), null], translate.errors.repassword),
	});

const ChangePassword = () => {
	const {
		register,
		setError,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(schema()),
	});

	const [loading, setLoading] = useState(false);
	const [showOldPassword, setOldShowPassword] = useState(false);
	const [showNewPassword, setNewShowPassword] = useState(false);
	const [showReNewPassword, setReNewShowPassword] = useState(false);

	const onSubmit = (data) => {
		setLoading(true);
		axios
			.put("/user/auth/change_password/", data)
			.then((res) => {
				notify("رمز شما با موفقیت تغییر پیدا کرد", "success");
				reset();
			})
			.catch((err) => {
				console.log(err)
				handleError({ err, setError });
			})
			.finally(() => setLoading(false));
	};

	return (
		<>
			<div className={style.wrapper}>
				<div className={style.main}>
					<div className={`${style.history} ${"active"}`}>
						<div className={style.header}>
							<div className={style.header__title}>
								<div className={style.title}>تغییر رمز عبور</div>
							</div>
						</div>
						<form className={style.form}>
							<Input
								className={style.form__input}
								required
								size="xlarge"
								label="رمزعبور قبلی"
								error={errors.old_password?.message}
								{...register("old_password")}
								type={showOldPassword ? "text" : "password"}
								leftIcon={
									<IconButton onClick={() => setOldShowPassword((show) => !show)}>
										<img src={showOldPassword ? IconEyeClose : IconEyeOpen} alt="eye-icon" />
									</IconButton>
								}
							/>
							<Input
								className={style.form__input}
								required
								size="xlarge"
								label="رمزعبور جدید"
								error={errors.new_password?.message}
								{...register("new_password")}
								type={showNewPassword ? "text" : "password"}
								leftIcon={
									<IconButton onClick={() => setNewShowPassword((show) => !show)}>
										<img src={showNewPassword ? IconEyeClose : IconEyeOpen} alt="eye-icon" />
									</IconButton>
								}
							/>
							<Input
								className={style.form__input}
								required
								size="xlarge"
								label="تکرار رمزعبور جدید"
								error={errors.new_re_password?.message}
								{...register("new_re_password")}
								type={showReNewPassword ? "text" : "password"}
								leftIcon={
									<IconButton onClick={() => setReNewShowPassword((show) => !show)}>
										<img src={showReNewPassword ? IconEyeClose : IconEyeOpen} alt="eye-icon" />
									</IconButton>
								}
							/>
						</form>
						<div className={style.buttons}>
								<Button size="xlarge" onClick={handleSubmit(onSubmit)} loading={loading}>
									تایید
								</Button>
							</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ChangePassword;
