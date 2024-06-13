import { Button } from "src/components/Button";
import { DatePicker } from "src/components/DatePicker";
import { Modal } from "src/components/Modal";
import style from "./style.module.scss";

const FactorModal = ({ open, setOpen, control, errors, onSubmit, fieldType }) => {
	return (
		<Modal
			fullWidth
			state={open}
			setState={() => setOpen(false)}
			maxWidth="md"
			footerEnd={
				<div className={style.buttons}>
					<Button size="xlarge" variant="ghost" onClick={() => setOpen(false)}>
						انصراف
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
					error={errors?.marketer_factor_date_after?.message}
					helperText="روز/ماه/سال"
					className={`${style.form__input} ${fieldType !== "marketer" && style.hidden}`}
					name="marketer_factor_date_after"
					control={control}
				/>
				<DatePicker
					size="xlarge"
					label="تا تاریخ"
					error={errors?.marketer_factor_date_before?.message}
					helperText="روز/ماه/سال"
					className={`${style.form__input} ${fieldType !== "marketer" && style.hidden}`}
					name="marketer_factor_date_before"
					control={control}
				/>
				<DatePicker
					size="xlarge"
					label="از تاریخ"
					error={errors?.stores_factor_date_after?.message}
					helperText="روز/ماه/سال"
					className={`${style.form__input} ${fieldType !== "stores" && style.hidden}`}
					name="stores_factor_date_after"
					control={control}
				/>
				<DatePicker
					size="xlarge"
					label="تا تاریخ"
					error={errors?.stores_factor_date_before?.message}
					helperText="روز/ماه/سال"
					className={`${style.form__input} ${fieldType !== "stores" && style.hidden}`}
					name="stores_factor_date_before"
					control={control}
				/>
				<DatePicker
					size="xlarge"
					label="از تاریخ"
					error={errors?.sales_factor_date_after?.message}
					helperText="روز/ماه/سال"
					className={`${style.form__input} ${fieldType !== "sales" && style.hidden}`}
					name="sales_factor_date_after"
					control={control}
				/>
				<DatePicker
					size="xlarge"
					label="تا تاریخ"
					error={errors?.sales_factor_date_before?.message}
					helperText="روز/ماه/سال"
					className={`${style.form__input} ${fieldType !== "sales" && style.hidden}`}
					name="sales_factor_date_before"
					control={control}
				/>
				<DatePicker
					size="xlarge"
					label="از تاریخ"
					error={errors?.product_factor_date_after?.message}
					helperText="روز/ماه/سال"
					className={`${style.form__input} ${fieldType !== "product" && style.hidden}`}
					name="product_factor_date_after"
					control={control}
				/>
				<DatePicker
					size="xlarge"
					label="تا تاریخ"
					error={errors?.product_factor_date_before?.message}
					helperText="روز/ماه/سال"
					className={`${style.form__input} ${fieldType !== "product" && style.hidden}`}
					name="product_factor_date_before"
					control={control}
				/>
			</form>
		</Modal>
	);
};

export default FactorModal;
