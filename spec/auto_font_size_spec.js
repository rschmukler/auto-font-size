'use strict'

describe('auto-font-size', function() {

    var $compile, $rootScope, $document, elem, scope, stage;

    beforeEach(function() {
        module('AutoFontSize');
                
        inject(function(_$compile_, _$rootScope_, _$document_){
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $document = _$document_;
            $($document[0].body).append('<div class="afs_test_div"></div>');    
            stage = $.find('.afs_test_div');
            expect(stage.length).toBe(1);
            stage = $(stage);
            scope = $rootScope.$new();
        });
    });
    
    afterEach(function() {
        stage.remove();
    });

    // ### Shrinking text
    // If the text cannot fit in the fixed size of the container div, then
    // it will shrink until it fits.
    it('should shrink text to fit in a div', function() {
        render('<div auto-font-size="options" style="width: 40px; height: 10px; font-size: 16px">ipsum lorem</div>');
        assertFontSizeLessThan(10);
    });
    
    // ### Growing text
    // If the text is not big enough to fill the fixed size of the container div, then
    // it will grow until it does.
    it('should grow text to fill a div', function() {
        render('<div auto-font-size="options"  style="width: 100px; height: 100px; font-size: 12px">ipsum lorem</div>');
        assertFontSizeGreaterThan(12);
    });
    
    // ### Only allow text to grow
    // If you set the 'shrink' option to false, then text will still
    // be allowed to grow to fill a space, but it will not shrink to fit
    // in a space.
    it('should not shrink if configured not to', function() {
        scope.options = {shrink: false};
        render('<div auto-font-size="options" style="width: 40px; height: 10px; font-size: 16px">ipsum lorem</div>');
        assertFontSizeEquals(16);
    });
    
    // ### Only allow text to shrink
    // If you set the 'grow' option to false, then text will still
    // be allowed to shrink to git in a space, but it will not grow to fill
    // a space.
    it('should not grow if configured not to', function() {
        scope.options = {grow: false};
        render('<div auto-font-size="options"  style="width: 100px; height: 100px; font-size: 12px">ipsum lorem</div>');
        assertFontSizeEquals(12);
    });
    
    // ### Re-size when things change
    // By using the 'watch' option, you can watch one or 
    // more properties on the parent scope, and resize when those properties 
    // change.  If you want to watch more than one property, then provide
    // a comma-separated list of properties.    
    it('should update when a watched something changes', function() {
        
        scope.options = {watch: 'something, else'};
        render('<div auto-font-size="options" style="width: 40px; height: 10px; font-size: 16px">ipsum lorem</div>');
        var fontSize = assertFontSizeLessThan(12);
        
        elem.find('div').html('So much text that we will have to shrink even more in order to fit because it is wrapping.');
        scope.$apply();
        //font size should not have been resized yet, because the watched variables have not changed
        assertFontSizeEquals(fontSize);
        
        scope.something = "changed";
        scope.$apply();
        //now that 'something' has changed, the auto-font-size element re-sized
        fontSize = assertFontSizeLessThan(fontSize);
        
        elem.find('div').html('make this bigger');
        scope.else = "changed";
        scope.$apply();
        assertFontSizeGreaterThan(fontSize);
    });
    
    function assertFontSizeEquals(size) {
        expect(fontSizeI()).toBe(size);
        return fontSizeI();
    }
    
    function assertFontSizeLessThan(size) {
        expect(fontSizeI() < size).toBe(true);
        return fontSizeI();
    }
    
    function assertFontSizeGreaterThan(size) {
        expect(fontSizeI() > size).toBe(true);
        return fontSizeI();
    }
    
    function fontSizeI() {
        var fontSize = elem.find('[data-role="inner"]').css('font-size');
        return Number(fontSize.match(/\d+/)[0]);
    }
    
    function render(html) {
        elem = angular.element(html);
        stage.html('');
        stage.append(elem);
        var compiled = $compile(elem);
        compiled(scope);
        scope.$digest();
        
        elem = elem;
    }

});
