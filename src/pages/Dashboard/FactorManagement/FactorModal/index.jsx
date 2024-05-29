import { yupResolver } from "@hookform/resolvers/yup";
import { Autocomplete, Popper, TextField, Tooltip } from "@mui/material";
import _debounce from "lodash/debounce";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import iconRemove from "src/assets/icons/icon-remove.svg";
import { Button } from "src/components/Button";
import { Input } from "src/components/Input";
import { Modal } from "src/components/Modal";
import { Select } from "src/components/Select";
import { Switch } from "src/components/Switch";
import RightToLeftLayout from "src/components/rtl";
import { handleError } from "src/utils/api-error-handling";
import axios from "src/utils/axios";
import notify from "src/utils/toast";
import { translate } from "src/utils/translate";
import { boolean, number, object, string } from "yup";
import style from "./style.module.scss";

const sxProps = {
	fontFamily: "inherit",
	boxShadow: "none",
	backgroundColor: "var(--bl-surface-container-lowest)",
	"&.MuiFilledInput-root": {
		borderColor: "transparent",
		color: "var(--bl-on-surface)",
		backgroundColor: "var(--bl-surface-container-low)",
	},
	"& .MuiInputBase-input": {
		position: "relative",
		fontSize: "0.75rem",
		height: "1rem",
		lineHeight: "1rem",
		textAlign: "right !important",
		padding: "0.25rem 0.75rem 0.25rem !important",
		minHeight: "unset",
		"&:focus": {
			boxShadow: "none",
			backgroundColor: "transparent",
		},
	},
};

const schema = () =>
	object({
		tracking_code: string(),
		payment_type: string().required(translate.errors.required),
		payment_status: boolean().required(translate.errors.required),
		customer: number().required(translate.errors.required),
		marketer: number(),
		address: number().required(translate.errors.required),
		store: number().required(translate.errors.required),
		description: string(),
	});

const factorPaymentTypeOptions = [
	{ name: "چک", value: "check" },
	{ name: "نقد", value: "cash" },
	{ name: "اقساط", value: "installment" },
];

const FactorModal = ({
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
		getValues,
		setValue,
		control,
		watch,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(schema(defaultValue !== null)),
		defaultValues: {
			payment_status: true,
		},
	});
	console.log(errors);

	const [loading, setLoading] = useState(false);
	const [editItemID, setEditItemID] = useState(null);
	const [storeData, setStoreData] = useState([]);
	const [customerData, setCustomerData] = useState([]);
	const [customerSearchValue, setCustomerSearchValue] = useState("");
	const [customerAddressData, setCustomerAddressData] = useState([]);
	const [customerAddressSearchValue, setCustomerAddressSearchValue] = useState("");
	const [MarketerData, setMarketerData] = useState([]);
	const [marketerSearchValue, setMarketerSearchValue] = useState("");
	const [productData, setProductData] = useState([]);
	const [productDataOption, setProductDataOption] = useState([]);
	const [productSearchValueData, setProductSearchValue] = useState("");
	const [factorProducts, setFactorProducts] = useState([]);

	const debouncedCustomerSearch = useMemo(
		() =>
			_debounce((value) => {
				setCustomerSearchValue(value);
			}, 300),
		[customerSearchValue],
	);
	const debouncedCustomerAddressSearch = useMemo(
		() =>
			_debounce((value) => {
				setCustomerAddressSearchValue(value);
			}, 300),
		[customerAddressSearchValue],
	);
	const debouncedMarketerSearch = useMemo(
		() =>
			_debounce((value) => {
				setMarketerSearchValue(value);
			}, 300),
		[marketerSearchValue],
	);
	const debouncedProductSearch = useMemo(
		() =>
			_debounce((value) => {
				setProductSearchValue(value);
			}, 300),
		[productSearchValueData],
	);

	const getStoreData = () => {
		axios
			.get("/store/manage/list_create/")
			.then((res) => {
				const storeDataVar = [];
				res?.data?.results?.map((item) => {
					storeDataVar.push({
						name: item?.name,
						value: String(item?.id),
						key: item?.id,
					});
				});
				setStoreData([...storeDataVar]);
			})
			.catch((err) => {});
	};
	const getProductData = () => {
		axios
			.get("/product/manage/list_create/", {
				params: { search: productSearchValueData },
			})
			.then((res) => {
				setProductData(res?.data?.results);
				const productDataVar = [];
				res?.data?.results?.map((item) => {
					productDataVar.push({
						label: `${item?.name} - ${item?.weight}kg`,
						value: item?.id,
						key: item?.id,
					});
				});
				setProductDataOption([...productDataVar]);
			})
			.catch((err) => {
				handleError({ err, setError });
			});
	};
	const getCustomerData = () => {
		axios
			.get("/customer/manage/list_create/", { params: { search: customerSearchValue } })
			.then((res) => {
				const customerDataVar = [];
				res?.data?.results?.map((item) => {
					customerDataVar.push({
						label: `${item?.customer_code} - ${item?.full_name} - ${item?.mobile_number}`,
						value: item?.id,
						key: item?.id,
					});
				});
				setCustomerData([...customerDataVar]);
			})
			.catch((err) => {});
	};
	const getCustomerAddressData = () => {
		const customerId = getValues("customer");
		if (customerId !== undefined) {
			axios
				.get("/customer/manage/address/list_create/", {
					params: { search: customerAddressSearchValue, customer: watch("customer") },
				})
				.then((res) => {
					const customerAddressDataVar = [];
					res?.data?.results?.map((item) => {
						customerAddressDataVar.push({
							label: `${item?.full_address}`,
							value: item?.id,
							key: item?.id,
						});
					});
					setCustomerAddressData([...customerAddressDataVar]);
				})
				.catch((err) => {});
		}
	};
	const getMarketerData = () => {
		axios
			.get("/customer/manage/list_create/", { params: { search: marketerSearchValue } })
			.then((res) => {
				const marketerDataVar = [];
				res?.data?.results?.map((item) => {
					marketerDataVar.push({
						label: `${item?.customer_code} - ${item?.full_name} - ${item?.mobile_number}`,
						value: item?.id,
						key: item?.id,
					});
				});
				setMarketerData([...marketerDataVar]);
			})
			.catch((err) => {});
	};
	const onSubmit = (data) => {
		setLoading(true);
		data.factor_items = [];
		factorProducts.map((item) => {
			data.factor_items.push({
				product: item?.id,
				price: item?.price,
				tax: item?.tax,
				count: item?.count,
			});
		});
		if (editItemID === null) {
			axios
				.post("/factor/manage/list_create/", data)
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
		setFactorProducts([]);
	};
	const filterCustomerOptions = (options, { inputValue }) => {
		debouncedCustomerSearch(inputValue);
		return options;
	};
	const filterCustomerAddressOptions = (options, { inputValue }) => {
		debouncedCustomerAddressSearch(inputValue);
		return options;
	};
	const filterMarketerOptions = (options, { inputValue }) => {
		debouncedMarketerSearch(inputValue);
		return options;
	};
	const filterProductOptions = (options, { inputValue }) => {
		debouncedProductSearch(inputValue);
		return options;
	};
	const addItem = (event, newValue) => {
		if (newValue) {
			const productId = newValue.value;
			const product = productData.find((item) => item.id === productId);
			const factorProductsVar = [...factorProducts];
			const newProduct = { ...product };
			newProduct.count = 1;
			factorProductsVar.push(newProduct);
			setFactorProducts(factorProductsVar);
		}
	};
	const removeItem = (item) => {
		const factorProductsVar = [...factorProducts];
		const productIndex = factorProductsVar.findIndex((node) => node.id === item.id);
		if (productIndex > -1) {
			factorProductsVar.splice(productIndex, 1);
			setFactorProducts([...factorProductsVar]);
		}
	};
	const changeItem = (event, item, field_name) => {
		const factorProductsVar = [...factorProducts];
		const productIndex = factorProductsVar.findIndex((node) => node.id === item.id);
		factorProductsVar[productIndex][field_name] = Number(event.target.value.replace(",", ""));
		setFactorProducts([...factorProductsVar]);
	};

	useEffect(() => {
		getStoreData();
		getCustomerData();
		getMarketerData();
		getProductData();
	}, []);
	useEffect(() => {
		if (customerSearchValue !== "") {
			getCustomerData();
		}
	}, [customerSearchValue]);
	useEffect(() => {
		if (watch("customer") !== null) {
			getCustomerAddressData();
		}
	}, [watch("customer"), customerAddressSearchValue]);
	useEffect(() => {
		if (marketerSearchValue !== "") {
			getMarketerData();
		}
	}, [marketerSearchValue]);
	useEffect(() => {
		if (productSearchValueData !== "") {
			getProductData();
		}
	}, [productSearchValueData]);
	useEffect(() => {
		if (defaultValue !== null) {
			setEditItemID(defaultValue?.id);
			setValue("tracking_code", defaultValue?.tracking_code);
			setValue("payment_type", defaultValue?.payment_type);
			setValue("payment_status", defaultValue?.payment_status);
			setValue("customer", defaultValue?.customer);
			setValue("marketer", defaultValue?.marketer);
			setValue("address", defaultValue?.address);
			setValue("store", defaultValue?.store);
			setValue("description", defaultValue?.description);
		}
	}, [defaultValue]);

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
					<Button size="xlarge" onClick={handleSubmit(onSubmit)} loading={loading}>
						تایید
					</Button>
				</div>
			}
		>
			<form className={style.form}>
				<div className={style.title}>مشخصات فاکتور</div>
				<Input
					className={style.form__input}
					size="xlarge"
					label="شماره فاکتور"
					error={errors.tracking_code?.message}
					{...register("tracking_code")}
				/>
				<Select
					className={style.form__input}
					size="xlarge"
					label="نوع پرداخت"
					required
					options={factorPaymentTypeOptions}
					error={errors.payment_type?.message}
					name="payment_type"
					control={control}
				/>
				<div className={style.payment_status}>
					پرداخت شده؟
					<Switch
						name="payment_status"
						checked={watch("payment_status")}
						onChange={(e) => setValue("payment_status", e.target.checked)}
					/>
				</div>
				<div className={style.title}>مشخصات مشتری</div>
				<RightToLeftLayout>
					<Controller
						control={control}
						name="customer"
						rules={{
							required: true,
						}}
						render={({ field: { value, onChange }, fieldState: { error } }) => (
							<Autocomplete
								className={style.form__input}
								disablePortal
								fullWidth
								PopperComponent={(props) => <Popper {...props} placement="bottom-start" />}
								filterOptions={filterCustomerOptions}
								id="customer"
								size="small"
								options={customerData}
								renderInput={(params) => (
									<>
										<TextField
											error={!!error}
											helperText={error ? error.message : null}
											label="مشتری *"
											size="small"
											{...params}
											{...(params.inputProps.value = value
												? customerData.find((item) => item.value === value)?.label
												: value)}
											sx={sxProps}
										/>
									</>
								)}
								onChange={(e, newValue) => onChange(newValue.value)}
							/>
						)}
					/>
					<Controller
						control={control}
						name="address"
						render={({ field: { value, onChange }, fieldState: { error } }) => (
							<Autocomplete
								className={style.form__input}
								disablePortal
								fullWidth
								PopperComponent={(props) => <Popper {...props} placement="bottom-start" />}
								filterOptions={filterCustomerAddressOptions}
								id="address"
								size="small"
								options={customerAddressData}
								renderInput={(params) => (
									<>
										<TextField
											error={!!error}
											helperText={error ? error.message : null}
											label="آدرس *"
											size="small"
											{...params}
											{...(params.inputProps.value = value
												? customerAddressData.find((item) => item.value === value)?.label
												: value)}
											sx={sxProps}
										/>
									</>
								)}
								onChange={(e, newValue) => onChange(newValue.value)}
							/>
						)}
					/>
					<Controller
						control={control}
						name="marketer"
						render={({ field: { value, onChange }, fieldState: { error } }) => (
							<Autocomplete
								className={style.form__input}
								disablePortal
								fullWidth
								PopperComponent={(props) => <Popper {...props} placement="bottom-start" />}
								filterOptions={filterMarketerOptions}
								id="marketer"
								size="small"
								options={MarketerData}
								renderInput={(params) => (
									<>
										<TextField
											error={!!error}
											helperText={error ? error.message : null}
											label="بازاریاب"
											size="small"
											{...params}
											{...(params.inputProps.value = value
												? MarketerData.find((item) => item.value === value)?.label
												: value)}
											sx={sxProps}
										/>
									</>
								)}
								onChange={(e, newValue) => onChange(newValue.value)}
							/>
						)}
					/>
				</RightToLeftLayout>
				<div className={style.title}>جزئیات فاکتور</div>
				<Select
					className={style.form__input}
					size="xlarge"
					label="انبار"
					required
					options={storeData}
					error={errors.store?.message}
					name="store"
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
				<div className={style.wrapper}>
					<div className={style.info}>
						<div className={style.info__headrow}>
							<div className={style.info__start}>
								<span>محصول</span>
								<span>قیمت واحد</span>
								<span>تعداد</span>
								<span>درصد مالیات</span>
								<span>جمع قیمت</span>
							</div>
						</div>
						{factorProducts.map((item, index) => (
							<div key={item.id} className={style.info__row}>
								<div className={style.info__columnStack}>
									<Tooltip title="پاک کردن">
										<img
											onClick={() => {
												removeItem(item);
											}}
											className={style.removeIcon}
											src={iconRemove}
											alt="icon-remove"
										/>
									</Tooltip>
								</div>
								<div className={style.info__start}>
									<span>
										{item.name} - {item.weight}kg
									</span>
									<span>
										<TextField
											className={style.miniSize}
											type="text"
											size="xsmall"
											value={(item?.price).toLocaleString()}
											onChange={(e) => changeItem(e, item, "price")}
											sx={sxProps}
										/>
									</span>
									<span>
										<TextField
											className={style.miniSize}
											type="text"
											size="xsmall"
											value={(item?.count).toLocaleString()}
											onChange={(e) => changeItem(e, item, "count")}
											sx={sxProps}
										/>
									</span>
									<span>
										{
											<TextField
												className={style.miniSize}
												type="text"
												size="xsmall"
												value={(item?.tax).toLocaleString()}
												onChange={(e) => changeItem(e, item, "tax")}
												sx={sxProps}
											/>
										}
									</span>
									<span>
										{(
											(item?.price + item?.price * (item?.tax / 100)) *
											item?.count
										).toLocaleString()}
									</span>
								</div>
							</div>
						))}
						<div className={style.info__row}>
							<div className={style.info__start}>
								<span>
									<RightToLeftLayout>
										<Autocomplete
											disablePortal
											fullWidth
											PopperComponent={(props) => <Popper {...props} placement="bottom-start" />}
											filterOptions={filterProductOptions}
											id="product"
											size="small"
											options={productDataOption}
											renderInput={(params) => (
												<TextField fullWidth label="محصول" size="small" {...params} sx={sxProps} />
											)}
											onChange={addItem}
											value={""}
										/>
									</RightToLeftLayout>
								</span>
								<span>0</span>
								<span>0</span>
								<span>0</span>
								<span>0</span>
							</div>
						</div>
					</div>
				</div>
			</form>
		</Modal>
	);
};

export default FactorModal;
