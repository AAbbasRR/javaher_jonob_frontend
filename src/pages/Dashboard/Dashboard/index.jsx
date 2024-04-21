import { IconButton, Tooltip } from "@mui/material";
import _debounce from "lodash/debounce";
import { useEffect, useMemo, useState } from "react";
import IconDelete from "src/assets/icons/icon-delete.svg";
import IconEdit from "src/assets/icons/icon-edit.svg";
import IconExcell from "src/assets/icons/icon-excel-file.svg";
import IconSearch from "src/assets/icons/icon-input-search.svg";
import IconAdd from "src/assets/icons/icon-plus-circle-success.svg";
import { Empty } from "src/components/Empty";
import { Input } from "src/components/Input";
import { Table } from "src/components/Table";
import { handleError } from "src/utils/api-error-handling";
import axios from "src/utils/axios";
import ImportMedicineModal from "./ImportMedicineModal";
import MedicineModal from "./MedicineModal";
import style from "./style.module.scss";

const Dashboard = () => {
	const [data, setData] = useState([]);
	const [count, setCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [paginationModel, setPaginationModel] = useState({ pageSize: 25, page: 0 });
	const [value, setValue] = useState("");
	const [medicineModalOpen, setMedicineModalOpen] = useState(false);
	const [importMedicineModalOpen, setImportMedicineModalOpen] = useState(false);
	const [editMedicineData, setEditMedicineData] = useState(null);
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
			.get("/admin/medicine/manage/list_create/", {
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
	const deleteMedicine = (id) => {
		axios
			.delete("/admin/medicine/manage/update_delete/", {
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
	const editMedicine = (item) => {
		setMedicineModalOpen(true);
		setEditMedicineData(item);
	};

	useEffect(() => {
		setPaginationModel((e) => ({ ...e, page: 0 }));
	}, [searchValue]);
	useEffect(() => {
		getData();
	}, [reload, paginationModel]);

	const columns = [
		{
			headerName: "کد IRC",
			field: "irc",
			flex: 1,
			sortable: false,
		},
		{
			headerName: "کد ژنریک",
			field: "generic_code",
			flex: 1,
			sortable: false,
		},
		{
			headerName: "نام",
			field: "full_name",
			flex: 1,
			sortable: false,
		},
		{
			headerName: "شرایط تعهد",
			field: "term",
			flex: 1,
			sortable: false,
		},
		{
			headerName: "قیمت واحد",
			field: "price",
			flex: 1,
			sortable: false,
			renderCell: ({ row }) => row?.price.toLocaleString(),
		},
		{
			headerName: "شرکت سازنده",
			field: "company",
			flex: 1,
			sortable: false,
		},
		{
			headerName: "",
			field: "action",
			sortable: false,
			renderCell: ({ row }) => (
				<div className={style.row}>
					<Tooltip title="ویرایش">
						<IconButton className={style.IconButton} onClick={() => editMedicine(row)}>
							<img src={IconEdit} alt="delete-icon" />
						</IconButton>
					</Tooltip>
					<Tooltip title="حذف">
						<IconButton className={style.IconButton} onClick={() => deleteMedicine(row?.id)}>
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
								<div className={style.title}>داشبورد</div>
								{/* <Tooltip title="اضافه کردن دارو">
									<IconButton
										className={style.IconButton}
										onClick={() => setMedicineModalOpen(true)}
									>
										<img src={IconAdd} alt="add-icon" />
									</IconButton>
								</Tooltip>
								<Tooltip title="اضافه/ویرایش گروهی دارو">
									<IconButton
										className={style.IconButton}
										onClick={() => setImportMedicineModalOpen(true)}
									>
										<img src={IconExcell} className={style.IconExcell} alt="import-icon" />
									</IconButton>
								</Tooltip> */}
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
						) : (
							<Empty />
						)}
					</div>
				</div>
			</div>
			<MedicineModal
				open={medicineModalOpen}
				setOpen={setMedicineModalOpen}
				setDefaultValue={setEditMedicineData}
				defaultValue={editMedicineData}
				reload={reload}
				setReload={setReload}
			/>
			<ImportMedicineModal
				open={importMedicineModalOpen}
				setOpen={setImportMedicineModalOpen}
				reload={reload}
				setReload={setReload}
			/>
		</>
	);
};

export default Dashboard;
