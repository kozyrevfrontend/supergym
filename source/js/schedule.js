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
  var selectButton = document.querySelector('.select__button');
  var selectList = document.querySelector('.select__list');
  var selectItems = document.querySelectorAll('.select__item');
  var selectValue = document.querySelector('.select__value');
  var selectAria = document.querySelector('.select__aria');

  var findCurrentTrainigList = function (data) {
    for (var i = 0; i < trainingLists.length; i++) {
      if (trainingLists[i].getAttribute('data-select') === data) {
        return trainingLists[i];
      }
    }
  };

  var addSelectItemClickListener = function (item) {
    item.addEventListener('click', function () {
      var selectDay = item.children[0].textContent;
      var currentTrainingList = findCurrentTrainigList(item.getAttribute('data-select'));

      selectValue.textContent = selectDay;
      selectList.classList.add('select__list--closed');
      currentTrainingList.classList.add('schedule__training-list--opened');
      selectButton.classList.add('select__button--opened');

      for (var l = 0; l < timeBoxes.length; l++) {
        timeBoxes[l].classList.toggle('schedule__time-item--disabled');
      }
    });
  };

  for (var i = 0; i < selectItems.length; i++) {
    addSelectItemClickListener(selectItems[i]);
  }

  selectButton.addEventListener('click', function () {
    selectButton.classList.toggle('select__button--opened');
    selectList.classList.toggle('select__list--closed');

    for (var p = 0; p < trainingLists.length; p++) {
      if (trainingLists[p].classList.contains('schedule__training-list--opened')) {
        trainingLists[p].classList.remove('schedule__training-list--opened');
      }
    }

    for (var l = 0; l < timeBoxes.length; l++) {
      timeBoxes[l].classList.toggle('schedule__time-item--disabled');
    }
  });

  var addCheckboxEventsListeners = function (checkbox) {
    var currentTimeBox;
    var currentTrainingBox = checkbox.parentElement;
    var currentDayBox = currentTrainingBox.parentElement.previousElementSibling;

    for (var t = 0; t < timeBoxes.length; t++) {
      if (timeBoxes[t].matches('li[data-time="' + currentTrainingBox.getAttribute('data-time') + '"]')) {
        currentTimeBox = timeBoxes[t];
      }
    }

    checkbox.addEventListener('change', function () {
      currentTrainingBox.classList.toggle('schedule__training-item--checked');
    });

    checkbox.addEventListener('focus', function () {
      currentTrainingBox.classList.add('schedule__training-item--hovered');
      currentDayBox.classList.add('schedule__day--hovered');
      currentTimeBox.classList.add('schedule__time-item--hovered');
    });

    checkbox.addEventListener('blur', function () {
      currentTrainingBox.classList.remove('schedule__training-item--hovered');
      currentDayBox.classList.remove('schedule__day--hovered');
      currentTimeBox.classList.remove('schedule__time-item--hovered');
    });
  };

  var addMouseoverListener = function (box) {
    var currentTimeBox;
    var currentDayBox = box.parentElement.previousElementSibling;
    for (var t = 0; t < timeBoxes.length; t++) {
      if (timeBoxes[t].matches('li[data-time="' + box.getAttribute('data-time') + '"]')) {
        currentTimeBox = timeBoxes[t];
      }
    }
    box.addEventListener('mouseover', function () {
      box.classList.add('schedule__training-item--hovered');
      currentTimeBox.classList.add('schedule__time-item--hovered');
      currentDayBox.classList.add('schedule__day--hovered');
      selectAria.classList.add('select__aria--hovered');
    });
  };

  var addMouseoutListener = function (box) {
    var currentTimeBox;
    var currentDayBox = box.parentElement.previousElementSibling;
    for (var q = 0; q < timeBoxes.length; q++) {
      if (timeBoxes[q].matches('li[data-time="' + box.getAttribute('data-time') + '"]')) {
        currentTimeBox = timeBoxes[q];
      }
    }
    box.addEventListener('mouseout', function () {
      box.classList.remove('schedule__training-item--hovered');
      currentTimeBox.classList.remove('schedule__time-item--hovered');
      currentDayBox.classList.remove('schedule__day--hovered');
      selectAria.classList.remove('select__aria--hovered');
    });
  };

  for (var k = 0; k < trainingLists.length; k++) {
    for (var j = 0; j < trainingLists[k].children.length; j++) {
      addMouseoverListener(trainingLists[k].children[j]);
      addMouseoutListener(trainingLists[k].children[j]);
    }
  }

  for (var m = 0; m < checkboxInputs.length; m++) {
    addCheckboxEventsListeners(checkboxInputs[m]);
  }
})();
