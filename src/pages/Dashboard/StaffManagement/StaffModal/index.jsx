import { yupResolver } from "@hookform/resolvers/yup";
import { FormControlLabel } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import IconEyeClose from "src/assets/icons/icon-eye-close.svg";
import IconEyeOpen from "src/assets/icons/icon-eye-open.svg";
import { Button } from "src/components/Button";
import { Input } from "src/components/Input";
import { Modal } from "src/components/Modal";
import { Select } from "src/components/Select";
import { Switch } from "src/components/Switch";
import { handleError } from "src/utils/api-error-handling";
import axios from "src/utils/axios";
import notify from "src/utils/toast";
import { translate } from "src/utils/translate";
import { bool, object, string } from "yup";
import style from "./style.module.scss";

const schema = (isUpdate) =>
	object({
		first_name: string().required(translate.errors.required),
		last_name: string().required(translate.errors.required),
		username: string().required(translate.errors.required),
		password: isUpdate ? string() : string().required(translate.errors.required),
		is_active: bool(false),
		type: string().required(translate.errors.required),
	});

const StaffModal = ({ open, setOpen, reload, setReload, setDefaultValue, defaultValue = null }) => {
	const {
		register,
		setError,
		setValue,
		handleSubmit,
		watch,
		control,
		reset,
		formState: { errors },
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(schema(defaultValue !== null)),
	});

	const [loading, setLoading] = useState(false);
	const [editItemID, setEditItemID] = useState(null);
	const [showPassword, setShowPassword] = useState(false);

	const onSubmit = (data) => {
		setLoading(true);
		if (editItemID === null) {
			axios
				.post("/user/manage/staff/list_create/", data)
				.then((res) => {
					closeModal();
					notify("با موفقیت ثبت شد", "success");
					setReload(!reload);
				})
				.catch((err) => {
					handleError({ err, setError });
				})
				.finally(() => setLoading(false));
		} else {
			axios
				.put(`/user/manage/staff/update_delete/?pk=${editItemID}`, data)
				.then((res) => {
					closeModal();
					notify("با موفقیت ویرایش شد", "success");
					setReload(!reload);
				})
				.catch((err) => {
					handleError({ err, setError });
				})
				.finally(() => setLoading(false));
		}
	};
	const closeModal = () => {
		setOpen(false);
		reset();
		setDefaultValue(null);
	};

	useEffect(() => {
		if (defaultValue !== null) {
			setEditItemID(defaultValue?.id);
			setValue("first_name", defaultValue?.first_name);
			setValue("last_name", defaultValue?.last_name);
			setValue("is_active", defaultValue?.is_active);
			setValue("username", defaultValue?.username);
			setValue("type", defaultValue?.type);
		}
	}, [defaultValue]);

	return (
		<Modal
			fullWidth
			state={open}
			setState={closeModal}
			maxWidth="md"
			footerEnd={
				<div className={style.buttons}>
					<Button size="xlarge" variant="ghost" onClick={closeModal}>
						انصراف
					</Button>
					<Button size="xlarge" onClick={handleSubmit(onSubmit)} loading={loading}>
						تایید
					</Button>
				</div>
			}
		>
			<form className={style.form}>
				<Input
					className={style.form__input}
					required
					size="xlarge"
					label="نام"
					error={errors.first_name?.message}
					{...register("first_name")}
				/>
				<Input
					className={style.form__input}
					size="xlarge"
					label="نام خانوادگی"
					required
					error={errors.last_name?.message}
					{...register("last_name")}
				/>
				<Input
					className={style.form__input}
					size="xlarge"
					label="نام کاربری"
					required
					error={errors.username?.message}
					{...register("username")}
				/>
				<Input
					required={defaultValue === null}
					size="xlarge"
					label="رمز عبور"
					error={errors.password?.message}
					type={showPassword ? "text" : "password"}
					className={style.form__input}
					leftIcon={
						<IconButton onClick={() => setShowPassword((show) => !show)}>
							<img src={showPassword ? IconEyeClose : IconEyeOpen} alt="eye-icon" />
						</IconButton>
					}
					{...register("password")}
				/>
				<Select
					className={style.form__input}
					size="xlarge"
					label="نوع کاربر"
					placeholder="انتخاب نوع کاربر"
					required
					name="type"
					control={control}
					error={errors.type?.message}
					options={[
						{ value: "superuser", name: "مدیر اصلی" },
						{ value: "staff", name: "مدیر" },
						{ value: "secretary", name: "منشی" },
						{ value: "worker", name: "کارگر" },
					]}
				/>
				<div className={style.row}>
					<FormControlLabel
						className={style.formLabel}
						label="وضعیت فعال بودن حساب"
						control={
							<Switch
								name="is_active"
								checked={watch("is_active")}
								onChange={(e) => setValue("is_active", e.target.checked)}
							/>
						}
					/>
				</div>
			</form>
		</Modal>
	);
};

export default StaffModal;
