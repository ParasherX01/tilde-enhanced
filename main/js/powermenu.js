class PowerMenu {
  constructor(options) {
    this.weatherApi = options.weatherApi
    this.cityName = options.cityName
    this.cityId = options.cityId
  
    this.timeEl = document.getElementById('clock');
    this.powerMenuEl = document.getElementById('power-menu');
    this.secondEl = document.getElementById('second');
    this.dateEl = document.getElementById('date');
    this.commandsEl = document.getElementById('commands-list');
    this.delimiters = document.getElementsByClassName('clock-delimiter');

    Weather.setApiKey(this.weatherApi)

    this.turnOnEventListners()
    this.renderCommandsButtons()
    this.renderWeather()
  }

  turnOnEventListners() {
    window.CBClick = (el) => {
      el.classList.add('activated')
      const ripple = document.getElementById('ripple')
      ripple.classList.add('activated')
      ripple.style.top = el.offsetTop + 'px'
      ripple.style.left = el.offsetLeft + 'px'
      ripple.style.background = el.getAttribute('data-bg')

      window.location.href = el.getAttribute('data-url')
    }
    
    document.addEventListener('keydown', e => {
      if (e.key === 'Shift') {
        this.unwrap()
        document.getElementById('commands-list').classList.add('tips')
      }
    })
    document.addEventListener('keyup', e => {
      if (e.key === 'Shift') {
        this.wrap()
        document.getElementById('commands-list').classList.remove('tips')
      }
    })

    document.getElementById('power-menu-btn').addEventListener('click', e => {
      this.toggle()
    })

    document.getElementById('main').addEventListener('contextmenu', e => {
      e.preventDefault()
      this.toggle()
    })

    document.getElementById('weather-temp-today').addEventListener('click', e => {
      if(document.getElementById('weather-temp-tomorrow').classList.contains('unwrap')) {
        document.getElementById('weather-temp-tomorrow').classList.remove('unwrap')
      } else {
        document.getElementById('weather-temp-tomorrow').classList.add('unwrap')
      }
    })

    //commands shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.shiftKey) {
        if (e.key !== 'Shift') {
          for (let i = 0; i < CONFIG.commands.length; i++) {
            if (CONFIG.commands[i].button === e.key.toLowerCase()) {
              e.preventDefault()
              form.hide()
              document.getElementById('command-tip-' + e.key.toLowerCase()).click()
              break
            } 
          }
        }
      }
    })

  }

  renderCommandsButtons() {
    let i = 0
    let j = 0
    while (j < 10 && i < CONFIG.commands.length) {
      if(CONFIG.commands[i].category === 'General' && CONFIG.commands[i].icon) {
        this.commandsEl.insertAdjacentHTML(
          'beforeend',
          `<div
            class='command-button'
            data-bg='${CONFIG.commands[i].color}'
            data-url='${CONFIG.commands[i].url}'
            onclick='CBClick(this)' 
            onmouseover='this.style.background = "${CONFIG.commands[i].color}"' 
            onmouseout='if (!this.classList.contains("activated")) {this.style.background = ""}'>
              <img 
                src='assets/icons/${CONFIG.commands[i].icon}.svg' 
                onload='SVGInject(this)' 
              />
              <div class='command-tip' id='command-tip-${CONFIG.commands[i].button}'>${CONFIG.commands[i].button}</div>
          </div>`
        )
        j++
      }
      i++
    }
  }

  renderWeather() {
    //today
    Weather.getCurrent(this.cityName, data => {
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

  toggle() {
    if (this.powerMenuEl.classList.contains('unwrap')) {
      this.wrap()
    } else {
      this.unwrap()
    }
  }

  unwrap() {
    this.powerMenuEl.classList.add('unwrap')
    this.secondEl.classList.add('unwrap')
    this.dateEl.classList.add('unwrap')
    this.timeEl.classList.add('unwrap')
    for(const e of this.delimiters) {
      e.classList.add('unwrap')
    }
  }

  wrap() {
    this.powerMenuEl.classList.remove('unwrap')
    this.secondEl.classList.remove('unwrap')
    this.dateEl.classList.remove('unwrap')
    this.timeEl.classList.remove('unwrap')
    for(const e of this.delimiters) {
      e.classList.remove('unwrap')
    }
  }

}