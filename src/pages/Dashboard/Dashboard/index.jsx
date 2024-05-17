import { useEffect, useState } from "react";
import { Grid, Divider } from "@mui/material";
import PieChart from "./pieChart/PieChart";
import LineChart from "./lineChart/LineChart";
import { handleError } from "src/utils/api-error-handling";
import axios from "src/utils/axios";
import style from "./style.module.scss";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SellIcon from "@mui/icons-material/Sell";
import PendingIcon from "@mui/icons-material/Pending";

const pieData = [
	{
		id: "خالی",
		label: "خالی",
		value: 1,
	},
];

const LineData = [];

const Dashboard = () => {
	const [infoBoxdata, setInfoBoxData] = useState([]);

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

	useEffect(() => {
		getData();
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
									<span className={style.infoBox__title__counter}>{infoBoxdata?.factor_count || 0}</span>
									<span>فاکتور های امروز</span>
								</div>
								<ReceiptIcon className={style.infoBox__icon} />
							</div>
						</Grid>
						<Grid item xs={12} lg={4}>
							<div className={`${style.infoBox} ${style.successBox}`}>
								<div className={style.infoBox__title}>
									<span className={style.infoBox__title__counter}>{infoBoxdata?.factor_sell || 0}</span>
									<span>مقدار فروش امروز</span>
								</div>
								<div>
									<SellIcon className={style.infoBox__icon} />
								</div>
							</div>
						</Grid>
						<Grid item xs={12} lg={4}>
							<div className={`${style.infoBox} ${style.warningBox}`}>
								<div className={`${style.infoBox__title} ${style.infoBox__titleDark}`}>
									<span className={style.infoBox__title__counter}>{infoBoxdata?.factor_not_accepted || 0}</span>
									<span>فاکتور های در انتظار تایید</span>
								</div>
								<PendingIcon className={style.infoBox__icon} />
							</div>
						</Grid>
						<Grid item xs={12} lg={6}>
							<div className={style.chartBox}>
								<div className={style.chartBox__header}>
									<span className={style.chartBox__header__title}>فروش بازاریاب ها</span>
								</div>
								<Divider />
								<PieChart data={pieData} />
							</div>
						</Grid>
						<Grid item xs={12} lg={6}>
							<div className={style.chartBox}>
								<div className={style.chartBox__header}>
									<span className={style.chartBox__header__title}>مقایسه فاکتور انبار ها</span>
								</div>
								<Divider />
								<PieChart data={pieData} full />
							</div>
						</Grid>
						<Grid item xs={12}>
							<div className={style.chartBox__Big}>
								<div className={style.chartBox__header}>
									<span className={style.chartBox__header__title}>فروش روزانه</span>
								</div>
								<Divider />
								{/* <LineChart data={LineData} /> */}
							</div>
						</Grid>
					</Grid>
				</div>
			</div>
		</>
	);
};

export default Dashboard;
