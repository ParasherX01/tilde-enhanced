class Clock {
    constructor(options) {
      this._el = $.el('#clock');
      this._elDate = $.el('#date');
      this._elSecond = $.el('#second');
      this._showAmPm = options.showAmPm;
      this._delimiter = options.delimiter;
      this._twentyFourHourClock = options.twentyFourHourClock;
      this._setTime = this._setTime.bind(this);
      this._el.addEventListener('click', options.toggleHelp);
      this._start();
    }
  
    _setTime() {
      const date = new Date();
      let hours = $.pad(date.getHours());
      let amPm = '';
  
      if (!this._twentyFourHourClock) {
        hours = date.getHours();
        if (hours > 12) hours -= 12;
        else if (hours === 0) hours = 12;
  
        if (this._showAmPm) { 
          amPm =
          `&nbsp;<span class="am-pm">` +
          `${date.getHours() >= 12 ? 'PM' : 'AM'}</span>`;
        }
      }
  
      const minutes = $.pad(date.getMinutes());
      this._el.innerHTML = `${hours}${this._delimiter}${minutes}${amPm}`;
      this._el.setAttribute('datetime', date.toTimeString());

      this._elSecond.innerHTML = `${date.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})},&nbsp;`;
      this._elSecond.setAttribute('datetime', date.toTimeString());
    }

    _setDate() {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const date = new Date();

      this._elDate.innerHTML = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear().toString().substr(-2)}`;
      this._elDate.setAttribute('datetime', date.toTimeString());
    }
  
    _start() {
      const date = new Date();
      this._setTime();
      this._setDate();
      
      setTimeout(() => {
        setInterval(this._setTime, 1000);
      }, (1000 - date.getMilliseconds()));

      setTimeout(() => {
        setInterval(this._setDate, 86400000);
      }, ((24 - date.getHours()) * (60 - date.getMinutes()) * (60 - date.getSeconds()) * (1000 - date.getMilliseconds())));
    
    }
  }