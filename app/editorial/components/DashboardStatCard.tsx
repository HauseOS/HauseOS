import React from 'react';

interface DashboardStatCardProps {
  icon: string;
  label: string;
  value: number | string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  icon,
  label,
  value,
  color = 'blue',
}) => {
  const colorClasses: { [key: string]: string } = {
    blue: 'bg-blue-100/10 border-blue-700/30',
    green: 'bg-green-100/10 border-green-700/30',
    red: 'bg-red-100/10 border-red-700/30',
    yellow: 'bg-yellow-100/10 border-yellow-700/30',
    purple: 'bg-purple-100/10 border-purple-700/30',
  };

  return (
    <div className={`border rounded-lg p-6 ${colorClasses[color]}`}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{icon}</span>
        <p className="text-gray-400 text-sm">{label}</p>
      </div>
      <p className="text-4xl font-bold text-white">{value}</p>
    </div>
  );
};

export default DashboardStatCard;
