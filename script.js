
function logout() {
    
    window.location.href = 'login.html';
}

function controlRelay(state) {
    playSound(); 
    fetch('/relay?state=' + state)
        .then(response => response.text())
        .then(() => {
            document.getElementById('relayStatus').innerText = 'Trạng thái thiết bị hiện tại: ' + state.toUpperCase();

            // Cập nhật icon theo trạng thái
            if (state.toUpperCase() === 'ON') {
                document.getElementById('icon').src = 'light_on.png';
            } else {
                document.getElementById('icon').src = 'light_off.png';
            }
        })
        
}


function setRgbScheme() {
    playSound();
    var scheme = document.getElementById('rgbScheme').value;
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', '/rgb?scheme=' + scheme, true);
    xhttp.send();
}


function toggleRgbPower(state) {
    playSound();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('rgbStatus').innerText = 'Trạng thái đèn RGB hiện tại: ' + state.toUpperCase();
            getRgbStatus(); // Optionally refresh the RGB status
        }
    };
    xhttp.open('GET', '/rgb?power=' + state, true);
    xhttp.send();
}


function setRgbDimmer(value) {
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', '/rgb?dimmer=' + value, true);
    xhttp.send();
}


function updateTempHumidity() {
    playSound();
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', '/lcd', true);
    xhttp.send();
    document.getElementById('lcd').src = 'lcd.png';
}

// Function to redirect to the firmware update page
function updateFirmware() {
    playSound();
    window.location.href = '/update';
}

// Function to get the current relay status
function getRelayStatus() {
    fetch('/relay/status')
        .then(response => response.text())
        .then(currentState => {
            currentState = currentState.trim().toUpperCase();
            document.getElementById('relayStatus').innerText = 'Trạng thái thiết bị hiện tại: ' + currentState;

            // Cập nhật icon theo trạng thái
            if (currentState === 'ON') {
                document.getElementById('icon').src = 'light_on.png';
            } else {
                document.getElementById('icon').src = 'light_off.png';
            }
        })
       
}


// Function to get the current RGB status
function getRgbStatus() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('rgbStatus').innerText = 'Trạng thái đèn RGB hiện tại: ' + this.responseText.toUpperCase();
        }
    };
    xhttp.open('GET', '/rgb/status', true);
    xhttp.send();
}


function fetchTempHumidityData() {
    fetch('/tempHumidityData')
        .then(response => response.json()) // Assume the server returns a JSON object with temperature and humidity
        .then(data => {
            var currentTime = new Date().toLocaleTimeString();

            // Add new data to the chart (assumes chart has been initialized)
            tempHumidityChart.data.labels.push(currentTime);
            tempHumidityChart.data.datasets[0].data.push(data.temperature); // Assuming dataset[0] is for temperature
            tempHumidityChart.data.datasets[1].data.push(data.humidity); // Assuming dataset[1] is for humidity

            // Limit to the last 10 data points
            if (tempHumidityChart.data.labels.length > 10) {
                tempHumidityChart.data.labels.shift(); // Remove oldest label
                tempHumidityChart.data.datasets[0].data.shift(); // Remove oldest temperature
                tempHumidityChart.data.datasets[1].data.shift(); // Remove oldest humidity
            }

    
            tempHumidityChart.update();
        })
        .catch(error => {
            console.error('Error fetching temperature and humidity data:', error);
        });
}
function getRainStatus() {
    fetch("/rainStatus")
      .then(response => response.json())
      .then(data => {
        console.log(data); // kiểm tra dữ liệu nhận về
        const rainStatusElement = document.getElementById("rainStatus");
        const imageElement = document.getElementById('icon-rain');
        console.log(rainStatusElement, imageElement); // Kiểm tra xem phần tử có tồn tại không
        
        rainStatusElement.innerText = data.rainStatus;
        if (data.rainStatus === "Mưa hoài...") {
          document.getElementById("rainAlert").style.color = "red"; 
          imageElement.src = 'rain.png?' + new Date().getTime(); 
        } else if (data.rainStatus === "Nắng chói chang!") {
          document.getElementById("rainAlert").style.color = "green";  
          imageElement.src = 'sun.png?' + new Date().getTime(); 
        }
      })
      .catch(error => console.error('Error fetching rain status:', error));
}
const seasons = ['Xuân', 'Hạ', 'Thu', 'Đông'];
let currentSeasonIndex = 0;

function changeSeason() {
    playSound();
    currentSeasonIndex = (currentSeasonIndex + 1) % seasons.length;
    const seasonLabel = document.getElementById('seasonLabel');
    const description = document.getElementById('description');
    const body = document.body;

    // Xóa hiệu ứng cũ
    removeSeasonEffects();

    // Xóa lớp cũ trước khi thêm lớp mới
    body.classList.remove('spring', 'summer', 'autumn', 'winter');

    switch (seasons[currentSeasonIndex]) {
        case 'Xuân':
            seasonLabel.textContent = "Mùa Xuân";
            description.textContent = "Một mùa đầy hoa và sự sống nở rộ!";
            body.classList.add('spring');
            createFallingEffect('flower-spring', '🌸');
            break;
        case 'Hạ':
            seasonLabel.textContent = "Mùa Hạ";
            description.textContent = "Ánh nắng vàng rực rỡ!";
            body.classList.add('summer');
            createFallingEffect('flower-summer', '🌼');
            break;
        case 'Thu':
            seasonLabel.textContent = "Mùa Thu";
            description.textContent = "Lá rụng vàng, trời trong xanh!";
            body.classList.add('autumn');
            createFallingEffect('flower-autumn', '🍂');
            break;
        case 'Đông':
            seasonLabel.textContent = "Mùa Đông";
            description.textContent = "Bông tuyết trắng xóa, trời lạnh giá!";
            body.classList.add('winter');
            createFallingEffect('snowflake', '❄️');
            break;
    }
}

function createFallingEffect(className, symbol) {
    const numberOfElements = 20; // Số lượng biểu tượng sẽ rơi
    for (let i = 0; i < numberOfElements; i++) {
        let element = document.createElement('div');
        element.className = className;
        element.style.left = Math.random() * 100 + 'vw'; // Vị trí ngẫu nhiên
        element.style.animationDuration = (Math.random() * 5 + 5) + 's'; // Thay đổi thời gian rơi ngẫu nhiên từ 5s đến 10s
        element.style.animationDelay = Math.random() * 2 + 's'; // Thay đổi độ trễ ngẫu nhiên
        element.textContent = symbol;
        document.body.appendChild(element);
    }
}


function removeSeasonEffects() {
    const snowflakes = document.querySelectorAll('.snowflake');
    const flowers = document.querySelectorAll('.flower-spring, .flower-summer, .flower-autumn');
    
    snowflakes.forEach(flake => flake.remove());
    flowers.forEach(flower => flower.remove());

    document.body.classList.remove('spring', 'summer', 'autumn', 'winter');
}


let seasonEffectsActive = true; // Biến để theo dõi trạng thái hiệu ứng

function toggleSeasonEffects() {
    seasonEffectsActive = !seasonEffectsActive; // Đổi trạng thái

    if (seasonEffectsActive) {
        // Nếu kích hoạt hiệu ứng, khởi động lại hiệu ứng cho mùa hiện tại
        changeSeason();
        document.getElementById('toggleSeasonButton').textContent = "Tắt Hiệu ứng Chuyển Mùa";
    } else {
        // Nếu tắt hiệu ứng, xóa các hiệu ứng hiện có
        removeSeasonEffects();
        document.getElementById('toggleSeasonButton').textContent = "Bật Hiệu ứng Chuyển Mùa";
    }
}


function playSound() {
    const audio = document.getElementById('buttonSound');
    audio.currentTime = 0;
    audio.play();
}


window.onload = function() {
    getRelayStatus();
    getRgbStatus();
    updateTempHumidity(); 
    getRainStatus();
   

}; 
setInterval(fetchTempHumidityData, 60000); 
setInterval(getRainStatus, 5000);
