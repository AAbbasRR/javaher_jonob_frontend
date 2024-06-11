import { Button } from "src/components/Button";
import { DatePicker } from "src/components/DatePicker";
import { Modal } from "src/components/Modal";
import { Select } from "src/components/Select";
import style from "./style.module.scss";

const paymentStatusOptions = [
	{
		name: "همه",
		value: "",
	},
	{
		name: "پرداخت شده",
		value: "true",
	},
	{
		name: "پرداخت نشده",
		value: "false",
	},
];

const FactorModal = ({ open, setOpen, control, errors, onSubmit, reset }) => {
	return (
		<Modal
			fullWidth
			state={open}
			setState={() => setOpen()}
			maxWidth="lg"
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
				<DatePicker
					size="xlarge"
					label="از تاریخ"
					error={errors.create_at_after?.message}
					helperText="روز/ماه/سال"
					className={style.form__input}
					name="factor_date_after"
					control={control}
				/>
				<DatePicker
					size="xlarge"
					label="تا تاریخ"
					error={errors.create_at_before?.message}
					helperText="روز/ماه/سال"
					className={style.form__input}
					name="factor_date_before"
					control={control}
				/>
				<Select
					className={style.form__input}
					size="xlarge"
					label="وضعیت پرداخت"
					required
					options={paymentStatusOptions}
					error={errors.payment_status?.message}
					name="payment_status"
					control={control}
				/>
			</form>
		</Modal>
	);
};

export default FactorModal;
