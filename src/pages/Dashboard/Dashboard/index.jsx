import PendingIcon from "@mui/icons-material/Pending";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SellIcon from "@mui/icons-material/Sell";
import { Button, Divider, Grid } from "@mui/material";
import moment from "moment-jalaali";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { handleError } from "src/utils/api-error-handling";
import axios from "src/utils/axios";
import FilterModal from "./FilterModal";
import BarChart from "./barChart";
import LineChart from "./lineChart";
import PieChart from "./pieChart";
import style from "./style.module.scss";

const Dashboard = () => {
	moment.loadPersian({ dialect: "persian-modern" });
	const nowDateJalali = moment();
	const startDate = nowDateJalali.startOf("jMonth").toDate();
	const endDate = nowDateJalali.endOf("jMonth").toDate();
	const {
		control,
		getValues,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm({
		mode: "onChange",
		defaultValues: {
			marketer_factor_date_after: startDate,
			marketer_factor_date_before: endDate,
			stores_factor_date_after: startDate,
			stores_factor_date_before: endDate,
			sales_factor_date_after: startDate,
			sales_factor_date_before: endDate,
			product_factor_date_after: startDate,
			product_factor_date_before: endDate,
		},
	});

	const [infoBoxdata, setInfoBoxData] = useState([]);
	const [fieldType, setFieldType] = useState("marketer");
	const [marketerChartData, setMarketerChartData] = useState([]);
	const [storesChartData, setStoresChartData] = useState([]);
	const [salesChartData, setSaleesChartData] = useState([]);
	const [productsChartData, setProductsChartData] = useState([]);
	const [productsChartKeys, setProductsChartKeys] = useState([]);
	const [filterModal, setFilterModal] = useState(false);

	const openFilterModal = (fieldType) => {
		setFilterModal(true);
		setFieldType(fieldType);
	};
	const submitFilterChart = () => {
		switch (fieldType) {
			case "marketer":
				getMarketerData();
				break;
			case "stores":
				getStoresData();
				break;
			case "sales":
				getSalesData();
				break;
			case "product":
				getProductsData();
				break;
			default:
				break;
		}
	};
	const getData = () => {
		axios
			.get("/dashboard/info_data/")
			.then((res) => {
				setInfoBoxData(res.data);
			})
			.catch((err) => {
				handleError({ err });
			});
	};
	const getMarketerData = () => {
		let factor_date_after = moment(getValues(`marketer_factor_date_after`)).format("YYYY-MM-DD");
		let factor_date_before = moment(getValues(`marketer_factor_date_before`)).format("YYYY-MM-DD");
		axios
			.get(
				`/dashboard/marketer_chart/?factor_date_after=${factor_date_after}&factor_date_before=${factor_date_before}`,
			)
			.then((res) => {
				res?.data?.result?.map((item) => {
					item.id = item?.customer__marketer;
					item.label = item?.customer__marketer;
					item.value = item?.total_payment_amount;
				});
				setMarketerChartData(res.data?.result);
				setFilterModal(false);
				clearErrors();
			})
			.catch((err) => {
				handleError({ err, setError });
			});
	};
	const getStoresData = () => {
		let factor_date_after = moment(getValues(`stores_factor_date_after`)).format("YYYY-MM-DD");
		let factor_date_before = moment(getValues(`stores_factor_date_before`)).format("YYYY-MM-DD");
		axios
			.get(
				`/dashboard/stores_chart/?factor_date_after=${factor_date_after}&factor_date_before=${factor_date_before}`,
			)
			.then((res) => {
				res?.data?.result?.map((item) => {
					item.id = item?.store__name;
					item.label = item?.store__name;
					item.value = item?.total_payment_amount;
				});
				setStoresChartData(res.data?.result);
				setFilterModal(false);
				clearErrors();
			})
			.catch((err) => {
				handleError({ err, setError });
			});
	};
	const getSalesData = () => {
		let factor_date_after = moment(getValues(`sales_factor_date_after`)).format("YYYY-MM-DD");
		let factor_date_before = moment(getValues(`sales_factor_date_before`)).format("YYYY-MM-DD");
		axios
			.get(
				`/dashboard/sales_chart/?factor_date_after=${factor_date_after}&factor_date_before=${factor_date_before}`,
			)
			.then((res) => {
				res?.data?.result?.map((item) => {
					item.x = new Date(item?.date).toLocaleString("fa-IR").split(",")[0];
					item.y = item?.total_payment_amount;
				});
				setSaleesChartData([
					{
						id: "فروش روزانه",
						data: res.data?.result,
					},
				]);
				setFilterModal(false);
				clearErrors();
			})
			.catch((err) => {
				handleError({ err, setError });
			});
	};
	const getProductsData = () => {
		let factor_date_after = moment(getValues(`product_factor_date_after`)).format("YYYY-MM-DD");
		let factor_date_before = moment(getValues(`product_factor_date_before`)).format("YYYY-MM-DD");
		axios
			.get(
				`/dashboard/products_chart/?factor_date_after=${factor_date_after}&factor_date_before=${factor_date_before}`,
			)
			.then((res) => {
				res?.data?.result?.map((item) => {
					item.date = new Date(item?.date).toLocaleString("fa-IR").split(",")[0];
				});
				setProductsChartData(res.data?.result);
				setProductsChartKeys(res.data?.keys);
				setFilterModal(false);
				clearErrors();
			})
			.catch((err) => {
				handleError({ err, setError });
			});
	};

	useEffect(() => {
		getData();
		getMarketerData();
		getStoresData();
		getSalesData();
		getProductsData();
	}, []);

	return (
		<>
			<div className={style.wrapper}>
				<div className={style.main}>
					<div className={`${style.history} ${"active"}`}>
						<div className={style.header}>
							<div className={style.header__title}>
								<div className={style.title}>داشبورد</div>
							</div>
						</div>
					</div>
					<Grid container direction={"row"} spacing={2}>
						<Grid item xs={12} lg={4}>
							<div className={`${style.infoBox} ${style.primaryBox}`}>
								<div className={style.infoBox__title}>
									<span className={style.infoBox__title__counter}>
										{infoBoxdata?.factor_count || 0}
									</span>
									<span>فاکتور های امروز</span>
								</div>
								<ReceiptIcon className={style.infoBox__icon} />
							</div>
						</Grid>
						<Grid item xs={12} lg={4}>
							<div className={`${style.infoBox} ${style.successBox}`}>
								<div className={style.infoBox__title}>
									<span className={style.infoBox__title__counter}>
										{infoBoxdata?.factor_sell?.toLocaleString() || 0}
									</span>
									<span>مقدار فروش امروز(ریال)</span>
								</div>
								<div>
									<SellIcon className={style.infoBox__icon} />
								</div>
							</div>
						</Grid>
						<Grid item xs={12} lg={4}>
							<div className={`${style.infoBox} ${style.warningBox}`}>
								<div className={`${style.infoBox__title} ${style.infoBox__titleDark}`}>
									<span className={style.infoBox__title__counter}>
										{infoBoxdata?.factor_not_accepted || 0}
									</span>
									<span>فاکتور های در انتظار تایید</span>
								</div>
								<PendingIcon className={style.infoBox__icon} />
							</div>
						</Grid>
						<Grid item xs={12} lg={6}>
							<div className={style.chartBox}>
								<div className={style.chartBox__header}>
									<span className={style.chartBox__header__title}>فروش بازاریاب ها</span>
									<div className={style.chartBox__header__filterbox}>
										<Button
											size="small"
											variant="contained"
											onClick={() => openFilterModal("marketer")}
										>
											فیلتر
										</Button>
									</div>
								</div>
								<Divider />
								<PieChart data={marketerChartData} />
							</div>
						</Grid>
						<Grid item xs={12} lg={6}>
							<div className={style.chartBox}>
								<div className={style.chartBox__header}>
									<span className={style.chartBox__header__title}>مقایسه فاکتور انبار ها</span>
									<div className={style.chartBox__header__filterbox}>
										<Button
											size="small"
											variant="contained"
											onClick={() => openFilterModal("stores")}
										>
											فیلتر
										</Button>
									</div>
								</div>
								<Divider />
								<PieChart data={storesChartData} full />
							</div>
						</Grid>
						<Grid item xs={12}>
							<div className={style.chartBox__Big}>
								<div className={style.chartBox__header}>
									<span className={style.chartBox__header__title}>فروش روزانه</span>
									<div className={style.chartBox__header__filterbox}>
										<Button
											size="small"
											variant="contained"
											onClick={() => openFilterModal("sales")}
										>
											فیلتر
										</Button>
									</div>
								</div>
								<Divider />
								{salesChartData[0]?.data.length >= 1 && <LineChart data={salesChartData} />}
							</div>
						</Grid>
						<Grid item xs={12}>
							<div className={style.chartBox__Big}>
								<div className={style.chartBox__header}>
									<span className={style.chartBox__header__title}>فروش تعداد محصول</span>
									<div className={style.chartBox__header__filterbox}>
										<Button
											size="small"
											variant="contained"
											onClick={() => openFilterModal("product")}
										>
											فیلتر
										</Button>
									</div>
								</div>
								<Divider />
								<BarChart keys={productsChartKeys} indexBy={"date"} data={productsChartData} />
							</div>
						</Grid>
					</Grid>
				</div>
			</div>
			<FilterModal
				open={filterModal}
				setOpen={setFilterModal}
				control={control}
				errors={errors}
				onSubmit={submitFilterChart}
				fieldType={fieldType}
			/>
		</>
	);
};

export default Dashboard;
