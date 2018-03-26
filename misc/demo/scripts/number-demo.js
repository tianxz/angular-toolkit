(function (global) {
    'use strict';

    angular
        .module('at.number.demo', [ 'angular.toolkit.number', 'ui.bootstrap' ])
        .controller('atNumberDemoController', function ($scope) {
            $scope.placeholder = '请输入整数或浮点数';
            $scope.atRequired = true;
            $scope.obj = '888.88';

            $scope.atOnChange = function () {
                console.log('change');
            };
            $scope.atOnClick = function () {
                console.log('click');
            };
            $scope.changeAtRequired = function () {
                $scope.atRequired = !$scope.atRequired;
            }
        })
})(window);