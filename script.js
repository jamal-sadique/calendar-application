// Array of months, with their name and number of days
const months = [
  { month: 'January', days: 31 },
  { month: 'February', days: 28 },
  { month: 'March', days: 31 },
  { month: 'April', days: 30 },
  { month: 'May', days: 31 },
  { month: 'June', days: 30 },
  { month: 'July', days: 31 },
  { month: 'August', days: 31 },
  { month: 'September', days: 30 },
  { month: 'October', days: 31 },
  { month: 'November', days: 30 },
  { month: 'December', days: 31 },
];


// Store booked date and reason in array and load it if its available
const bookings = JSON.parse(localStorage.getItem('bookings')) || [];

let selectedDateElement = null;
let selectedDay = null;
// Current index of the 'months' array
let currentMonthIndex = 0;

// Get the 'days-grid' element/container from HTML 
const daysGrid = document.getElementById('days-grid');


function displayMonth() {
  daysGrid.innerHTML = ' ';
  const currentMonth = months[currentMonthIndex]; // Constant which holds the current month index
  let numberOfDays = currentMonth.days; // Append #of days based on currentMonth

  // Loop generating days of the month
  for (let day = 1; day <= numberOfDays; day++) {
    const dayElement = document.createElement('div'); // New div for each day
    dayElement.classList.add('day'); // Append "day" class
    dayElement.textContent = day; 
    dayElement.style.padding = '10px';
    dayElement.style.textAlign = 'center';
    dayElement.style.minHeight = '50px'; 
    dayElement.style.cursor = 'pointer'; 
    dayElement.style.borderRadius = '8px'
    dayElement.addEventListener('click', () => openBooking(dayElement, day));
    daysGrid.appendChild(dayElement); 
  }
  document.getElementById('month-head').textContent = currentMonth.month;
  displayBookings();
}

function displayBookings() {
  bookings
    .filter((booking) => {
      if (!booking.date || typeof booking.date !== 'string')
        return false;

      const dateParts = booking.date.split(' ');
      if (dateParts.length < 2)
        return false; 
      const [month] = dateParts;
      return months[currentMonthIndex].month === month;
    })
    .forEach((booking) => {
      const dateParts = booking.date.split(' ');
      const dayNumber = parseInt(dateParts[1]);
      if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > months[currentMonthIndex].days)
        return;
      const dayElement = daysGrid.querySelector(`.day:nth-child(${dayNumber})`);
    
      if (!dayElement) return; 
      const icon = document.createElement('span');
      icon.textContent = '📅';
      icon.classList.add('booking-icon');
      icon.title = booking.reason;

      dayElement.appendChild(icon);
      dayElement.classList.add('booked');
    });
}

function handleBookingSubmit(e) {
  e.preventDefault(); // Prevent submission of default form
  const bookingReason = document.getElementById('reason').value;
  const bookingMonth = months[currentMonthIndex].month;
  const bookingDate = `${bookingMonth} ${selectedDay}`; // Constant to represent month and day

  bookings.push({
    date: `${bookingMonth} ${selectedDay}`,
    reason: bookingReason,
  });
  localStorage.setItem('bookings', JSON.stringify(bookings));
  console.log(bookings);
  closeBooking();
}

function openBooking(dateElement, day) {
  let formHTML = `
  <div id="booking-overlay" class="overlay">
    <form id="booking-form">
      <label for="reason">Event Title:</label>
      <input type="text" id="reason" required />
      <button type="submit">Finish</button>
      <button type="button" onclick="closeBooking()">Cancel</button>
    </form>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', formHTML);
  document.getElementById('booking-overlay').style.display = 'flex';
  selectedDateElement = dateElement;
  selectedDay = day;
  document.getElementById('booking-form').addEventListener('submit', handleBookingSubmit);
}

function closeBooking(dateElement) {
  document.getElementById('booking-overlay').style.display = 'none';
  document.getElementById('reason').value = " ";
  selectedDateElement = null;
  selectedDay = null;
}

function nextMonth() {
  if (currentMonthIndex < 11) {
    currentMonthIndex++;
    displayMonth();
  } else {
    alert('Showing months for only current Year.');
  }
}
function previousMonth() {
  if (currentMonthIndex != 0) {
    currentMonthIndex--;
    displayMonth();
  } else {
    alert('Showing months for only current Year.');
  }
}

document.getElementById('next').addEventListener('click', nextMonth);
document.getElementById('Previous').addEventListener('click', previousMonth);
displayMonth();
