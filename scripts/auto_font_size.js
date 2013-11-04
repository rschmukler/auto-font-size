'use strict';

angular.module('AutoFontSize', [])
    .directive('autoFontSize', [
        function() {
            return {
                template: '<div data-role="inner" ng-transclude></div>',
                transclude: true,
                link: {
                    post: function(scope, elem, attrs) {
                    
                        var providedOptions = scope.$eval(attrs.autoFontSize) || {};
                        var options = angular.extend({
                            shrink: true,
                            grow: true
                        }, providedOptions);
                    
                        var inner = elem.find('div[data-role]');
                        shrinkOrGrow();
                        
                        if (options.watch) {
                            angular.forEach(options.watch.split(','), function(str){
                                scope.$watch(str, shrinkOrGrow);
                            });
                        }
                    
                        function shrinkOrGrow() {
                            var size = 1;
                            var i = 0;
                            var step = 0.05;
                            
                            if (fontTooBig() && options.shrink) {
                                setFontSize(size);
                                
                                while (fontTooBig() && i < 100) {
                                    size = (1-step)*size;
                                    setFontSize(size);
                                    i = i + 1;
                                }
                            } else if (fontTooSmall() && options.grow) {
                                setFontSize(size);
                                
                                while (fontTooSmall() && i < 100) {
                                    size = (1+step)*size;
                                    setFontSize(size);
                                    i = i + 1;
                                }
                            }
                        }
                    
                        function setFontSize(em) {
                            inner.css('fontSize', em + 'em');
                        }
                    
                        function fontTooBig() {
                            return (inner.width() > elem.width() || inner.height() > elem.height());
                        }
                    
                        function fontTooSmall() {
                            return (inner.width() < elem.width() || inner.height() < elem.height());
                        }
                    
                    }
                }
            };
        }
    ]);
