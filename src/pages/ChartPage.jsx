// pages/ChartPage.jsx — Top-10 salary bar chart with average reference line.
import { useEmployees } from '../hooks/useEmployees';
import { useEmployeeStore } from '../store/useEmployeeStore';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ReferenceLine, ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#818cf8', '#4f46e5', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95', '#3730a3'];

function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
        const emp = payload[0].payload;
        return (
            <div className="chart-tooltip">
                <p className="ct-name">{emp.name}</p>
                <p className="ct-city">📍 {emp.city}</p>
                <p className="ct-salary">{emp.getDisplaySalary()}</p>
            </div>
        );
    }
    return null;
}

export default function ChartPage() {
    const { isLoading } = useEmployees();
    const { service, status } = useEmployeeStore();

    if (isLoading) {
        return (
            <div className="page-content">
                <div className="loading-state">
                    <div className="spinner" />
                    <p>Loading chart data…</p>
                </div>
            </div>
        );
    }

    const top10 = service.getTopBySalary(10);
    const avg = service.getAverageSalary();

    if (status === 'success' && top10.length === 0) {
        return (
            <div className="page-content">
                <div className="empty-state"><p>No employee data to chart.</p></div>
            </div>
        );
    }

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Salary Chart</h1>
                    <p className="page-subtitle">Top 10 highest-paid employees</p>
                </div>
                <div className="chart-legend">
                    <span className="legend-bar">▌</span> Salary &nbsp;
                    <span className="legend-avg">— — </span> Avg (
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(avg)})
                </div>
            </div>

            <div className="chart-card">
                <ResponsiveContainer width="100%" height={420}>
                    <BarChart data={top10} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="name"
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            angle={-40}
                            textAnchor="end"
                            interval={0}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                        <ReferenceLine
                            y={avg}
                            stroke="#f59e0b"
                            strokeDasharray="6 3"
                            label={{ value: 'Avg', position: 'insideTopRight', fill: '#f59e0b', fontSize: 12 }}
                        />
                        <Bar dataKey="salary" radius={[6, 6, 0, 0]} maxBarSize={60}>
                            {top10.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="chart-summary-row">
                {top10.slice(0, 3).map((emp, i) => (
                    <div key={emp.id} className={`podium-card podium-${i + 1}`}>
                        <span className="podium-rank">#{i + 1}</span>
                        <img className="podium-avatar" src={emp.avatar} alt={emp.name} />
                        <p className="podium-name">{emp.name}</p>
                        <p className="podium-salary">{emp.getDisplaySalary()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
