//console.log('This is a popup!');
document.addEventListener("DOMContentLoaded", () => {
    let seconds = 0, minutes = 0;
    let timeRef = document.querySelector(".timer-display");
    let int = null;

    console.log("Timer script loaded"); // Debugging log
    console.log(timeRef); // Ensure element exists

    document.getElementById("start-timer").addEventListener("click", () => {
        if (int !== null) {
            clearInterval(int);
        }
        int = setInterval(displayTimer, 1000);
    });

    document.getElementById("pause-timer").addEventListener("click", () => {
        clearInterval(int);
    });

    document.getElementById("reset-timer").addEventListener("click", () => {
        clearInterval(int);
        int = null;
        seconds = 0;
        minutes = 0;
        timeRef.innerHTML = "00:00";
    });

    function displayTimer() {
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        let m = minutes < 10 ? "0" + minutes : minutes;
        let s = seconds < 10 ? "0" + seconds : seconds;
        timeRef.innerHTML = `${m}:${s}`;
    }

    console.log("this is the clock");
});