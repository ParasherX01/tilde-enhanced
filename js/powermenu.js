class PowerMenu {
  constructor(options) {
    this.weatherApi = options.weatherApi
    this.cityName = options.cityName
    this.cityId = options.cityId
  
    this.powerMenuEl = document.getElementById('power-menu');
    this.secondEl = document.getElementById('second');
    this.dateEl = document.getElementById('date');
    this.delimiters = document.getElementsByClassName('clock-delimiter');

    Weather.setApiKey(this.weatherApi)

    this.turnOnEventListners()

    //today
    Weather.getCurrent(this.cityName, data => {
      console.log(data);
      data = data.data
      
      const temp = Math.round(Weather.kelvinToCelsius(data.main.temp))
      const feelsLike = Math.round(Weather.kelvinToCelsius(data.main.feels_like))
      const textedTemp = (temp === feelsLike ? `${temp}°C` : `${temp}°C, feels like ${feelsLike}°C`)

      document.getElementById('wtemp-today').textContent = `${textedTemp}`
      document.getElementById('wicon-today').src  = `http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`
    })

    //tomorrow
    Weather.getForecast(this.cityName, data => {      
      const day = 24 * 60 * 60 * 1000
      let tomorrow = new Date()
      tomorrow.setHours(0, 0, 0, 0)
      tomorrow.setTime(tomorrow.getTime() + day)

      data = data.data.list.filter(x => {let dayOfX = new Date(x.dt_txt); return (dayOfX.getDate() === tomorrow.getDate())})
      console.log(data)
      console.log(data.map(x => x.main.temp_max))
      const maxTemp = Math.round(Weather.kelvinToCelsius(Math.max(...data.map(x => x.main.temp_max))))
      const minTemp = Math.round(Weather.kelvinToCelsius(Math.min(...data.map(x => x.main.temp_min))))
      
      let count = {}
      data.forEach(x => { count[x.weather[0].icon] = (count[x.weather[0].icon]||0) + 1 })
      const icon = Object.keys(count).find(key => count[key] === Math.max(...Object.values(count)))

      const textedTemp = `${maxTemp}°C/${minTemp}°C`

      document.getElementById('wtemp-tomorrow').textContent = `${textedTemp}`
      document.getElementById('wicon-tomorrow').src  = `http://openweathermap.org/img/wn/${icon}@4x.png` 
    })
  }

  turnOnEventListners() {
    document.addEventListener('keydown', e => {
      if (e.key === 'Shift') {
        this.unwrap()
      }
    })
    document.addEventListener('keyup', e => {
      if (e.key === 'Shift') {
        this.wrap()
      }
    })

    document.getElementById('power-menu-btn').addEventListener('click', e => {
      if (this.powerMenuEl.classList.contains('unwrap')) {
        this.wrap()
      } else {
        this.unwrap()
      }
    })

    document.getElementById('weather-temp-today').addEventListener('click', e => {
      if(document.getElementById('weather-temp-tomorrow').classList.contains('unwrap')) {
        document.getElementById('weather-temp-tomorrow').classList.remove('unwrap')
      } else {
        document.getElementById('weather-temp-tomorrow').classList.add('unwrap')
      }
    })

  }

  unwrap() {
    this.powerMenuEl.classList.add('unwrap')
    this.secondEl.classList.add('unwrap')
    this.dateEl.classList.add('unwrap')
    for(const e of this.delimiters) {
      e.classList.add('unwrap')
    }
  }

  wrap() {
    this.powerMenuEl.classList.remove('unwrap')
    this.secondEl.classList.remove('unwrap')
    this.dateEl.classList.remove('unwrap')
    for(const e of this.delimiters) {
      e.classList.remove('unwrap')
    }
  }

}