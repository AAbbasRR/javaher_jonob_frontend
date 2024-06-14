import { Button } from "src/components/Button";
import { Modal } from "src/components/Modal";
import { Select } from "src/components/Select";
import style from "./style.module.scss";

const ModelOptions = [
	{
		name: "همه",
		value: "",
	},
	{
		name: "انبار",
		value: "Store",
	},
	{
		name: "کارمندان",
		value: "User",
	},
	{
		name: "محصول",
		value: "Product",
	},
	{
		name: "فاکتور",
		value: "Factor",
	},
	{
		name: "راننده",
		value: "Driver",
	},
	{
		name: "مشتری",
		value: "Customer",
	},
	{
		name: "آدرس مشتری",
		value: "CustomerAddress",
	},
	{
		name: "اقلام فاکتور",
		value: "FactorItems",
	},
	{
		name: "پرداختی فاکتور",
		value: "FactorPayments",
	},
];

const ActionOptions = [
	{
		name: "همه",
		value: "",
	},
	{
		name: "ایجاد",
		value: "create",
	},
	{
		name: "بروزرسانی",
		value: "update",
	},
];

const FactorModal = ({ open, setOpen, control, errors, onSubmit, reset }) => {
	return (
		<Modal
			fullWidth
			state={open}
			setState={() => setOpen()}
			maxWidth="md"
			footerEnd={
				<div className={style.buttons}>
					<Button size="xlarge" variant="ghost" onClick={() => setOpen()}>
						انصراف
					</Button>
					<Button size="xlarge" onClick={reset}>
						پاک کردن
					</Button>
					<Button size="xlarge" onClick={onSubmit}>
						تایید
					</Button>
				</div>
			}
		>
			<form className={style.form}>
				{/* <DatePicker
					size="xlarge"
					label="از تاریخ"
					error={errors.time_after?.message}
					helperText="روز/ماه/سال"
					className={style.form__input}
					name="time_after"
					control={control}
				/>
				<DatePicker
					size="xlarge"
					label="تا تاریخ"
					error={errors.time_before?.message}
					helperText="روز/ماه/سال"
					className={style.form__input}
					name="time_before"
					control={control}
				/> */}
				<Select
					className={style.form__input}
					size="xlarge"
					label="نام بخش"
					required
					options={ModelOptions}
					error={errors.model_name?.message}
					name="model_name"
					control={control}
				/>
				<Select
					className={style.form__input}
					size="xlarge"
					label="رویداد"
					required
					options={ActionOptions}
					error={errors.action?.message}
					name="action"
					control={control}
				/>
			</form>
		</Modal>
	);
};

export default FactorModal;
