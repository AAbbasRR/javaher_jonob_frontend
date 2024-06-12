import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
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
		country: string().required(translate.errors.required),
		state: string().required(translate.errors.required),
		city: string().required(translate.errors.required),
		street: string().required(translate.errors.required),
		full_address: string().required(translate.errors.required),
	});

const AddressModal = ({ open, setOpen, setNewAddress }) => {
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

	const onSubmit = (data) => {
		setLoading(true);
		axios
			.post("/customer/manage/address/list_create/", data)
			.then((res) => {
				closeModal();
				notify("با موفقیت ثبت شد", "success");
				setNewAddress({ ...res?.data });
			})
			.catch((err) => {
				handleError({ err, setError });
			})
			.finally(() => setLoading(false));
	};
	const closeModal = () => {
		setOpen(false);
		reset();
	};

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
					size="xlarge"
					label="کشور"
					required
					error={errors.country?.message}
					{...register("country")}
				/>
				<Input
					className={style.form__input}
					size="xlarge"
					label="استان"
					error={errors.state?.message}
					{...register("state")}
				/>
				<Input
					className={style.form__input}
					size="xlarge"
					label="شهر"
					error={errors.city?.message}
					{...register("city")}
				/>
				<Input
					className={style.form__input}
					size="xlarge"
					label="خیابان"
					error={errors.street?.message}
					{...register("street")}
				/>
				<Input
					className={style.form__inputFull}
					size="xlarge"
					label="آدرس"
					type="textarea"
					error={errors.full_address?.message}
					{...register("full_address")}
				/>
			</form>
		</Modal>
	);
};

export default AddressModal;
