(function (window) {
    "use strict";

    angular
        .module('angular.toolkit.dept', ['angular.toolkit.utils'])
        .constant('atDeptConfig', {
            maxFence: 3,
            source: null,
            sourceType: 'object',   // object or url, default: object
        })
        .controller('atDeptController', function (atDeptConfig) {

        })
        .controller('atDeptFenceController', function () {

        })
        .directive('atDept', function () {
            return {
                controller: 'AtDeptController',
                restrict: 'E',
                templateUrl: function (element, attrs) {
                    return attrs.templateUrl || 'at/dept/template/dept.html';
                }
            };
        })
        .directive('atDeptFence', function () {
            return {
                require: '^atDept',
                restrict: 'E',
                controller: 'atDeptFenceController',
                templateUrl: function (element, attrs) {
                    return attrs.templateUrl || 'at/dept/template/dept-fence.html';
                }
            }
        })
    ;
})(window);