(function(){

angular.module('starter', ['ionic'])

.run(function() {})

.directive('clearableInput',
	[
		'$compile',
		ClearableInput
	]
);

/**
 * Directive clearable-input for <input> elements. Simulates the "clear icon" of the Android EditText.
 *
 * Based on the work of "Udi": http://codepen.io/udfalkso/pen/cdfsp
 *
 * IMPORTANT NOTE:
 * The parent node of the input should be a <div>.
 * The "clear icon" does not work in a <label> element.
 * Ionitron's answer: https://github.com/driftyco/ionic/issues/2311#issuecomment-74161442
 * M. Hartington's answer: http://forum.ionicframework.com/t/cannot-tap-click-a-clear-search-icon-inside-an-input-label/4237/7
 *
 * Exemple of HTML code:
 * <div class="item item-input">
 *     <i class="icon ion-search placeholder-icon"></i>
 *     <input 	type="search" ng-model="ctrl.number" placeholder="Number"
 *				clearable-input required>
 * </div>
 *
 * @author VinceOPS https://github.com/VinceOPS
 */
function ClearableInput($compile) {
	// limit to input element of specific types
	var inputTypes = /^(text|search|number|tel|url|email|password)$/i;

	return {
		restrict: 'A',
		require: 'ngModel',
		scope: {},
		link: function(isolateScope, elem, attrs, ngModelCtrl) {
			var inputElem = elem[0];

			if (inputElem.nodeName.toUpperCase() !== "INPUT") {
				// reserved to <input> elements
				throw new Error('Directive clearable-input is reserved to input elements');
			} else if(!inputTypes.test(attrs.type)) {
				// with a correct "type" attribute
				throw new Error("Invalid input type for clearableInput: " + attrs.type);
			}

			// initialized to false so the clear icon is hidden (see the ng-show directive)
			isolateScope.clearable = false;
			// more "testable" when exposed in the scope...
			isolateScope.clearInput = clearInput;

			// build and insert the "clear icon"
			var iconCss = 'margin-right: 15px; ';
			iconCss += 'color: '+ (attrs.clearableInput !== '' ? attrs.clearableInput : '#888');
			var iconTemplate = '<i class="icon ion-android-close" ng-show="clearable" style="'+iconCss+'"></i>';
			var clearIconElem = $compile(iconTemplate)(isolateScope);
			elem.after(clearIconElem);
			// make it clear the <input> on click
			clearIconElem.bind('click', isolateScope.clearInput);

			// --- Event-driven behavior ---
			// if the user types something: show the "clear icon" if <input> is not empty
			elem.bind('input', showIconIfInputNotEmpty);
			// if the user focuses the input: show the "clear icon" if it is not empty
			elem.bind('focus', showIconIfInputNotEmpty);
			// if the <input> loses the focus: hide the "clear icon"
			elem.bind('blur', hideIcon);

			function clearInput() {
				ngModelCtrl.$setViewValue('');
				// rendering the updated viewValue also updates the value of the bound model
				ngModelCtrl.$render();

				// hide the "clear icon" as it is not necessary anymore
				isolateScope.clearable = false;

				// as user may want to types again, put the focus back on the <input>
				inputElem.focus();
			};

			/**
			 * Used to show or hide the "clear icon" by updating the scope "clearable" property.
			 *
			 * @param {boolean} newValue If true, show the icon. Otherwise, hide it.
			 */
			function setContainerClearable(newValue){
				isolateScope.clearable = newValue;
				isolateScope.$apply();
			};

			function showIconIfInputNotEmpty() {
				setContainerClearable(!ngModelCtrl.$isEmpty(elem.val()));
			};

			function hideIcon() {
				setContainerClearable(false);
			};
		}
    };
}

})()