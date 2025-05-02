import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, Info, Star } from 'lucide-react';
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
  
  // Calculate percentage changes
  const percentChange = stats.changePercentage;
  const isPositiveChange = percentChange >= 0;
  
  // Format average rating
  const formattedAverage = stats.average.toFixed(1);
  
  // Memoized chart data
  const ratingChartData = useMemo(() => {
    const distribution = stats.distribution || [];
    
    return {
      labels: ['5★', '4★', '3★', '2★', '1★'],
      datasets: [
        {
          data: distribution.map(d => d.count),
          backgroundColor: [
            getRatingColor(5, 0.8),
            getRatingColor(4, 0.8),
            getRatingColor(3, 0.8),
            getRatingColor(2, 0.8),
            getRatingColor(1, 0.8),
          ],
          borderColor: [
            getRatingColor(5),
            getRatingColor(4),
            getRatingColor(3),
            getRatingColor(2),
            getRatingColor(1),
          ],
          borderWidth: 1,
          borderRadius: 4,
          barThickness: 16,
        }
      ]
    };
  }, [stats.distribution]);
  
  // Sentiment chart data
  const sentimentChartData = useMemo(() => {
    const { positive, neutral, negative } = stats.sentimentDistribution || {};
    
    return {
      labels: ['Positif', 'Netral', 'Negatif'],
      datasets: [
        {
          data: [positive, neutral, negative],
          backgroundColor: [
            getSentimentColor('positive', 0.8),
            getSentimentColor('neutral', 0.8),
            getSentimentColor('negative', 0.8),
          ],
          borderColor: [
            getSentimentColor('positive'),
            getSentimentColor('neutral'),
            getSentimentColor('negative'),
          ],
          borderWidth: 1,
          hoverOffset: 4,
        }
      ]
    };
  }, [stats.sentimentDistribution]);
  
  // Chart options
  const ratingChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw} ulasan`
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          precision: 0,
        }
      },
      y: {
        grid: {
          display: false,
        }
      }
    }
  };
  
  const sentimentChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${value} ulasan (${percentage}%)`;
          }
        }
      }
    }
  };
  
  return (
    <Card className="bg-white dark:bg-gray-950 shadow-sm border border-gray-200 dark:border-gray-800">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold">Statistik Ulasan</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Ringkasan statistik dan tren ulasan
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-100 dark:border-blue-800">
            Minggu Ini
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Rating summary section */}
          <div className="space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Rating Rata-rata
                </h3>
                <div className="flex items-end mt-1">
                  <span className="text-3xl font-bold mr-1">{formattedAverage}</span>
                  <div className="flex mb-1">
                    <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Ulasan
                </h3>
                <div className="mt-1">
                  <span className="text-3xl font-bold">{formatNumber(stats.total)}</span>
                </div>
              </div>
            </div>
            
            {/* Weekly change */}
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Perubahan vs Minggu Lalu</h3>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-[200px]">
                        Persentase perubahan jumlah ulasan dibandingkan minggu sebelumnya
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className={`flex items-center mt-2 ${
                isPositiveChange 
                  ? 'text-green-600 dark:text-green-400' 
                  : percentChange === 0 
                    ? 'text-gray-500' 
                    : 'text-red-600 dark:text-red-400'
              }`}>
                <div className="p-1.5 rounded-full bg-opacity-20 mr-2">
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
                  <span className="text-xs ml-1 text-gray-500 dark:text-gray-400">
                    ({stats.thisWeek} ulasan minggu ini)
                  </span>
                </div>
              </div>
            </div>
            
            {/* Total distribution */}
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-3">Distribusi Ulasan</h3>
              
              {(stats.distribution || []).map((item, index) => (
                <div key={`rating-${item.rating}`} className="mb-2 last:mb-0">
                  <div className="flex items-center mb-1">
                    <div className="w-8 text-sm font-medium">{item.rating}★</div>
                    <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full rounded-full"
                        style={{ 
                          backgroundColor: getRatingColor(item.rating),
                          width: `${item.percentage}%` 
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                    <div className="w-10 text-right text-sm text-gray-500 dark:text-gray-400 ml-2">
                      {item.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Charts section */}
          <div className="md:col-span-2">
            <Tabs defaultValue="distribution" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="distribution">Distribusi</TabsTrigger>
                  <TabsTrigger value="sentiment">Sentimen</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="distribution" className="mt-0">
                <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg h-[280px]">
                  <Bar 
                    data={ratingChartData} 
                    options={ratingChartOptions}
                  />
                </div>
                
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {[5, 4, 3, 2, 1].map(rating => {
                    const item = stats.distribution?.find(d => d.rating === rating) || { count: 0, percentage: 0 };
                    return (
                      <div key={`stat-${rating}`} className="text-center">
                        <div 
                          className="text-xs font-medium px-2 py-1 rounded-full mx-auto w-8"
                          style={{ 
                            backgroundColor: getRatingColor(rating, 0.2),
                            color: getRatingColor(rating)
                          }}
                        >
                          {rating}★
                        </div>
                        <div className="text-sm font-semibold mt-1">
                          {item.count}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {item.percentage}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
              
              <TabsContent value="sentiment" className="mt-0">
                <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg h-[280px] flex items-center justify-center">
                  <div className="w-full max-w-[240px] h-full relative">
                    <Doughnut 
                      data={sentimentChartData} 
                      options={sentimentChartOptions}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</div>
                      <div className="text-2xl font-bold">{stats.total}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">ulasan</div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {['positive', 'neutral', 'negative'].map((sentiment, index) => {
                    const labels = ['Positif', 'Netral', 'Negatif'];
                    const counts = [
                      stats.sentimentDistribution?.positive || 0,
                      stats.sentimentDistribution?.neutral || 0,
                      stats.sentimentDistribution?.negative || 0
                    ];
                    const total = counts.reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? Math.round((counts[index] / total) * 100) : 0;
                    
                    return (
                      <div key={`sentiment-${sentiment}`} className="text-center">
                        <div 
                          className="text-xs font-medium px-2 py-1 rounded-full mx-auto w-fit"
                          style={{ 
                            backgroundColor: getSentimentColor(sentiment, 0.2),
                            color: getSentimentColor(sentiment)
                          }}
                        >
                          {labels[index]}
                        </div>
                        <div className="text-sm font-semibold mt-1">
                          {counts[index]}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {percentage}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialStats; 