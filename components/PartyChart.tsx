
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { PartySummary } from '../types';

interface PartyChartProps {
  data: PartySummary[];
}

const PartyChart: React.FC<PartyChartProps> = ({ data }) => {
  const chartData = data.map(p => ({
    name: p.shortName,
    won: p.seatsWon,
    leading: p.seatsLeading,
    total: p.seatsWon + p.seatsLeading,
    color: p.color
  })).sort((a, b) => b.total - a.total);

  return (
    <div className="h-80 w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend />
          <Bar dataKey="won" stackId="a" fill="#22c55e" name="Seats Won" />
          <Bar dataKey="leading" stackId="a" fill="#eab308" name="Leading" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PartyChart;
