(function (window) {
    "use strict";

    angular
        .module('angular.toolkit.utils', [])
        .service('atUtilService', function () {
            var transformTo2Dimension = function (source, node, parent, parentKey) {
                angular.forEach(source, function (item) {
                    if ( item[ parentKey ] == parent ) {
                        node.push(item);
                        item.children = [];
                        transformTo2Dimension(source, item.children, item.value, parentKey);
                    }
                });
                return node;
            };

            var transformToTree = function (treeSource, twoDSource, childrenKey) {
                angular.forEach(treeSource, function (item) {
                    if ( angular.isArray(item[ childrenKey ]) ) {
                        transformToTree(item[ childrenKey ], twoDSource, childrenKey);
                    }
                    twoDSource.push(item);
                });
            };

            return {
                flushStatus: function (source, name, val) {
                    angular.forEach(source, function (item) {
                        if ( item.hasOwnProperty(name) ) {
                            if ( val ) {
                                item[ name ] = val;
                            } else {
                                item[ name ] = false;
                            }
                        }
                    });
                },
                TwoD2Tree: function (source, parentKey) {
                    var node = [];
                    transformTo2Dimension(source, node, null, parentKey);
                    return node;
                },
                Tree2TwoD: function (source, childrenKey) {
                    var twoDSource = [];
                    transformToTree(source, twoDSource, childrenKey);
                    return twoDSource;
                }
            }
        })
    ;
})(window);