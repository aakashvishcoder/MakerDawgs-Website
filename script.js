document.addEventListener("DOMContentLoaded", function () {
    const monthYearEl = document.getElementById('month-year');
    const daysEl = document.getElementById('days');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const todayBtn = document.getElementById('today-btn');
    const eventPanel = document.getElementById('event-panel');
    const eventDateEl = document.getElementById("event-date");
    const eventListEl = document.getElementById('event-list');

    let currentDate = new Date();
    let selectedDate = null;

    // Sample data
    const events = {
        '2025-10-07': [
            { time: '2:45 PM', text: "First Meeting!"}
        ]
    };

    function pad(num) {
        return num.toString().padStart(2, '0');
    }

    function renderCalendar() {
        const firstDay = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
        );

        const lastDay = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
        );

        const prevLastDay = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            0
        );

        const firstDayIndex = firstDay.getDay();
        const lastDayIndex = lastDay.getDay();
        const nextDays = 7 - lastDayIndex -1;

        const months = [
            "January", "February", "March", "April", "May", "June", 
            "July","August","September","October","November","December"
        ];
        
        monthYearEl.innerHTML = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        let days = "";

        for (let x = firstDayIndex; x > 0; x--) {
            const prevDate = prevLastDay.getDate() - x + 1;
            const dateKey = `${currentDate.getFullYear()}-${pad(currentDate.getMonth())}-${pad(prevDate)}`;
            const hasEvent = events[dateKey] !== undefined;

            days += `<div class="day other-month${hasEvent ? ' has-events' : ''}">${prevDate}</div>`;
        }

        for(let i = 1; i <= lastDay.getDate(); i++) {
            const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                i
            );

            const dateKey = `${currentDate.getFullYear()}-${pad(currentDate.getMonth()+1)}-${pad(i)}`;
            const hasEvent = events[dateKey] !== undefined;

            let dayClass = "day";

            if(
                date.getDate() === new Date().getDate() &&
                date.getMonth() === new Date().getMonth() && 
                date.getFullYear() === new Date().getFullYear()
            ) {
                dayClass += " today";
            }

            if(
                selectedDate &&
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear()
            ) {
                dayClass += " selected";
            }

            if(hasEvent) {
                dayClass += " has-events";
            }

            days += `<div class="${dayClass}" data-date="${dateKey}">${i}</div>`;
        }

        for(let j =1; j <= nextDays; j++) {
            const dateKey = `${currentDate.getFullYear()}-${pad(currentDate.getMonth()+2)}-${pad(j)}`;
            const hasEvent = events[dateKey] !== undefined;

            days += `<div class="day other-month${hasEvent ? ' has-events': ''}">${j}</div>`;
        }

        daysEl.innerHTML = days;

        document.querySelectorAll('.day:not(.other-month)').forEach(day => {
            day.addEventListener('click', () => {
                const dayStr = day.getAttribute('data-date');
                const [year, month, dayNum] = dayStr.split('-').map(Number);
                selectedDate = new Date(year, month-1, dayNum);
                renderCalendar();
                showEvents(dayStr);
            });
        });
    }

    function showEvents(dataStr) {
        const [year, month, day] = dataStr.split('-').map(Number);
        const dateObj = new Date(year, month-1, day);
        const months = [
            "January", "February", "March", "April", "May", "June", 
            "July","August","September","October","November","December"
        ];

        const dayNames = ["Sunday","Monday", "Tuesday", "Wednesday","Thursday","Friday","Saturday"];
        const dayName = dayNames[dateObj.getDay()];

        eventDateEl.textContent = `${dayName}, ${months[dateObj.getMonth()]} ${day}, ${year}`;
        
        eventListEl.innerHTML = '';

        if(events[dataStr]) {
            events[dataStr].forEach(event => {
                const eventItem = document.createElement('div');
                eventItem.className = 'event-item';
                eventItem.innerHTML = `
                    <div class="event-color"></div>
                    <div class="event-time">${event.time}</div>
                    <div class="event-text">${event.text}</div>
                `;
                eventListEl.appendChild(eventItem);
            });
        } else {
            eventListEl.innerHTML = '<div class="no-events">No events scheduled for this day</div>';
        }
    }

    prevMonthBtn.addEventListener('click',() => {
        currentDate.setMonth(currentDate.getMonth() -1);
        renderCalendar();
        eventDateEl.textContent = "Select a date";
        eventListEl.innerHTML = '<div class="no-events">Select a date with events to view them here</div>';
    });

    nextMonthBtn.addEventListener('click',()=>{
        currentDate.setMonth(currentDate.getMonth()+1);
        renderCalendar();
        eventDateEl.textContent = "Select a date";
        eventListEl.innerHTML = '<div class="no-events">Select a date with events to view them here</div>';
    });

    todayBtn.addEventListener('click',()=>{
        currentDate = new Date();
        selectedDate = new Date();
        renderCalendar();

        const dataStr = `${currentDate.getFullYear()}-${pad(currentDate.getMonth()+1)}-${pad(currentDate.getDate())}`;
        showEvents(dataStr);
    });

    renderCalendar();
});