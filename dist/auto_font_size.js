'use strict';

angular.module('AutoFontSize', [])
    .directive('autoFontSize', ['$window', '$timeout',
        function($window, $timeout) {

            return {
                template: '<div data-role="inner" ng-transclude></div>',
                transclude: true,
                link: {
                    post: function(scope, elem, attrs) {
                    
                        var providedOptions = scope.$eval(attrs.autoFontSize) || {};
                        var options = angular.extend({
                            shrink: true,
                            grow: true,
                            minSize: 1,
                            preserveLineHeight: false
                        }, providedOptions);
                    
                        var inner = angular.element(elem[0].querySelector('div[data-role]'));
                        
                        // on every scope.$digest, check if a resize is needed
                        scope.$watch(function() {
                          $timeout(shrinkOrGrow, 0, false);
                        });

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
                                setFontSize(fontSizeI() - 1); // We grew too big, shrink it back one
                            } else {
                                return;
                            }
                            
                            scope.$emit('auto-font-size:resized', {
                                fontSize: fontSizeI(),
                                elem: elem
                            });
                        }

                        function css(el, prop) {
                            if($window.getComputedStyle) return $window.getComputedStyle(el[0]).getPropertyValue(prop);
                        }
                        
                        function fontSizeI() {
                            var fontSize = css(inner, 'font-size');
                            return Number(fontSize.match(/\d+/)[0]);
                        }
                    
                        function setFontSize(size) {
                            inner[0].style.fontSize = size + 'px';
                            adjustLineHeightAndInlineImages();
                        }

                        function adjustLineHeightAndInlineImages() {
                            if (!fontSizeAdjusted()) { return; }
                            var size;

                            if (options.preserveLineHeight) {
                              size = css(elem, 'line-height');
                            } else {
                              size = fontSizeI() + 2;
                            }

                            var images = inner[0].querySelectorAll('img');
                            angular.forEach(images, function(img) {
                              img.style.height((size) + 'px');
                            });
                            inner[0].style.lineHeight = (size) + 'px';
                        }

                        function fontSizeAdjusted() {
                            return !!inner[0].style.fontSize;
                        }

                        function fontTooBig() {
                            // dont do anything if we are in a display none parent
                            if (!inner[0].children[0].offsetWidth) return false;
                            var verticalPadding = parseInt(css(elem, 'padding-top')) +
                                                  parseInt(css(elem, 'padding-bottom'));

                            var horizontalPadding = parseInt(css(elem, 'padding-left')) +
                                                  parseInt(css(elem, 'padding-right'));


                            return (inner[0].children[0].offsetWidth > (elem[0].offsetWidth - horizontalPadding) || inner[0].children[0].offsetHeight > (elem[0].offsetHeight - verticalPadding));
                        }
                    
                        function fontTooSmall() {
                            // dont do anything if we are in a display none parent
                            if (!inner[0].children[0].offsetWidth) return false;
                            var verticalPadding = parseInt(css(elem, 'padding-top')) +
                                                  parseInt(css(elem, 'padding-bottom'));
                            var horizontalPadding = parseInt(css(elem, 'padding-left')) +
                                                  parseInt(css(elem, 'padding-right'));

                            return (inner[0].children[0].offsetWidth < elem[0].offsetWidth - horizontalPadding && inner[0].children[0].offsetHeight < elem[0].offsetHeight - verticalPadding);
                        }
                    }
                }
            };
        }
    ]);
