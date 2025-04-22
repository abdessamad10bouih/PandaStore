import React from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart";

const ProductAreaChart = ({
  produits = [],
  title = "Product Data",
  description = "Showing price and stock levels for products"
}) => {

  // Define chart configuration for shadcn/ui
  const chartConfig = {
    prix: {
      label: "Prix",
      color: "hsl(285, 91%, 14%)", // Dark purple
    },
    stock: {
      label: "Stock",
      color: "hsl(52, 91%, 61%)", // Bright yellow
    },
  };

  return (
    <Card className="w-full bg-card shadow-sm border border-muted rounded-md overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={produits}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="nom"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
            />
            <YAxis
              fontSize={12}
              tickLine={true}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Legend />
            <defs>
              <linearGradient id="fillPrix" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-prix)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-prix)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillStock" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-stock)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-stock)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="prix"
              stackId="1"
              fill="url(#fillPrix)"
              fillOpacity={0.6}
              stroke="var(--color-prix)"
            />
            <Area
              type="monotone"
              dataKey="stock"
              stackId="1"
              fill="url(#fillStock)"
              fillOpacity={0.6}
              stroke="var(--color-stock)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ProductAreaChart;