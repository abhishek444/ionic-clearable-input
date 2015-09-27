'use strict';

describe('ClearableInput', function() {
	var	$compile,
		$scope,
		element,
		isolateScope,
		inputElem,
		iconElem;
	
	// load the module
	beforeEach(module('giapp'));
	
	// required to avoid the $httpBackend flushing to provoke a change of $state
	// which would try to change the current page (by loading a template)...
	// see https://github.com/angular-ui/ui-router/issues/212
	beforeEach(module(function($provide, $urlRouterProvider) {
		$provide.value('$ionicTemplateCache', function(){} );
		$urlRouterProvider.deferIntercept();
	}));

	// compile the element's template, and initialize its isolateScope
	beforeEach(inject(function(_$compile_, $rootScope){
		$compile = _$compile_;
		$scope = $rootScope;
		
		var ngElem = angular.element('<div><input ng-model="anyModel" type="text" clearable-input></div>');
		
		element = $compile(ngElem)($scope);
		$scope.$digest();
		
		isolateScope = element.children().isolateScope();
		inputElem = element.find('input');
		iconElem = element.find('i');
	}));
	
	// ---------------------------------------------------

	describe('post-compilation content validation', function(){
		it('should inject the icon html markup in the container of the input', function() {
			// Check that the compiled element contains the injected icon
			expect(iconElem).toBeDefined();
			expect(iconElem.length).toBe(1);
			expect(iconElem.hasClass('icon')).toBe(true);
			expect(iconElem.hasClass('ion-android-close')).toBe(true);
		});
		
		it('should contains one (and only one) input', function() {	
			expect(inputElem).toBeDefined();
			expect(inputElem.length).toBe(1);
		});
	});
	
	describe('isolate scope', function(){
		it('should has a property "clearable" initialized to false', function(){
			expect(isolateScope.clearable).toBeDefined();
			expect(typeof isolateScope.clearable).toBe('boolean');
			expect(isolateScope.clearable).toBe(false);
		});
				
		it('should has a method "clearInput"', function(){
			expect(isolateScope.clearInput).toBeDefined();
			expect(typeof isolateScope.clearInput).toBe('function');
		});
		
		it('should set the property "clearable" to false when #clearInput is called', function() {
			isolateScope.clearable = true;
			isolateScope.clearInput();
			expect(isolateScope.clearable).toBe(false);
		});
	});
	
	describe('directive behavior', function() {
		it('should hide the clear icon when scope.clearable is false', function() {
			isolateScope.clearable = false;
			$scope.$digest();
			
			expect(iconElem.hasClass('ng-hide')).toBe(true);
		});
		
		it('should show the clear icon when scope.clearable is true', function() {
			isolateScope.clearable = true;
			$scope.$digest();
			
			expect(iconElem.hasClass('ng-hide')).toBe(false);
		});
		
		it('should give the focus to the input once it has been cleared', function() {
			spyOn(inputElem[0], 'focus');
			isolateScope.clearInput();
			expect(inputElem[0].focus).toHaveBeenCalled();
		});
		
		it('should throw an Error if the input element has an invalid type', function() {
			var ngElem = angular.element('<div><input ng-model="anyModel" type="te2xt" clearable-input></div>');
			expect(function() { $compile(ngElem)($scope) }).toThrow(jasmine.any(Error));
		});
		
		it('should throw an Error if the element is not an INPUT', function() {
			var ngElem = angular.element('<div><button ng-model="anyModel" clearable-input></div>');
			expect(function() { $compile(ngElem)($scope) }).toThrow(jasmine.any(Error));
		});
	});
	
	describe('events on the input element', function() {
		it('should turn isolateScope.clearable to false on event blur', function() {
			isolateScope.clearable = true;
			inputElem.triggerHandler('blur');
			expect(isolateScope.clearable).toBe(false);
		});
		
		it('should turn isolateScope.clearable to true on event focus if input is not empty', function() {
			isolateScope.clearable = false;
			inputElem.val('not empty');
			inputElem.triggerHandler('focus');
			expect(isolateScope.clearable).toBe(true);
		});
		
		it('should turn isolateScope.clearable to false on event focus if input is empty', function() {
			isolateScope.clearable = true;
			inputElem.val('');
			inputElem.triggerHandler('focus');
			expect(isolateScope.clearable).toBe(false);
		});
		
		it('should turn isolateScope.clearable to true on event input if input is not empty', function() {
			isolateScope.clearable = false;
			inputElem.val('not empty');
			inputElem.triggerHandler('input');
			expect(isolateScope.clearable).toBe(true);
		});
		
		it('should turn isolateScope.clearable to false on event input if input is empty', function() {
			isolateScope.clearable = true;
			inputElem.val('');
			inputElem.triggerHandler('input');
			expect(isolateScope.clearable).toBe(false);
		});
	});
});