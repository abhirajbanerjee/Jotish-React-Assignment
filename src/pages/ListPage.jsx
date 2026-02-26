import { useState } from 'react';
import { AlertTriangle, SearchX } from 'lucide-react';
import { useEmployees } from '../hooks/useEmployees';
import { useEmployeeStore } from '../store/useEmployeeStore';
import EmployeeCard from '../components/EmployeeCard';
import SkeletonCard from '../components/SkeletonCard';
import SearchBar from '../components/SearchBar';

const SKELETON_COUNT = 8;

export default function ListPage() {
    const [query, setQuery] = useState('');
    const { isLoading, isError, error } = useEmployees();
    const { service, employees, status } = useEmployeeStore();

    const filtered = query.trim()
        ? service.search(query)
        : employees;

    if (isError) {
        return (
            <div className="page-content">
                <div className="error-state">
                    <AlertTriangle size={48} strokeWidth={2} color="#f59e0b" />
                    <h2>Failed to load employees</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Employees</h1>
                    <p className="page-subtitle">
                        {status === 'success' ? `${filtered.length} of ${employees.length} employees` : 'Loading…'}
                    </p>
                </div>
                <SearchBar value={query} onChange={setQuery} />
            </div>

            <div className="card-grid">
                {isLoading
                    ? Array.from({ length: SKELETON_COUNT }, (_, i) => <SkeletonCard key={i} />)
                    : filtered.length === 0
                        ? (
                            <div className="empty-state">
                                <SearchX size={48} strokeWidth={2} color="#475569" />
                                <p>No employees match &quot;{query}&quot;</p>
                                <button className="btn btn-ghost" onClick={() => setQuery('')}>Clear search</button>
                            </div>
                        )
                        : filtered.map((emp, i) => (
                            <EmployeeCard key={emp.id} employee={emp} index={i} />
                        ))
                }
            </div>
        </div>
    );
}
