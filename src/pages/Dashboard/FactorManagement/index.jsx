import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { Button, IconButton, Tooltip } from "@mui/material";
import _debounce from "lodash/debounce";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import iconReject from "src/assets/icons/icon-chips-danger.svg";
import iconAccept from "src/assets/icons/icon-chips-success.svg";
import IconDelete from "src/assets/icons/icon-delete.svg";
import IconEdit from "src/assets/icons/icon-edit.svg";
import iconInfo from "src/assets/icons/icon-info.svg";
import {
	default as IconSearch,
	default as iconPayment,
} from "src/assets/icons/icon-input-search.svg";
import IconAdd from "src/assets/icons/icon-plus-circle-success.svg";
import iconDetail from "src/assets/icons/icon-search-document.svg";
import { Empty } from "src/components/Empty";
import { Input } from "src/components/Input";
import { Spin } from "src/components/Spin";
import { Table } from "src/components/Table";
import useAuthStore from "src/store";
import { handleError } from "src/utils/api-error-handling";
import axios from "src/utils/axios";
import FactorModal from "./FactorModal";
import PaymentsModal from "./PaymentsModal";
import style from "./style.module.scss";

const FactorManagement = () => {
	const { userInfo } = useAuthStore();
	const navigate = useNavigate();

	const [data, setData] = useState([]);
	const [count, setCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [paginationModel, setPaginationModel] = useState({ pageSize: 15, page: 0 });
	const [value, setValue] = useState("");
	const [adminModalOpen, setAdminModalOpen] = useState(false);
	const [editAdminData, setEditAdminData] = useState(null);
	const [paymentsModalOpen, setPaymentsModalOpen] = useState(false);
	const [paymentsData, setPaymentsData] = useState(null);
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
			.get("/factor/manage/list_create/", {
				params: { search: searchValue, page: page + 1, page_size: pageSize },
			})
			.then((res) => {
				setData(res.data.results);
				setCount(res?.data?.count_all);
			})
			.catch((err) => {
				handleError({ err });
			})
			.finally(() => setLoading(false));
	};
	const deleteAdmin = (id) => {
		setLoading(true);
		axios
			.delete("/factor/manage/update_delete/", {
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
	const paymentsModal = (item) => {
		setPaymentsModalOpen(true);
		setPaymentsData(item);
	};
	const acceptFactor = (id) => {
		axios
			.put(`/factor/manage/accept_factor/?pk=${id}`)
			.then((res) => {
				getData();
			})
			.catch((err) => {
				handleError({ err });
			});
	};

	useEffect(() => {
		if (userInfo?.is_superuser === false) {
			navigate("..");
		}
	}, []);
	useEffect(() => {
		setPaginationModel((e) => ({ ...e, page: 0 }));
	}, [searchValue]);
	useEffect(() => {
		getData();
	}, [reload, paginationModel]);

	const columns = [
		{
			headerName: "شماره فاکتور",
			field: "tracking_code",
			flex: 1,
			minWidth: 150,
			sortable: false,
		},
		{
			headerName: "تاریخ فاکتور",
			field: "factor_date",
			flex: 1,
			minWidth: 100,
			sortable: false,
			renderCell: ({ row }) => new Date(row?.factor_date).toLocaleString("fa-IR").split(", ")[0],
		},
		{
			headerName: "مبلغ فاکتور(ریال)",
			field: "payment_amount",
			flex: 1,
			minWidth: 120,
			sortable: false,
			renderCell: ({ row }) => row?.payment_amount.toLocaleString(),
		},
		{
			headerName: "مشتری",
			field: "customer_data",
			flex: 1,
			minWidth: 120,
			sortable: false,
			renderCell: ({ row }) => row?.customer_data?.full_name,
		},
		{
			headerName: "بازاریاب",
			field: "marketer_data",
			flex: 1,
			minWidth: 120,
			sortable: false,
			renderCell: ({ row }) => row?.customer_data?.marketer || "خالی",
		},
		{
			headerName: "وضعیت پرداخت",
			flex: 1,
			minWidth: 130,
			sortable: false,
			renderCell: ({ row }) => (
				<span
					className={row?.payment_status ? style.paymentStatusSuccess : style.paymentStatusError}
				>
					{row?.payment_status ? "پرداخت شده" : "پرداخت نشده"}
				</span>
			),
		},
		{
			headerName: "انبار",
			field: "store_data",
			flex: 1,
			minWidth: 150,
			sortable: false,
		},
		{
			headerName: "تایید شده",
			field: "is_accepted",
			flex: 1,
			minWidth: 100,
			sortable: false,
			renderCell: ({ row }) => (
				<div className={style.stack}>
					<img
						className={style.Icon}
						src={row?.is_accepted ? iconAccept : iconReject}
						alt="is_accepted"
					/>
					{!row?.is_accepted && row?.can_accept && (
						<Button
							onClick={() => acceptFactor(row?.id)}
							size="small"
							variant="contained"
							color="success"
						>
							تایید
						</Button>
					)}
				</div>
			),
		},
		{
			headerName: "پرداخت / چاپ فاکتور",
			field: "payment",
			flex: 1,
			minWidth: 100,
			sortable: false,
			renderCell: ({ row }) => (
				<div className={style.row}>
					<Tooltip title="چاپ">
						<IconButton className={style.IconButton} onClick={() => deleteAdmin(row?.id)}>
							<LocalPrintshopIcon alt="print-icon" />
						</IconButton>
					</Tooltip>
					<Tooltip title="دریافت/پرداخت">
						<IconButton className={style.IconButton} onClick={() => paymentsModal(row)}>
							<img src={iconPayment} alt="payment-icon" />
						</IconButton>
					</Tooltip>
				</div>
			),
		},
		{
			headerName: "تاریخ ایجاد",
			field: "formatted_create_at",
			flex: 1,
			minWidth: 150,
			sortable: false,
			renderCell: ({ row }) => new Date(row?.formatted_create_at).toLocaleString("fa-IR"),
		},
		{
			headerName: "",
			field: "action",
			sortable: false,
			renderCell: ({ row }) => (
				<div className={style.row}>
					<Tooltip title={`توضیحات: ${row?.description || "خالی"}`}>
						<IconButton className={style.IconButton}>
							<img src={iconInfo} alt="info-icon" />
						</IconButton>
					</Tooltip>
					{["superuser", "staff", "secretary"].includes(userInfo.type) && (
						<Tooltip title="ویرایش">
							<IconButton className={style.IconButton} onClick={() => editAdmin(row)}>
								<img src={IconEdit} alt="delete-icon" />
							</IconButton>
						</Tooltip>
					)}
					{["superuser", "staff"].includes(userInfo.type) && (
						<Tooltip title="حذف">
							<IconButton className={style.IconButton} onClick={() => deleteAdmin(row?.id)}>
								<img src={IconDelete} alt="delete-icon" />
							</IconButton>
						</Tooltip>
					)}
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
								<div className={style.title}>مدیریت فاکتور</div>
								<Tooltip title="ثبت فاکتور جدید">
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
			<FactorModal
				open={adminModalOpen}
				setOpen={setAdminModalOpen}
				setDefaultValue={setEditAdminData}
				defaultValue={editAdminData}
				reload={reload}
				setReload={setReload}
			/>
			<PaymentsModal
				open={paymentsModalOpen}
				setOpen={setPaymentsModalOpen}
				defaultValues={paymentsData}
				reload={reload}
				setReload={setReload}
			/>
		</>
	);
};

export default FactorManagement;
