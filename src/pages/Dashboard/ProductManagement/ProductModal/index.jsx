import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { Input } from "src/components/Input";
import { Modal } from "src/components/Modal";
import { handleError } from "src/utils/api-error-handling";
import axios from "src/utils/axios";
import notify from "src/utils/toast";
import { translate } from "src/utils/translate";
import { number, object, string } from "yup";
import style from "./style.module.scss";

const schema = (isUpdate) =>
	object({
		name: string().required(translate.errors.required),
		weight: number().required(translate.errors.required).min(1, "وزن نباید کمتر از ۱ کیلوگرم باشد"),
		price: string().required(translate.errors.required),
		tax: number()
			.required(translate.errors.required)
			.max(100, "درصد مالیات نباید بیشتر از ۱۰۰ باشد")
			.min(0, "درصد مالیات نباید کمتر از ۰ باشد"),
	});

const ProductModal = ({
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
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(schema(defaultValue !== null)),
		defaultValues: { price: 0 },
	});

	const [loading, setLoading] = useState(false);
	const [editItemID, setEditItemID] = useState(null);

	const onSubmit = (data) => {
		setLoading(true);
		if (editItemID === null) {
			axios
				.post("/product/manage/list_create/", data)
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
				.put(`/product/manage/update_delete/?pk=${editItemID}`, data)
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
			setValue("name", defaultValue?.name);
			setValue("weight", defaultValue?.weight);
			setValue("price", defaultValue?.price);
			setValue("tax", defaultValue?.tax);
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
					label="نام محصول"
					error={errors.name?.message}
					{...register("name")}
				/>
				<Input
					className={style.form__input}
					size="xlarge"
					label="وزن محصول(کیلوگرم)"
					required
					type="number"
					error={errors.weight?.message}
					{...register("weight")}
				/>
				<Controller
					control={control}
					name="price"
					render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
						<Input
							className={style.form__input}
							size="xlarge"
							label="قیمت(ریال)"
							required
							type="text"
							error={error?.message}
							id="price"
							onBlur={onBlur}
							value={value.toLocaleString()}
							onChange={(e) => onChange(Number(e.target.value.replaceAll(",", "")))}
						/>
					)}
				/>
				<Input
					className={style.form__input}
					size="xlarge"
					label="مالیات بر ارزش افزوده"
					required
					type="number"
					error={errors.tax?.message}
					{...register("tax")}
				/>
			</form>
		</Modal>
	);
};

export default ProductModal;
