document.getElementById('checkSpeed').addEventListener('click', checkInternetSpeed);

function checkInternetSpeed() {
    const resultDiv = document.getElementById('result');
    const speedLabel = document.getElementById('speedLabel');
    const canvas = document.getElementById('speedometer');
    const ctx = canvas.getContext('2d');
    resultDiv.textContent = 'Checking...';
    speedLabel.textContent = 'Checking...';

    const startTime = new Date().getTime();
    const image = new Image();
    const downloadSize = 5000000; // Approx 5MB image

    image.onload = function () {
        const endTime = new Date().getTime();
        const duration = (endTime - startTime) / 1000; // seconds
        const bitsLoaded = downloadSize * 8; // bits
        const speedBps = bitsLoaded / duration; // bits per second
        const speedKbps = (speedBps / 1024).toFixed(2); // kilobits per second
        const speedMbps = (speedKbps / 1024).toFixed(2); // megabits per second

        resultDiv.textContent = `Your internet speed is: ${speedMbps} Mbps (${speedKbps} Kbps)`;
        speedLabel.textContent = `${speedMbps} Mbps`;

        animateSpeedometer(speedMbps);
    };

    image.onerror = function () {
        resultDiv.textContent = 'Error checking speed. Please try again.';
        speedLabel.textContent = 'Error';
    };

    // Using a random URL to prevent caching
    const cacheBuster = `?nnn=${startTime}`;
    image.src = 'https://upload.wikimedia.org/wikipedia/commons/3/3d/LARGE_elevation.jpg' + cacheBuster;
}

function animateSpeedometer(speedMbps) {
    const canvas = document.getElementById('speedometer');
    const ctx = canvas.getContext('2d');
    const maxSpeed = 100; // Adjust this value based on expected max speed
    const targetAngle = (Math.min(speedMbps / maxSpeed, 1) * 270) - 135; // 270 degrees for the arc, -135 to start from 12 o'clock
    let currentAngle = -135;
    const speedLabel = document.getElementById('speedLabel');

    function drawNeedle(angle) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw arc
        ctx.beginPath();
        ctx.arc(200, 200, 150, Math.PI * 1.25, Math.PI * 2.75);
        ctx.strokeStyle = 'lightgray';
        ctx.lineWidth = 10;
        ctx.stroke();

        // Draw colored arc
        ctx.beginPath();
        ctx.arc(200, 200, 150, Math.PI * 1.25, (Math.PI * (1.25 + ((angle + 135) / 270))));
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 10;
        ctx.stroke();

        // Draw needle
        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(0, -140);
        ctx.lineTo(10, 0);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.restore();
    }

    function updateNeedle() {
        if (currentAngle < targetAngle) {
            currentAngle += 5; // Increase the angle increment for faster animation
            drawNeedle(currentAngle);
            requestAnimationFrame(updateNeedle);
        } else {
            drawNeedle(targetAngle);
        }
    }

    updateNeedle();
}
