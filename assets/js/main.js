var isMuted = false;
$(document).ready(function() {
	if ($('body').attr('data-sound') == 'off') {
		stopSound($('#mute'));
	}
	$(document).on('click', '#mute', function() {
		if (!isMuted) {
			stopSound($(this));
			$.ajax({
				url: "./controller/soundController.php",
				method: "POST",
				data: {
					sound: 'off'
				}
			});
		} else {
			$(this).attr('src', './assets/img/sound_on.png');
			$('#menu audio')[0].play();
			$('body').attr('data-sound', 'on');
			isMuted = false;
			$.ajax({
				url: "./controller/soundController.php",
				method: "POST",
				data: {
					sound: 'on'
				}
			});
		}
	});
});

function stopSound(muteObj) {
	muteObj.attr('src', './assets/img/sound_off.png');
	$('audio').each(function() {
		$(this)[0].pause();
	});
	$('body').attr('data-sound', 'off');
	isMuted = true;
}