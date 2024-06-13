import { ResponsiveLine } from "@nivo/line";

const LineChart = ({ data }) => (
	<ResponsiveLine
		data={data}
		margin={{ top: 20, left: 60, bottom: 60, right: 20 }}
		yScale={{
			type: "linear",
			min: "auto",
			max: "auto",
		}}
		yFormat=" >-.2f"
		axisTop={null}
		axisRight={null}
		axisLeft={{
            tickPadding: 55,
            legendPosition: 'middle',
        }}
		pointBorderColor={{ from: "serieColor" }}
		pointLabel="data.yFormatted"
		pointLabelYOffset={-12}
		enableTouchCrosshair={true}
		useMesh={true}
		legends={[]}
	/>
);

export default LineChart;
