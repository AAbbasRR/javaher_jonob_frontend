import { IconButton, Tooltip } from "@mui/material";
import _debounce from "lodash/debounce";
import { useEffect, useMemo, useState } from "react";
import IconDelete from "src/assets/icons/icon-delete.svg";
import IconEdit from "src/assets/icons/icon-edit.svg";
import IconSearch from "src/assets/icons/icon-input-search.svg";
import IconAdd from "src/assets/icons/icon-plus-circle-success.svg";
import IconSearchList from "src/assets/icons/icon-search-document.svg";
import { Empty } from "src/components/Empty";
import { Spin } from "src/components/Spin";
import { Input } from "src/components/Input";
import { Table } from "src/components/Table";
import { handleError } from "src/utils/api-error-handling";
import axios from "src/utils/axios";
import CustomerModal from "./CustomerModal";
import ListAddressModal from "./ListAddressModal";
import style from "./style.module.scss";

const CustomerManagement = () => {
	const [data, setData] = useState([]);
	const [count, setCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [paginationModel, setPaginationModel] = useState({ pageSize: 15, page: 1 });
	const [listAddressModalOpen, setListAddressModalOpen] = useState(false);
	const [value, setValue] = useState("");
	const [customerModalOpen, setCustomerModalOpen] = useState(false);
	const [editCustomerData, setEditCustomerData] = useState(null);
	const [selectedCustomerID, setSelectedCustomerID] = useState(null);
	const [reload, setReload] = useState(false);

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

		axios
			.get("/customer/manage/list_create/", {
				params: { search: searchValue, page: page, page_size: pageSize },
			})
			.then((res) => {
				setData(res.data.results);
				setCount(res?.data?.total);
			})
			.catch((err) => {
				handleError({ err });
			})
			.finally(() => setLoading(false));
	};
	const deleteCustomer = (id) => {
		setLoading(true);
		axios
			.delete("/customer/manage/update_delete/", {
				params: { pk: id },
			})
			.then((res) => {
				getData();
			})
			.catch((err) => {
				handleError({ err });
			})
			.finally(() => setLoading(false));
	};
	const editCustomer = (item) => {
		setCustomerModalOpen(true);
		setEditCustomerData(item);
	};
	const showListCustomerAddress = (id) => {
		setSelectedCustomerID(id);
		setListAddressModalOpen(true);
	};

	useEffect(() => {
		setPaginationModel((e) => ({ ...e, page: 1 }));
	}, [searchValue]);
	useEffect(() => {
		getData();
	}, [reload, paginationModel]);

	const columns = [
		{
			headerName: "کد مشتری",
			field: "customer_code",
			flex: 1,
			minWidth: 150,
			sortable: false,
		},
		{
			headerName: "نام و نام خانوادگی",
			field: "full_name",
			flex: 1,
			minWidth: 150,
			sortable: false,
		},
		{
			headerName: "بازاریاب",
			field: "marketer",
			flex: 1,
			minWidth: 150,
			sortable: false,
		},
		{
			headerName: "شماره تماس",
			field: "mobile_number",
			flex: 1,
			minWidth: 150,
			sortable: false,
		},
		{
			headerName: "کد ملی",
			field: "national_code",
			flex: 1,
			minWidth: 150,
			sortable: false,
		},
		{
			headerName: "تاریخ ایجاد",
			field: "formatted_date_joined",
			flex: 1,
			minWidth: 150,
			sortable: false,
			renderCell: ({ row }) => new Date(row?.formatted_create_at).toLocaleString("fa-IR"),
		},
		{
			headerName: "آدرس های مشتری",
			field: "medicines",
			flex: 1,
			minWidth: 150,
			sortable: false,
			renderCell: ({ row }) => (
				<Tooltip title="آدرس ها">
					<IconButton className={style.IconButton} onClick={() => showListCustomerAddress(row?.id)}>
						<img src={IconSearchList} className={style.searchListIcon} alt="documents-icon" />
					</IconButton>
				</Tooltip>
			),
		},
		{
			headerName: "",
			field: "action",
			sortable: false,
			renderCell: ({ row }) => (
				<div className={style.row}>
					<Tooltip title="ویرایش">
						<IconButton className={style.IconButton} onClick={() => editCustomer(row)}>
							<img src={IconEdit} alt="delete-icon" />
						</IconButton>
					</Tooltip>
					<Tooltip title="حذف">
						<IconButton className={style.IconButton} onClick={() => deleteCustomer(row?.id)}>
							<img src={IconDelete} alt="delete-icon" />
						</IconButton>
					</Tooltip>
				</div>
			),
		},
	];

	return (
		<>
			<div className={style.wrapper}>
				<div className={style.main}>
					<div className={`${style.history} ${"active"}`}>
						<div className={style.header}>
							<div className={style.header__title}>
								<div className={style.title}>مدیریت مشتریان</div>
								<Tooltip title="اضافه کردن مشتری">
									<IconButton
										className={style.IconButton}
										onClick={() => setCustomerModalOpen(true)}
									>
										<img src={IconAdd} alt="add-icon" />
									</IconButton>
								</Tooltip>
							</div>
							<Input
								size="small"
								value={value}
								className={style.input}
								onChange={handleChange}
								placeholder="جستجو..."
								rightIcon={<img src={IconSearch} alt="search-icon" />}
							/>
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
			<CustomerModal
				open={customerModalOpen}
				setOpen={setCustomerModalOpen}
				setDefaultValue={setEditCustomerData}
				defaultValue={editCustomerData}
				reload={reload}
				setReload={setReload}
			/>
			<ListAddressModal
				open={listAddressModalOpen}
				setOpen={setListAddressModalOpen}
				customerID={selectedCustomerID}
			/>
		</>
	);
};

export default CustomerManagement;
