(function (window) {
    'use strict';

    function checkFloat(value) {
        var ex = /(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))/;
        var value = value + '';
        if ( ex.test(value) ) {
            if ( value.match(ex)[ 0 ] == value.replace('.', '') || value.match(ex)[ 0 ] == value ) {
                return true;
            }
        }
        return null;
    }

    function cutFloat(val, digit) {
        val = parseFloat(val) + '';
        if ( val.indexOf('.') > 0 ) {
            val = val.substring(0, val.indexOf('.')) + val.substring(val.indexOf('.'), val.indexOf('.') + digit + 1);
        }
        return val;
    }

    angular
        .module('angular.toolkit.number', [ 'at/template/cache' ])
        .constant('config', {
            atDigit: 0
        })
        .controller('_atNumberController_', function ($scope, config) {
            if ( !$scope.atDigit ) {
                $scope.atDigit = config.atDigit;
            }

            $scope.focus = function () {
                var val = $scope.atValue;
                var digit = parseInt($scope.atDigit);
                $scope.atValue = parseFloat(cutFloat(val, digit));
            };


            $scope.$watch(
                function () {
                    return $scope.atValue;
                },
                function (newValue) {
                    var value = newValue + '';
                    if ( checkFloat(newValue) ) {
                        var arr = value.split('.');
                        if ( arr.length >= 2 ) {
                            value = arr[ 0 ];
                            value += '.';
                            if ( arr[ 1 ] ) {
                                value += arr[ 1 ];
                            }
                        }
                        $scope.atValue = value;
                    } else {
                        $scope.atValue = parseFloat(value);
                        if ( $scope.atValue + '' == 'NaN' ) {
                            $scope.atValue = undefined;
                        }
                    }
                }
            );
        })
        .directive('atNumber', function () {
            return {
                templateUrl: function (element, attrs) {
                    return attrs.templateUrl || 'at/number/template/number.html';
                },
                controller: '_atNumberController_',
                restrict: 'AE',
                scope: {
                    atValue: '=?',
                    atPlaceholder: '@',
                    atDigit: '@',
                    atClass: '=?'
                },
                link: function (scope) {
                }
            }
        })
    ;
})(window);