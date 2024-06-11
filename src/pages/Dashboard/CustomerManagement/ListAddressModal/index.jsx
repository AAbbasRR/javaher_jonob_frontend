import { IconButton, Tooltip } from "@mui/material";
import _debounce from "lodash/debounce";
import { useEffect, useMemo, useState } from "react";
import IconDelete from "src/assets/icons/icon-delete.svg";
import IconEdit from "src/assets/icons/icon-edit.svg";
import IconSearch from "src/assets/icons/icon-input-search.svg";
import IconAdd from "src/assets/icons/icon-plus-circle-success.svg";
import { Empty } from "src/components/Empty";
import { Input } from "src/components/Input";
import { Modal } from "src/components/Modal";
import { Spin } from "src/components/Spin";
import { Table } from "src/components/Table";
import { handleError } from "src/utils/api-error-handling";
import axios from "src/utils/axios";
import AddressModal from "./AddressModal";
import style from "./style.module.scss";

const ListAddressModal = ({ open, setOpen, customerID }) => {
	const [data, setData] = useState([]);
	const [count, setCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [paginationModel, setPaginationModel] = useState({ pageSize: 15, page: 1 });
	const [value, setValue] = useState("");
	const [reload, setReload] = useState(false);
	const [addressModalOpen, setAddressModalOpen] = useState(false);
	const [editAddressData, setEditAddressData] = useState(null);

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
			.get("/customer/manage/address/list_create/", {
				params: {
					customer: customerID,
					search: searchValue,
					page: page,
					page_size: pageSize,
				},
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
	const deleteAddress = (id) => {
		axios
			.delete("/customer/manage/address/update_delete/", {
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
	const editAddress = (item) => {
		setAddressModalOpen(true);
		setEditAddressData(item);
	};

	useEffect(() => {
		setPaginationModel((e) => ({ ...e, page: 1 }));
	}, [searchValue]);
	useEffect(() => {
		if (customerID) {
			getData();
		}
	}, [customerID, reload, paginationModel]);

	const columns = [
		{
			headerName: "کشور",
			field: "country",
			flex: 1,
			sortable: false,
		},
		{
			headerName: "استان",
			field: "state",
			flex: 1,
			sortable: false,
		},
		{
			headerName: "شهر",
			field: "city",
			flex: 1,
			sortable: false,
		},
		{
			headerName: "خیابان",
			field: "street",
			flex: 1,
			sortable: false,
		},
		{
			headerName: "آدرس",
			field: "full_address",
			flex: 1,
			sortable: false,
		},
		{
			headerName: "تاریخ ایجاد",
			field: "formatted_date_joined",
			flex: 1,
			sortable: false,
			renderCell: ({ row }) => new Date(row?.formatted_create_at).toLocaleString("fa-IR"),
		},
		{
			headerName: "",
			field: "action",
			sortable: false,
			renderCell: ({ row }) => (
				<div className={style.row}>
					<Tooltip title="ویرایش">
						<IconButton className={style.IconButton} onClick={() => editAddress(row)}>
							<img src={IconEdit} alt="delete-icon" />
						</IconButton>
					</Tooltip>
					<Tooltip title="حذف">
						<IconButton className={style.IconButton} onClick={() => deleteAddress(row?.id)}>
							<img src={IconDelete} alt="delete-icon" />
						</IconButton>
					</Tooltip>
				</div>
			),
		},
	];

	return (
		<>
			<Modal fullWidth state={open} setState={() => setOpen(false)} maxWidth="lg">
				<div className={style.wrapper}>
					<div className={style.main}>
						<div className={`${style.history} ${"active"}`}>
							<div className={style.header}>
								<div className={style.header__title}>
									<div className={style.title}>آدرس های مشتری</div>
									<Tooltip title="اضافه کردن آدرس">
										<IconButton
											className={style.IconButton}
											onClick={() => setAddressModalOpen(true)}
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
										rowCount={count}
										loading={loading}
										columns={columns}
										paginationMode="server"
										paginationModel={paginationModel}
										onPaginationModelChange={setPaginationModel}
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
			</Modal>
			<AddressModal
				open={addressModalOpen}
				setOpen={setAddressModalOpen}
				setDefaultValue={setEditAddressData}
				defaultValue={editAddressData}
				reload={reload}
				setReload={setReload}
				customerID={customerID}
			/>
		</>
	);
};

export default ListAddressModal;
