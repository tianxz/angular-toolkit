(function (global) {
    angular
        .module('at.dept.demo', [ 'angular.toolkit.dept', 'ui.bootstrap' ])
        .controller('atDeptDemoController', function ($scope, $uibModal) {
            var scope = $scope;

            $scope.initData1 = function () {
                $scope.source = [
                    { name: '中国', value: 'ZhongGuo', parent: null },
                    { name: '德国', value: 'DeGuo', parent: null },
                    { name: '陕西', value: 'ShanXi', parent: 'ZhongGuo' },
                    { name: '广东', value: 'GuangDong', parent: 'ZhongGuo' },
                    { name: '深圳', value: 'ShenZhen', parent: 'GuangDong' },
                    { name: '西安', value: 'Xian', parent: 'ShanXi' },
                    { name: '高新区', value: 'GaoXin', parent: 'Xian' },
                ];
            };

            $scope.initData2 = function () {
                $scope.source = [
                    { name: '业务群I', value: 'A', parent: null },
                    { name: '业务线II', value: 'B', parent: null },
                    { name: '事业部I', value: 'AA', parent: 'A' },
                    { name: '事业部II', value: 'AB', parent: 'B' },
                    { name: '交付部I', value: 'AAA', parent: 'AA' },
                    { name: '交付部II', value: 'AAB', parent: 'AA' }
                ];
            };

            $scope.initData3 = function () {
                $scope.source3 = [
                    { name: '业务群I', value: 'A', parent: null },
                    { name: '业务线II', value: 'B', parent: null },
                    { name: '事业部I', value: 'AA', parent: 'A' },
                    { name: '事业部II', value: 'AB', parent: 'B' },
                    { name: '交付部I', value: 'AAA', parent: 'AA' },
                    { name: '交付部II', value: 'AAB', parent: 'AA' }
                ];
            };

            $scope.openModel = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'deptModel.html',
                    size: 'lg',
                    controller: function ($scope) {
                        var src = [];
                        angular.copy(scope.source, src);
                        $scope.modelSource = src;
                        $scope.modelItems = [];
                    }
                });

                modalInstance
                    .result
                    .then(
                        function (selectedItem) {

                        },
                        function () {

                        });
            };

            $scope.items = [ 'ZhongGuo' ];

            $scope.initData1();
            $scope.initData3();
        });
})(window);