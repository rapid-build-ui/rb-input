## [0.0.13](https://github.com/rapid-build-ui/rb-input/compare/v0.0.12...v0.0.13) (2019-02-24)


### Features

* **api:** add readonly ([f6c10bf](https://github.com/rapid-build-ui/rb-input/commit/f6c10bf))
* **popover slot:** create it so consumers can add rb-popover and not worry about styling ([666592d](https://github.com/rapid-build-ui/rb-input/commit/666592d))


### Dependencies

* **bump deps:** ([419a8da](https://github.com/rapid-build-ui/rb-input/commit/419a8da))
	* **rb-base** to v0.0.7
	* **rb-icon** to v0.0.12
	* **rb-popover** to v0.0.14
	* **form-control** to v0.0.6



## [0.0.12](https://github.com/rapid-build-ui/rb-input/compare/v0.0.11...v0.0.12) (2018-12-05)


### Features

* **bump:** deps rb-base v0.0.6, form-control v0.0.5 and rb-icon v0.0.11 ([5e4b1df](https://github.com/rapid-build-ui/rb-input/commit/5e4b1df))
* **hidden attribute:** display style that respects the hidden attribute ([f9603c3](https://github.com/rapid-build-ui/rb-input/commit/f9603c3))
* **styling:** enhancement ([31ed700](https://github.com/rapid-build-ui/rb-input/commit/31ed700))


### Performance Improvements

* **css:** improve browser performance by adding css contain property ([b968b10](https://github.com/rapid-build-ui/rb-input/commit/b968b10))



## [0.0.11](https://github.com/rapid-build-ui/rb-input/compare/v0.0.10...v0.0.11) (2018-11-13)


### Dependencies

* **bump:** deps rb-base v0.0.5, form-control v0.0.4 and rb-icon v0.0.10 ([dd850f2](https://github.com/rapid-build-ui/rb-input/commit/dd850f2))



## [0.0.10](https://github.com/rapid-build-ui/rb-input/compare/v0.0.9...v0.0.10) (2018-09-26)


### Features

* **validation:** set form control and focus element for validation to be generic ([a2f047c](https://github.com/rapid-build-ui/rb-input/commit/a2f047c))


### Dependencies

* **bump:** deps form-control v0.0.3, rb-base v0.0.4 and rb-icon v0.0.9 ([5d40fd6](https://github.com/rapid-build-ui/rb-input/commit/5d40fd6))


### BREAKING CHANGES

* **api option:** change icon to icon-kind ([b72b9db](https://github.com/rapid-build-ui/rb-input/commit/b72b9db))

To migrate the code follow the example below:

**Before:**  
icon="heart"

**Now:**  
icon-kind="heart"



## [0.0.9](https://github.com/rapid-build-ui/rb-input/compare/v0.0.8...v0.0.9) (2018-09-14)


### Dependencies

* **bump deps:** ([208d31e](https://github.com/rapid-build-ui/rb-input/commit/208d31e))
	* **rb-base** to v0.0.3
	* **rb-icon** to v0.0.8
	* **form-control** to v0.0.2



## [0.0.8](https://github.com/rapid-build-ui/rb-input/compare/v0.0.7...v0.0.8) (2018-09-08)


### Bug Fixes

* **icon-source:** get it working again ([18e5809](https://github.com/rapid-build-ui/rb-input/commit/18e5809))


### Dependencies

* **new dependency:** [@rapid-build-ui/form-control](https://github.com/rapid-build-ui/form-control) ([aae8c2a](https://github.com/rapid-build-ui/rb-input/commit/aae8c2a))



## [0.0.7](https://github.com/rapid-build-ui/rb-input/compare/v0.0.6...v0.0.7) (2018-09-05)


### Dependencies

* **rb-base:** bump to v0.0.2 ([2f16f1b](https://github.com/rapid-build-ui/rb-input/commit/2f16f1b))



## [0.0.6](https://github.com/rapid-build-ui/rb-input/compare/v0.0.5...v0.0.6) (2018-08-30)


### Features

* **validation:** add support for native form validation ([f6bce5a](https://github.com/rapid-build-ui/rb-input/commit/f6bce5a))


### Dependencies

* **rb-base:** replace deps lit-html and skatejs with @rapid-build-ui/rb-base and make corresponding updates ([cb28065](https://github.com/rapid-build-ui/rb-input/commit/cb28065))



## [0.0.5](https://github.com/rapid-build-ui/rb-input/compare/v0.0.4...v0.0.5) (2018-07-11)


Release contains:
* some refactoring
* bump deps: skatejs v5.2.1 and rb-icon v0.0.5



## [0.0.4](https://github.com/rapid-build-ui/rb-input/compare/v0.0.3...v0.0.4) (2018-07-08)


Release switches web components library Polymer 3 to [SkateJS](http://skatejs.netlify.com/) and view renderer [lit-html](https://polymer.github.io/lit-html/).



## 0.0.3 (2018-06-22)


### Bug Fixes

* **placeholder:** do not move label on blur ([7778e1a](https://github.com/rapid-build-ui/rb-input/commit/7778e1a))
* **spacing:** add dynamically space for subtext and label ([fa79873](https://github.com/rapid-build-ui/rb-input/commit/fa79873))
* **style:** error state color for label above ([4317515](https://github.com/rapid-build-ui/rb-input/commit/4317515))
* **type:** add default for type property ([c0f7768](https://github.com/rapid-build-ui/rb-input/commit/c0f7768))
* **validation:** add support for multiple params and promise ([0fcc2aa](https://github.com/rapid-build-ui/rb-input/commit/0fcc2aa))
* **validation:** fire validation only when dirty and blured once ([70a1a9c](https://github.com/rapid-build-ui/rb-input/commit/70a1a9c))


### Features

* **new api option:** inline ([4e0d07f](https://github.com/rapid-build-ui/rb-input/commit/4e0d07f))
* **api option:** add support for input type ([c06f976](https://github.com/rapid-build-ui/rb-input/commit/c06f976))
* **binding:** add support to notify when input value changes. ([c954481](https://github.com/rapid-build-ui/rb-input/commit/c954481))
* **bump:** dep [@rapid-build-ui](https://github.com/rapid-build-ui)/rb-icon to v0.0.3 ([2991bda](https://github.com/rapid-build-ui/rb-input/commit/2991bda))



