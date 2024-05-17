import { ResponsivePie } from "@nivo/pie";

const PieChart = ({ data, full = false }) => {
	return (
		<ResponsivePie
			data={data}
			margin={{ top: 30, bottom: 30 }}
			innerRadius={full ? 0 : 0.65}
			colors={{ scheme: "category10" }}
			padAngle={full ? 0 : 2}
			cornerRadius={full ? 0 : 2}
			activeOuterRadiusOffset={8}
			borderColor={{
				from: "color",
				modifiers: [["darker", "0.2"]],
			}}
			enableArcLinkLabels={false}
			enableArcLabels={false}
			legends={[]}
		/>
	);
};

export default PieChart;
