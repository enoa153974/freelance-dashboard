

/* =========================
    天気パネルの動作
========================= */
export function initWeather() {
    const API_KEY =  '431956e1ae5d6c3bde0cbdbaf7b3102e';

    const statusEl = document.getElementById('weather-status');
    const tempEl = document.getElementById('weather-temp');
    const refreshBtn = document.getElementById('weather-refresh');

    if (!statusEl || !tempEl) return;

    let weatherInterval = null;
    const AUTO_UPDATE_INTERVAL = 30 * 60 * 1000;

    async function fetchWeather(retry = false) {
        if (!navigator.geolocation) {
            statusEl.textContent = '位置情報が使えません';
            return;
        }

        statusEl.textContent = '天気取得中…';
        tempEl.textContent = '';

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude: lat, longitude: lon } = position.coords;

                try {
                    const res = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ja&appid=${API_KEY}`
                    );
                    const data = await res.json();

                    statusEl.textContent =
                        `${getWeatherIcon(data.weather[0].main)} ${data.weather[0].description}`;
                    tempEl.textContent =
                        `気温は：${Math.round(data.main.temp)}℃です`;
                } catch {
                    statusEl.textContent = '天気取得に失敗しました';
                }
            },
            () => {
                if (!retry) {
                    setTimeout(() => fetchWeather(true), 3000);
                } else {
                    statusEl.textContent = '位置情報が取得できません';
                }
            }
        );
    }

    function getWeatherIcon(main) {
        switch (main) {
            case 'Clear': return '☀️';
            case 'Clouds': return '☁️';
            case 'Rain':
            case 'Drizzle': return '🌧️';
            case 'Thunderstorm': return '⛈️';
            case 'Snow': return '❄️';
            default: return '🌥️';
        }
    }

    refreshBtn?.addEventListener('click', fetchWeather);

    function startAutoUpdate() {
        stopAutoUpdate();
        weatherInterval = setInterval(fetchWeather, AUTO_UPDATE_INTERVAL);
    }

    function stopAutoUpdate() {
        if (weatherInterval) {
            clearInterval(weatherInterval);
            weatherInterval = null;
        }
    }

    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            fetchWeather();
            startAutoUpdate();
        }
    });

    fetchWeather();
    startAutoUpdate();
}
