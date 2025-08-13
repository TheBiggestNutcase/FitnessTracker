// Global data storage
let fitnessData = [];
let currentEditId = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedSummaryDate = null;
let currentCycleMonth = new Date().getMonth();
let currentCycleYear = new Date().getFullYear();

// Chart instances
let stepsChart = null;
let weightChart = null;
let sleepChart = null;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing app...');

    // Small delay to ensure everything is loaded
    setTimeout(() => {
        initializeApp();
    }, 100);
});

const workouts = {
    ARMS: [
        "Dumbell Bicep Curl", "Tricep Extension", "Barbell Bicep Curl", "Standing wide grip bicep cable curls",
        "Standing cable tricep push down with rope", "kettlebell overhead tricep Extension",
        "barbell close grup bicep curls", "barbell wide grip bicep curls",
        "inclined dumbell seated seesaw hammer curls", "inclined dumbell seated hammer Curl",
        "inclined dumbell seated alternating hammer Curl", "Single arm dumbell seated reverse curl",
        "Dumbbells Double Arm Inner Biceps Curls", "Dumbbells Double Arm Zottman Curls",
        "Dumbbell Reverse Curls", "Knee Down Sphinx Push Ups", "Barbell Elevator Curls",
        "Dumbbell Seated Bicep Curl", "Bench Dips", "Alternating Bicep Curl",
        "Barbell Close Grip Curls", "1-arm Zottman Curls", "PREACHER CURL MACHINE",
        "Ez Barbell Curl", "Ez Bar Trice Extension", "Dumbbell Forearm Curls",
        "Bodyweight Tricep Dips", "Lying Double Arm Skull Crusher"
    ],
    BACK: [
        "Barbell Deadlifts", "Dumbbell Bent Over Row", "Lat Pull Down", "Barbell bent over rows",
        "Standing Wide Grip Cable Rows", "Single Knee Down High Plank Rowing", "Kettlbell Double Arm Shrugs",
        "Kettlebell Single Arm Bent Over Rows", "Kettlebells Bent Over Alternating Rows",
        "Kettlebells Bent Over Rows", "Kettlbell Bent Crush Row", "Barbell Supinated Bent Over Rows",
        "Seated Archer Stretch", "Dumbbells Alternating Bent Over Row", "Single Arm Dumbbell Chest Supported Rows",
        "Goodmorning", "Single Leg Half Forward Fold", "Standing Half Lat Stretch",
        "Standing Half Straddle Stretch", "Bent Over T Spine Rotations", "Bent Over T Spine Rotations- Advanced",
        "Plate Loaded Lat Pull Down", "Single Arm Plate Loaded Lat Pull", "Pendlay rows",
        "Seated Wide Grip Lat Pull Down Bar", "Seated Neutral Grip Horizontal Row",
        "Seated Close Grip Horizontal Row", "Seated Reverse Cose Grip Horizontal Row",
        "Seated Reverse WIDE Horizontal Row"
    ],
    CHEST: [
        "Machine Chest Flyes", "Barbell Bench Press", "Incline Bench Press", "Dumbbell Bench Press",
        "Push Up To Mountain", "Knee Down Pseudo Push Ups", "Pseudo Push Ups", "Pulse Pushups",
        "Incline Dumbbell Seesaw Bench Press", "Incline Dumbbell Alternating Bench Press",
        "DOUBLE ARM DUMBBELL INCLINE FLYES", "Weighted Pullover", "Knee Down Deficit Push Up",
        "1 Arm Incline Dumbbell Bench Press", "Dumbbell Close Grip Floor Press", "Double Arm Chest Press",
        "Dips", "Knee Down Close Grip Push Ups", "Knee Down Hand Release Push Up",
        "Plate Loaded Altenate arm Incline Press", "Plate Loaded One arm Hold Inclined Press",
        "Kettlebell Pull Over", "Plate Trice Dips", "Incline Wide Grip Bench Press",
        "Incline 1.5 Close Grip Bench Press", "Incline 1.5 Neutral Grip Bench Press",
        "Incline Reverse Grip Bench Press", "Decline Wide Grip bench press",
        "Decline Pause Wide grip bench press", "Decline Wide Grip bench press",
        "Decline Pause Wide grip bench press", "Decline Close Grip bench press"
    ],
    CORE: [],
    'FULL BODY': [],
    LEGS: [],
    'LOWER BODY': [],
    SHOULDERS: [],
    'UPPER BODY': []
};

function initializeApp() {
    try {
        console.log('Starting app initialization...');

        // Load sample data first
        loadSampleData();
        console.log('Sample data loaded');

        // Set up event listeners
        setupEventListeners();
        console.log('Event listeners setup complete');

        // Set today's date as default
        const dateInput = document.getElementById('entry-date');
        if (dateInput) {
            dateInput.valueAsDate = new Date();
            console.log('Default date set');
        }

        // Initialize views - make sure dashboard view is active by default
        showView('dashboard');
        setActiveNav('dashboard');

        // Initialize table and dashboard data
        updateTable();
        updateDashboard();

        console.log('Fitness Tracker initialized successfully');

    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

function loadSampleData() {
    const sampleEntries = [
        // {
        //     id: "entry1",
        //     date: "2024-08-10",
        //     weight: 65.5,
        //     measurements: { waist: 28, hips: 36, thighs: 22, arms: 11 },
        //     progressPhotos: "",
        //     calories: 1800,
        //     protein: 120,
        //     carbQuality: "Good - mostly whole grains",
        //     sugar: 45,
        //     waterIntake: 2.5,
        //     workoutSessions: 1,
        //     steps: 8500,
        //     strengthProgress: "Increased deadlift by 5lbs",
        //     menstrualCycle: "",
        //     energyMood: "High energy, positive mood",
        //     sleepQuality: "Good",
        //     sleepDuration: 7.5
        // },
        // {
        //     id: "entry2", 
        //     date: "2024-08-11",
        //     weight: 65.3,
        //     measurements: { waist: 28, hips: 36, thighs: 22, arms: 11 },
        //     progressPhotos: "",
        //     calories: 1750,
        //     protein: 115,
        //     carbQuality: "Fair - some processed foods",
        //     sugar: 50,
        //     waterIntake: 2.2,
        //     workoutSessions: 1,
        //     steps: 7200,
        //     strengthProgress: "Rest day - light stretching",
        //     menstrualCycle: "",
        //     energyMood: "Moderate energy, calm",
        //     sleepQuality: "Fair",
        //     sleepDuration: 6.5
        // }
    ];

    fitnessData = [...sampleEntries];
}

function setupEventListeners() {
    console.log('Setting up event listeners...');

    // Navigation buttons - use more explicit event handling
    const formBtn = document.querySelector('[data-view="form"]');
    const tableBtn = document.querySelector('[data-view="table"]');
    const dashboardBtn = document.querySelector('[data-view="dashboard"]');

    if (formBtn) {
        formBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Form nav clicked');
            showView('form');
            setActiveNav('form');
        });
    }

    if (tableBtn) {
        tableBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Table nav clicked');
            showView('table');
            setActiveNav('table');
        });
    }

    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Dashboard nav clicked');
            showView('dashboard');
            setActiveNav('dashboard');
            // Refresh dashboard when showing it
            setTimeout(() => updateDashboard(), 200);
        });
    }
    const fitnessFormBtn = document.querySelector('[data-view="fitness-form"]');
    if (fitnessFormBtn) {
        fitnessFormBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Fitness form nav clicked');
            showView('fitness-form');
            setActiveNav('fitness-form');
        });
    }

    const workoutForm = document.getElementById('workout-form');
    if (workoutForm) {
        workoutForm.addEventListener('submit', handleWorkoutFormSubmit);
    }

    const muscleAreaSelect = document.getElementById('muscle-area');
    if (muscleAreaSelect) {
        muscleAreaSelect.addEventListener('change', updateWorkoutDropdown);
    }

    // Form submission
    const form = document.getElementById('fitness-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log('Form submitted');
            handleFormSubmit(e);
        });
    }
    document.getElementById('heatmap-calendar').addEventListener('click', (e) => {
        if (e.target.classList.contains('calendar-day') && !e.target.classList.contains('calendar-day-header')) {
            const day = e.target.textContent;
            const month = currentMonth + 1;
            const year = currentYear;

            // Format the date string
            const monthStr = month < 10 ? `0${month}` : month;
            const dayStr = day < 10 ? `0${day}` : day;

            selectedSummaryDate = `${year}-${monthStr}-${dayStr}`;
            updateFitnessSummary();
        }
    });

    // Add this new listener for the cycle form
    const cycleForm = document.getElementById('cycle-form');
    if (cycleForm) {
        cycleForm.addEventListener('submit', handleCycleFormSubmit);
    }

    // Add these new listeners for the cycle calendar navigation
    const prevCycleBtn = document.getElementById('prev-cycle-month');
    const nextCycleBtn = document.getElementById('next-cycle-month');

    if (prevCycleBtn) {
        prevCycleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            navigateCycleMonth(-1);
        });
    }

    if (nextCycleBtn) {
        nextCycleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            navigateCycleMonth(1);
        });
    }

    // Cancel edit button
    const cancelBtn = document.getElementById('cancel-edit');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cancelEdit();
        });
    }

    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    const clearSearchBtn = document.getElementById('clear-search');
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            clearSearch();
        });
    }

    // Data management
    const exportBtn = document.getElementById('export-data');
    if (exportBtn) {
        exportBtn.addEventListener('click', (e) => {
            e.preventDefault();
            exportData();
        });
    }

    const importInput = document.getElementById('import-data');
    if (importInput) {
        importInput.addEventListener('change', importData);
    }

    // Calendar navigation
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            navigateMonth(-1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            navigateMonth(1);
        });
    }

    console.log('All event listeners attached successfully');
}

function showView(viewName) {
    console.log('Showing view:', viewName);

    // Hide all views first
    const allViews = document.querySelectorAll('.view');
    allViews.forEach(view => {
        view.classList.remove('active');
        console.log('Hiding view:', view.id);
    });

    // Show the target view
    const targetView = document.getElementById(`${viewName}-view`);
    if (targetView) {
        targetView.classList.add('active');
        console.log('Showing view:', targetView.id);

        // If switching to table view, update the table
        if (viewName === 'table') {
            setTimeout(() => updateTable(), 100);
        }

        // If switching to dashboard, update charts
        if (viewName === 'dashboard') {
            setTimeout(() => updateDashboard(), 200);
        }
        if (targetView) {
            targetView.classList.add('active');

            if (viewName === 'table') {
                updateTable();
            } else if (viewName === 'dashboard') {
                updateDashboard();
            } else if (viewName === 'cycle') {
                updateCycleDashboard(); // This is a new function call
            }
        }

    } else {
        console.error('Target view not found:', `${viewName}-view`);
    }
}

function setActiveNav(viewName) {

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const viewName = e.target.getAttribute('data-view');
            showView(viewName);
            setActiveNav(viewName);
        });
    });

    // Add active class to current nav button
    const activeBtn = document.querySelector(`[data-view="${viewName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        console.log('Active nav set to:', viewName);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    console.log('Processing form submission...');

    try {
        const formData = collectFormData();
        console.log('Form data collected:', formData);

        if (currentEditId) {
            updateEntry(currentEditId, formData);
            console.log('Entry updated');
        } else {
            addEntry(formData);
            console.log('Entry added');
        }

        // Immediately export the data after a new entry is saved or updated
        exportData();

        // Show success message
        showStatusMessage('Entry saved successfully!', 'success');

        // Reset form
        resetForm();

        // Update table data
        updateTable();

        // Switch to table view to show the saved entry
        setTimeout(() => {
            showView('table');
            setActiveNav('table');
        }, 500);

    } catch (error) {
        console.error('Error submitting form:', error);
        showStatusMessage('Error saving entry. Please try again.', 'error');
    }
}

function collectFormData() {
    return {
        id: currentEditId || generateId(),
        date: getFieldValue('entry-date'),
        weight: parseFloat(getFieldValue('weight')) || null, // This is the person's weight
        measurements: {
            waist: parseFloat(getFieldValue('waist')) || null,
            hips: parseFloat(getFieldValue('hips')) || null,
            thighs: parseFloat(getFieldValue('thighs')) || null,
            arms: parseFloat(getFieldValue('arms')) || null
        },
        progressPhotos: getFieldValue('progress-photos'),
        calories: parseInt(getFieldValue('calories')) || null,
        protein: parseFloat(getFieldValue('protein')) || null,
        carbQuality: getFieldValue('carb-quality'),
        sugar: parseFloat(getFieldValue('sugar')) || null,
        waterIntake: parseFloat(getFieldValue('water-intake')) || null,
        workoutSessions: parseInt(getFieldValue('workout-sessions')) || 0,
        steps: parseInt(getFieldValue('steps')) || null,
        strengthProgress: getFieldValue('strength-progress'),
        menstrualCycle: getFieldValue('menstrual-cycle'),
        energyMood: getFieldValue('energy-mood'),
        sleepQuality: getFieldValue('sleep-quality'),
        sleepDuration: parseFloat(getFieldValue('sleep-duration')) || null
    };
}

function getFieldValue(fieldId) {
    const field = document.getElementById(fieldId);
    return field ? field.value.trim() : '';
}

function generateId() {
    return 'entry_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function addEntry(entry) {
    fitnessData.push(entry);
    sortDataByDate();
    console.log('Entry added. Total entries:', fitnessData.length);
}

function updateEntry(id, newData) {
    const index = fitnessData.findIndex(entry => entry.id === id);
    if (index !== -1) {
        fitnessData[index] = newData;
        sortDataByDate();
        console.log('Entry updated');
    }
}

function deleteEntry(id) {
    console.log('Delete entry called for:', id);
    if (confirm('Are you sure you want to delete this entry?')) {
        const initialLength = fitnessData.length;
        fitnessData = fitnessData.filter(entry => entry.id !== id);

        if (fitnessData.length < initialLength) {
            // Call the save function after deleting an entry
            saveDataToFile();

            updateTable();
            showStatusMessage('Entry deleted successfully!', 'success');
            console.log('Entry deleted. Remaining entries:', fitnessData.length);
        }
    }
}

function updateWorkoutDropdown() {
    const muscleArea = document.getElementById('muscle-area').value;
    const workoutSelect = document.getElementById('workout-type');
    workoutSelect.innerHTML = '<option value="">Select workout</option>'; // Reset dropdown

    if (muscleArea && workouts[muscleArea]) {
        workouts[muscleArea].forEach(workout => {
            const option = document.createElement('option');
            option.value = workout;
            option.textContent = workout;
            workoutSelect.appendChild(option);
        });
    }
}

function handleWorkoutFormSubmit(e) {
    e.preventDefault();
    console.log('Processing workout form submission...');

    const date = document.getElementById('workout-date').value;
    const muscleArea = document.getElementById('muscle-area').value;
    const workoutType = document.getElementById('workout-type').value;
    const equipmentWeight = parseFloat(document.getElementById('workout-weight').value) || null; // Use a new variable name

    if (!date || !muscleArea || !workoutType) {
        showStatusMessage('Please fill out all required fields.', 'error');
        return;
    }

    const workoutEntry = {
        id: generateId(),
        date: date,
        type: 'workout',
        muscleArea: muscleArea,
        workoutType: workoutType,
        equipmentWeight: equipmentWeight // Store equipment weight here
    };

    fitnessData.push(workoutEntry);
    sortDataByDate();
    exportData();

    showStatusMessage('Workout saved successfully!', 'success');
    document.getElementById('workout-form').reset();
}

function sortDataByDate() {
    fitnessData.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function resetForm() {
    const form = document.getElementById('fitness-form');
    if (form) {
        form.reset();
    }

    const dateInput = document.getElementById('entry-date');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }

    const formTitle = document.getElementById('form-title');
    if (formTitle) {
        formTitle.textContent = 'Add New Entry';
    }

    const cancelBtn = document.getElementById('cancel-edit');
    if (cancelBtn) {
        cancelBtn.classList.add('hidden');
    }

    currentEditId = null;
    console.log('Form reset');
}

function editEntry(id) {
    console.log('Editing entry:', id);
    const entry = fitnessData.find(e => e.id === id);
    if (!entry) {
        console.error('Entry not found:', id);
        return;
    }

    currentEditId = id;

    // Populate form fields
    setFieldValue('entry-date', entry.date);
    setFieldValue('weight', entry.weight);
    setFieldValue('waist', entry.measurements?.waist);
    setFieldValue('hips', entry.measurements?.hips);
    setFieldValue('thighs', entry.measurements?.thighs);
    setFieldValue('arms', entry.measurements?.arms);
    setFieldValue('progress-photos', entry.progressPhotos);
    setFieldValue('calories', entry.calories);
    setFieldValue('protein', entry.protein);
    setFieldValue('carb-quality', entry.carbQuality);
    setFieldValue('sugar', entry.sugar);
    setFieldValue('water-intake', entry.waterIntake);
    setFieldValue('workout-sessions', entry.workoutSessions);
    setFieldValue('steps', entry.steps);
    setFieldValue('strength-progress', entry.strengthProgress);
    setFieldValue('menstrual-cycle', entry.menstrualCycle);
    setFieldValue('energy-mood', entry.energyMood);
    setFieldValue('sleep-quality', entry.sleepQuality);
    setFieldValue('sleep-duration', entry.sleepDuration);

    // Update form UI
    const formTitle = document.getElementById('form-title');
    if (formTitle) {
        formTitle.textContent = 'Edit Entry';
    }

    const cancelBtn = document.getElementById('cancel-edit');
    if (cancelBtn) {
        cancelBtn.classList.remove('hidden');
    }

    // Switch to form view
    showView('form');
    setActiveNav('form');
}

function setFieldValue(fieldId, value) {
    const field = document.getElementById(fieldId);
    if (field && value !== null && value !== undefined) {
        field.value = value;
    }
}

function cancelEdit() {
    resetForm();
    console.log('Edit cancelled');
}

function updateTable() {
    console.log('Updating table with', fitnessData.length, 'entries');

    const tbody = document.getElementById('table-body');
    const noDataDiv = document.getElementById('no-data');

    if (!tbody) {
        console.error('Table body not found');
        return;
    }

    if (fitnessData.length === 0) {
        tbody.innerHTML = '';
        if (noDataDiv) {
            noDataDiv.classList.remove('hidden');
        }
        return;
    }

    if (noDataDiv) {
        noDataDiv.classList.add('hidden');
    }

    const tableHTML = fitnessData.map(entry => {
        if (entry.type === 'workout') {
            return `
                <tr>
                    <td>${formatDate(entry.date)}</td>
                    <td>-</td> <td>-</td> <td>1 (${entry.workoutType})</td> <td>-</td> <td>-</td> <td class="table-actions">
                        <button class="btn btn--sm btn--edit" onclick="editEntry('${entry.id}')">Edit</button>
                        <button class="btn btn--sm btn--delete" onclick="deleteEntry('${entry.id}')">Delete</button>
                    </td>
                </tr>
            `;
        } else {
            return `
                <tr>
                    <td>${formatDate(entry.date)}</td>
                    <td>${entry.weight ? entry.weight + ' kg' : '-'}</td>
                    <td>${entry.calories || '-'}</td>
                    <td>${entry.workoutSessions || 0}</td>
                    <td>${entry.steps ? entry.steps.toLocaleString() : '-'}</td>
                    <td>${entry.sleepDuration ? entry.sleepDuration + 'h' : '-'} (${entry.sleepQuality || '-'})</td>
                    <td class="table-actions">
                        <button class="btn btn--sm btn--edit" onclick="editEntry('${entry.id}')">Edit</button>
                        <button class="btn btn--sm btn--delete" onclick="deleteEntry('${entry.id}')">Delete</button>
                    </td>
                </tr>
            `;
        }
    }).join('');

    tbody.innerHTML = tableHTML;
    console.log('Table updated successfully');
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#table-body tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function clearSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }

    document.querySelectorAll('#table-body tr').forEach(row => {
        row.style.display = '';
    });
}

function updateDashboard() {
    console.log('Updating dashboard...');
    updateMetrics();
    updateCharts();
    updateHeatmapCalendar();
}

function updateMetrics() {
    console.log('Updating metrics...');

    // Filter data for the current month and year
    const currentMonthData = fitnessData.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    });

    // Total workouts this month
    const totalWorkoutsMonth = currentMonthData.reduce((sum, entry) => sum + (entry.workoutSessions || 0), 0);
    const totalWorkoutsMonthEl = document.getElementById('total-workouts-month');
    if (totalWorkoutsMonthEl) {
        totalWorkoutsMonthEl.textContent = totalWorkoutsMonth;
    }

    // Total steps this month
    const totalStepsMonth = currentMonthData.reduce((sum, entry) => sum + (entry.steps || 0), 0);
    const totalStepsMonthEl = document.getElementById('total-steps-month');
    if (totalStepsMonthEl) {
        totalStepsMonthEl.textContent = totalStepsMonth.toLocaleString();
    }

    // Workout streak (calculation remains the same)
    const streak = calculateWorkoutStreak();
    const streakEl = document.getElementById('workout-streak');
    if (streakEl) {
        streakEl.textContent = `${streak} day${streak !== 1 ? 's' : ''}`;
    }

    // Last period (calculation remains the same)
    const lastPeriod = findLastPeriod();
    const lastPeriodEl = document.getElementById('last-period');
    if (lastPeriodEl) {
        lastPeriodEl.textContent = lastPeriod ? formatDate(lastPeriod) : 'Not recorded';
    }
}

function calculateWorkoutStreak() {
    if (fitnessData.length === 0) return 0;

    const sortedData = [...fitnessData].sort((a, b) => new Date(b.date) - new Date(a.date));
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
        const dateString = currentDate.toISOString().split('T')[0];
        const entry = sortedData.find(e => e.date === dateString);

        if (entry && entry.workoutSessions > 0) {
            streak++;
        } else if (i > 0) {
            break;
        }

        currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
}

function findLastPeriod() {
    const periodsWithDates = fitnessData
        .filter(entry => entry.menstrualCycle && entry.menstrualCycle.trim())
        .sort((a, b) => new Date(b.menstrualCycle) - new Date(a.menstrualCycle));

    return periodsWithDates.length > 0 ? periodsWithDates[0].menstrualCycle : null;
}

function getDaysInMonth(year, month) {
    const date = new Date(year, month, 1);
    const dates = [];
    while (date.getMonth() === month) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return dates;
}

function updateCharts() {
    console.log('Updating charts...');
    setTimeout(() => {
        try {
            updateStepsChart();
            updateWeightChart();
            updateSleepChart(); // Add this line
        } catch (error) {
            console.error('Error updating charts:', error);
        }
    }, 100);
}

function updateStepsChart() {
    const canvas = document.getElementById('steps-chart');
    if (!canvas) {
        console.warn('Steps chart canvas not found');
        return;
    }

    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded');
        return;
    }

    const ctx = canvas.getContext('2d');

    // Filter data for the current month
    const monthDays = getDaysInMonth(currentYear, currentMonth);
    const monthlyData = monthDays.map(date => {
        const dateString = date.toISOString().split('T')[0];
        const entry = fitnessData.find(e => e.date === dateString);
        return entry ? (entry.steps || 0) : null;
    });

    const labels = monthDays.map(date => date.toLocaleDateString('en-US', { day: 'numeric' }));

    if (stepsChart) {
        stepsChart.destroy();
    }

    stepsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Daily Steps',
                data: monthlyData,
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
    console.log('Steps chart updated for current month');
}

function updateWeightChart() {
    const canvas = document.getElementById('weight-chart');
    if (!canvas) {
        console.warn('Weight chart canvas not found');
        return;
    }

    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded');
        return;
    }

    const ctx = canvas.getContext('2d');
    const weightEntries = fitnessData
        .filter(entry => entry.weight && entry.weight > 0)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-30);

    const weightData = weightEntries.map(entry => entry.weight);
    const labels = weightEntries.map(entry => formatDate(entry.date));

    if (weightChart) {
        weightChart.destroy();
    }

    weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Weight (kg)',
                data: weightData,
                borderColor: '#FFC185',
                backgroundColor: 'rgba(255, 193, 133, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });

    console.log('Weight chart updated');
}

function updateSleepChart() {
    const canvas = document.getElementById('sleep-chart');
    if (!canvas) {
        console.warn('Sleep chart canvas not found');
        return;
    }

    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded');
        return;
    }

    const ctx = canvas.getContext('2d');
    const last30Days = getLast30DaysData();

    // Define color scale for sleep quality
    const qualityColors = {
        'Excellent': '#134252',
        'Good': '#21808D',
        'Fair': '#2D93A0',
        'Poor': '#32B8C6',
        'None': 'rgba(245, 245, 245, 0.5)' // Light gray for no data
    };

    const chartData = last30Days.map((entry, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - index));

        const quality = entry?.sleepQuality || 'None';
        const duration = entry?.sleepDuration || null;

        return {
            x: date,
            y: duration,
            quality: quality,
            color: qualityColors[quality]
        };
    }).filter(d => d.y !== null);

    if (sleepChart) {
        sleepChart.destroy();
    }

    sleepChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Sleep Duration (hours)',
                data: chartData,
                borderColor: '#21808D',
                backgroundColor: chartData.map(d => d.color),
                pointRadius: 6,
                pointHoverRadius: 8,
                fill: false,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const dataPoint = context.raw;
                            const date = dataPoint.x.toLocaleDateString();
                            const duration = dataPoint.y;
                            const quality = dataPoint.quality;
                            return `Date: ${date}, Duration: ${duration}h, Quality: ${quality}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Sleep Duration (hours)'
                    }
                }
            }
        }
    });
    console.log('Sleep chart updated');
}

function getLast30DaysData() {
    const result = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];

        const entry = fitnessData.find(e => e.date === dateString);
        result.push(entry || null);
    }

    return result;
}

function updateHeatmapCalendar() {
    const calendar = document.getElementById('heatmap-calendar');
    const monthYearSpan = document.getElementById('current-month-year');
    const entry = fitnessData.find(e => e.date === dateString);
    const workouts = entry && entry.type === 'fitness' ? (entry.workoutSessions || 0) : 0;
    const level = Math.min(workouts, 4);

    if (!calendar) {
        console.warn('Heatmap calendar not found');
        return;
    }

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    if (monthYearSpan) {
        monthYearSpan.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }

    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const daysInCalendar = 42;
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    let calendarHTML = '';

    dayHeaders.forEach(day => {
        calendarHTML += `<div class="calendar-day calendar-day-header">${day}</div>`;
    });

    for (let i = 0; i < daysInCalendar; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

        const isCurrentMonth = currentDate.getMonth() === currentMonth;
        const dateString = currentDate.toISOString().split('T')[0];
        const entry = fitnessData.find(e => e.date === dateString);

        const workouts = entry ? (entry.workoutSessions || 0) : 0;
        const level = Math.min(workouts, 4);

        const classes = [
            'calendar-day',
            isCurrentMonth ? '' : 'other-month'
        ].filter(Boolean).join(' ');

        const tooltip = `${currentDate.getDate()} ${monthNames[currentDate.getMonth()]}: ${workouts} workout${workouts !== 1 ? 's' : ''}`;

        calendarHTML += `
            <div class="${classes}" 
                 data-level="${level}" 
                 data-tooltip="${tooltip}">
                ${currentDate.getDate()}
            </div>
        `;
    }

    calendar.innerHTML = calendarHTML;
    console.log('Heatmap calendar updated');
    // Initial update for summary
    if (!selectedSummaryDate) {
        selectedSummaryDate = fitnessData.length > 0 ? fitnessData[0].date : new Date().toISOString().split('T')[0];
    }
    updateFitnessSummary();
}

function navigateMonth(direction) {
    currentMonth += direction;

    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }

    updateHeatmapCalendar();
}

function exportData() {
    try {
        const dataStr = JSON.stringify(fitnessData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `fitness-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        showStatusMessage('Data exported successfully!', 'success');
        console.log('Data exported');
    } catch (error) {
        console.error('Export error:', error);
        showStatusMessage('Error exporting data', 'error');
    }
}

function importData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        try {
            const importedData = JSON.parse(event.target.result);

            if (!Array.isArray(importedData)) {
                throw new Error('Invalid data format - expected array');
            }

            let merged = 0;
            let added = 0;

            importedData.forEach(entry => {
                if (!entry.date) return;

                const existingIndex = fitnessData.findIndex(existing =>
                    existing.date === entry.date
                );

                if (existingIndex !== -1) {
                    fitnessData[existingIndex] = { ...entry, id: fitnessData[existingIndex].id };
                    merged++;
                } else {
                    fitnessData.push({ ...entry, id: generateId() });
                    added++;
                }
            });

            sortDataByDate();
            updateTable();

            updateDashboard();

            showStatusMessage(`Data imported! Added ${added} new entries, merged ${merged} existing entries.`, 'success');
            console.log('Data imported:', { added, merged });

        } catch (error) {
            console.error('Import error:', error);
            showStatusMessage('Error importing data: Invalid file format', 'error');
        }
    };

    reader.readAsText(file);
    e.target.value = '';
}

function showStatusMessage(message, type = 'success') {
    const statusEl = document.getElementById('status-message');
    if (!statusEl) return;

    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;
    statusEl.classList.remove('hidden');

    setTimeout(() => {
        statusEl.classList.add('hidden');
    }, 5000);

    console.log('Status message:', message, type);
}

function formatDate(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
}
// Add this new function to handle saving the data
function saveDataToFile() {
    try {
        const dataStr = JSON.stringify(fitnessData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        // This creates a link to download the data immediately
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `fitness-data.json`;

        // To save without user interaction, you'd need a server-side component.
        // For a client-side solution, this approach requires the user to save the file.
        // You can uncomment the line below to auto-download, but it might be intrusive.
        // link.click();

        console.log('Data prepared for saving');
    } catch (error) {
        console.error('Save error:', error);
    }
}

function updateFitnessSummary() {
    const summaryContent = document.getElementById('summary-content');
    const summaryDateEl = document.getElementById('summary-date');

    if (!summaryContent || !summaryDateEl || !selectedSummaryDate) {
        return;
    }

    const date = formatDate(selectedSummaryDate);
    summaryDateEl.textContent = date;

    const dailyWorkouts = fitnessData.filter(entry => entry.date === selectedSummaryDate && entry.type === 'workout');

    if (dailyWorkouts.length === 0) {
        summaryContent.innerHTML = '<p>No specific workouts tracked for this day.</p>';
        return;
    }

    let totalWorkouts = dailyWorkouts.length;
    let muscleAreas = [...new Set(dailyWorkouts.map(w => w.muscleArea))].join(', ');

    let summaryHTML = `
        <p><strong>Workouts Done:</strong> ${totalWorkouts}</p>
        <p><strong>Muscle Focus:</strong> ${muscleAreas}</p>
        <h4>Workout Details:</h4>
        <ul>
    `;

    dailyWorkouts.forEach(workout => {
        const weight = workout.equipmentWeight ? `${workout.equipmentWeight} kg` : 'N/A';
        summaryHTML += `
            <li>
                <strong>${workout.workoutType}</strong>: ${weight}
            </li>
        `;
    });

    summaryHTML += '</ul>';
    summaryContent.innerHTML = summaryHTML;
}

function handleCycleFormSubmit(e) {
    e.preventDefault();
    console.log('Processing period form submission...');

    const date = document.getElementById('period-date').value;
    const flowRate = document.getElementById('flow-rate').value;

    if (!date) {
        showStatusMessage('Please select a date.', 'error');
        return;
    }

    const periodEntry = {
        id: generateId(),
        date: date,
        type: 'period',
        flowRate: flowRate
    };

    const existingEntry = fitnessData.find(e => e.date === date && e.type === 'period');
    if (existingEntry) {
        showStatusMessage('A period entry already exists for this date.', 'warning');
        return;
    }

    fitnessData.push(periodEntry);
    sortDataByDate();
    exportData();

    showStatusMessage('Period day saved successfully!', 'success');
    document.getElementById('cycle-form').reset();
    updateCycleDashboard();
}

// Updates the cycle tracker dashboard
function updateCycleDashboard() {
    console.log('Updating cycle dashboard...');
    updateCycleStats();
    renderCycleHeatmap();
}

// Calculates and displays cycle stats
function updateCycleStats() {
    const periodEntries = fitnessData
        .filter(entry => entry.type === 'period')
        .map(entry => ({ ...entry, dateObj: new Date(entry.date + 'T00:00:00Z') }))
        .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

    const cycleStartEl = document.getElementById('cycle-start-date');
    const cycleEndEl = document.getElementById('cycle-end-date');
    const cycleLengthEl = document.getElementById('cycle-length');

    const cycles = [];
    if (periodEntries.length > 0) {
        let currentCycleStart = new Date(periodEntries[0].date);
        let currentCycleEnd = null;

        for (let i = 1; i < periodEntries.length; i++) {
            const currentPeriodDay = new Date(periodEntries[i].date);
            const previousPeriodDay = new Date(periodEntries[i - 1].date);

            const diffInDays = (currentPeriodDay - previousPeriodDay) / (1000 * 60 * 60 * 24);

            if (diffInDays > 2) { // Assuming a break of more than 2 days is a new cycle
                currentCycleEnd = previousPeriodDay;
                cycles.push({
                    start: currentCycleStart,
                    end: currentCycleEnd,
                    length: (currentCycleEnd - currentCycleStart) / (1000 * 60 * 60 * 24) + 1
                });
                currentCycleStart = currentPeriodDay;
            } else if (i === periodEntries.length - 1) {
                currentCycleEnd = currentPeriodDay;
                cycles.push({
                    start: currentCycleStart,
                    end: currentCycleEnd,
                    length: (currentCycleEnd - currentCycleStart) / (1000 * 60 * 60 * 24) + 1
                });
            }
        }
    }

    if (periodEntries.length > 0) {
        // Logic to find last cycle start and end dates
        let lastEntryDate = new Date(periodEntries[periodEntries.length - 1].date);
        let lastPeriodStart = new Date(lastEntryDate);
        while (periodEntries.some(e => new Date(e.date).getTime() === lastPeriodStart.getTime() - (24 * 60 * 60 * 1000))) {
            lastPeriodStart.setDate(lastPeriodStart.getDate() - 1);
        }

        cycleStartEl.textContent = formatDate(lastPeriodStart.toISOString().split('T')[0]);
        cycleEndEl.textContent = formatDate(lastEntryDate.toISOString().split('T')[0]);
    } else {
        cycleStartEl.textContent = 'Not recorded';
        cycleEndEl.textContent = 'Not recorded';
    }

    if (cycles.length > 0) {
        const totalLength = cycles.reduce((sum, cycle) => sum + cycle.length, 0);
        const averageLength = totalLength / cycles.length;
        cycleLengthEl.textContent = `${averageLength.toFixed(0)} days`;
    } else {
        cycleLengthEl.textContent = 'N/A';
    }
}

// Renders the new period calendar
function renderCycleHeatmap() {
    const calendar = document.getElementById('cycle-heatmap-calendar');
    const monthYearSpan = document.getElementById('current-cycle-month-year');
    if (!calendar) return;

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    monthYearSpan.textContent = `${monthNames[currentCycleMonth]} ${currentCycleYear}`;

    const periodDays = new Map(
        fitnessData
            .filter(entry => entry.type === 'period')
            .map(entry => [entry.date, entry.flowRate])
    );

    const firstDayOfMonth = new Date(Date.UTC(currentCycleYear, currentCycleMonth, 1));
    const firstDayOfWeek = firstDayOfMonth.getUTCDay();
    const startDate = new Date(Date.UTC(currentCycleYear, currentCycleMonth, 1 - firstDayOfWeek));

    const daysInCalendar = 42;
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    let calendarHTML = '';
    dayHeaders.forEach(day => {
        calendarHTML += `<div class="calendar-day calendar-day-header">${day}</div>`;
    });

    for (let i = 0; i < daysInCalendar; i++) {
        const currentDate = new Date(startDate);
        currentDate.setUTCDate(startDate.getUTCDate() + i);

        const isCurrentMonth = currentDate.getUTCMonth() === currentCycleMonth;
        const dateString = currentDate.toISOString().split('T')[0];
        const flowRate = periodDays.get(dateString);
        const isPeriodDay = !!flowRate;

        const classes = [
            'calendar-day',
            isCurrentMonth ? '' : 'other-month',
            isPeriodDay ? 'period-day' : ''
        ].filter(Boolean).join(' ');

        const tooltip = isPeriodDay ? `Period day: ${flowRate}` : 'No period';

        calendarHTML += `
        <div class="${classes}" 
             data-tooltip="${tooltip}"
             data-date="${dateString}">
            ${currentDate.getUTCDate()}
        </div>
    `;
    }

    calendar.innerHTML = calendarHTML;
}

// Navigates the new cycle calendar
function navigateCycleMonth(direction) {
    currentCycleMonth += direction;

    if (currentCycleMonth > 11) {
        currentCycleMonth = 0;
        currentCycleYear++;
    } else if (currentCycleMonth < 0) {
        currentCycleMonth = 11;
        currentCycleYear--;
    }

    renderCycleHeatmap();
}

// Global functions for onclick handlers
window.editEntry = editEntry;
window.deleteEntry = deleteEntry;
window.switchView = showView;