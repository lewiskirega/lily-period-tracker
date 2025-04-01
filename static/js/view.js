
(function (window) {
  /**
   * View
   */
  var View = function (template) {
    var _self = this;
    _self.template = template;
    _self.config = _self.template.config;

    console.log('Starting DOM element selection...');
    
    console.log('Selecting .main-section elements');
    var $sections = $('.main-section');
    console.log('Found', $sections.length, '.main-section elements');
    
    console.log('Selecting .main-nav a elements');
    var $navLinks = $('.main-nav a');
    console.log('Found', $navLinks.length, '.main-nav a elements');

    console.log('Selecting #home-calc element');
    var $homeCalc = $$('#home-calc');
    console.log('Found #home-calc:', $homeCalc ? 'yes' : 'no');
    
    console.log('Selecting #next element');
    var $next = $$('#next');
    console.log('Found #next:', $next ? 'yes' : 'no');
    
    console.log('Selecting #countdown element');
    var $countdown = $$('#countdown');
    console.log('Found #countdown:', $countdown ? 'yes' : 'no');
    
    console.log('Selecting #counter element');
    var $counter = $$('#counter');
    console.log('Found #counter:', $counter ? 'yes' : 'no');
    
    console.log('Selecting #home-add element');
    var $homeAdd = $$('#home-add');
    console.log('Found #home-add:', $homeAdd ? 'yes' : 'no');
    
    console.log('Selecting .add-form__toggle elements');
    var $addFormToggle = $('.add-form__toggle');
    console.log('Found', $addFormToggle.length, '.add-form__toggle elements');
    
    console.log('Selecting .add-form elements');
    var $addForm = $('.add-form');
    console.log('Found', $addForm.length, '.add-form elements');
    
    console.log('Selecting input[name="add-date"] elements');
    var $addDate = $('input[name="add-date"]');
    console.log('Found', $addDate.length, 'input[name="add-date"] elements');

    console.log('Selecting #edit-form--log element');
    var $editForm = $$('#edit-form--log');
    console.log('Found #edit-form--log:', $editForm ? 'yes' : 'no');
    
    console.log('Selecting #edit-form--log-tr element');
    var $editFormTr = $$('#edit-form--log-tr');
    console.log('Found #edit-form--log-tr:', $editFormTr ? 'yes' : 'no');

    console.log('Selecting #calendar-data element');
    var $cal = $$('#calendar-data');
    console.log('Found #calendar-data:', $cal ? 'yes' : 'no');
    
    console.log('Selecting #average element');
    var $average = $$('#average');
    console.log('Found #average:', $average ? 'yes' : 'no');
    
    console.log('Selecting #log-data element');
    var $log = $$('#log-data');
    console.log('Found #log-data:', $log ? 'yes' : 'no');

    console.log('Selecting #import-data element');
    var $importData = $$('#import-data');
    console.log('Found #import-data:', $importData ? 'yes' : 'no');
    
    console.log('Selecting #export-data element');
    var $exportData = $$('#export-data');
    console.log('Found #export-data:', $exportData ? 'yes' : 'no');
    
    console.log('Selecting #share-data element');
    var $shareData = $$('#share-data');
    console.log('Found #share-data:', $shareData ? 'yes' : 'no');
    
    console.log('Selecting #delete-all element');
    var $deleteAll = $$('#delete-all');
    console.log('Found #delete-all:', $deleteAll ? 'yes' : 'no');
    
    console.log('Selecting #settings-week-start element');
    var $settingsWeekStart = $$('#settings-week-start');
    console.log('Found #settings-week-start:', $settingsWeekStart ? 'yes' : 'no');
    
    console.log('Selecting #settings-extended-month element');
    var $settingsExtendedMonth = $$('#settings-extended-month');
    console.log('Found #settings-extended-month:', $settingsExtendedMonth ? 'yes' : 'no');

    console.log('Selecting #settings-period-length element');
    var $settingsPeriodLength = $$('#settings-period-length');
    console.log('Found #settings-period-length:', $settingsPeriodLength ? 'yes' : 'no');
    
    console.log('Selecting #settings-cycle-length element');
    var $settingsCycleLength = $$('#settings-cycle-length');
    console.log('Found #settings-cycle-length:', $settingsCycleLength ? 'yes' : 'no');

    console.log('Selecting #alerts element');
    var $alerts = $$('#alerts');
    console.log('Found #alerts:', $alerts ? 'yes' : 'no');

    console.log('Selecting #status-icon-offline element');
    var $statusOffline = $$('#status-icon-offline');
    console.log('Found #status-icon-offline:', $statusOffline ? 'yes' : 'no');

    console.log('Selecting #version element');
    var $version = $$('#version');
    console.log('Found #version:', $version ? 'yes' : 'no');
    
    console.log('DOM element selection completed');

    var _viewCommands = {};

    _viewCommands.alert = function (type, msg) {
      $alerts.innerHTML += _self.template.alert(type, msg);
    };

    _viewCommands.info = function (err) {
      _viewCommands.alert('info', err);
    };
    this.giulia = function () {
      _viewCommands.alert('info', 'ciao');
      _viewCommands.alert('error', 'ciao');
      _viewCommands.alert('success', 'ciao');
      _viewCommands.alert('warning', 'ciao');
    };

    _viewCommands.error = function (err) {
      _viewCommands.alert('error', err);
    };

    _viewCommands.success = function (err) {
      _viewCommands.alert('success', err);
    };

    _viewCommands.warning = function (err) {
      _viewCommands.alert('warning', err);
    };

    _viewCommands.section = function (model, parameter, args) {
      console.log('Changing section to:', parameter || 'home');
      parameter = parameter || 'home';
      
      console.log('Removing main-section--selected class from all sections');
      if ($sections && $sections.length > 0) {
        $sections.forEach(function ($el) {
          $el.classList.remove('main-section--selected');
        });
      } else {
        console.error('No sections found with .main-section selector');
      }
      
      console.log('Selecting section element with id:', parameter);
      let $selectedSection = $$('#' + parameter);

      if (!$selectedSection) {
        console.error('Section element #' + parameter + ' not found, falling back to not-found section');
        _viewCommands.alert('error', 'Section "' + parameter + '" not found in the DOM.');
        parameter = 'not-found';
        $selectedSection = $$('#' + parameter);
        
        if (!$selectedSection) {
          console.error('Not-found section element not found either');
          return;
        }
      }

      console.log('Adding main-section--selected class to section:', parameter);
      $selectedSection.classList.add('main-section--selected');
      
      console.log('Updating navigation links');
      if ($navLinks && $navLinks.length > 0) {
        $navLinks.forEach(function ($el) {
          if ($el.getAttribute('href') === '#/' + parameter) {
            $el.classList.add('main-nav__link--selected');
          } else {
            $el.classList.remove('main-nav__link--selected');
          }
        });
      } else {
        console.error('No navigation links found with .main-nav a selector');
      }
      
      if (parameter === 'calendar') {
        console.log('Rendering calendar section');
        let yearN = args[0];
        let monthN = args[1];

        const todayMonthN = helpers.today.getDate('month');
        const todayYearN = helpers.today.getDate('year');

        monthN = parseInt(monthN) || todayMonthN;
        yearN = parseInt(yearN) || todayYearN;

        console.log('Calendar parameters - month:', monthN, 'year:', yearN);
        _viewCommands.calendar(model, monthN, yearN);
      } else if (parameter === 'inventory') {
        console.log('Initializing inventory section');
        _viewCommands.inventory(model);
      }
      
      console.log('Section change completed to:', parameter);
    };

    _viewCommands.chrome = function () {
      $version.innerHTML = VERSION;
    };

    _viewCommands.home = function (model) {
      console.log('Rendering home section');
      
      if (!$next) {
        console.error('Element #next not found');
      } else {
        $next.innerHTML = model.next
          ? dates.formatOnce(model.next, 'ddd, MMM D')
          : '';
        $next.setAttribute('datetime', model.next ? model.next : '');
      }
      
      if (!$countdown) {
        console.error('Element #countdown not found');
      } else {
        $countdown.innerHTML = model.countdown;
      }
      
      if (!$counter) {
        console.error('Element #counter not found');
      } else {
        $counter.innerHTML = model.counter;
      }
      
      if (!$homeCalc) {
        console.error('Element #home-calc not found');
      } else {
        $homeCalc.classList.toggle('home__calc--invisible', !model.next);
      }
      
      var todayStr = helpers.todayStr;
      if (!$addDate || $addDate.length === 0) {
        console.error('Elements input[name="add-date"] not found');
      } else {
        $addDate.forEach(function ($el) {
          $el.defaultValue = todayStr;
          $el.value = todayStr;
          $el.max = todayStr;
        });
      }
      
      // hide add button if we are into the period time
      if (!$homeAdd) {
        console.error('Element #home-add not found');
      } else {
        $homeAdd.classList.toggle(
          'home_add--hide',
          model.counter > 0 && model.counter <= _self.config.get('periodLength')
        );
      }
      
      console.log('Home section rendering completed');
    };

    _viewCommands.calendar = function (model, month, year) {
      console.log('Rendering calendar section for month:', month, 'year:', year);
      
      if (!$cal) {
        console.error('Element #calendar-data not found');
        return;
      }
      
      $cal.innerHTML = _self.template.calendar(model, month, year);
      console.log('Calendar section rendering completed');
    };

    _viewCommands.log = function (model) {
      console.log('Rendering log section');
      
      if (!$average) {
        console.error('Element #average not found');
      } else {
        $average.innerHTML = model.average;
      }
      
      if (!$log) {
        console.error('Element #log-data not found');
      } else {
        $log.innerHTML = _self.template.log(model);
      }
      
      console.log('Log section rendering completed');
    };

    _viewCommands.inventory = function (model) {
      console.log('Rendering inventory section');
      
      // Hide any visible map when entering inventory section
      if (window.mapsModule && typeof window.mapsModule.hideMap === 'function') {
        window.mapsModule.hideMap();
      }
      
      // Trigger the inventory UI update from app.Inventory
      if (window.app && window.app.inventory) {
        window.app.inventory.updateUI();
      }
      
      // Bind map button if it exists
      var showMapBtn = document.getElementById('show-map-inventory');
      if (showMapBtn) {
        showMapBtn.addEventListener('click', function(e) {
          e.preventDefault();
          if (window.mapsModule && window.mapsModule.showMap) {
            window.mapsModule.showMap();
          }
        });
      } else {
        console.error('Element #show-map-inventory not found');
      }
      
      console.log('Inventory section rendering completed');
    };

    _viewCommands.settings = function () {
      console.log('Rendering settings section');
      
      if (!$settingsWeekStart) {
        console.error('Element #settings-week-start not found');
      } else {
        if (_self.config.get('startDayOfWeek')) {
          $settingsWeekStart.checked = true;
        } else {
          $settingsWeekStart.checked = false;
        }
      }
      
      if (!$settingsExtendedMonth) {
        console.error('Element #settings-extended-month not found');
      } else {
        if (_self.config.get('showExtendedMonth')) {
          $settingsExtendedMonth.checked = true;
        } else {
          $settingsExtendedMonth.checked = false;
        }
      }
      
      if (!$settingsPeriodLength) {
        console.error('Element #settings-period-length not found');
      } else {
        $settingsPeriodLength.value = _self.config.get('periodLength');
      }
      
      if (!$settingsCycleLength) {
        console.error('Element #settings-cycle-length not found');
      } else {
        $settingsCycleLength.value = _self.config.get('cycleLength');
      }
      
      console.log('Settings section rendering completed');
    };

    _viewCommands.offline = function (status) {
      $statusOffline.classList.toggle(
        'main-header__status__icon--active',
        status
      );
    };

    this.render = function (viewCmd, model, parameter, args) {
      console.log('Rendering view command:', viewCmd);
      
      if (!_viewCommands[viewCmd]) {
        console.error('View command not found:', viewCmd);
        return;
      }
      
      try {
        _viewCommands[viewCmd](model, parameter, args);
        console.log('View command completed:', viewCmd);
      } catch (error) {
        console.error('Error executing view command:', viewCmd, error);
      }
    };

    this.bind = function (event, handler) {
      if (event === 'itemAdd') {
        $addFormToggle.forEach(function ($el) {
          $el.on('click', function () {
            this.form.classList.add('add-form--selected');
            this.form.elements['add-date'].focus();
            this.form.elements['add-date'].click();
          });
        });

        $addForm.forEach(function ($el) {
          $el.on('submit', function (event) {
            event.preventDefault();
            var res = handler(this.elements['add-date'].value);
            if (res !== -1) {
              this.reset();
            }
          });
        });
        $addForm.forEach(function ($el) {
          $el.on('reset', function () {
            this.classList.remove('add-form--selected');
          });
        });
      } else if (event === 'itemRemove') {
        helpers.$delegate($log, '.js-remove', 'click', function () {
          var $tr = this.parentNode.parentNode;
          $log
            .querySelectorAll('.log-list__item--selected')
            .forEach(function ($el) {
              $el.classList.remove('log-list__item--selected');
            });
          $tr.classList.add('log-list__item--selected');
          // When showed a confirm dialog in Chrome and similar browsers, earlier DOM changes are not yet visible, hence the delay with setTimeout
          // https://stackoverflow.com/a/59286014
          setTimeout(() => {
            if (
              window.confirm(
                'Are you sure you want to delete `' +
                  this.getAttribute('data-date') +
                  '`?'
              )
            ) {
              handler(this.getAttribute('data-id'));
            } else {
              $tr.classList.toggle('log-list__item--selected');
            }
          }, 0);
        });
      } else if (event === 'showItemEdit') {
        helpers.$delegate($log, '.js-edit', 'click', function () {
          var id = this.getAttribute('data-id');
          var $tr = this.parentNode.parentNode;
          var { date } = handler(id);

          $editForm.elements['edit-id'].value = id;
          $editForm.elements['edit-date'].value = date;
          $editForm.elements['edit-date'].max = helpers.todayStr;

          $log
            .querySelectorAll('.log-list__item--selected')
            .forEach(function ($el) {
              $el.classList.remove('log-list__item--selected');
            });
          $tr.classList.add('log-list__item--selected');
          $tr.parentNode.insertBefore($editFormTr, $tr.nextSibling);
        });
        $editForm.on('reset', function () {
          if ($editFormTr.previousSibling) {
            $editFormTr.previousSibling.classList.remove(
              'log-list__item--selected'
            );
          }
          $editFormTr.remove();
        });
      } else if (event === 'itemEdit') {
        $editForm.on('submit', function (event) {
          event.preventDefault();
          var res = handler(
            this.elements['edit-id'].value,
            this.elements['edit-date'].value
          );
          if (res !== -1) {
            this.reset();
          }
        });
      } else if (event === 'importData') {
        $importData.on('click', function (event) {
          if (
            !window.confirm(
              'This will completely overwrite the data. Do you want to continue?'
            )
          ) {
            event.preventDefault();
          }
        });
        $importData.on('change', function () {
          const [file] = $importData.files;
          handler(file);
        });
      } else if (event === 'exportData') {
        $exportData.on('click', function () {
          handler();
        });
      } else if (event === 'shareData') {
        $shareData.on('click', function () {
          handler();
        });
      } else if (event === 'itemRemoveAll') {
        $deleteAll.on('click', function () {
          if (
            window.confirm(
              'Are you sure you want to delete all the entries and reset the settings?'
            )
          ) {
            handler();
          }
        });
      } else if (event === 'settingsUpdate') {
        var data = {};

        $settingsWeekStart.on('change', function () {
          if (this.checked) {
            data.startDayOfWeek = 1;
          } else {
            data.startDayOfWeek = 0;
          }
          handler(data);
        });

        $settingsExtendedMonth.on('change', function () {
          if (this.checked) {
            data.showExtendedMonth = true;
          } else {
            data.showExtendedMonth = false;
          }
          handler(data);
        });

        $settingsPeriodLength.on('input', function () {
          data.periodLength = this.value * 1;
          handler(data);
        });

        $settingsCycleLength.on('input', function () {
          data.cycleLength = this.value * 1;
          handler(data);
        });

        $('.js-number').forEach(function ($item) {
          var $add = $item.querySelector('.js-number__add');
          var $sub = $item.querySelector('.js-number__sub');
          var $input = $item.querySelector('.js-number__input');
          var min = $input.min ? Number($input.min) : null;
          var max = $input.max ? Number($input.max) : null;
          // TODO maybe disable the buttons when cannot go above/below min/max
          $sub.on('click', function () {
            if (min !== null && $input.value <= min) {
              return;
            }
            $input.value--;
            $input.dispatchEvent(new Event('input'));
          });
          $add.on('click', function () {
            if (max !== null && $input.value >= max) {
              return;
            }
            $input.value++;
            $input.dispatchEvent(new Event('input'));
          });
        });
      }
    };
  };

  // export to window
  window.app = window.app || {};
  window.app.View = View;
})(window);

