import PendingIcon from "@mui/icons-material/Pending";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SellIcon from "@mui/icons-material/Sell";
import { Divider, Grid } from "@mui/material";
import BarChart from "./barChart";
import { useEffect, useState } from "react";
import { handleError } from "src/utils/api-error-handling";
import axios from "src/utils/axios";
import LineChart from "./lineChart";
import PieChart from "./pieChart";
import style from "./style.module.scss";

const months = {
	"۱": "فروردین",
	"۲": "اردیبهشت",
	"۳": "خرداد",
	"۴": "تیر",
	"۵": "مرداد",
	"۶": "شهریور",
	"۷": "مهر",
	"۸": "آبان",
	"۹": "آذر",
	"۱۰": "دی",
	"۱۱": "بهمن",
	"۱۲": "اسفند",
};

const Dashboard = () => {
	const [infoBoxdata, setInfoBoxData] = useState([]);
	const [marketerChartData, setMarketerChartData] = useState([]);
	const [marketerFilter, setMarketerFilter] = useState("monthly");
	const [storesChartData, setStoresChartData] = useState([]);
	const [storesFilter, setStoresFilter] = useState("monthly");
	const [salesChartData, setSaleesChartData] = useState([]);
	const [salesFilter, setSalesFilter] = useState("monthly");
	const [productsChartData, setProductsChartData] = useState([]);
	const [productsChartKeys, setProductsChartKeys] = useState([]);
	const [productsFilter, setProductsFilter] = useState("monthly");

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
		axios
			.get(`/dashboard/marketer_chart/?filter=${marketerFilter}`)
			.then((res) => {
				res?.data?.result?.map((item) => {
					item.id = item?.customer__marketer;
					item.label = item?.customer__marketer;
					item.value = item?.total_payment_amount;
				});
				setMarketerChartData(res.data?.result);
			})
			.catch((err) => {
				handleError({ err });
			});
	};
	const getStoresData = () => {
		axios
			.get(`/dashboard/stores_chart/?filter=${storesFilter}`)
			.then((res) => {
				res?.data?.result?.map((item) => {
					item.id = item?.store__name;
					item.label = item?.store__name;
					item.value = item?.total_payment_amount;
				});
				setStoresChartData(res.data?.result);
			})
			.catch((err) => {
				handleError({ err });
			});
	};
	const getSalesData = () => {
		axios
			.get(`/dashboard/sales_chart/?filter=${salesFilter}`)
			.then((res) => {
				if (salesFilter === "monthly") {
					res?.data?.result?.map((item) => {
						item.x = new Date(item?.date).toLocaleString("fa-IR").split(",")[0];
						item.y = item?.total_payment_amount;
					});
				} else if (salesFilter === "yearly") {
					res?.data?.result?.map((item) => {
						item.x =
							months[new Date(item?.date).toLocaleString("fa-IR").split(",")[0].split("/")[1]];
						item.y = item?.total_payment_amount;
					});
				} else {
					res?.data?.result?.map((item) => {
						item.x = new Date(item?.date).toLocaleString("fa-IR").split(",")[1];
						item.y = item?.total_payment_amount;
					});
				}
				setSaleesChartData([
					{
						id: "فروش روزانه",
						data: res.data?.result,
					},
				]);
			})
			.catch((err) => {
				handleError({ err });
			});
	};
	const getProductsData = () => {
		axios
			.get(`/dashboard/products_chart/?filter=${productsFilter}`)
			.then((res) => {
				if (productsFilter === "monthly") {
					res?.data?.result?.map((item) => {
						item.date = new Date(item?.date).toLocaleString("fa-IR").split(",")[0];
					});
				} else if (productsFilter === "yearly") {
					res?.data?.result?.map((item) => {
						item.date =
							months[new Date(item?.date).toLocaleString("fa-IR").split(",")[0].split("/")[1]];
					});
				} else {
					res?.data?.result?.map((item) => {
						item.date = new Date(item?.date).toLocaleString("fa-IR").split(",")[1];
					});
				}
				setProductsChartData(res.data?.result);
				setProductsChartKeys(res.data?.keys);
			})
			.catch((err) => {
				handleError({ err });
			});
	};

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		getMarketerData();
	}, [marketerFilter]);

	useEffect(() => {
		getStoresData();
	}, [storesFilter]);

	useEffect(() => {
		getSalesData();
	}, [salesFilter]);

	useEffect(() => {
		getProductsData();
	}, [productsFilter]);

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
										{infoBoxdata?.factor_sell || 0}
									</span>
									<span>(ریال)مقدار فروش امروز</span>
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
										<span
											onClick={() => setMarketerFilter("daily")}
											className={`${style.chartBox__header__filterbox__button} ${
												marketerFilter === "daily" &&
												style.chartBox__header__filterbox__button__active
											}`}
										>
											روزانه
										</span>
										<span
											onClick={() => setMarketerFilter("monthly")}
											className={`${style.chartBox__header__filterbox__button} ${
												marketerFilter === "monthly" &&
												style.chartBox__header__filterbox__button__active
											}`}
										>
											ماهانه
										</span>
										<span
											onClick={() => setMarketerFilter("yearly")}
											className={`${style.chartBox__header__filterbox__button} ${
												marketerFilter === "yearly" &&
												style.chartBox__header__filterbox__button__active
											}`}
										>
											سالانه
										</span>
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
										<span
											onClick={() => setStoresFilter("daily")}
											className={`${style.chartBox__header__filterbox__button} ${
												storesFilter === "daily" &&
												style.chartBox__header__filterbox__button__active
											}`}
										>
											روزانه
										</span>
										<span
											onClick={() => setStoresFilter("monthly")}
											className={`${style.chartBox__header__filterbox__button} ${
												storesFilter === "monthly" &&
												style.chartBox__header__filterbox__button__active
											}`}
										>
											ماهانه
										</span>
										<span
											onClick={() => setStoresFilter("yearly")}
											className={`${style.chartBox__header__filterbox__button} ${
												storesFilter === "yearly" &&
												style.chartBox__header__filterbox__button__active
											}`}
										>
											سالانه
										</span>
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
										<span
											onClick={() => setSalesFilter("daily")}
											className={`${style.chartBox__header__filterbox__button} ${
												salesFilter === "daily" && style.chartBox__header__filterbox__button__active
											}`}
										>
											روزانه
										</span>
										<span
											onClick={() => setSalesFilter("monthly")}
											className={`${style.chartBox__header__filterbox__button} ${
												salesFilter === "monthly" &&
												style.chartBox__header__filterbox__button__active
											}`}
										>
											ماهانه
										</span>
										<span
											onClick={() => setSalesFilter("yearly")}
											className={`${style.chartBox__header__filterbox__button} ${
												salesFilter === "yearly" &&
												style.chartBox__header__filterbox__button__active
											}`}
										>
											سالانه
										</span>
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
										<span
											onClick={() => setProductsFilter("daily")}
											className={`${style.chartBox__header__filterbox__button} ${
												productsFilter === "daily" && style.chartBox__header__filterbox__button__active
											}`}
										>
											روزانه
										</span>
										<span
											onClick={() => setProductsFilter("monthly")}
											className={`${style.chartBox__header__filterbox__button} ${
												productsFilter === "monthly" &&
												style.chartBox__header__filterbox__button__active
											}`}
										>
											ماهانه
										</span>
										<span
											onClick={() => setProductsFilter("yearly")}
											className={`${style.chartBox__header__filterbox__button} ${
												productsFilter === "yearly" &&
												style.chartBox__header__filterbox__button__active
											}`}
										>
											سالانه
										</span>
									</div>
								</div>
								<Divider />
								<BarChart keys={productsChartKeys} indexBy={"date"} data={productsChartData} />
							</div>
						</Grid>
					</Grid>
				</div>
			</div>
		</>
	);
};

export default Dashboard;
