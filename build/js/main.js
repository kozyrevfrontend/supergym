'use strict';

// Оптимизация вставки видео
(function () {
  function findVideo() {
    var video = $('.gym__video');

    setupVideo(video);
  }

  function setupVideo(video) {
    var link = $('.gym__video-link').removeAttr('href');
    var button = $('.gym__video-button').on('click', function () {
      var iframe = createIframe();
      video.remove(link);
      video.remove(button).append(iframe);
    });

    video.addClass('gym__video--enabled');
  }

  function createIframe() {
    var iframe = $('<iframe>', {
      src: 'https://www.youtube.com/embed/bnzHECC0Z8A?rel=0&showinfo=0&autoplay=1',
      allowfullscreen: ''
    });

    iframe.addClass('gym__video-media');

    return iframe;
  }

  findVideo();
})();
