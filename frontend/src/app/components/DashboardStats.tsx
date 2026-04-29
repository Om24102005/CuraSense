import { Card, CardContent } from './ui/card';
import { Activity, Brain, Stethoscope, TrendingUp, Users, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardStatsProps {
  totalAnalyses: number;
}

export function DashboardStats({ totalAnalyses }: DashboardStatsProps) {
  const stats = [
    {
      icon: Activity,
      label: 'Total Analyses',
      value: totalAnalyses.toString(),
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-500',
    },
    {
      icon: Brain,
      label: 'AI Models Active',
      value: '3',
      gradient: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-500',
    },
    {
      icon: Stethoscope,
      label: 'Accuracy Rate',
      value: '94.2%',
      gradient: 'from-green-500 to-green-600',
      iconBg: 'bg-green-500',
    },
    {
      icon: Zap,
      label: 'Avg Response Time',
      value: '2.3s',
      gradient: 'from-orange-500 to-orange-600',
      iconBg: 'bg-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className={`bg-gradient-to-br ${stat.gradient} text-white border-0 overflow-hidden relative`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <stat.icon className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
