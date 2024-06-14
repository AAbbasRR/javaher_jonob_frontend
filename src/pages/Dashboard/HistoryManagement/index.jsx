import { Button, IconButton, Tooltip } from "@mui/material";
import _debounce from "lodash/debounce";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import JSONView from "react-json-view";
import IconSearch from "src/assets/icons/icon-input-search.svg";
import IconSearchList from "src/assets/icons/icon-search-document.svg";
import { Button as CustomButton } from "src/components/Button";
import { Empty } from "src/components/Empty";
import { Input } from "src/components/Input";
import { Modal } from "src/components/Modal";
import { Spin } from "src/components/Spin";
import { Table } from "src/components/Table";
import { handleError } from "src/utils/api-error-handling";
import axios from "src/utils/axios";
import FilterModal from "./FilterModal";
import style from "./style.module.scss";

const ModelOptions = {
	Store: "انبار",
	User: "کارمندان",
	Product: "محصول",
	Factor: "فاکتور",
	Driver: "راننده",
	Customer: "مشتری",
	CustomerAddress: "آدرس مشتری",
	FactorItems: "اقلام فاکتور",
	FactorPayments: "پرداختی فاکتور",
};

const HistoryManagement = () => {
	const {
		control,
		reset,
		getValues,
		clearErrors,
		setError,
		formState: { errors },
	} = useForm({
		mode: "onChange",
		defaultValues: {
			// time_after: "",
			// time_before: "",
			model_name: "",
			action: "",
		},
	});

	const [data, setData] = useState([]);
	const [count, setCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [paginationModel, setPaginationModel] = useState({ pageSize: 15, page: 1 });
	const [value, setValue] = useState("");
	const [filterModal, setFilterModal] = useState(false);
	const [dataJsonModal, setDataJsonModal] = useState(false);
	const [dataJsonSelected, setDataJsonSelected] = useState(null);

	const debouncedSearch = useMemo(
		() =>
			_debounce((value) => {
				setSearchValue(value);
			}, 750),
		[searchValue],
	);

	const handleChange = (e) => {
		const value = e.target.value;
		setValue(value);
		debouncedSearch(value);
	};
	const getData = () => {
		setLoading(true);
		const { pageSize, page } = paginationModel;
		// let time_after = getValues("time_after");
		// let time_before = getValues("time_before");

		// if (time_after !== "" && time_after !== null) {
		// 	time_after = moment(time_after).format("YYYY-MM-DD");
		// }

		// if (time_before !== "" && time_before !== null) {
		// 	time_before = moment(time_before).format("YYYY-MM-DD");
		// }

		axios
			.get("/history/manage/list/", {
				params: {
					search: searchValue,
					page: page,
					page_size: pageSize,
					// time_after: time_after,
					// time_before: time_before,
					model_name: getValues("model_name"),
					action: getValues("action"),
				},
			})
			.then((res) => {
				setData(res.data.results);
				setCount(res?.data?.total);
				clearErrors();
				setFilterModal(false);
			})
			.catch((err) => {
				handleError({ err, setError });
			})
			.finally(() => setLoading(false));
	};
	const resetFilter = () => {
		reset();
		getData();
	};
	const openDataJsonModal = (row) => {
		setDataJsonSelected(row);
		setDataJsonModal(true);
	};

	useEffect(() => {
		setPaginationModel((e) => ({ ...e, page: 1 }));
	}, [searchValue]);
	useEffect(() => {
		getData();
	}, [paginationModel]);

	const columns = [
		{
			headerName: "نام بخش",
			field: "model_name",
			flex: 1,
			minWidth: 150,
			sortable: false,
			renderCell: ({ row }) => `${ModelOptions[row?.model_name]} (ردیف: ${row?.object_id})`,
		},
		{
			headerName: "رویداد",
			field: "action_display",
			flex: 1,
			minWidth: 100,
			sortable: false,
		},
		{
			headerName: "نام و نام خانوادگی تغییر دهنده",
			field: "user__fullname",
			flex: 1,
			minWidth: 120,
			sortable: false,
			renderCell: ({ row }) =>
				row?.user?.first_name + " " + row?.user?.last_name === "undefined undefined" && "خالی",
		},
		{
			headerName: "نام کاربری تغییر دهنده",
			field: "user__username",
			flex: 1,
			minWidth: 150,
			sortable: false,
			renderCell: ({ row }) => row?.user?.username,
		},
		{
			headerName: "سمت تغییر دهنده",
			field: "user__type_display",
			flex: 1,
			minWidth: 150,
			sortable: false,
			renderCell: ({ row }) => row?.user?.type_display,
		},
		{
			headerName: "داده ها",
			field: "datas",
			flex: 1,
			minWidth: 150,
			sortable: false,
			renderCell: ({ row }) => (
				<Tooltip title="داده ها">
					<IconButton className={style.IconButton} onClick={() => openDataJsonModal(row)}>
						<img src={IconSearchList} className={style.searchListIcon} alt="data-icon" />
					</IconButton>
				</Tooltip>
			),
		},
		{
			headerName: "زمان رویداد",
			field: "formatted_time",
			flex: 1,
			minWidth: 150,
			sortable: false,
			renderCell: ({ row }) => new Date(row?.formatted_time).toLocaleString("fa-IR"),
		},
	];

	return (
		<>
			<div className={style.wrapper}>
				<div className={style.main}>
					<div className={`${style.history} ${"active"}`}>
						<div className={style.header}>
							<div className={style.header__title}>
								<div className={style.title}>لیست تغییرات</div>
							</div>
							<div className={style.row}>
								<Button variant="contained" onClick={() => setFilterModal(true)}>
									فیلتر
								</Button>
								<Input
									size="small"
									value={value}
									className={style.input}
									onChange={handleChange}
									placeholder="جستجو..."
									rightIcon={<img src={IconSearch} alt="search-icon" />}
								/>
							</div>
						</div>
						{data.length > 0 ? (
							<div className={style.table}>
								<Table
									rows={data}
									loading={loading}
									columns={columns}
									paginationCount={count}
									pagination={paginationModel}
									paginationChange={setPaginationModel}
								/>
							</div>
						) : loading ? (
							<Spin size={50} />
						) : (
							<Empty />
						)}
					</div>
				</div>
			</div>
			<FilterModal
				open={filterModal}
				setOpen={setFilterModal}
				control={control}
				errors={errors}
				onSubmit={getData}
				reset={resetFilter}
			/>
			<Modal
				fullWidth
				state={dataJsonModal}
				setState={() => setDataJsonModal(false)}
				maxWidth="lg"
				footerEnd={
					<CustomButton
						size="xlarge"
						className={style.button}
						variant="ghost"
						onClick={() => setDataJsonModal(false)}
					>
						بستن
					</CustomButton>
				}
			>
				{dataJsonSelected?.data_before && (
					<div className={style.jsonBox}>
						<span className={style.title}>داده قبل از تغییر</span>
						<JSONView src={JSON.parse(JSON.stringify(dataJsonSelected?.data_before))} />
					</div>
				)}
				{dataJsonSelected?.data_after && (
					<div className={style.jsonBox}>
						<span className={style.title}>داده بعد از تغییر</span>
						<JSONView src={JSON.parse(JSON.stringify(dataJsonSelected?.data_after))} />
					</div>
				)}
			</Modal>
		</>
	);
};

export default HistoryManagement;
