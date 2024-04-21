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
		customer: string().required(translate.errors.required),
		country: string().required(translate.errors.required),
		state: string().required(translate.errors.required),
		full_address: string().required(translate.errors.required),
	});

const AddressModal = ({
	open,
	setOpen,
	reload,
	setReload,
	setDefaultValue,
	customerID,
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
	const [addressNameOptions, setAddressNameOptions] = useState([]);

	const getAddressData = () => {
		setLoading(true);
		axios
			.get("user/address/list/all/")
			.then((res) => {
				const nameOptions = [];
				res.data.map((item) => {
					nameOptions.push({
						label: `${item.full_name}`,
						value: item.id,
						key: item.id,
					});
				});
				setAddressNameOptions(nameOptions);
			})
			.catch((err) => {
				handleError(err);
			})
			.finally(() => {
				setLoading(false);
			});
	};
	const onSubmit = (data) => {
		setLoading(true);
		if (editItemID === null) {
			axios
				.post("/customer/manage/address/list_create/", data)
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
				.put(`/customer/manage/address/update_delete/?pk=${editItemID}`, data)
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
		setEditItemID(null);
	};

	useEffect(() => {
		if (defaultValue !== null) {
			setEditItemID(defaultValue?.id);
			setValue("customer", defaultValue?.customer);
			setValue("country", defaultValue?.country);
			setValue("state", defaultValue?.state);
			setValue("full_address", defaultValue?.full_address);
		}
	}, [defaultValue]);
	useEffect(() => {
		if (open) {
			setValue("customer", customerID);
			if (addressNameOptions.length === 0) {
				getAddressData();
			}
		}
	}, [open]);

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
