import { useEmployees } from '../hooks/useEmployees';
import { useEmployeeStore } from '../store/useEmployeeStore';
import { formatCurrency } from '../utils/formatCurrency';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ReferenceLine, ResponsiveContainer, CartesianGrid, Cell,
    PieChart, Pie, Legend,
} from 'recharts';

const BAR_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#818cf8', '#4f46e5', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95', '#3730a3'];
const CITY_COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#94a3b8'];
const STATUS_COLORS = { Active: '#10b981', 'On Leave': '#f59e0b', Remote: '#6366f1' };

function BarTooltip({ active, payload }) {
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

function DonutTooltip({ active, payload }) {
    if (active && payload && payload.length) {
        const { name, value, payload: inner } = payload[0];
        const pct = inner.percent ? ` (${(inner.percent * 100).toFixed(1)}%)` : '';
        return (
            <div className="chart-tooltip">
                <p className="ct-name">{name}</p>
                <p className="ct-city">{value} employees{pct}</p>
            </div>
        );
    }
    return null;
}

function DonutLegend({ payload }) {
    return (
        <ul className="donut-legend">
            {payload.map((entry) => (
                <li key={entry.value} className="donut-legend-item">
                    <span className="donut-legend-dot" style={{ background: entry.color }} />
                    <span>{entry.value}</span>
                </li>
            ))}
        </ul>
    );
}

function getCityData(employees) {
    const map = {};
    employees.forEach(e => { map[e.city] = (map[e.city] || 0) + 1; });
    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
    const top5 = sorted.slice(0, 5).map(([name, value]) => ({ name, value }));
    const othersCount = sorted.slice(5).reduce((s, [, v]) => s + v, 0);
    if (othersCount > 0) top5.push({ name: 'Others', value: othersCount });
    return top5;
}

function getStatusData(employees) {
    const map = {};
    employees.forEach(e => { map[e.status] = (map[e.status] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
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
    const allEmps = service.getAll();
    const cityData = getCityData(allEmps);
    const statusData = getStatusData(allEmps);

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
                    <h1 className="page-title">Salary Analytics</h1>
                    <p className="page-subtitle">Visual breakdown of your workforce</p>
                </div>
                <div className="chart-legend">
                    <span className="legend-bar">▌</span> Salary &nbsp;
                    <span className="legend-avg">— — </span> Avg ({formatCurrency(avg)})
                </div>
            </div>

            <div className="chart-section-label">Top 10 Highest-Paid Employees</div>
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
                            tickFormatter={v => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${(v / 1000).toFixed(0)}K`}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                        <ReferenceLine
                            y={avg}
                            stroke="#f59e0b"
                            strokeDasharray="6 3"
                            label={{ value: 'Avg', position: 'insideTopRight', fill: '#f59e0b', fontSize: 12 }}
                        />
                        <Bar dataKey="salary" radius={[6, 6, 0, 0]} maxBarSize={60}>
                            {top10.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
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

            <div className="chart-donut-row">

                <div className="chart-donut-panel">
                    <div className="chart-section-label">Employees by City</div>
                    <div className="chart-card chart-card--donut">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={cityData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={3}
                                    dataKey="value"
                                    animationBegin={0}
                                    animationDuration={800}
                                >
                                    {cityData.map((_, i) => (
                                        <Cell key={`city-${i}`} fill={CITY_COLORS[i % CITY_COLORS.length]} />
                                    ))}
                                </Pie>
                                <text x="50%" y="44%" textAnchor="middle" dominantBaseline="middle"
                                    style={{ fontSize: 28, fontWeight: 800, fill: 'var(--text-primary)', fontFamily: 'inherit' }}>
                                    {allEmps.length}
                                </text>
                                <text x="50%" y="54%" textAnchor="middle" dominantBaseline="middle"
                                    style={{ fontSize: 11, fill: 'var(--text-muted)', letterSpacing: '0.5px', fontFamily: 'inherit' }}>
                                    EMPLOYEES
                                </text>
                                <Tooltip content={<DonutTooltip />} />
                                <Legend content={<DonutLegend />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-donut-panel">
                    <div className="chart-section-label">Workforce Status</div>
                    <div className="chart-card chart-card--donut">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={3}
                                    dataKey="value"
                                    animationBegin={200}
                                    animationDuration={800}
                                >
                                    {statusData.map((entry, i) => (
                                        <Cell
                                            key={`status-${i}`}
                                            fill={STATUS_COLORS[entry.name] || CITY_COLORS[i]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<DonutTooltip />} />
                                <Legend content={<DonutLegend />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="status-pills">
                            {statusData.map(({ name, value }) => (
                                <span
                                    key={name}
                                    className="status-pill"
                                    style={{ borderColor: STATUS_COLORS[name], color: STATUS_COLORS[name] }}
                                >
                                    {name}: {value}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
