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
                        
                        scope.$watch(shrinkOrGrow);
                                            
                        function shrinkOrGrow() {
                            var i = 0;
                            
                            if (fontTooBig() && options.shrink) {
                                while (fontTooBig() && i < 100) {
                                    setFontSize(fontSizeI() - 1);
                                    i = i + 1;
                                }
                            } else if (fontTooSmall() && options.grow) {
                                while (fontTooSmall() && i < 100) {
                                    setFontSize(fontSizeI() + 1);
                                    i = i + 1;
                                }
                            }
                        }
                        
                        function fontSizeI() {
                            var fontSize = inner.css('font-size');
                            return Number(fontSize.match(/\d+/)[0]);
                        }
                    
                        function setFontSize(size) {
                            inner.css('fontSize', size + 'px');
                            inner.css('lineHeight', (size+2) + 'px');
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
