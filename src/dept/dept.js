(function (window) {
    'use strict';

    angular
        .module('angular.toolkit.dept', [ 'angular.toolkit.utils', 'at/template/cache' ])
        .constant('config', {
            fenceMaxTotal: 3,
            singleSelect: true
        })
        .controller('atDeptController', function (config, $scope, atUtilService) {
            var self = this;
            var scope = $scope;

            //region init config parameter
            for ( var attr in config ) {
                if ( scope.deptOptions && scope.deptOptions.hasOwnProperty(attr) ) {
                    self[ attr ] = scope.deptOptions[ attr ];
                    scope[ attr ] = self[ attr ];
                } else {
                    self[ attr ] = config[ attr ];
                    scope[ attr ] = self[ attr ];
                }
            }
            //endregion

            var number2Array = function (number) {
                var fx = [];
                for ( var i = 0; i < number; i++ ) {
                    fx.push(i);
                }
                return fx;
            };

            var includeItemsAtSource = function (source, values, itemOpe) {
                var includeItems = [];
                angular.forEach(source, function (s) {
                    angular.forEach(values, function (val) {
                        if ( s.value === val ) {
                            if ( angular.isFunction(itemOpe) ) itemOpe(s);
                            includeItems.push(s);
                        }
                    });
                });
                return includeItems;
            };

            self.ctrls = {};                            //dept组件包含的控制器名称map
            self.fenceCtrlName = 'fenceCtrl';           //dept组件包含的控制器名称前缀
            self.selectSingleItem = { val: null };      //用户单选模式下选中的项

            //region init scope
            scope.selectItems = [];                                 //用户单选/多选模式下选中的项
            scope.fenceIdxs = number2Array(self.fenceMaxTotal);     //传递栏位索引集合到scope中
            //endregion

            /**
             * 刷新数据源并重新渲染view.
             * @param newValue
             */
            self.refreshData = function (newValue) {
                scope.selectItems = [];
                self.selectSingleItem.val = null;
                if ( self.singleSelect ) {
                    var items = includeItemsAtSource(scope.deptSource, scope.ngModel);
                    if ( items.length > 0 ) {
                        self.selectSingleItem.val = items[ items.length - 1 ];
                    }
                    if ( self.selectSingleItem.val ) {
                        scope.selectItems.push(self.selectSingleItem.val);
                    }
                } else {
                    scope.selectItems = includeItemsAtSource(scope.deptSource, scope.ngModel, function (item) {
                        item.checked = true;
                    });
                }

                var treeData = atUtilService.TwoD2Tree(newValue ? newValue : scope.deptSource, 'parent');   //转换二维数据为tree data
                self.source = treeData;
                if ( newValue ) {
                    self.refreshFenceView(0, self.source);   //根据新数据重新渲染view
                }
            };

            /**
             * 刷新当前选中的项
             * 1. 清空选中项
             * 2. 根据套件模式(单选/多选)设置选中的项
             */
            self.itemSelectChange = function () {
                scope.selectItems = [];

                if ( self.singleSelect ) {
                    if ( self.selectSingleItem.val ) {
                        scope.selectItems.push(self.selectSingleItem.val);
                    }
                } else {
                    angular.forEach(scope.deptSource, function (item) {
                        if ( item.checked ) scope.selectItems.push(item);
                    });
                }
            };

            self.initFence = function (index, ctrl) {

                //region refresh fence view
                self.ctrls[ self.fenceCtrlName + '_' + index ] = ctrl;
                if ( index == 0 ) {
                    self.refreshFenceView(0, self.source);
                }
                //endregion
            };

            self.refreshFenceView = function (index, source) {
                var ctrlName = self.fenceCtrlName + '_' + index;

                //region 清空index之后的fence数据源
                for ( var i = index; i <= config.fenceMaxTotal; i++ ) {
                    var tmpCtrlName = self.fenceCtrlName + '_' + i;
                    if ( self.ctrls.hasOwnProperty(tmpCtrlName) ) {
                        self.ctrls[ tmpCtrlName ]._refreshView({ fi: index, source: null });
                    }
                }
                //endregion

                if ( self.ctrls.hasOwnProperty(ctrlName) ) {
                    self.ctrls[ ctrlName ]._refreshView({ fi: index, source: source });
                }
            };
        })
        .controller('atDeptFenceController', function ($scope, atUtilService) {
            var self = this;
            self.scope = $scope;
            /**
             * @param args
             *        |- source: fence data source
             *        |- fi: fence index
             * @private
             */
            self._refreshView = function (args) {
                self.fenceList = [];
                angular.forEach(args.source, function (item) {
                    item.active = false;
                    if ( item.checked === undefined || item.checked === null ) {
                        item.checked = false;
                    }
                    self.fenceList.push(item);
                });

                self.scope.fenceList = self.fenceList;
                self.scope.singleSelect = self.singleSelect;
                self.scope.itemSelectChange = self.itemSelectChange;
                self.scope.selectSingleItem = self.selectSingleItem;
            };

            self.scope.selected = function (index, item) {
                self.refreshFenceView(index + 1, item.children);
                atUtilService.flushStatus(self.fenceList, 'active');
                item.active = true;
            };
        })
        .directive('atDept', function () {
            return {
                templateUrl: function (element, attrs) {
                    return attrs.templateUrl || 'at/dept/template/dept.html';
                },
                require: [ 'atDept' ],
                controller: 'atDeptController',
                scope: {
                    deptSource: '=',
                    deptOptions: '=?',
                    ngModel: '=?'
                },
                restrict: 'AE',
                link: function (scope, element, attrs, ctrls) {
                    if ( scope.deptSource && !angular.isArray(scope.deptSource) ) throw Error('dept-source 数据源类型必须为数组');
                    var atDeptCtrl = ctrls[ 0 ];
                    atDeptCtrl.refreshData();
                    scope.$watch('deptSource', function (newValue, oldValue) {
                        atDeptCtrl.refreshData(newValue ? newValue : []);
                        scope.$broadcast('AT_DEPT_REFRESH__BROADCAST');
                    });
                }
            };
        })
        .directive('atDeptFence', function () {
            return {
                require: [ '^atDept', 'atDeptFence' ],
                restrict: 'AE',
                controller: 'atDeptFenceController',
                scope: {
                    index: '='
                },
                templateUrl: function (element, attrs) {
                    return attrs.templateUrl || 'at/dept/template/dept-fence.html';
                },
                link: function (scope, element, attrs, ctrls) {
                    var atDeptCtrl = ctrls[ 0 ];
                    var atDeptFenceCtrl = ctrls[ 1 ];
                    angular.extend(atDeptFenceCtrl, atDeptCtrl);

                    atDeptCtrl.initFence(scope.index, atDeptFenceCtrl);
                }
            }
        })
        .directive('offset', function () {
            return {
                require: [ 'atDeptFence', '^atDept' ],
                restrict: 'A',
                link: function (scope, element, attrs, ctrls) {
                    var ele = $(element);
                    var fenceCtrl = ctrls[ 0 ];
                    var index = fenceCtrl.scope.index;
                    ele.click(function () {
                        if ( index < fenceCtrl.fenceMaxTotal ) {
                            var width = ele.width();
                            $('#DEPT_FENCE_CONTAINER__ID').scrollLeft(width * index);
                        }
                    });
                    scope.$on('AT_DEPT_REFRESH__BROADCAST', function () {
                        $('#DEPT_FENCE_CONTAINER__ID').scrollLeft(0);
                    });
                }
            }
        })
    ;
})(window);