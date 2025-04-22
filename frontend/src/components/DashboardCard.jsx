import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area } from "recharts";
import { useProducts } from "../context/ProductContext";

export default function DashboardCard({
  title = "Total Sales",
  value = "$716,519",
  percentageChange = 20,
  data = [],
  icon = <DollarSign className="h-5 w-5" />,
  color = "#ff6b4a",
  isLoading = false,
}) {
  const formattedPercentage = percentageChange >= 0 ? `+${percentageChange}%` : `${percentageChange}%`;

  const percentageColor = percentageChange >= 0 ? "text-green-500" : "text-red-500";
  const percentageIcon =
    percentageChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm text-xs">
          <p className="font-medium">{label}</p>
          <p className="text-gray-700">
            {new Intl.NumberFormat("ar-MA", {
              style: "currency",
              currency: "MAD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const { products } = useProducts()

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded mb-6"></div>
            <div className="h-[180px] bg-gray-200 rounded"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-orange-100 text-orange-500">
                  {icon}
                </div>
                <span className="text-sm font-medium text-gray-500">{title}</span>
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${percentageColor}`}>
                {percentageIcon}
                {formattedPercentage}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span className="text-2xl font-bold">{value}</span>
            </div>

            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#888" }}
                    dy={10}
                  />
                  <YAxis hide={true} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorGradient)"
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, fill: color, stroke: "white", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
