(function(angular, undefined) {
  angular.module("fullstackApp.constants", [])

.constant("appConfig", {
	"default": {
		"userRoles": [
			"guest",
			"user",
			"admin"
		]
	}
})

;
})(angular);