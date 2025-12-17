const fs = require('fs');
const talks = JSON.parse(fs.readFileSync('talks.json', 'utf-8'));

function generateSchedule(talks) {
  let scheduleHtml = '';
  let currentTime = new Date();
  currentTime.setHours(10, 0, 0, 0); // Event starts at 10:00 AM

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  talks.forEach((talk, index) => {
    const startTime = new Date(currentTime);
    const endTime = new Date(startTime.getTime() + talk.duration * 60000);

    scheduleHtml += `
      <div class="talk" data-category="${talk.category.join(' ').toLowerCase()}">
        <div class="time">${formatTime(startTime)} - ${formatTime(endTime)}</div>
        <div class="details">
          <h3>${talk.title}</h3>
          <p><strong>Speakers:</strong> ${talk.speakers.join(', ')}</p>
          <p><strong>Category:</strong> ${talk.category.join(', ')}</p>
          <p>${talk.description}</p>
        </div>
      </div>
    `;

    currentTime = new Date(endTime.getTime() + 10 * 60000); // 10 minute break

    if (index === 2) { // Lunch break after the 3rd talk
      const lunchStartTime = new Date(currentTime);
      const lunchEndTime = new Date(lunchStartTime.getTime() + 60 * 60000);
      scheduleHtml += `
        <div class="talk break">
          <div class="time">${formatTime(lunchStartTime)} - ${formatTime(lunchEndTime)}</div>
          <div class="details">
            <h3>Lunch Break</h3>
          </div>
        </div>
      `;
      currentTime = lunchEndTime;
    }
  });

  return scheduleHtml;
}

const schedule = generateSchedule(talks);

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tech Talks Today</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; background-color: #f8f9fa; color: #333; }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #ddd; }
    h1 { margin: 0; font-size: 2.5em; }
    #search { width: 100%; padding: 10px; margin: 20px 0; box-sizing: border-box; border: 1px solid #ccc; border-radius: 5px; }
    .talk { display: flex; border-bottom: 1px solid #eee; padding: 20px 0; }
    .talk.hidden { display: none; }
    .talk .time { flex: 0 0 150px; font-weight: bold; color: #007bff; }
    .talk .details h3 { margin-top: 0; }
    .talk.break .details h3 { color: #888; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Tech Talks Today</h1>
      <p>A one-day event filled with technical talks.</p>
    </header>
    <input type="text" id="search" placeholder="Search by category...">
    <div id="schedule">
      ${schedule}
    </div>
  </div>
  <script>
    const searchInput = document.getElementById('search');
    const talks = document.querySelectorAll('.talk:not(.break)');

    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase().trim();
      talks.forEach(talk => {
        const categories = talk.dataset.category;
        if (categories.includes(searchTerm)) {
          talk.classList.remove('hidden');
        } else {
          talk.classList.add('hidden');
        }
      });
    });
  </script>
</body>
</html>
`;

fs.writeFileSync('index.html', htmlContent);
console.log('index.html has been generated successfully.');
