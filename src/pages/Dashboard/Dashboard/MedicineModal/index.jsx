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
		irc: string().required(translate.errors.required),
		generic_code: string().required(translate.errors.required).length(5, "حداکثر ۵ رقم"),
		full_name: string().required(translate.errors.required),
		company: string().required(translate.errors.required),
		price: string().required(translate.errors.required),
		term: string(),
	});

const MedicineModal = ({
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
				.post("/admin/medicine/manage/list_create/", data)
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
				.put(`/admin/medicine/manage/update_delete/?pk=${editItemID}`, data)
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
			setValue("irc", defaultValue?.irc);
			setValue("generic_code", defaultValue?.generic_code);
			setValue("full_name", defaultValue?.full_name);
			setValue("company", defaultValue?.company);
			setValue("price", defaultValue?.price);
			setValue("term", defaultValue?.term);
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
					label="کد IRC"
					error={errors.irc?.message}
					{...register("irc")}
				/>
				<Input
					className={style.form__input}
					required
					size="xlarge"
					label="کد ژنریک"
					error={errors.generic_code?.message}
					{...register("generic_code")}
				/>
				<Input
					className={style.form__inputFull}
					size="xlarge"
					label="نام کامل دارو (شامل: دوز، شکل و ...)"
					required
					error={errors.full_name?.message}
					{...register("full_name")}
				/>
				<Input
					className={style.form__input}
					size="xlarge"
					label="قیمت"
					required
					error={errors.price?.message}
					{...register("price")}
				/>
				<Input
					className={style.form__input}
					size="xlarge"
					label="شرکت سازنده"
					error={errors.company?.message}
					{...register("company")}
				/>
				<Input
					className={style.form__inputFull}
					size="xlarge"
					label="شرایط تعهد"
					error={errors.term?.message}
					{...register("term")}
					type="textarea"
				/>
			</form>
		</Modal>
	);
};

export default MedicineModal;
