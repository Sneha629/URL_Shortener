const BASE_URL = 'http://localhost:5000';

window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  if (code) {
    document.getElementById('codeInput').value = code;
    loadAnalytics();
  }
};

async function loadAnalytics() {
  const code = document.getElementById('codeInput').value.trim();
  const dataDiv = document.getElementById('analyticsData');
  const errorDiv = document.getElementById('analyticsError');

  dataDiv.classList.add('hidden');
  errorDiv.classList.add('hidden');

  if (!code) {
    errorDiv.textContent = 'Please enter a short code!';
    errorDiv.classList.remove('hidden');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/analytics/${code}`);
    const data = await response.json();

    if (data.shortCode) {
      document.getElementById('originalUrl').textContent = data.originalUrl;
      document.getElementById('shortCode').textContent = data.shortCode;
      document.getElementById('totalClicks').textContent = data.clicks;

      renderClicksChart(data.analytics);
      renderDeviceChart(data.analytics);

      dataDiv.classList.remove('hidden');
    } else {
      errorDiv.textContent = data.error || 'Not found!';
      errorDiv.classList.remove('hidden');
    }
  } catch (err) {
    errorDiv.textContent = 'Cannot connect to server!';
    errorDiv.classList.remove('hidden');
  }
}

function renderClicksChart(analytics) {
  const ctx = document.getElementById('clicksChart').getContext('2d');

  const dateMap = {};
  analytics.forEach(a => {
    const date = new Date(a.timestamp).toLocaleDateString();
    dateMap[date] = (dateMap[date] || 0) + 1;
  });

  if (window.clicksChartInstance) window.clicksChartInstance.destroy();

  window.clicksChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Object.keys(dateMap),
      datasets: [{
        label: 'Clicks',
        data: Object.values(dateMap),
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79,70,229,0.1)',
        tension: 0.4,
        fill: true,
      }]
    },
    options: { responsive: true }
  });
}

function renderDeviceChart(analytics) {
  const ctx = document.getElementById('deviceChart').getContext('2d');

  const deviceMap = { Mobile: 0, Desktop: 0 };
  analytics.forEach(a => {
    if (a.device === 'Mobile') deviceMap.Mobile++;
    else deviceMap.Desktop++;
  });

  if (window.deviceChartInstance) window.deviceChartInstance.destroy();

  window.deviceChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Mobile', 'Desktop'],
      datasets: [{
        data: [deviceMap.Mobile, deviceMap.Desktop],
        backgroundColor: ['#4f46e5', '#e0e7ff'],
      }]
    },
    options: { responsive: true }
  });
}