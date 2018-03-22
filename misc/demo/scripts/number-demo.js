(function (global) {
    'use strict';

    angular
        .module('at.number.demo', [ 'angular.toolkit.number', 'ui.bootstrap' ])
        .controller('atNumberDemoController', function ($scope) {
            $scope.placeholder = '请输入整数或浮点数';
        })
})(window);