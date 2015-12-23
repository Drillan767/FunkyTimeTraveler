/*
 * jQuery endcredits Plugin
 *
 * Copyright (c) 2014 Daniel Malkafly <malk@epichail.com>
 * Dual licensed under the MIT or GPL Version 2 licenses or later.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */
$(document).ready(function () {

    var isMuted = false;
    $(document).on('click', 'a[name=creditos]', function (e) {
        e.preventDefault();
        if ($('body').attr('data-sound') == 'off') {
            isMuted = true;
        } else {
            isMuted = false;
        }

        if (!isMuted) {
            $('#menu audio')[0].pause();
            $('#credits audio')[0].play();
        }
        
        var maskHeight = $(document).height();
        var maskWidth = $(window).width();

        // $('#titles').css({
        //     'width': maskWidth,
        //     'height': maskHeight
        // });

        $('#titles').fadeIn(1000);
        $('#titles').fadeTo("slow");
        $('#titles').fadeIn();
        // $('#credits').css("left", (($('#credits').parent().width() - $('#credits').outerWidth()) / 2) + "px");
        $('#credits').css("bottom", "-" + (maskHeight * 1.65) + "px");
        $('#credits').show('slow');

        $('#credits').animate({
            bottom: (maskHeight+100) + "px"
        }, {
            duration: 20000,
            complete: function () {
                $('#titles').fadeOut();
                $('.window').fadeOut();
                $('#credits').css("bottom", "-" + (maskHeight * 2) + "px");
                if (!isMuted) {
                    $('#credits audio')[0].pause();
                    $('#menu audio')[0].play();
                }
            },
            step: function (n, t) {
                var pos = $(this).position();
                // console.log('X: ' + pos.left.toFixed(2) + ' Y: ' + pos.top.toFixed(2));
            }
        });
    });

    $('.window .close').click(function (e) {
        e.preventDefault();
        $('#credits').css("bottom", "-" + ($(document).height() * 2) + "px");
        $('#titles').hide();
        $('.window').hide();
    });

    $('#titles').click(function () {
        $(this).hide();
        $('#credits').css("bottom", "-" + ($(document).height() * 2) + "px");
        $('.window').hide();
        if (!isMuted) {
            $('#credits audio')[0].pause();
            $('#menu audio')[0].play();
        }
    });
});