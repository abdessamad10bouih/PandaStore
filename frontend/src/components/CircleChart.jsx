import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart";
import { useEffect, useMemo, useState } from "react";
import { getCategories } from "../lib/api";

export default function CircleChart() {
    const COLORS = ["#4285F4", "#EA4335", "#FBBC05", "#34A853", "#673AB7"];
    const [data, setData] = useState([]);
    const [width, setWidth] = useState(600);
    const [height, setHeight] = useState(400);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getCategories();
                // Transform categories data for the pie chart
                const chartData = res.data.map(category => ({
                    name: category.nom,
                    value: category.produits.length, // Number of products
                    description: category.description,
                    fullData: category // Include full category data if needed
                }));
                setData(chartData);
            } catch (error) {
                console.error("Error getting categories: ", error);
            }
        };
        fetchCategories();
    }, []);

    const chartConfig = useMemo(() => {
        return data.reduce((config, item, index) => {
            config[item.name] = {
                label: item.name,
                color: COLORS[index % COLORS.length],
                description: item.description
            };
            return config;
        }, {});
    }, [data]);

    return (
        <ChartContainer config={chartConfig} className="w-full h-full flex items-center justify-center">
            <PieChart
                width={600}  // Increased width
                height={500} // Increased height
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Tooltip
                    content={<ChartTooltipContent />}
                    formatter={(value, name, props) => [
                        value,
                        `${name} (${props.payload.description})`
                    ]}
                />
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `${name}: ${value}`}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ChartContainer>
    );
}