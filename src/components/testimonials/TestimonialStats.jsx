import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown, Minus, Info, Star } from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import useTestimonialStore from '@/store/testimonialStore';

// Helper to get color based on sentiment
const getSentimentColor = (sentiment, alpha = 1) => {
  const colors = {
    positive: `rgba(34, 197, 94, ${alpha})`,  // green-500
    neutral: `rgba(168, 162, 158, ${alpha})`,  // gray-400
    negative: `rgba(239, 68, 68, ${alpha})`,  // red-500
  };
  
  return colors[sentiment] || colors.neutral;
};

// Helper to get color based on rating
const getRatingColor = (rating, alpha = 1) => {
  const colors = {
    5: `rgba(34, 197, 94, ${alpha})`,     // green-500
    4: `rgba(132, 204, 22, ${alpha})`,    // lime-500
    3: `rgba(234, 179, 8, ${alpha})`,     // yellow-500
    2: `rgba(249, 115, 22, ${alpha})`,    // orange-500
    1: `rgba(239, 68, 68, ${alpha})`,     // red-500
  };
  
  return colors[rating] || colors[3];
};

// Helper to format numbers
const formatNumber = (num) => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
};

const TestimonialStats = () => {
  const { stats, fetchStats, fetchTrends } = useTestimonialStore();
  
  // Initialize stats if null
  const safeStats = stats || {
    total: 0,
    average: 0,
    changePercentage: 0,
    distribution: [
      { rating: 5, count: 0 },
      { rating: 4, count: 0 },
      { rating: 3, count: 0 },
      { rating: 2, count: 0 },
      { rating: 1, count: 0 }
    ],
    sentimentDistribution: {
      positive: 0,
      neutral: 0,
      negative: 0
    }
  };
  
  // Calculate percentage changes
  const percentChange = safeStats.changePercentage;
  const isPositiveChange = percentChange >= 0;
  
  // Format average rating
  const formattedAverage = safeStats.average.toFixed(1);
  
  // Load stats on mount
  React.useEffect(() => {
    if (!safeStats || Object.keys(safeStats).length === 0) {
      fetchStats();
      fetchTrends();
    }
  }, [fetchStats, fetchTrends, safeStats]);
  
  return (
    <Card className="bg-white shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Left Section - Summary */}
        <div className="md:w-1/3 p-5 md:p-6 md:border-r border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <CardTitle className="text-lg">Statistik Ulasan</CardTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
              Minggu Ini
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Average Rating */}
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Rating Rata-rata</div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold mr-1">{formattedAverage}</span>
                <div className="flex">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                </div>
              </div>
            </div>
            
            {/* Total Reviews */}
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Total Ulasan</div>
              <div className="text-3xl font-bold">{formatNumber(safeStats.total)}</div>
            </div>
            
            {/* Weekly change */}
            <div className="col-span-2">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-medium mb-2">
                  Perubahan vs Minggu Lalu
                </div>
                
                <div className={`flex items-center ${
                  isPositiveChange ? 'text-green-600' : percentChange === 0 ? 'text-gray-500' : 'text-red-600'
                }`}>
                  <div className="rounded-full mr-2">
                    {isPositiveChange ? (
                      <TrendingUp className="h-5 w-5" />
                    ) : percentChange === 0 ? (
                      <Minus className="h-5 w-5" />
                    ) : (
                      <TrendingDown className="h-5 w-5" />
                    )}
                  </div>
                  
                  <div>
                    <span className="text-lg font-semibold">
                      {isPositiveChange ? '+' : ''}{percentChange}%
                    </span>
                    <span className="text-xs ml-1 text-gray-500">
                      ({safeStats.thisWeek || 0} ulasan minggu ini)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Section - Distribution */}
        <div className="md:w-2/3 p-5 md:p-6">
          <Tabs defaultValue="distribution" className="w-full">
            <div className="flex justify-between items-center mb-6">
              <CardTitle className="text-lg">Distribusi Rating</CardTitle>
              <TabsList>
                <TabsTrigger value="distribution">Rating</TabsTrigger>
                <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="distribution" className="mt-0">
              {/* Rating distribution */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-2">
                {[5, 4, 3, 2, 1].map(rating => {
                  const item = safeStats.distribution?.find(d => d.rating === rating) || { count: 0, percentage: 0 };
                  return (
                    <div key={`stat-${rating}`} className="flex flex-col items-center">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full" style={{ backgroundColor: getRatingColor(rating, 0.1) }}>
                        <div className="flex items-center">
                          <span className="text-sm font-semibold" style={{ color: getRatingColor(rating) }}>{rating}</span>
                          <Star className="h-3 w-3 ml-0.5" style={{ color: getRatingColor(rating) }} />
                        </div>
                      </div>
                      <div className="text-lg font-semibold mt-1">{item.count}</div>
                      <div className="text-xs text-gray-500">{item.percentage}%</div>
                    </div>
                  );
                })}
              </div>
              
              {/* Progress bars */}
              <div className="space-y-3 mt-4">
                {(safeStats.distribution || []).map((item) => (
                  <div key={`rating-bar-${item.rating}`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium flex items-center">
                        {item.rating}<Star className="h-3 w-3 ml-0.5 text-amber-400" />
                      </div>
                      <div className="text-sm text-gray-500">{item.percentage}%</div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full rounded-full"
                        style={{ 
                          backgroundColor: getRatingColor(item.rating)
                        }}
                        initial={{ width: "0%" }}
                        animate={{ width: `${item.percentage || 0}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="sentiment" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sentiment distribution chart */}
                <div className="bg-gray-50 p-5 rounded-lg flex items-center justify-center h-48">
                  <div className="relative h-full w-full max-w-[200px] mx-auto">
                    <Doughnut 
                      data={{
                        labels: ['Positif', 'Netral', 'Negatif'],
                        datasets: [{
                          data: [
                            safeStats.sentimentDistribution?.positive || 0,
                            safeStats.sentimentDistribution?.neutral || 0,
                            safeStats.sentimentDistribution?.negative || 0
                          ],
                          backgroundColor: [
                            getSentimentColor('positive', 0.8),
                            getSentimentColor('neutral', 0.8),
                            getSentimentColor('negative', 0.8),
                          ],
                          borderWidth: 1,
                          hoverOffset: 4,
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '70%',
                        plugins: {
                          legend: {
                            display: false,
                          },
                        }
                      }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-sm text-gray-500">Total</div>
                      <div className="text-2xl font-bold">{safeStats.total}</div>
                    </div>
                  </div>
                </div>
                
                {/* Sentiment stats */}
                <div className="space-y-4">
                  {[
                    { label: 'Positif', key: 'positive', icon: <ArrowUp className="h-4 w-4" /> },
                    { label: 'Netral', key: 'neutral', icon: <Minus className="h-4 w-4" /> },
                    { label: 'Negatif', key: 'negative', icon: <ArrowDown className="h-4 w-4" /> }
                  ].map((sentiment, index) => {
                    const count = safeStats.sentimentDistribution?.[sentiment.key] || 0;
                    const total = (safeStats.sentimentDistribution?.positive || 0) +
                                (safeStats.sentimentDistribution?.neutral || 0) +
                                (safeStats.sentimentDistribution?.negative || 0);
                    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                    
                    return (
                      <div key={sentiment.key} className="flex items-center p-3 rounded-lg" style={{ backgroundColor: getSentimentColor(sentiment.key, 0.1) }}>
                        <div className="p-2 rounded-full mr-3" style={{ backgroundColor: getSentimentColor(sentiment.key, 0.2) }}>
                          <div style={{ color: getSentimentColor(sentiment.key) }}>{sentiment.icon}</div>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium" style={{ color: getSentimentColor(sentiment.key) }}>
                            {sentiment.label}
                          </div>
                          <div className="text-xs text-gray-500">{percentage}% ({count} ulasan)</div>
                        </div>
                        <div className="text-xl font-bold" style={{ color: getSentimentColor(sentiment.key) }}>
                          {count}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Card>
  );
};

export default TestimonialStats; 