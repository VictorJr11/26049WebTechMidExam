// Constants
const API_BASE_URL = '/api/bookings';
let currentSort = { field: null, direction: 'asc' };
let debounceTimer;

// Utility Functions
const debounce = (func, delay) => {
    return (...args) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
};

// API Calls
const fetchBookings = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams();

        if (filters.customerName) queryParams.append('customerName', filters.customerName);
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.startDate) queryParams.append('startDate', filters.startDate);
        if (filters.endDate) queryParams.append('endDate', filters.endDate);
        if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
        if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

        const response = await fetch(`${API_BASE_URL}/search?${queryParams}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching bookings:', error);
        showErrorToast('Failed to fetch bookings. Please try again.');
        return [];
    }
};

// UI Handlers
const applyFilters = debounce(async () => {
    const filters = {
        customerName: document.getElementById('customerNameFilter').value,
        status: document.getElementById('statusFilter').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        minPrice: document.getElementById('minPrice').value,
        maxPrice: document.getElementById('maxPrice').value
    };

    showLoadingSpinner();
    const bookings = await fetchBookings(filters);
    renderBookingTable(bookings);
    hideLoadingSpinner();
}, 500);

const resetFilters = () => {
    document.getElementById('customerNameFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    applyFilters();
};

const sortTable = (field) => {
    if (currentSort.field === field) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.field = field;
        currentSort.direction = 'asc';
    }

    updateSortingIcons(field);
    applyFilters();
};

const renderBookingTable = (bookings) => {
    const tableBody = document.getElementById('bookingTableBody');
    tableBody.innerHTML = '';

    if (bookings.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">No bookings found</td>
            </tr>
        `;
        return;
    }

    // Sort bookings if sorting is active
    if (currentSort.field) {
        bookings.sort((a, b) => {
            let comparison = 0;
            if (a[currentSort.field] < b[currentSort.field]) comparison = -1;
            if (a[currentSort.field] > b[currentSort.field]) comparison = 1;
            return currentSort.direction === 'asc' ? comparison : -comparison;
        });
    }

    bookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.name}</td>
            <td>${booking.email}</td>
            <td>${formatDate(booking.checkInDate)}</td>
            <td>${formatDate(booking.checkOutDate)}</td>
            <td>
                <span class="badge bg-${getStatusBadgeClass(booking.status)}">
                    ${booking.status}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editBooking(${booking.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteBooking(${booking.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
};

const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
        case 'confirmed': return 'success';
        case 'pending': return 'warning';
        case 'cancelled': return 'danger';
        default: return 'secondary';
    }
};

// UI Feedback
const showLoadingSpinner = () => {
    const spinner = document.createElement('div');
    spinner.id = 'loadingSpinner';
    spinner.className = 'position-fixed top-50 start-50 translate-middle';
    spinner.innerHTML = `
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `;
    document.body.appendChild(spinner);
};

const hideLoadingSpinner = () => {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.remove();
};

const showErrorToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'toast position-fixed top-0 end-0 m-3';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="toast-header bg-danger text-white">
            <strong class="me-auto">Error</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    document.body.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize tooltips and popovers if using Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // Add input event listeners for real-time filtering
    const filterInputs = document.querySelectorAll('.filter-panel input, .filter-panel select');
    filterInputs.forEach(input => {
        input.addEventListener('input', applyFilters);
    });

    // Initial load
    applyFilters();
});