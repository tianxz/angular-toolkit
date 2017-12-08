(function (window) {
    'use strict';
    angular
        .module('angular.toolkit.dept.search', [ 'at/template/cache' ])
        .controller('atDeptSearchController', function () {

        })
        .directive('atDeptSearch', function () {
            return {
                templateUrl: 'at/dept/template/dept-search.html',
                restrict: 'AE',
                link: function () {

                }
            }
        })
})(window);