# Ionic ClearableInput (AngularJS Directive)
Allows adding a "clear" button in &lt;input&gt; elements for Ionic Framework.

![alt tag](http://s14.postimg.org/h2b6xj6oh/screen.png)

Displayed when: The input is focused and not empty.
Hidden when: The input is empty and/or not focused.

Usage:
```html
<div class="item item-input">
	<i class="icon ion-search placeholder-icon"></i>
	<input 	type="search" ng-model="anyModel" placeholder="Number" required clearable-input>
</div>
```

The color of the clear button (default #888) can be modified in the directive:

```html
<input type="text" ng-model="myModel" clearable-input="red">
```

Please see the comments in *clearableInput.js* for more details.

Unit tests (*clearableInputSpec.js*) written using Jasmine (test runner: Karma).

First AngularJS directive - feel free to fork and submit any pull requests ;-)!
