import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Visitor } from '../types/Visitor';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { format, subDays, isWithinInterval } from 'date-fns';
import './AdminDashboard.css';
import PhotoViewerModal from './PhotoViewerModal';
import EditVisitorModal from './EditVisitorModal';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

const AdminDashboard: React.FC = () => {
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateRangeFilter, setDateRangeFilter] = useState('all');
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
    const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedVisitors = JSON.parse(localStorage.getItem('visitors') || '[]');
        setVisitors(storedVisitors.sort((a: Visitor, b: Visitor) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }, []);

    const updateVisitors = (updatedVisitors: Visitor[]) => {
        setVisitors(updatedVisitors);
        localStorage.setItem('visitors', JSON.stringify(updatedVisitors));
    };

    const handleSignOut = (visitorId: string) => {
        const updated = visitors.map(v => v.id === visitorId ? { ...v, timeOut: new Date().toLocaleTimeString() } : v);
        updateVisitors(updated);
    };

    const handleDelete = (visitorId: string) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            const updated = visitors.filter(v => v.id !== visitorId);
            updateVisitors(updated);
        }
    };

    const handleSaveEdit = (updatedVisitor: Visitor) => {
        const updated = visitors.map(v => v.id === updatedVisitor.id ? updatedVisitor : v);
        updateVisitors(updated);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('isAdminAuthenticated');
        navigate('/login');
    };

    const exportToCSV = () => {
        const headers = ['Name', 'Surname', 'Company', 'Host', 'Date', 'Time In', 'Time Out'];
        const rows = filteredVisitors.map(v => [v.name, v.surname, v.company, v.host, v.date, v.timeIn, v.timeOut || 'N/A'].join(','));
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `visitor_log_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredVisitors = useMemo(() => {
        const now = new Date();
        return visitors.filter(v => {
            const visitorDate = new Date(v.date);
            const nameMatch = `${v.name} ${v.surname}`.toLowerCase().includes(searchTerm.toLowerCase());
            const companyMatch = v.company.toLowerCase().includes(searchTerm.toLowerCase());
            const searchMatch = nameMatch || companyMatch;

            const statusMatch = statusFilter === 'all' ||
                (statusFilter === 'checked-in' && !v.timeOut) ||
                (statusFilter === 'checked-out' && v.timeOut);

            const dateRangeMatch = dateRangeFilter === 'all' ||
                (dateRangeFilter === 'today' && format(visitorDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')) ||
                (dateRangeFilter === '7days' && isWithinInterval(visitorDate, { start: subDays(now, 7), end: now })) ||
                (dateRangeFilter === '30days' && isWithinInterval(visitorDate, { start: subDays(now, 30), end: now }));

            return searchMatch && statusMatch && dateRangeMatch;
        });
    }, [visitors, searchTerm, statusFilter, dateRangeFilter]);

    const chartData = useMemo(() => {
        const dailyCounts = filteredVisitors.reduce((acc, visitor) => {
            const date = visitor.date;
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const sortedDates = Object.keys(dailyCounts).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        return { labels: sortedDates, datasets: [{ label: 'Visitors per Day', data: sortedDates.map(date => dailyCounts[date]), backgroundColor: 'rgba(0, 123, 255, 0.6)', borderColor: 'rgba(0, 123, 255, 1)', borderWidth: 1 }] };
    }, [filteredVisitors]);

    const peakTimesData = useMemo(() => {
        const hourlyCounts = Array(24).fill(0);
        filteredVisitors.forEach(visitor => {
            try {
                const hour = parseInt(visitor.timeIn.split(':')[0]);
                if (!isNaN(hour)) {
                    hourlyCounts[hour]++;
                }
            } catch (e) {
                // Ignore if timeIn format is unexpected
            }
        });
        return {
            labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
            datasets: [{
                label: 'Peak Visitor Hours',
                data: hourlyCounts,
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.3
            }]
        };
    }, [filteredVisitors]);

    const overviewStats = useMemo(() => {
        const now = new Date();
        const todayCount = visitors.filter(v => format(new Date(v.date), 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')).length;
        const checkedInCount = visitors.filter(v => !v.timeOut).length;
        return {
            total: visitors.length,
            today: todayCount,
            checkedIn: checkedInCount,
        };
    }, [visitors]);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
            </div>

            <div className="overview-grid">
                <div className="stat-card"><h4>Total Visitors</h4><span>{overviewStats.total}</span></div>
                <div className="stat-card"><h4>Today's Visitors</h4><span>{overviewStats.today}</span></div>
                <div className="stat-card"><h4>Currently Checked In</h4><span>{overviewStats.checkedIn}</span></div>
            </div>

            <div className="chart-container">
                <h3>Peak Visitor Hours</h3>
                <Line data={peakTimesData} options={{ responsive: true }} />
            </div>

            <div className="filters-container">
                <h3>Visitor Log</h3>
                <input type="text" placeholder="Search by name or company..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="search-input" />
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="all">All Statuses</option>
                    <option value="checked-in">Checked In</option>
                    <option value="checked-out">Checked Out</option>
                </select>
                <select value={dateRangeFilter} onChange={e => setDateRangeFilter(e.target.value)}>
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                </select>
                <button onClick={exportToCSV} className="export-button">Export CSV</button>
            </div>

            <div className="visitor-table-container">
                <table className="visitor-table">
                    <thead>
                        <tr>
                            <th>Photo</th>
                            <th>Name</th>
                            <th>Company</th>
                            <th>Host</th>
                            <th>Time In</th>
                            <th>Time Out</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVisitors.length > 0 ? (
                            filteredVisitors.map((visitor) => (
                                <tr key={visitor.id}>
                                    <td>
                                        <img src={visitor.photo} alt="Visitor" className="visitor-photo" onClick={() => setSelectedPhoto(visitor.photo)} />
                                    </td>
                                    <td>{visitor.name} {visitor.surname}</td>
                                    <td>{visitor.company || 'N/A'}</td>
                                    <td>{visitor.host}</td>
                                    <td>{visitor.date} at {visitor.timeIn}</td>
                                    <td>{visitor.timeOut || 'Checked In'}</td>
                                    <td className="visitor-actions">
                                        <button onClick={() => setEditingVisitor(visitor)} className="edit-button">Edit</button>
                                        <button onClick={() => handleSignOut(visitor.id)} className="sign-out-button">
                                            {visitor.timeOut ? 'Update Sign Out' : 'Sign Out'}
                                        </button>
                                        <button onClick={() => handleDelete(visitor.id)} className="delete-button">Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="no-visitors-message">No visitors found matching your criteria.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="chart-container">
                <h3>Visitor Trends</h3>
                <Bar data={chartData} options={{ responsive: true }} />
            </div>

            {selectedPhoto && <PhotoViewerModal imageSrc={selectedPhoto} onClose={() => setSelectedPhoto(null)} />}
            {editingVisitor && <EditVisitorModal visitor={editingVisitor} onClose={() => setEditingVisitor(null)} onSave={handleSaveEdit} />}
            <footer className="dashboard-footer">
                <button onClick={handleLogout} className="logout-button">Log Out</button>
            </footer>
        </div>
    );
};

export default AdminDashboard;
