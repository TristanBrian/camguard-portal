
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { ChartContainer, ChartTooltip } from 'components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, ChevronRight, FileText, BarChart2, PieChart as PieChartIcon, LineChart as LineChartIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Sample market trends data
const marketShareData = [
  { name: 'KimCom', value: 26 },
  { name: 'SecureTech', value: 30 },
  { name: 'SafeGuard', value: 18 },
  { name: 'ProtectView', value: 15 },
  { name: 'Others', value: 11 },
];

const COLORS = ['#8b5cf6', '#ef4444', '#22c55e', '#f59e0b', '#64748b'];

const competitorGrowthData = [
  { name: 'KimCom', current: 26, previous: 22, growth: 18 },
  { name: 'SecureTech', current: 30, previous: 32, growth: -6 },
  { name: 'SafeGuard', current: 18, previous: 17, growth: 6 },
  { name: 'ProtectView', current: 15, previous: 16, growth: -6 },
  { name: 'Others', current: 11, previous: 13, growth: -15 },
];

const priceComparisonData = [
  { name: 'Indoor Cam', kimcom: 8999, competitor: 9500 },
  { name: 'Outdoor Cam', kimcom: 15999, competitor: 16800 },
  { name: '8-Ch NVR', kimcom: 29999, competitor: 32500 },
  { name: 'WiFi Router', kimcom: 6500, competitor: 7200 },
  { name: 'Dome Camera', kimcom: 12000, competitor: 11500 },
];

const industryTrendsData = [
  { name: 'Jan', smart: 3200, standard: 4500 },
  { name: 'Feb', smart: 3600, standard: 4300 },
  { name: 'Mar', smart: 4100, standard: 4100 },
  { name: 'Apr', smart: 4800, standard: 3900 },
  { name: 'May', smart: 5200, standard: 3700 },
  { name: 'Jun', smart: 5900, standard: 3500 },
  { name: 'Jul', smart: 6500, standard: 3300 },
];

const customerPrefData = [
  { name: 'Wired', '2023': 60, '2024': 45 },
  { name: 'Wireless', '2023': 40, '2024': 55 },
  { name: 'Local Storage', '2023': 70, '2024': 40 },
  { name: 'Cloud Storage', '2023': 30, '2024': 60 },
  { name: 'HD Quality', '2023': 55, '2024': 25 },
  { name: '4K Quality', '2023': 45, '2024': 75 },
];

const marketInsights = [
  {
    title: 'Smart Systems Gaining Traction',
    content: 'The market is rapidly shifting towards smart security systems with AI capabilities and mobile integration. Consider expanding your smart product offerings.',
    trend: 'up',
    category: 'Product Development',
  },
  {
    title: 'Price Sensitivity Analysis',
    content: 'Your mid-range products show the best competitive advantage. High-end products are slightly overpriced compared to the market average.',
    trend: 'down',
    category: 'Pricing Strategy',
  },
  {
    title: 'Customer Preference Shift',
    content: 'There\'s a significant trend towards wireless systems and cloud storage solutions. Consider bundling cloud storage with your camera systems.',
    trend: 'up',
    category: 'Customer Behavior',
  },
  {
    title: 'Competitor Analysis',
    content: 'SecureTech has lost 6% market share in the last quarter, creating an opportunity to target their customer base with competitive offers.',
    trend: 'up',
    category: 'Competition',
  },
];

const forecasts = [
  {
    period: 'Next Quarter',
    growth: 7.2,
    trend: 'up',
    confidence: 'high',
  },
  {
    period: 'Next 6 Months',
    growth: 12.5,
    trend: 'up',
    confidence: 'medium',
  },
  {
    period: 'Next Year',
    growth: 18.3,
    trend: 'up',
    confidence: 'low',
  },
];

const MarketTrends: React.FC = () => {
  const navigate = useNavigate();
  const [activeInsight, setActiveInsight] = useState(0);

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  
    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="#333" className="text-base font-medium">
          {payload.name}
        </text>
        <text x={cx} y={cy} dy={10} textAnchor="middle" fill="#999" className="text-sm">
          {`${value}%`}
        </text>
        <text x={cx} y={cy} dy={30} textAnchor="middle" fill="#999" className="text-xs">
          {`(${(percent * 100).toFixed(1)}%)`}
        </text>
      </g>
    );
  };

  return (
    <div className="space-y-6 p-0 md:p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Market Trends</h1>
          <p className="text-muted-foreground">
            Analyze market performance and competitor insights
          </p>
        </div>
        <div className="flex flex-col xs:flex-row gap-3">
          <Button variant="outline" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
          <Button className="bg-kimcom-600 hover:bg-kimcom-700">
            Last 30 Days
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Market Share</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-row items-baseline justify-between">
              <div className="text-2xl font-bold text-purple-900">26%</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                <span>+4% from last quarter</span>
              </div>
            </div>
            <div className="h-1 w-full bg-purple-200 mt-2 rounded-full overflow-hidden">
              <div className="bg-purple-600 h-full" style={{ width: '26%' }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Industry Position</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-row items-baseline justify-between">
              <div className="text-2xl font-bold text-blue-900">#2</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                <span>Up from #3</span>
              </div>
            </div>
            <div className="mt-2">
              <Badge className="bg-blue-600">Top 3 Vendor</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Growth Rate</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-row items-baseline justify-between">
              <div className="text-2xl font-bold text-green-900">18.2%</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="mr-1 h-3 w-3" />
                <span>Industry avg: 8.5%</span>
              </div>
            </div>
            <div className="flex mt-2 space-x-1">
              <div className="h-1 flex-1 bg-green-200 rounded-full overflow-hidden">
                <div className="bg-green-600 h-full w-full"></div>
              </div>
              <div className="h-1 flex-1 bg-green-200 rounded-full overflow-hidden">
                <div className="bg-green-600 h-full w-full"></div>
              </div>
              <div className="h-1 flex-1 bg-green-200 rounded-full overflow-hidden">
                <div className="bg-green-600 h-full"></div>
              </div>
              <div className="h-1 flex-1 bg-green-200 rounded-full overflow-hidden">
                <div className="bg-green-600 h-full w-1/3"></div>
              </div>
              <div className="h-1 flex-1 bg-green-200 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-900">Price Competitiveness</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-row items-baseline justify-between">
              <div className="text-2xl font-bold text-red-900">93%</div>
              <div className="flex items-center text-xs text-red-600">
                <ArrowDownRight className="mr-1 h-3 w-3" />
                <span>-2% from average</span>
              </div>
            </div>
            <div className="h-1 w-full bg-red-200 mt-2 rounded-full overflow-hidden">
              <div className="bg-red-600 h-full" style={{ width: '93%' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="marketShare" className="w-full">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 mb-2">
          <TabsTrigger value="marketShare" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            <span>Market Share</span>
          </TabsTrigger>
          <TabsTrigger value="priceComparison" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span>Price Comparison</span>
          </TabsTrigger>
          <TabsTrigger value="industryTrends" className="flex items-center gap-2">
            <LineChartIcon className="h-4 w-4" />
            <span>Industry Trends</span>
          </TabsTrigger>
          <TabsTrigger value="customerPreferences" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span>Customer Preferences</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="marketShare">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Market Share Analysis</span>
                  <Badge variant="outline" className="ml-2">Q2 2024</Badge>
                </CardTitle>
                <CardDescription>
                  Market distribution among top security system providers
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-0 pt-4">
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={marketShareData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        labelLine={false}
                        activeShape={renderActiveShape}
                      >
                        {marketShareData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Competitor Growth</CardTitle>
                <CardDescription>Quarter-over-quarter change</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {competitorGrowthData.map((competitor, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          <p className="font-medium">{competitor.name}</p>
                        </div>
                        <div className="flex items-center">
                          <span className="font-semibold">{competitor.current}%</span>
                          <div className={`flex items-center ml-2 ${competitor.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {competitor.growth > 0 ? (
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                            )}
                            <span className="text-xs">{competitor.growth > 0 ? '+' : ''}{competitor.growth}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all" 
                          style={{ 
                            width: `${competitor.current}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="priceComparison">
          <Card>
            <CardHeader>
              <CardTitle>Price Comparison with Competitors</CardTitle>
              <CardDescription>KimCom prices vs industry average (KSh)</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ChartContainer 
                config={{
                  kimcom: { 
                    label: "KimCom Price (KSh)",
                    theme: { 
                      light: "#8b5cf6", 
                      dark: "#a78bfa" 
                    } 
                  },
                  competitor: {
                    label: "Competitor Avg. Price (KSh)",
                    theme: {
                      light: "#ef4444",
                      dark: "#f87171"
                    }
                  }
                }}
                className="h-[400px] w-full"
              >
                <BarChart
                  data={priceComparisonData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip formatter={(value) => `KSh ${value.toLocaleString()}`} />
                  <Legend />
                  <Bar 
                    dataKey="kimcom" 
                    fill="var(--color-kimcom)" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="competitor" 
                    fill="var(--color-competitor)" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ChartContainer>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <div className="text-purple-800 font-semibold mb-2">Price Advantage</div>
                  <p className="text-sm text-purple-700">
                    KimCom products are priced 5-10% lower than competitors for most categories, giving us a competitive edge.
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <div className="text-red-800 font-semibold mb-2">Price Alert</div>
                  <p className="text-sm text-red-700">
                    Dome Camera pricing is above market average by 4.3%. Consider price adjustment to maintain competitiveness.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="industryTrends">
          <Card>
            <CardHeader>
              <CardTitle>Industry Trend: Smart vs. Standard Systems</CardTitle>
              <CardDescription>Monthly sales volumes by system type</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ChartContainer 
                config={{
                  smart: { 
                    label: "Smart Systems",
                    theme: { 
                      light: "#8b5cf6", 
                      dark: "#a78bfa" 
                    } 
                  },
                  standard: {
                    label: "Standard Systems",
                    theme: {
                      light: "#f59e0b",
                      dark: "#fbbf24"
                    }
                  }
                }}
                className="h-[400px] w-full"
              >
                <LineChart
                  data={industryTrendsData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="smart" 
                    stroke="var(--color-smart)" 
                    strokeWidth={3}
                    activeDot={{ r: 8 }} 
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="standard" 
                    stroke="var(--color-standard)" 
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-700" />
                    <span className="text-purple-800 font-semibold">Smart Systems Trend</span>
                  </div>
                  <p className="text-sm text-purple-700 mt-2">
                    Smart systems have shown a 103% growth over the past 6 months, expected to overtake standard systems in Q3.
                  </p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-amber-700" />
                    <span className="text-amber-800 font-semibold">Standard Systems Trend</span>
                  </div>
                  <p className="text-sm text-amber-700 mt-2">
                    Standard systems are declining at 7.4% per month. Focus should shift to smart systems while maintaining support for existing customers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customerPreferences">
          <Card>
            <CardHeader>
              <CardTitle>Customer Preferences: 2023 vs. 2024</CardTitle>
              <CardDescription>Shifting customer preferences in security solutions</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ChartContainer 
                config={{
                  "2023": { 
                    label: "2023",
                    theme: { 
                      light: "#8b5cf6", 
                      dark: "#a78bfa" 
                    } 
                  },
                  "2024": {
                    label: "2024",
                    theme: {
                      light: "#ec4899",
                      dark: "#f472b6"
                    }
                  }
                }}
                className="h-[400px] w-full"
              >
                <BarChart
                  data={customerPrefData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <ChartTooltip />
                  <Legend />
                  <Bar dataKey="2023" fill="var(--color-2023)" radius={[0, 4, 4, 0]} barSize={20} />
                  <Bar dataKey="2024" fill="var(--color-2024)" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ChartContainer>
              
              <div className="mt-6 bg-gray-50 rounded-lg p-4 border">
                <h3 className="font-medium text-gray-900 mb-2">Key Preference Changes</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Strong shift from wired to wireless solutions (+15%)</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Cloud storage adoption doubled (30% to 60%)</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">4K quality demand increased significantly (45% to 75%)</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Mobile connectivity is now the #1 requested feature</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Market Insights</CardTitle>
            <CardDescription>
              Strategic analysis based on market data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {marketInsights.map((insight, index) => (
                <div
                  key={index}
                  onClick={() => setActiveInsight(index)}
                  className={`cursor-pointer p-4 rounded-lg border transition-colors ${
                    activeInsight === index 
                      ? 'border-purple-300 bg-purple-50' 
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium flex items-center">
                      {insight.trend === 'up' ? (
                        <TrendingUp className={`h-4 w-4 mr-2 ${activeInsight === index ? 'text-purple-600' : 'text-gray-400'}`} />
                      ) : (
                        <TrendingDown className={`h-4 w-4 mr-2 ${activeInsight === index ? 'text-purple-600' : 'text-gray-400'}`} />
                      )}
                      {insight.title}
                    </h3>
                    <Badge variant="outline" className={activeInsight === index ? 'bg-purple-100 text-purple-800 border-purple-200' : ''}>
                      {insight.category}
                    </Badge>
                  </div>
                  <p className={`text-sm ${activeInsight === index ? 'text-purple-800' : 'text-gray-600'}`}>
                    {insight.content}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Growth Forecast</CardTitle>
            <CardDescription>Projected market performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {forecasts.map((forecast, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-500">{forecast.period}</span>
                    <Badge 
                      variant="outline"
                      className={
                        forecast.confidence === 'high' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : forecast.confidence === 'medium'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                      }
                    >
                      {forecast.confidence} confidence
                    </Badge>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold">{forecast.growth}%</span>
                    <div className="ml-2 flex items-center text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="text-xs">growth</span>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-600 rounded-full" 
                      style={{ width: `${Math.min(forecast.growth * 5, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}

              
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MarketTrends;
