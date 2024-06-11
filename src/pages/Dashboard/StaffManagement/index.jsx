import { IconButton, Tooltip } from "@mui/material";
import _debounce from "lodash/debounce";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import IconDanger from "src/assets/icons/icon-chips-danger.svg";
import IconSuccess from "src/assets/icons/icon-chips-success.svg";
import IconDelete from "src/assets/icons/icon-delete.svg";
import IconEdit from "src/assets/icons/icon-edit.svg";
import IconSearch from "src/assets/icons/icon-input-search.svg";
import IconAdd from "src/assets/icons/icon-plus-circle-success.svg";
import { Empty } from "src/components/Empty";
import { Input } from "src/components/Input";
import { Spin } from "src/components/Spin";
import { Table } from "src/components/Table";
import useAuthStore from "src/store";
import { handleError } from "src/utils/api-error-handling";
import axios from "src/utils/axios";
import StaffModal from "./StaffModal";
import style from "./style.module.scss";

const StaffManagement = () => {
	const { userInfo } = useAuthStore();
	const navigate = useNavigate();

	const [data, setData] = useState([]);
	const [count, setCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [paginationModel, setPaginationModel] = useState({ pageSize: 15, page: 1 });
	const [value, setValue] = useState("");
	const [adminModalOpen, setAdminModalOpen] = useState(false);
	const [editAdminData, setEditAdminData] = useState(null);
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
			.get("/user/manage/staff/list_create/", {
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
	const deleteAdmin = (id) => {
		setLoading(true);
		axios
			.delete("/user/manage/staff/update_delete/", {
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
	const editAdmin = (item) => {
		setAdminModalOpen(true);
		setEditAdminData(item);
	};

	useEffect(() => {
		if (userInfo?.is_superuser === false) {
			navigate("..");
		}
	}, []);
	useEffect(() => {
		setPaginationModel((e) => ({ ...e, page: 1 }));
	}, [searchValue]);
	useEffect(() => {
		getData();
	}, [reload, paginationModel]);

	const columns = [
		{
			headerName: "نام",
			field: "first_name",
			flex: 1,
			minWidth: 150,
			sortable: false,
		},
		{
			headerName: "نام خانوادگی",
			field: "last_name",
			flex: 1,
			minWidth: 150,
			sortable: false,
		},
		{
			headerName: "نام کاربری",
			field: "username",
			flex: 1,
			minWidth: 150,
			sortable: false,
		},
		{
			headerName: "نوع",
			field: "type_display",
			flex: 1,
			minWidth: 100,
			sortable: false,
		},
		{
			headerName: "تاریخ ایجاد",
			field: "formatted_date_joined",
			flex: 1,
			minWidth: 150,
			sortable: false,
			renderCell: ({ row }) => new Date(row?.formatted_date_joined).toLocaleString("fa-IR"),
		},
		{
			headerName: "تاریخ آخرین ورود",
			field: "formatted_last_login",
			flex: 1,
			minWidth: 150,
			sortable: false,
			renderCell: ({ row }) => {
				if (row?.formatted_last_login === null) {
					return "وارد نشده";
				}
				return new Date(row?.formatted_last_login).toLocaleString("fa-IR");
			},
		},
		{
			headerName: "فعال بودن حساب",
			field: "is_active",
			sortable: false,
			renderCell: ({ row }) => (
				<img
					className={style.roleChips}
					src={row?.is_active ? IconSuccess : IconDanger}
					alt="is_active_status"
				/>
			),
		},
		{
			headerName: "",
			field: "action",
			sortable: false,
			renderCell: ({ row }) => (
				<div className={style.row}>
					<Tooltip title="ویرایش">
						<IconButton className={style.IconButton} onClick={() => editAdmin(row)}>
							<img src={IconEdit} alt="delete-icon" />
						</IconButton>
					</Tooltip>
					<Tooltip title="حذف">
						<IconButton className={style.IconButton} onClick={() => deleteAdmin(row?.id)}>
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
								<div className={style.title}>مدیریت کارمندان</div>
								<Tooltip title="اضافه کردن کارمند">
									<IconButton className={style.IconButton} onClick={() => setAdminModalOpen(true)}>
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
			<StaffModal
				open={adminModalOpen}
				setOpen={setAdminModalOpen}
				setDefaultValue={setEditAdminData}
				defaultValue={editAdminData}
				reload={reload}
				setReload={setReload}
			/>
		</>
	);
};

export default StaffManagement;
