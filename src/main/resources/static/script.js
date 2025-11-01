// Lấy các phần tử từ DOM
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');

const currentWeatherInfo = document.getElementById('current-weather-info');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const weatherIcon = document.getElementById('weather-icon');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const forecastContainer = document.getElementById('forecast-container');

// Gắn sự kiện
searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        fetchWeatherData(city);
    }
});

cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const city = cityInput.value;
        if (city) {
            fetchWeatherData(city);
        }
    }
});

// Hàm chính để gọi cả hai API
async function fetchWeatherData(city) {
    const currentWeatherUrl = `/api/weather?city=${city}`;
    const forecastUrl = `/api/weather/forecast?city=${city}`;

    try {
        const [currentWeatherResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl)
        ]);

        if (!currentWeatherResponse.ok || !forecastResponse.ok) {
            throw new Error('Không tìm thấy thành phố hoặc có lỗi xảy ra!');
        }

        const currentWeatherData = await currentWeatherResponse.json();
        const forecastData = await forecastResponse.json();

        displayCurrentWeather(currentWeatherData);
        displayForecast(forecastData);

    } catch (error) {
        alert(error.message);
        currentWeatherInfo.classList.add('hidden');
        forecastContainer.innerHTML = '';
    }
}

// Hiển thị thời tiết hiện tại
function displayCurrentWeather(data) {
    cityName.textContent = data.name;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    description.textContent = data.weather[0].description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;

    currentWeatherInfo.classList.remove('hidden');
}

// Hiển thị dự báo 5 ngày
function displayForecast(data) {
    forecastContainer.innerHTML = ''; // Xóa dự báo cũ

    // API trả về dữ liệu mỗi 3 giờ, ta cần lọc ra để lấy 1 mốc/ngày
    const dailyForecasts = data.list.filter(item => {
        // Lấy dự báo vào khoảng giữa trưa mỗi ngày
        return item.dt_txt.includes("12:00:00");
    });

    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toLocaleDateString('vi-VN', { weekday: 'short' });

        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';

        forecastCard.innerHTML = `
            <div class="date">${day}</div>
            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="icon">
            <div class="temp">${Math.round(forecast.main.temp)}°C</div>
        `;

        forecastContainer.appendChild(forecastCard);
    });
}