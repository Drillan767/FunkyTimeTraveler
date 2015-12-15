$(document).ready(function() {
    var chrono = new (function() {
        // Stopwatch element on the page
        var $stopwatch;
        // Timer speed in milliseconds
        var incrementTime = 70;
        // Current timer position in milliseconds
        var currentTime = 0;
        // Start the timer
        $(function() {
            $stopwatch = $('#stopwatch');
            chrono.Timer = $.timer(updateTimer, incrementTime, true);
        });

        // Output time and increment
        function updateTimer() {
            var timeString = formatTime(currentTime);
            $stopwatch.html(timeString);
            currentTime += incrementTime;
        }
        // Reset timer
        this.resetStopwatch = function() {
            currentTime = 0;
            chrono.Timer.stop().once();
        };
    });


    function pad(number, length) {
        var str = '' + number;
        while (str.length < length) {str = '0' + str;}
        return str;
    }
    function formatTime(time) {
        time = time / 10;
        var min = parseInt(time / 6000),
            sec = parseInt(time / 100) - (min * 60),
            hundredths = pad(time - (sec * 100) - (min * 6000), 2);
        return (min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2) + ":" + hundredths;
    }
});

