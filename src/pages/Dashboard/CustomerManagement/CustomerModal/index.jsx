import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { Input } from "src/components/Input";
import { Modal } from "src/components/Modal";
import { handleError } from "src/utils/api-error-handling";
import axios from "src/utils/axios";
import notify from "src/utils/toast";
import { translate } from "src/utils/translate";
import { object, string } from "yup";
import style from "./style.module.scss";

const schema = () =>
	object({
		mobile_number: string().required(translate.errors.required).length(11, "حداکثر ۱۱ رقم"),
		full_name: string().required(translate.errors.required),
		national_code: string().required(translate.errors.required).length(10, "حداکثر ۱۰ رقم"),
		customer_code: string().length(10, "حداکثر ۱۰ رقم"),
	});

const CustomerModal = ({
	open,
	setOpen,
	reload,
	setReload,
	setDefaultValue,
	defaultValue = null,
}) => {
	const {
		register,
		setError,
		setValue,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(schema()),
	});

	const [loading, setLoading] = useState(false);
	const [editItemID, setEditItemID] = useState(null);

	const onSubmit = (data) => {
		setLoading(true);
		if (editItemID === null) {
			axios
				.post("/customer/manage/list_create/", data)
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
				.put(`/customer/manage/update_delete/?pk=${editItemID}`, data)
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
			setValue("mobile_number", defaultValue?.mobile_number);
			setValue("full_name", defaultValue?.full_name);
			setValue("customer_code", defaultValue?.customer_code);
			setValue("national_code", defaultValue?.national_code);
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
					label="نام و نام خانوادگی"
					error={errors.full_name?.message}
					{...register("full_name")}
				/>
				<Input
					className={style.form__input}
					size="xlarge"
					label="کد ملی"
					required
					error={errors.national_code?.message}
					{...register("national_code")}
				/>
				<Input
					className={style.form__input}
					size="xlarge"
					label="شماره موبایل"
					required
					error={errors.mobile_number?.message}
					{...register("mobile_number")}
				/>
				<Input
					className={style.form__input}
					size="xlarge"
					label="کد مشتری"
					error={errors.customer_code?.message}
					{...register("customer_code")}
				/>
			</form>
		</Modal>
	);
};

export default CustomerModal;
