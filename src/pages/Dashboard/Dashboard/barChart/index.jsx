import { ResponsiveBar } from "@nivo/bar";

const BarChart = ({ data, keys, indexBy }) => (
	<ResponsiveBar
		data={data}
		keys={keys}
		indexBy={indexBy}
		margin={{ top: 20, left: 40, bottom: 80, right: 20 }}
		padding={0.3}
		innerPadding={5}
		groupMode="grouped"
		axisTop={null}
		axisRight={null}
		axisLeft={{
            tickPadding: 25,
            legendPosition: 'middle',
        }}
		labelSkipWidth={19}
		isFocusable={true}
	/>
);

export default BarChart;
