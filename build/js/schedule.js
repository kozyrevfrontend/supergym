'use strict';

// Активация полифила svg4everybody
(function () {
  svg4everybody();
})();

// Интерактивное меню
(function () {
  var timeBoxes = document.querySelectorAll('.schedule__time-item');
  var trainingLists = document.querySelectorAll('.schedule__training-list');
  var checkboxInputs = document.querySelectorAll('input[type="checkbox"]');
  var trainingListMobileButtons = document.querySelectorAll('.schedule__training-button');

  var addButtonClickListener = function (button) {
    button.addEventListener('click', function () {
      button.previousElementSibling.classList.toggle('schedule__training-list--opened');
      button.classList.toggle('schedule__training-button--opened');
    });
  };

  var addCheckboxChangeListener = function (checkbox) {
    var currentTrainingBox = checkbox.parentElement;
    checkbox.addEventListener('change', function () {
      currentTrainingBox.classList.toggle('schedule__training-item--checked');
    });
  };

  var addMouseoverListener = function (box) {
    var currentTimeBox;
    var currentDayBox = box.parentElement.previousElementSibling;
    for (var i = 0; i < timeBoxes.length; i++) {
      if (timeBoxes[i].matches('li[data-time="' + box.getAttribute('data-time') + '"]')) {
        currentTimeBox = timeBoxes[i];
      }
    }
    box.addEventListener('mouseover', function () {
      box.classList.add('schedule__training-item--hovered');
      currentTimeBox.classList.add('schedule__time-item--hovered');
      currentDayBox.classList.add('schedule__day--hovered');
    });
  };

  var addMouseoutListener = function (box) {
    var currentTimeBox;
    var currentDayBox = box.parentElement.previousElementSibling;
    for (var i = 0; i < timeBoxes.length; i++) {
      if (timeBoxes[i].matches('li[data-time="' + box.getAttribute('data-time') + '"]')) {
        currentTimeBox = timeBoxes[i];
      }
    }
    box.addEventListener('mouseout', function () {
      box.classList.remove('schedule__training-item--hovered');
      currentTimeBox.classList.remove('schedule__time-item--hovered');
      currentDayBox.classList.remove('schedule__day--hovered');
    });
  };

  for (var k = 0; k < trainingLists.length; k++) {
    for (var j = 0; j < trainingLists[k].children.length; j++) {
      addMouseoverListener(trainingLists[k].children[j]);
      addMouseoutListener(trainingLists[k].children[j]);
    }
  }

  for (var m = 0; m < checkboxInputs.length; m++) {
    addCheckboxChangeListener(checkboxInputs[m]);
  }

  for (var n = 0; n < trainingListMobileButtons.length; n++) {
    addButtonClickListener(trainingListMobileButtons[n]);
  }
})();
