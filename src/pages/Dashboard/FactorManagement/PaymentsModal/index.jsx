import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Divider } from "@mui/material";
import { Button } from "src/components/Button";
import { DatePicker } from "src/components/DatePicker";
import { Empty } from "src/components/Empty";
import { Input } from "src/components/Input";
import { Modal } from "src/components/Modal";
import { Select } from "src/components/Select";
import { Table } from "src/components/Table";
import { handleError } from "src/utils/api-error-handling";
import axios from "src/utils/axios";
import notify from "src/utils/toast";
import { translate } from "src/utils/translate";
import { number, object, string } from "yup";
import style from "./style.module.scss";

const payment_type_options = [
	{
		name: "چک",
		value: "check",
	},
	{
		name: "نقدی",
		value: "cash",
	},
	{
		name: "به حساب",
		value: "bank",
	},
];

const schema = () =>
	object({
		factor: number().required(translate.errors.required),
		amount: string().required(translate.errors.required),
		tracking_code: string(),
		payment_date: string().required(translate.errors.required),
		payment_type: string().required(translate.errors.required),
		description: string(),
	});

const PaymentsModal = ({ open, setOpen, reload, setReload, defaultValues = null }) => {
	const {
		setError,
		register,
		handleSubmit,
		setValue,
		control,
		reset,
		formState: { errors },
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(schema()),
		defaultValues: { amount: 0 },
	});

	const [loading, setLoading] = useState(false);

	const onSubmit = (data) => {
		setLoading(true);
		data.payment_date = new Date(data?.payment_date).toISOString()?.slice(0, 10);
		axios
			.post("/factor/manage/payments/create/", data)
			.then((res) => {
				closeModal();
				notify("با موفقیت ثبت شد", "success");
				setReload(!reload);
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

	useEffect(() => {
		if (defaultValues !== null) {
			setValue("factor", defaultValues?.id);
		}
	}, [defaultValues]);

	const columns = [
		{
			headerName: "کد پیگیری",
			field: "tracking_code",
			flex: 1,
			sortable: false,
			renderCell: ({ row }) => row?.tracking_code || "خالی",
		},
		{
			headerName: "نوع",
			field: "payment_type_display",
			flex: 1,
			sortable: false,
		},
		{
			headerName: "مقدار(ریال)",
			field: "amount",
			flex: 1,
			sortable: false,
			renderCell: ({ row }) => row?.amount.toLocaleString("fa-IR"),
		},
		{
			headerName: "تاریخ",
			field: "payment_date",
			flex: 1,
			sortable: false,
			renderCell: ({ row }) => new Date(row?.payment_date).toLocaleString("fa-IR").split(", ")[0],
		},
		{
			headerName: "توضحیات",
			field: "description",
			flex: 1,
			sortable: false,
		},
		{
			headerName: "تاریخ ایجاد",
			field: "formatted_create_at",
			flex: 1,
			sortable: false,
			renderCell: ({ row }) => new Date(row?.formatted_create_at).toLocaleString("fa-IR"),
		},
	];

	return (
		<Modal
			fullWidth
			state={open}
			setState={closeModal}
			maxWidth="lg"
			footerEnd={
				<div className={style.buttons}>
					<Button size="xlarge" variant="ghost" onClick={closeModal}>
						انصراف
					</Button>
					{defaultValues?.payment_status || (
						<Button size="xlarge" onClick={handleSubmit(onSubmit)} loading={loading}>
							تایید
						</Button>
					)}
				</div>
			}
		>
			<form className={style.form}>
				<div className={style.title}>جزییات پرداخت/دریافت</div>
				{defaultValues?.payment_status || (
					<>
						<Input
							className={style.form__input}
							size="xlarge"
							label="کد پیگیری"
							error={errors.tracking_code?.message}
							{...register("tracking_code")}
						/>
						<Select
							className={style.form__input}
							size="xlarge"
							label="نوع پرداخت"
							required
							options={payment_type_options}
							error={errors.payment_type?.message}
							name="payment_type"
							control={control}
						/>
						<Controller
							control={control}
							name="amount"
							render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
								<>
									<Input
										className={style.form__input}
										size="xlarge"
										label="مقدار(ریال)"
										required
										type="text"
										error={error?.message}
										id="amount"
										onBlur={onBlur}
										value={value.toLocaleString()}
										onChange={(e) => onChange(Number(e.target.value.replaceAll(",", "")))}
									/>
								</>
							)}
						/>
						<DatePicker
							required
							size="xlarge"
							label="تاریخ پرداخت"
							error={errors.payment_date?.message}
							helperText="روز/ماه/سال"
							className={style.form__input}
							name="payment_date"
							control={control}
						/>
						<Input
							className={style.form__inputBig}
							size="xlarge"
							type="textarea"
							label="توضیحات"
							error={errors.description?.message}
							{...register("description")}
						/>
					</>
				)}
			</form>
			{defaultValues?.factor_payments?.length > 0 ? (
				<div className={style.table}>
					<Table rows={defaultValues?.factor_payments} loading={loading} columns={columns} />
				</div>
			) : (
				<Empty />
			)}
			<Divider />
			<div className={style.debtBalance}>
				مانده:{" "}
				{(
					defaultValues?.payment_amount -
					defaultValues?.factor_payments?.reduce((sum, item) => {
						return Math.ceil(sum + Math.ceil(item?.amount));
					}, 0)
				).toLocaleString()}{" "}
				ریال
			</div>
		</Modal>
	);
};

export default PaymentsModal;
