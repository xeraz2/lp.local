var lpApp = angular.module('lpApp', []);

lpApp.controller('lpPriceCtrl', function ($scope, $http) {

    $http.get('price.json').then(function (res) {
        $scope.prices = res.data;
        calc();
        $scope.sortGet();
    }).catch(function (err) {
        $scope.requestStatus = err.status;
        $scope.requestStatusText = err.statusText;
    });

    $scope.sortSet = function (propertyName) {
        if ($scope.sortBy == propertyName) {
            $scope.sortRev = !$scope.sortRev;
        }
        $scope.sortBy = propertyName;
        localStorage.sortBy = $scope.sortBy;
        localStorage.sortRev = $scope.sortRev;
    }

    $scope.sortGet = function () {
        if (localStorage.sortBy && localStorage.sortRev) {
            $scope.sortBy = localStorage.sortBy;
            $scope.sortRev = (localStorage.sortRev == 'true');
        } else {
            $scope.sortBy = 'name';
            $scope.sortRev = false;
        }
    }

    function calc() {
        $scope.prices.forEach(function (price) {
            price.price2 = price.price * (1 - price.discount);
        });
    }
});

(function ($) {
    $(document).ready(function () {

        /* Начальный экран при загрузке */
        var lpReady = false;     
        function lpGoToActive() {
            var lpPath = window.location.pathname.replace('/', ''),
                lpTrgt;
            if (lpPath != '') {
                lpTrgt = $('#' + lpPath);
                if (lpTrgt.length > 0) {
                    $('body, html').scrollTop(lpTrgt.offset().top - 44);
                }
            }
            setTimeout(function () {
                lpReady = true;
            }, 500);
        }
        lpGoToActive(); 
        $(window).on('load', lpGoToActive); 

        /* Панель навигации */
      
        function lpHeader() {
            if ($(window).scrollTop() == 0) { 
                $('header').addClass('top'); 
            } else { 
                $('header.top').removeClass('top'); 
            }
        }
        
        lpHeader(); 
        $(window).on('scroll', lpHeader); 

        /* Плавный скролл при клике на ссылку в меню */
        var lpNav = $('header ul');
        lpNav.find('li a').on('click', function (e) {
            var linkTrgt = $($(this).attr('href'));
            if (linkTrgt.length > 0) { 
                e.preventDefault(); 
                var offset = linkTrgt.offset().top; 
                $('body, html').animate({
                    scrollTop: offset - 44
                }, 750); 
            }
        });

        /* Отслеживание активного экрана */
       
        function lpSetNavActive() {
            var curItem = '';
            $('section').each(function () {
                if ($(window).scrollTop() > $(this).offset().top - 200) {
                    curItem = $(this).attr('id'); 
                }
            });
            if (lpNav.find('li.active a').attr('href') != '#' + curItem || lpNav.find('li.active').length == 0) {
                lpNav.find('li.active').removeClass('active');
                lpNav.find('li a[href="#' + curItem + '"]').parent().addClass('active');
                if (lpReady) {
                    window.history.pushState({
                        curItemName: curItem
                    }, curItem, '/' + curItem);
                }
            }
        }

        lpSetNavActive(); 
        $(window).on('load scroll', lpSetNavActive); 

        /* Слайдер */

        $('.lp-slider1').owlCarousel({
            items: 1,
            nav: true,
            navText: ['<i class="fas fa-arrow-left"></i>', '<i class="fas fa-arrow-right"></i>']
        });

        $('.lp-slider2').owlCarousel({
            items: 3,
            nav: true,
            navText: ['<i class="fas fa-arrow-left"></i>', '<i class="fas fa-arrow-right"></i>']
        });

        /* Табулятор */

 
        $('.lp-tabs').each(function () {
            var tabs = $(this),
                tabsTitlesNames = []; 
            tabs.find('div[data-tab-title]').each(function () {
                tabsTitlesNames.push($(this).attr('data-tab-title'));
            }).addClass('lp-tab');
            tabs.wrapInner('<div class="lp-tabs-content"></div>');
            tabs.prepend('<div class="lp-tabs-titles"><ul></ul></div>');
            var tabsTitles = tabs.find('.lp-tabs-titles'), 
                tabsContent = tabs.find('.lp-tabs-content'), 
                tabsContentTabs = tabsContent.find('.lp-tab'); 
            tabsTitlesNames.forEach(function (value) {
                tabsTitles.find('ul').append('<li>' + value + '</li>');
            });
            var tabsTitlesItems = tabsTitles.find('ul li');
            tabsTitlesItems.eq(0).addClass('active');
            tabsContentTabs.eq(0).addClass('active').show();
            tabsContent.height(tabsContent.find('.active').outerHeight());
            tabsTitlesItems.on('click', function () {
                if (!tabs.hasClass('changing')) {
                    tabs.addClass('changing');
                    tabsTitlesItems.removeClass('active');
                    $(this).addClass('active');
                    var curTab = tabsContent.find('.active'), 
                        nextTab = tabsContentTabs.eq($(this).index());
                    var curHeight = curTab.outerHeight();
                    nextTab.show();
                    var nextHeight = nextTab.outerHeight();
                    nextTab.hide();
                    if (curHeight < nextHeight) {
                        tabsContent.animate({
                            height: nextHeight
                        }, 500);
                    }
                    curTab.fadeOut(500, function () {
                        if (curHeight > nextHeight) {
                            tabsContent.animate({
                                height: nextHeight
                            }, 500);
                        }
                        nextTab.fadeIn(500, function () {
                            curTab.removeClass('active');
                            nextTab.addClass('active');
                            tabs.removeClass('changing');
                        });
                    });

                }
            });
            $(window).on('load resize', function () {
                tabsContent.height(tabsContent.find('.active').outerHeight());
            });
        });

        /* Всплывающие окна */

        $('.lp-mfp-inline').magnificPopup({
            type: 'inline'
        });

        $('.lp-gallery').each(function () {
            $(this).magnificPopup({
                delegate: 'a',
                type: 'image',
                gallery: {
                    enabled: true
                }
            });
        });

        /* Обратная связь */

        $('#lp-fb1').wiFeedBack({
            fbScript: 'blocks/wi-feedback.php',
            fbLink: '.lp-fb1-link',
            fbColor: '#7952b3'
        });

        $('#lp-fb2').wiFeedBack({
            fbScript: 'blocks/wi-feedback.php',
            fbLink: false,
            fbColor: '#7952b3'
        });

        /* Яндекс.Карта */

        $.fn.lpMapInit = function () {

            var lpMapOptions = {
                center: [53.906522, 27.510232],
                zoom: 16,
                controls: ['zoomControl', 'fullscreenControl']
            }

            if (window.innerWidth < 768) {
                lpMapOptions.behaviors = ['multiTouch'];
            } else {
                lpMapOptions.behaviors = ['drag'];
            }

            var lpMap = new ymaps.Map('lp-map', lpMapOptions);

            var lpPlacemark = new ymaps.Placemark(lpMapOptions.center, {
                hintContent: 'ИТ Академия',
                balloonContentHeader: 'ИТ Академия',
                balloonContentBody: 'учебные курсы',
                balloonContentFooter: 'пер. 4-й Загородный, 56А'
            });

            lpMap.geoObjects.add(lpPlacemark);
        }

    });
})(jQuery);
