'use strict';

angular.module('AutoFontSize', [])
    .directive('autoFontSize', ['$window', 
        function($window) {

            return {
                template: '<div data-role="inner" ng-transclude></div>',
                transclude: true,
                link: {
                    post: function(scope, elem, attrs) {
                    
                        var providedOptions = scope.$eval(attrs.autoFontSize) || {};
                        var options = angular.extend({
                            shrink: true,
                            grow: true,
                            minSize: 1
                        }, providedOptions);
                    
                        var inner = elem.find('div[data-role]');
                        
                        // on every scope.$digest, check if a resize is needed
                        scope.$watch(shrinkOrGrow);

                        function shrinkOrGrow() {
                            var i = 0;

                            // deal with line-height and images
                            adjustLineHeightAndInlineImages();

                            if (fontTooBig() && options.shrink) {
                                while (fontTooBig() && i < 100 && fontSizeI() >= options.minSize) {
                                    setFontSize(fontSizeI() - 1);
                                    i = i + 1;
                                }
                            } else if (fontTooSmall() && options.grow) {
                                while (fontTooSmall() && i < 100) {
                                    setFontSize(fontSizeI() + 1);
                                    i = i + 1;
                                }
                            } else {
                                return;
                            }
                            
                            scope.$emit('auto-font-size:resized', {
                                fontSize: fontSizeI(),
                                elem: elem
                            });
                        }
                        
                        function fontSizeI() {
                            var fontSize = inner.css('font-size');
                            return Number(fontSize.match(/\d+/)[0]);
                        }
                    
                        function setFontSize(size) {
                            inner.css('fontSize', size + 'px');
                            adjustLineHeightAndInlineImages();
                        }

                        function adjustLineHeightAndInlineImages() {
                            if (!fontSizeAdjusted()) { return; }
                            var size = fontSizeI();
                            inner.css('lineHeight', (size+2) + 'px');
                            inner.find('img').height(size+2);
                        }

                        function fontSizeAdjusted() {
                            return !!inner.css('font-size');
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
