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
                        var originalFontSize;
                    
                        var inner = elem.find('div[data-role]');
                        
                        // on every scope.$digest, check if a resize is needed
                        scope.$watch(shrinkOrGrow);
                                            
                        function shrinkOrGrow() {
                            var i = 0;
                            if (fontSizeI() === null) { return; }
                            
                            // originalFontSize is the font size when the directive was first created, 
                            // before the auto-font-size directive ever changed it
                            if (!originalFontSize) {
                                originalFontSize = fontSizeI();
                            }   
                            
                            // currentFontSize is the font size before this run of shrinkOrGrow
                            var currentFontSize = fontSizeI();
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
                                correctOvershoot();
                            } else if (!fontTooBig() && fontHasBeenShrunk()) {
                                while (!fontTooBig() && fontHasBeenShrunk() && i < 100) {
                                    setFontSize(fontSizeI() + 1);
                                    i = i + 1;
                                }
                                correctOvershoot();
                            }
                                                        
                            
                            // if the font size has changed, thn emit an event
                            if (currentFontSize != fontSizeI()) {
                                scope.$emit('auto-font-size:resized', {
                                    fontSize: fontSizeI(),
                                    elem: elem
                                });
                            }
                            
                        }
                        
                        function correctOvershoot() {
                            if (fontTooBig()) {
                                setFontSize(fontSizeI() - 1); 
                            }
                        }
                        
                        function fontSizeI() {
                            var fontSize = inner.css('font-size');
                            var match = fontSize.match(/\d+/);
                            return match ? Number(match[0]) : null;
                        }
                    
                        function setFontSize(size) {
                            inner.css('fontSize', size + 'px');
                            inner.css('lineHeight', (size+2) + 'px');
                        }
                        
                        function fontHasBeenShrunk() {
                            return fontSizeI() < originalFontSize;
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
