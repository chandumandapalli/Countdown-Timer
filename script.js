// COUNTDOWN TIMER APPLICATION
// This code creates a working countdown timer with start, pause, and reset functionality
// 
// HOW IT WORKS OVERVIEW:
// 1. User enters time (hours, minutes, seconds) 
// 2. User clicks "Start" - timer begins counting down every second
// 3. User can "Pause" to stop temporarily, then "Continue" to resume
// 4. User can "Reset" to clear everything and start over
// 5. When timer reaches 00:00:00, it stops automatically

// Wrapping everything in an IIFE (Immediately Invoked Function Expression)
// This keeps our variables private and doesn't pollute the global scope
// Think of it as putting all our code in a private box
(function () {
  
  // ========== GETTING HTML ELEMENTS ==========
  // Finding and storing references to all the input fields and buttons we need
  // These are like "remote controls" for the HTML elements on the page
  var hour = document.querySelector(".hour");     // The hours input field
  var min = document.querySelector(".minute");    // The minutes input field  
  var sec = document.querySelector(".sec");       // The seconds input field
  var startBtn = document.querySelector(".start"); // The start/continue button
  var stopBtn = document.querySelector(".stop");   // The pause button
  var resetBtn = document.querySelector(".reset"); // The reset button

  // This variable will hold our timer interval so we can start/stop it
  // Think of it as the "ID card" for our running timer
  var countdownTimer = null;

  // ========== START BUTTON FUNCTIONALITY ==========
  // When someone clicks the start button, this function runs
  startBtn.addEventListener("click", function () {
    
    // VALIDATION: Check if all time fields are empty or zero
    // Example: If user clicks start with 00:00:00, don't start timer
    // This prevents starting a timer with no time set
    if (hour.value == 0 && min.value == 0 && sec.value == 0) return;

    // Inner function that actually starts the countdown
    // We put this in a separate function to keep code organized
    function startInterval() {
      // BUTTON SWITCHING: Hide start button, show pause button
      // This gives user visual feedback that timer is now running
      // Before: [Start] [Reset] 
      // After:  [Pause] [Reset]
      startBtn.style.display = "none";
      stopBtn.style.display = "initial";

      // THE ACTUAL TIMER: Start the countdown mechanism
      // setInterval runs our timer() function every 1000 milliseconds (1 second)
      // Think of it like: "Every second, run the timer() function"
      // We store this in countdownTimer so we can stop it later
      countdownTimer = setInterval(function () {
        timer(); // Call our main timer function every second
      }, 1000);
    }
    
    // Call the function to start everything
    startInterval();
  });

  // ========== MAIN TIMER LOGIC ==========
  // This function runs every second when the timer is active
  // Think of this as the "brain" of our countdown timer
  function timer() {
    
    // ===== FIXING USER INPUT ERRORS =====
    // Sometimes users might enter more than 60 seconds or minutes
    // We need to convert these to proper time format
    
    // EXAMPLE: User enters 90 seconds
    // We should convert this to 1 minute and 30 seconds
    // So: 90 seconds becomes -> 1 minute + 30 seconds
    if (sec.value > 60) {
      min.value++;                           // Add 1 to minutes
      sec.value = parseInt(sec.value) - 59;  // Keep the extra seconds (90-59=31, but we want 30, so this needs fixing)
    }
    
    // EXAMPLE: User enters 90 minutes  
    // We should convert this to 1 hour and 30 minutes
    // So: 90 minutes becomes -> 1 hour + 30 minutes
    if (min.value > 60) {
      hour.value++;                           // Add 1 to hours
      min.value = parseInt(min.value) - 60;   // Keep the extra minutes (90-60=30)
    }
    
    // Make sure minutes never go above 60 (safety check)
    min.value = min.value > 60 ? 60 : min.value;

    // ===== COUNTDOWN LOGIC =====
    // This is where we actually count down the time
    // Think of this like a digital clock running backwards
    
    // SCENARIO 1: Timer reaches zero - STOP EVERYTHING!
    // Example: 00:00:00 - timer is finished!
    if (hour.value == 0 && min.value == 0 && sec.value == 0) {
      // Timer finished! Clear all fields and stop the timer
      hour.value = "";
      min.value = "";
      sec.value = "";
      stopInterval(); // Stop the countdown
      
    // SCENARIO 2: We still have seconds to count down
    // Example: 01:30:45 -> 01:30:44 (just subtract 1 second)
    } else if (sec.value != 0) {
      // If we have seconds left, just subtract 1 from seconds
      // The tricky part: Add a "0" in front if the number is 10 or less
      // Example: 9 becomes "09", 15 stays "15"
      sec.value = `${sec.value <= 10 ? "0" : ""}${sec.value - 1}`;
      
    // SCENARIO 3: No seconds left, but we have minutes
    // Example: 01:05:00 -> 01:04:59 (borrow from minutes)
    } else if (min.value != 0 && sec.value == 0) {
      // Reset seconds to 59 (like a clock going from 1:00 to 0:59)
      sec.value = 59;
      // Subtract 1 from minutes (and add leading zero if needed)
      min.value = `${min.value <= 10 ? "0" : ""}${min.value - 1}`;
      
    // SCENARIO 4: No minutes left, but we have hours  
    // Example: 02:00:00 -> 01:59:59 (borrow from hours)
    } else if (hour.value != 0 && min.value == 0) {
      // Reset minutes to 60 (like going from 2:00 to 1:60, which becomes 1:59:59)
      min.value = 60;
      // Subtract 1 from hours (and add leading zero if needed)
      hour.value = `${hour.value <= 10 ? "0" : ""}${hour.value - 1}`;
    }
    
    // DETAILED EXAMPLE OF HOW COUNTDOWN WORKS:
    // Starting time: 01:02:03 (1 hour, 2 minutes, 3 seconds)
    // After 1 second: 01:02:02 (just subtract 1 second)
    // After 2 seconds: 01:02:01 (just subtract 1 second)  
    // After 3 seconds: 01:02:00 (just subtract 1 second)
    // After 4 seconds: 01:01:59 (no seconds left, so reset to 59 and subtract 1 minute)
    // ...and so on until we reach 00:00:00
    
    return; // Exit the function
  }

  // ========== STOP/PAUSE FUNCTIONALITY ==========
  // This function handles stopping the timer and updating button display
  // It's used both for pausing and for resetting
  function stopInterval(state) {
    
    // SMART BUTTON TEXT: Change button text based on what happened
    // If we're pausing (user clicked pause): show "Continue" 
    // If we're resetting or timer finished: show "Start"
    // Example scenarios:
    // - User clicks pause -> button shows "Continue"
    // - User clicks reset -> button shows "Start" 
    // - Timer reaches 00:00:00 -> button shows "Start"
    startBtn.innerHTML = state === "pause" ? "Continue" : "Start";

    // BUTTON SWITCHING: Hide pause button, show start/continue button
    // This switches the interface back to the "ready to start" state
    // Before: [Pause] [Reset]
    // After:  [Start/Continue] [Reset]
    stopBtn.style.display = "none";
    startBtn.style.display = "initial";
    
    // STOP THE TIMER: Actually stop the countdown from running
    // clearInterval stops the timer that was created by setInterval
    // Think of it as "stop calling the timer() function every second"
    clearInterval(countdownTimer);
  }

  // ========== PAUSE BUTTON FUNCTIONALITY ==========
  // When someone clicks the pause button, stop the timer but keep the time
  stopBtn.addEventListener("click", function () {
    // Call stop function with "pause" state
    // This will:
    // 1. Stop the countdown from running
    // 2. Change start button text to "Continue" 
    // 3. Hide pause button, show continue button
    // 4. Keep the current time values (don't reset to 00:00:00)
    stopInterval("pause");
  });

  // ========== RESET BUTTON FUNCTIONALITY ==========
  // When someone clicks reset, clear everything and stop the timer
  resetBtn.addEventListener("click", function () {
    
    // CLEAR ALL TIME: Reset all input fields to empty
    // This completely clears the timer back to starting state
    hour.value = "";   // Hours back to empty
    min.value = "";    // Minutes back to empty  
    sec.value = "";    // Seconds back to empty

    // STOP AND RESET: Stop the timer and reset button states
    // This will:
    // 1. Stop the countdown if it's running
    // 2. Change start button text back to "Start" (not "Continue")
    // 3. Hide pause button, show start button
    // 4. Clear the timer interval
    stopInterval(); // No state parameter = defaults to "Start" text
  });
  
})(); // End of IIFE - this () at the end immediately runs the whole function