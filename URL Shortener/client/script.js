const BASE_URL = 'http://localhost:5000';

async function shortenUrl() {
  const input = document.getElementById('urlInput').value.trim();
  const resultDiv = document.getElementById('result');
  const errorDiv = document.getElementById('error');

  resultDiv.classList.add('hidden');
  errorDiv.classList.add('hidden');

  if (!input) {
    errorDiv.textContent = 'Please enter a URL!';
    errorDiv.classList.remove('hidden');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/shorten`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalUrl: input })
    });

    const data = await response.json();

    if (data.shortCode) {
      const shortUrl = `${BASE_URL}/${data.shortCode}`;
      document.getElementById('shortLink').textContent = shortUrl;
      document.getElementById('shortLink').href = shortUrl;
      document.getElementById('analyticsLink').href = `dash.html?code=${data.shortCode}`;
      resultDiv.classList.remove('hidden');
    } else {
      errorDiv.textContent = data.error || 'Something went wrong!';
      errorDiv.classList.remove('hidden');
    }
  } catch (err) {
    errorDiv.textContent = 'Cannot connect to server!';
    errorDiv.classList.remove('hidden');
  }
}

function copyUrl() {
  const link = document.getElementById('shortLink').textContent;
  navigator.clipboard.writeText(link);
  alert('Copied to clipboard!');
}