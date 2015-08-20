angular.module('ng-bootstrap-loading', [])
    .directive('ngBootLoading', ['$rootScope', 'BootLoadingService',function ($rootScope,BootLoadingService) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                message: '@'
            },
            link: function (scope, element, attrs) {
                scope.initMessage = scope.message;
                BootLoadingService.setLoadingInstance(function(status, msg) {
                    if(status == 1) {
                        if(msg) {
                            scope.message = msg;
                        }
                        var item = angular.element("#boot-loading-message");
                        var width = $(window).width() - parseInt(item.width());
                        item.css("left", width / 2);
                        var top = $(window).height() / 2 - parseInt(item.height());
                        item.css("top", top);
                        angular.element("#boot-loading-mask").css("display" , "block");
                        angular.element("#boot-loading-message").css("display", "block");
                    }
                    if(status == 0) {
                        scope.message = scope.initMessage;
                        angular.element("#boot-loading-mask").css("display" , "none");
                        angular.element("#boot-loading-message").css("display", "none");
                    }
                });
            },
            template:
            '<div>' +
            '   <div id="boot-loading-mask"></div>' +
            '   <div id="boot-loading-message">' +
            '       <span class="boot-loading-image"></span><span class="boot-loading-text">{{message}}</span>' +
            '   </div>' +
            '</div>'
        }
    }])
    .factory('BootLoadingService', ['$timeout',function($timeout) {
        var status = 0;
        var timer;
        var timeout = 10000;
        var timeoutClose = 5000;
        var timeoutMsg = "后台访问超时！";
        var loadingInstance;

        return {
            start : function(msg) {
                status = 1;
                loadingInstance(status, msg);
                timer = $timeout(function() {
                    if(status == 1) {
                        loadingInstance(status, timeoutMsg);
                        timer = $timeout(function() {
                            loadingInstance(0);
                        }, timeoutClose);
                    }
                }, timeout);
            },
            complete : function() {
                status = 0;
                loadingInstance(status);
                $timeout.cancel(timer);
            },
            status : status,
            setLoadingInstance : function(instance) {
                loadingInstance = instance;
            }
        }
    }]);