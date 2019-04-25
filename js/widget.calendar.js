class Calendar {

    constructor(selector, currentDate){
        this.months = [
            {
                name: 'January',
                days: () => 31
            },
            {
                name: 'February',
                days: (year) => year % 4 == 0 ? 29 : 28
            },
            {
                name: 'March',
                days: () => 31
            },
            {
                name: 'April',
                days: () => 30
            },
            {
                name: 'May',
                days: () => 31
            },
            {
                name: 'June',
                days: () => 30
            },
            {
                name: 'July',
                days: () => 31
            },
            {
                name: 'August',
                days: () => 31
            },
            {
                name: 'September',
                days: () => 30
            },
            {
                name: 'October',
                days: () => 31
            },
            {
                name: 'November',
                days: () => 30
            },
            {
                name: 'December',
                days: () => 31
            }
        ];
        
        this.selector = selector;
        
        this.visible = this.selector.style.display === 'block';

        this.listeners = {
            'datechanged': undefined
        };

        var table = this.selector.getElementsByTagName('table')[0];

        if(!table) return console.error('Tag table not found in widget');
        
        this.tbody = table.getElementsByTagName('tbody')[0];

        this.monthTitles = table.getElementsByClassName('mounth-name');
        this.yearTitles = table.getElementsByClassName('year');

        let now = new Date();

        currentDate = {
            year:   (!currentDate || !currentDate.year && currentDate.year != 0) ? now.getFullYear() : currentDate.year,
            month:  (!currentDate || !currentDate.month && currentDate.month != 0) ? now.getMonth() : currentDate.month,
            day:    (!currentDate || !currentDate.day && currentDate.day != 0) ? now.getDate() : currentDate.day
        };
        
        console.log(currentDate);

        this.setCurrentDate(currentDate);

        this.selectDate(currentDate);

        let nextBtns = this.selector.getElementsByClassName('next-month');
        let prevBtns = this.selector.getElementsByClassName('prev-month');

        for(let i = 0; i < nextBtns.length; i++) nextBtns[i].onclick = () => this.nextMonth();
        for(let i = 0; i < prevBtns.length; i++) prevBtns[i].onclick = () => this.prevMonth();

        let self = this;

        table.onclick = function(event){
            if(event.target.tagName == 'TD'){
                let day = Number(event.target.getAttribute('data-day'));        
                let month = Number(event.target.getAttribute('data-month'));
                let year = Number(event.target.getAttribute('data-year'));

                self.selectDate({
                    day: day,
                    month: month,
                    year: year
                }, event.target);

                if(month != self.currentDate.month || year != self.currentDate.year){
                    self.setCurrentDate({
                        year: year,
                        month: month
                    });
                    self.render();
                }
                self.hide();
            }
        }
    }

    isVisible(){
        return this.visible;
    }

    on(event, callback){
        this.listeners[event] = callback;
    }

    setCurrentDate(currentDate){
        this.currentDate = this.getMonthInfo(currentDate.year, currentDate.month, currentDate.day);
    }

    changeThead(){
        for(let i = 0; i < this.monthTitles.length; i++){
            this.monthTitles[i].innerText = this.currentDate.monthName;
        }
        for(let i = 0; i < this.yearTitles.length; i++){
            this.yearTitles[i].innerText = this.currentDate.year;
        }
    }


    nextMonth(){
        let month = this.currentDate.month < 11 ? this.currentDate.month + 1 : 0;
        let year = this.currentDate.month == 11 ? this.currentDate.year + 1 : this.currentDate.year;

        this.setCurrentDate({
            year: year,
            month: month
        });

        this.render();
    }

    prevMonth(){
        let month = this.currentDate.month > 0 ? this.currentDate.month - 1 : 11;
        let year = this.currentDate.month == 0 ? this.currentDate.year - 1 : this.currentDate.year;

        this.setCurrentDate({
            year: year,
            month: month
        });

        this.render();
    }

    selectDate(currentDate, target){
        let now = new Date();
        this.selectedDate = {
            year:  currentDate && currentDate.year ? currentDate.year : now.getFullYear(), 
            month: currentDate && currentDate.month ? currentDate.month : now.getMonth(),
            day:   currentDate && currentDate.day ? currentDate.day : now.getDate()
        };
        
        let actives = this.tbody.getElementsByClassName('active');

        for(let i = 0; i < actives.length; i++){
            actives[i].className = '';
        }

        if(target){
            target.classList.add('active');
            target.classList.add('background-color-link');
            target.classList.add('color-buttonText');
        }

        if(this.listeners['datechanged']){
            this.listeners['datechanged'](currentDate);
        }
    }

    getMonthInfo(year, month, day){
        let self = this;
        if(month < 0 || month > 11) month = 0;
        if(day < 0 || day > self.months[month].days(year)) day = 1;
        return {
            year: year,
            month: month,
            day: day,
            monthName: self.months[month].name,
            days: self.months[month].days(year),
            _start: undefined,
            start: function(){
                if(this._start) return this._start;
                
                let month = this.month > 0 ? this.month - 1 : 11;
                let year = month == 11 ? this.year - 1 : this.year;
                let days = self.months[month].days(year);
                this._start =  (new Date(year, month, days)).getDay();
                console.log(days + " " + month + " " + year + " " + this._start);
                return this._start;
            }
        };
    }

    render(){
        this.changeThead();

        let html = "";
        let day = 1;
        
        let nextMonth = this.currentDate.month == 11 ? 0 : this.currentDate.month + 1;
        let nextYear  = this.currentDate.month == 11 ? this.currentDate.year + 1: this.currentDate.year;
        let nextDay = 1;

        let prevMonth = this.currentDate.month == 0 ? 11 : this.currentDate.month - 1;
        let prevYear = this.currentDate.month == 0  ? this.currentDate.year - 1: this.currentDate.year;
        let prevDay = this.months[prevMonth].days() - this.currentDate.start() + 1; 

        for(let row = 0; row < 6; row++){
            html += "<tr>";
            for(let cell = 0; cell < 7; cell++){
                if(row == 0 && cell < this.currentDate.start()){
                    let clss = prevDay == this.selectedDate.day 
                              && prevMonth == this.selectedDate.month 
                              && prevYear == this.selectedDate.year ?
                                    "active background-color-link color-buttonText" 
                                    : "";

                    html += this.cellTemplate(prevDay, prevMonth, prevYear, 'other-mouns ' + clss);

                    prevDay++;

                    continue;
                }else if(day > this.currentDate.days){
                    let clss = nextDay == this.selectedDate.day 
                                && nextMonth == this.selectedDate.month 
                                && nextYear == this.selectedDate.year ?
                                    "active background-color-link color-buttonText" 
                                    : "";
                    html += this.cellTemplate(nextDay, nextMonth, nextYear, 'other-mouns ' + clss);
                    nextDay++;
                    continue;
                }
                let clss = day == this.selectedDate.day && this.currentDate.month == this.selectedDate.month && this.currentDate.year == this.selectedDate.year ?
                            "active background-color-link color-buttonText" : "";

                html += this.cellTemplate(day, this.currentDate.month, this.currentDate.year, clss);

                day++;
            }
            html += "</tr>";
            if(day > this.currentDate.days) break;
        }
        this.tbody.innerHTML = html;
    }

    cellTemplate(day, month, year, clss){
        return "<td class='" + clss + "' data-day='" + day + "' data-month='" + month + "' data-year='" + year + "'>" + day + "</td>";
    }

    show(){
        this.visible = true;
        this.selector.style.display = 'block';
    }

    hide(){
        this.visible = false;
        this.selector.style.display = 'none';
    }
}



(
    function(){
        function initCalendarWidget(wrapper){

            function parseDate(date){
                let split = date.split('/');
                
                let d = Number(split[0]);
                let m = Number(split[1]);
                let y = Number(split[2]);
    
                return {
                    day: d,
                    month: m - 1,
                    year: y
                };
            }

            function dateToString(date){
                let month = date.month + 1;
                return (date.day < 10 ? '0' + date.day : date.day) + '/' + (month < 10 ? '0' + month : month) + '/' + date.year;
            }

            let calendarWrapper = document.getElementsByClassName('widget-calendar-table')[0];
            let inputWrapper = document.getElementsByClassName('widget-calendar-input')[0];
            
            if(!inputWrapper || !calendarWrapper) return;

            let input = inputWrapper.getElementsByTagName('input')[0];

            input.style.display = 'none';

            let divFake = document.createElement("div");
            
            divFake.classList.add('text-color-link');
            divFake.classList.add('border-color-buttonBG');
            divFake.classList.add('fake-input');

            divFake.innerText = input.value;

            input.parentNode.insertBefore(divFake, input);

            let button = document.createElement('button');
            button.classList.add('widget-button'); 
            button.classList.add('background-color-link');
            button.classList.add('color-buttonText');
            button.classList.add('border-color-buttonBG');
            button.innerHTML = '<i class="far fa-clock"></i>';

            input.parentElement.appendChild(button);


            let calendar = new Calendar(calendarWrapper, parseDate(input.value));
            
            calendar.on('datechanged', (d)=>{
                input.value = dateToString(d);
                divFake.innerText = input.value;
                app.setWidgetOutput(d);
            });
            
            calendar.render();    

            function toggleCalendarVisible(){
                if(calendar.isVisible()){
                    calendar.hide();
                }
                else{
                    calendar.show();
                }
            }

            button.onclick = toggleCalendarVisible;
            divFake.onclick = toggleCalendarVisible;
        }

        initCalendarWidget();
    }
)();