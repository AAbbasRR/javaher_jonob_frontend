import { ResponsiveLine } from "@nivo/line";

const LineChart = ({ data }) => (
	<ResponsiveLine
		data={data}
		margin={{ top: 20, left: 20, bottom: 40, right: 20 }}
		yScale={{
			type: "linear",
			min: "auto",
			max: "auto",
		}}
		yFormat=" >-.2f"
		axisTop={null}
		axisRight={null}
		axisLeft={null}
		axisBottom={null}
		pointBorderColor={{ from: "serieColor" }}
		pointLabel="data.yFormatted"
		pointLabelYOffset={-12}
		enableTouchCrosshair={true}
		useMesh={true}
		legends={[]}
	/>
);

export default LineChart;
