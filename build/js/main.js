'use strict';

// Активация полифила svg4everybody
(function () {
  svg4everybody();
})();

// Активация полифила object-fit: cover
(function () {
  objectFitImages();
})();

// Оптимизация вставки видео
(function () {
  function findVideo() {
    var video = document.querySelector('.video__container');

    setupVideo(video);
  }

  function setupVideo(video) {
    var link = document.querySelector('.video__link');
    link.removeAttribute('href');

    var button = document.querySelector('.video__button');

    button.addEventListener('click', function () {
      var iframe = createIframe();
      link.remove();
      button.remove();
      video.appendChild(iframe);
    });

    video.classList.add('video__container--enabled');
  }

  function createIframe() {
    var iframe = document.createElement('iframe');
    iframe.setAttribute('src', 'https://www.youtube.com/embed/bnzHECC0Z8A?rel=0&showinfo=0&autoplay=1');
    iframe.setAttribute('allowfullscreen', '');
    iframe.classList.add('video__media');

    return iframe;
  }

  findVideo();
})();


// Табы
(function () {
  var tablist = document.querySelectorAll('[role="tablist"]')[0];
  var tabs;
  var panels;

  generateArrays();

  function generateArrays() {
    tabs = document.querySelectorAll('[role="tab"]');
    panels = document.querySelectorAll('[role="tabpanel"]');
  }

  // For easy reference
  var keys = {
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    delete: 46,
    enter: 13,
    space: 32
  };

  // Add or subtract depending on key pressed
  var direction = {
    37: -1,
    38: -1,
    39: 1,
    40: 1
  };

  // Bind listeners
  for (var i = 0; i < tabs.length; ++i) {
    addListeners(i);
  }

  function addListeners(index) {
    tabs[index].addEventListener('click', clickEventListener);
    tabs[index].addEventListener('keydown', keydownEventListener);
    tabs[index].addEventListener('keyup', keyupEventListener);

    // Build an array with all tabs (<button>s) in it
    tabs[index].index = index;
  }

  // When a tab is clicked, activateTab is fired to activate it
  function clickEventListener(event) {
    var tab = event.target;
    activateTab(tab, false);
  }

  // Handle keydown on tabs
  function keydownEventListener(event) {
    var key = event.keyCode;

    switch (key) {
      case keys.end:
        event.preventDefault();
        // Activate last tab
        focusLastTab();
        break;
      case keys.home:
        event.preventDefault();
        // Activate first tab
        focusFirstTab();
        break;

      // Up and down are in keydown
      // because we need to prevent page scroll >:)
      case keys.up:
      case keys.down:
        determineOrientation(event);
        break;
    }
  }

  // Handle keyup on tabs
  function keyupEventListener(event) {
    var key = event.keyCode;

    switch (key) {
      case keys.left:
      case keys.right:
        determineOrientation(event);
        break;
      case keys.delete:
        determineDeletable(event);
        break;
      case keys.enter:
      case keys.space:
        activateTab(event.target);
        break;
    }
  }

  // When a tablistâ€™s aria-orientation is set to vertical,
  // only up and down arrow should function.
  // In all other cases only left and right arrow function.
  function determineOrientation(event) {
    var key = event.keyCode;
    var vertical = tablist.getAttribute('aria-orientation') === 'vertical';
    var proceed = false;

    if (vertical) {
      if (key === keys.up || key === keys.down) {
        event.preventDefault();
        proceed = true;
      }
    } else {
      if (key === keys.left || key === keys.right) {
        proceed = true;
      }
    }

    if (proceed) {
      switchTabOnArrowPress(event);
    }
  }

  // Either focus the next, previous, first, or last tab
  // depending on key pressed
  function switchTabOnArrowPress(event) {
    var pressed = event.keyCode;

    if (direction[pressed]) {
      var target = event.target;
      if (target.index !== undefined) {
        if (tabs[target.index + direction[pressed]]) {
          tabs[target.index + direction[pressed]].focus();
        } else if (pressed === keys.left || pressed === keys.up) {
          focusLastTab();
        } else if (pressed === keys.right || pressed === keys.down) {
          focusFirstTab();
        }
      }
    }
  }

  // Activates any given tab panel
  function activateTab(tab, setFocus) {
    setFocus = setFocus || true;
    // Deactivate all other tabs
    deactivateTabs();

    // Remove tabindex attribute
    tab.removeAttribute('tabindex');

    // Set the tab as selected
    tab.setAttribute('aria-selected', 'true');

    // Get the value of aria-controls (which is an ID)
    var controls = tab.getAttribute('aria-controls');

    // Remove hidden attribute from tab panel to make it visible
    document.getElementById(controls).removeAttribute('hidden');

    // Set focus when required
    if (setFocus) {
      tab.focus();
    }
  }

  // Deactivate all tabs and tab panels
  function deactivateTabs() {
    for (var t = 0; t < tabs.length; t++) {
      tabs[t].setAttribute('aria-selected', 'false');
    }

    for (var p = 0; p < panels.length; p++) {
      panels[p].setAttribute('hidden', 'hidden');
    }
  }

  // Make a guess
  function focusFirstTab() {
    tabs[0].focus();
  }

  // Make a guess
  function focusLastTab() {
    tabs[tabs.length - 1].focus();
  }

  // Detect if a tab is deletable
  function determineDeletable(event) {
    var target = event.target;

    if (target.getAttribute('data-deletable') !== null) {
      // Delete target tab
      deleteTab(event, target);

      // Update arrays related to tabs widget
      generateArrays();

      // Activate the closest tab to the one that was just deleted
      if (target.index - 1 < 0) {
        activateTab(tabs[0]);
      } else {
        activateTab(tabs[target.index - 1]);
      }
    }
  }

  // Deletes a tab and its panel
  function deleteTab(event) {
    var target = event.target;
    var panel = document.getElementById(target.getAttribute('aria-controls'));

    target.parentElement.removeChild(target);
    panel.parentElement.removeChild(panel);
  }

  // Determine whether there should be a delay
  // when user navigates with the arrow keys
  function determineDelay() {
    var hasDelay = tablist.hasAttribute('data-delay');
    var delay = 0;

    if (hasDelay) {
      var delayValue = tablist.getAttribute('data-delay');
      if (delayValue) {
        delay = delayValue;
      } else {
        // If no value is specified, default to 300ms
        delay = 300;
      }
    }

    return delay;
  }
}());

// Слайдеры
(function () {
  var CreateSlider = function (domNode, config) {
    this.slidesContainer = domNode;
    this.slider = this.slidesContainer.querySelector('.slider');
    this.slides = this.slider.querySelectorAll('.slide');
    this.previousButton = this.slidesContainer.querySelector('.sliderPreviousButton');
    this.nextButton = this.slidesContainer.querySelector('.sliderNextButton');
    this.slidesCount = this.slides.length;
    this.position = 0;
    this.config = config;

    this.init();
  };

  CreateSlider.prototype = {
    init: function () {
      this.checkButtons();
      this.addPointerEvents();
      this.slider.style.transition = '0.5s';
    },

    findSuitableCfg: function () {
      var suitableCfg = this.config.find(function (cfg) {
        return window.matchMedia('(min-width: ' + cfg.screenWidth + 'px)').matches;
      });
      return suitableCfg;
    },

    setPosition: function () {
      this.slider.style.transform = 'translateX(' + this.position + 'px)';
    },

    checkButtons: function () {
      var currentConfig = this.findSuitableCfg();

      if (this.position === 0) {
        this.previousButton.setAttribute('disabled', 'disabled');
      } else {
        this.previousButton.removeAttribute('disabled');
      }

      if (this.position <= -(this.slidesCount - currentConfig.slidesToShow) * (currentConfig.slideWidth + currentConfig.slideGap)) {
        this.nextButton.setAttribute('disabled', 'disabled');
      } else {
        this.nextButton.removeAttribute('disabled');
      }
    },

    addPointerEvents: function () {
      var self = this;

      var moveLeft = function () {
        var currentConfig = self.findSuitableCfg();
        var slidesLeft = Math.abs(self.position) / (currentConfig.slideWidth + currentConfig.slideGap);
        var movePosition = (currentConfig.slideWidth + currentConfig.slideGap) * currentConfig.slidesToScroll;

        if (slidesLeft >= currentConfig.slidesToScroll) {
          self.position += movePosition;
        } else {
          self.position += slidesLeft * (currentConfig.slideWidth + currentConfig.slideGap);
        }

        self.setPosition();
        self.checkButtons();
      };

      var moveRight = function () {
        var currentConfig = self.findSuitableCfg();
        var slidesLeft = Math.floor(self.slidesCount - (Math.abs(self.position) + currentConfig.slidesToShow * currentConfig.slideWidth + (currentConfig.slidesToShow - 1) * currentConfig.slideGap) / (currentConfig.slideWidth + currentConfig.slideGap));
        var movePosition = (currentConfig.slideWidth + currentConfig.slideGap) * currentConfig.slidesToScroll;

        if (slidesLeft >= currentConfig.slidesToScroll) {
          self.position -= movePosition;
        } else {
          self.position -= slidesLeft * (currentConfig.slideWidth + currentConfig.slideGap);
        }

        self.setPosition();
        self.checkButtons();
      };

      this.previousButton.addEventListener('click', moveLeft);
      this.nextButton.addEventListener('click', moveRight);

      var swipe = function (el) {
        var settings = {
          minDistanсe: 30,
          maxDistance: 300,
          maxTime: 700,
          minTime: 50
        };


        var direction;
        var swipeType;
        var distance;
        var startX = 0;
        var distanceX = 0;
        var startY = 0;
        var distanceY = 0;
        var startTime = 0;

        var checkStart = function (evt) {
          direction = 'none';
          swipeType = 'none';
          distance = 0;
          startX = evt.targetTouches[0].pageX;
          startY = evt.targetTouches[0].pageY;
          startTime = new Date().getTime();
        };

        var checkMove = function (evt) {
          distanceX = evt.targetTouches[0].pageX - startX;
          distanceY = evt.targetTouches[0].pageY - startY;

          if (Math.abs(distanceX) > Math.abs(distanceY)) {
            direction = (distanceX < 0) ? 'left' : 'right';
          } else {
            direction = (distanceY < 0) ? 'up' : 'down';
          }
        };

        var checkEnd = function () {
          var endTime = new Date().getTime();
          var time = endTime - startTime;
          if (time >= settings.minTime && time <= settings.maxTime) {
            if (Math.abs(distanceX) >= settings.minDistanсe && Math.abs(distanceY) <= settings.maxDistance) {
              swipeType = direction;
            } else if (Math.abs(distanceY) >= settings.minDist && Math.abs(distanceX) <= settings.maxDistance) {
              swipeType = direction;
            }
          }
          distance = (direction === 'left' || direction === 'right') ? Math.abs(distanceX) : Math.abs(distanceY);

          if (swipeType !== 'none' && distance >= settings.minDistanсe) {
            var swipeEvent = new CustomEvent('swipe', {
              detail: {
                direction: swipeType,
                distance: distance,
                time: time
              }
            });
            el.dispatchEvent(swipeEvent);
          }
        };

        el.addEventListener('touchstart', checkStart);
        el.addEventListener('touchmove', checkMove);
        el.addEventListener('touchend', checkEnd);
      };

      swipe(this.slider);

      this.slider.addEventListener('swipe', function (evt) {
        if (evt.detail.direction === 'left') {
          moveRight();
        } else if (evt.detail.direction === 'right') {
          moveLeft();
        }
      });
    }
  };

  var configCoaches = [
    {
      screenWidth: 1301,
      slidesToScroll: 4,
      slidesToShow: 4,
      slideWidth: 260,
      slideGap: 40
    },
    {
      screenWidth: 768,
      slidesToScroll: 2,
      slidesToShow: 2,
      slideWidth: 268,
      slideGap: 30
    },
    {
      screenWidth: 320,
      slidesToScroll: 1,
      slidesToShow: 1,
      slideWidth: 226,
      slideGap: 30
    }
  ];

  var configFeedback = [
    {
      screenWidth: 1024,
      slidesToScroll: 1,
      slidesToShow: 1,
      slideWidth: 560,
      slideGap: 0
    },
    {
      screenWidth: 768,
      slidesToScroll: 1,
      slidesToShow: 1,
      slideWidth: 566,
      slideGap: 0
    },
    {
      screenWidth: 320,
      slidesToScroll: 1,
      slidesToShow: 1,
      slideWidth: 226,
      slideGap: 0
    }
  ];

  var coachesSlider = new CreateSlider(document.querySelector('.coaches__container-inner'), configCoaches);
  var feedbackSlider = new CreateSlider(document.querySelector('.feedback__container-inner'), configFeedback);
})();

// Валидация поля ввода телефона
(function () {
  var phoneInput = document.querySelector('#user-phone');

  phoneInput.addEventListener('keyup', function (evt) {
    var target = evt.target;
    target.value = this.value.replace(/[a-zA-Zа-яёА-ЯЁ]/g, '');
  });
})();
