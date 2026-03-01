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
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    purple: 'bg-purple-50 border-purple-200',
  };

  return (
    <div className={`border rounded-lg p-6 ${colorClasses[color]}`}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{icon}</span>
        <p className="text-gray-600 text-sm">{label}</p>
      </div>
      <p className="text-4xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export default DashboardStatCard;
