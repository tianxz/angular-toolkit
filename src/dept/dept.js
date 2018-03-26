(function (window) {
    'use strict';

    angular
        .module('angular.toolkit.dept', [ 'angular.toolkit.utils', 'at/template/cache' ])
        .constant('atDeptConfig', {
            fenceMaxTotal: 3,
            singleSelect: true,
            parentKey: 'parent'
        })
        .controller('atDeptController', function (atDeptConfig, $scope, atUtil) {
            var self = this;
            var scope = $scope;

            //region init atDeptConfig parameter
            for ( var attr in atDeptConfig ) {
                if ( scope.deptOptions && scope.deptOptions.hasOwnProperty(attr) ) {
                    self[ attr ] = scope.deptOptions[ attr ];
                    scope[ attr ] = self[ attr ];
                } else {
                    self[ attr ] = atDeptConfig[ attr ];
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
                    var items = includeItemsAtSource(self.deptSource, scope.ngModel);
                    if ( items.length > 0 ) {
                        self.selectSingleItem.val = items[ items.length - 1 ];
                    }
                    if ( self.selectSingleItem.val ) {
                        scope.selectItems.push(self.selectSingleItem.val);
                    }
                } else {
                    scope.selectItems = includeItemsAtSource(self.deptSource, scope.ngModel, function (item) {
                        item.checked = true;
                    });
                }

                var treeData = atUtil.TwoD2Tree(newValue ? newValue : self.deptSource, self.parentKey);   //转换二维数据为tree data
                self.source = treeData;
                if ( newValue ) {
                    self.refreshFenceView(0, self.source);   //根据新数据重新渲染view
                }
            };

            /**
             * checkbox or radio at item of fence changed.
             */
            self.itemSelectChange = function () {
                scope.selectItems = [];

                if ( self.singleSelect ) {
                    if ( self.selectSingleItem.val ) {
                        scope.selectItems.push(self.selectSingleItem.val);
                    }
                } else {
                    angular.forEach(self.deptSource, function (item) {
                        if ( item.checked ) scope.selectItems.push(item);
                    });
                }

                var viewValue = [];
                angular.forEach(scope.selectItems, function (item) {
                    viewValue.push(item.value);
                });
                self.ngModelCtrl.$setViewValue(viewValue);
                self.ngModelCtrl.$render();
            };

            self.initDeptSource = function (deptSource) {
                self.deptSource = [];
                angular.copy(deptSource, self.deptSource);
                return self.deptSource;
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
                for ( var i = index; i <= atDeptConfig.fenceMaxTotal; i++ ) {
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
        .controller('atDeptFenceController', function ($scope, atUtil) {
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

            /**
             * item of fence changed
             * @param index
             * @param item
             */
            self.scope.selected = function (index, item) {
                self.refreshFenceView(index + 1, item.children);
                atUtil.flushStatus(self.fenceList, 'active');
                item.active = true;
            };
        })
        .directive('atDept', function () {
            return {
                templateUrl: function (element, attrs) {
                    return attrs.templateUrl || 'at/dept/template/dept.html';
                },
                require: [ 'atDept', 'ngModel' ],
                controller: 'atDeptController',
                scope: {
                    deptSource: '=',
                    deptOptions: '=?',
                    ngModel: '=?'
                },
                restrict: 'AE',
                link: function (scope, element, attrs, ctrls) {
                    if ( scope.deptSource && !angular.isArray(scope.deptSource) ) throw Error('dept-source 数据源类型必须为数组');

                    var ele = $(element);
                    var atDeptCtrl = ctrls[ 0 ];

                    atDeptCtrl.ngModelCtrl = ctrls[ 1 ];

                    scope.$watch('deptSource', function (newValue) {
                        var deptSource = atDeptCtrl.initDeptSource(newValue);
                        atDeptCtrl.refreshData(deptSource ? atDeptCtrl.deptSource : []);

                        ele.find('.dept').scrollLeft(0);
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
                            ele.parents('.dept').scrollLeft(width * 0.8 * index);
                        }
                    });
                }
            }
        })
    ;
})(window);