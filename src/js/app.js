angular.module("vdi", [
	"ngRoute",
	"ngAnimate",
	"ngResource",
	"ngTouch",
	"ngSanitize"
])

.factory("db", [function(){
	var _ = Object.create(null, {
		host: {
			get: function(){
				return sessionStorage.$$$host || "";
			},
			set: function(val){
				sessionStorage.$$$host = val;
			}
		},
		port: {
			get: function(){
				return sessionStorage.$$$port || "8081";
			},
			set: function(val){
				sessionStorage.$$$port = val;
			}
		},
		username: {
			get: function(){
				return sessionStorage.$$$username || "";
			},
			set: function(val){
				sessionStorage.$$$username = val;
			}
		},
		password: {
			get: function(){
				return sessionStorage.$$$password || "";
			},
			set: function(val){
				sessionStorage.$$$password = val;
			}
		},
		isLogin: {
			get: function(){
				return sessionStorage.$$$isLogin === "true";
			},
			set: function(val){
				sessionStorage.$$$isLogin = val;
			}
		}
	});
	return _;
}])

.config(["$httpProvider", "$rootScopeProvider", function($httpProvider, $rootScopeProvider){
	$httpProvider.interceptors.push(function($q, db, $rootScope){
		return {
			request: function(config){
				if(config.isAPI){
					config.withCredentials = true;
					if(config.method.toUpperCase() === "POST"){
						var data = config.data;
						console.log(1111111111,data)
						if(data && data.host){
							db.host = data.host;
							db.username = data.username;
							db.password = data.password;
							data.host = undefined;
							delete data.host;
						}
					}
					config.url = "http://" + db.host + ":" + db.port + config.url;
				}
				return config;
			},
			requestError: function(reject){
				return $q.reject({
					msg: reject
				});
			},
			responseError: function(reject){
				return $q.reject({
					msg: reject
				});
			},
			response: function(res){
				if(/json/.test(res.headers("content-type"))){
					res.data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
					if(res.data.code){
						if(res.data.code === 17001){
							$rootScope.$broadcast("auth", false);
						}
						return $q.reject(res);
					}
				}
				return res;
			}
		};
	});
}])

.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider){
	$routeProvider
		.when("/home", {
			templateUrl: "tpl/home.html",
			controller: "HomeController"
		})
		.when("/home/confirm", {
			templateUrl: "tpl/confirm.html",
			controller: "HomeConfirmController"
		})
		.when("/host", {
			templateUrl: "tpl/host.html",
			controller: "HostController"
		})
		.when("/host/edit",{
			templateUrl:"tpl/host.edit.html",
			controller:"HostEditController"
		})
		.when("/host/confirm/reboot", {
			templateUrl: "tpl/confirm.html",
			controller: "HostConfirmRebootController"
		})
		.when("/host/confirm/shutdown", {
			templateUrl: "tpl/confirm.html",
			controller: "HostConfirmShutdownController"
		})
		.when("/classroom", {
			templateUrl: "tpl/classroom.html",
			controller: "ClassRoomController"
		})
		.when("/classroom/confirm/shutdown",{
			templateUrl:"tpl/confirm.html",
			controller: "ClassRoomConfirmShutdownController"
		})
		// .when("/classroom/confirm/reboot", {
		// 	templateUrl: "tpl/confirm.html",
		// 	controller: "ClassRoomConfirmRebootController"
		// })
		.when("/classroom/edit",{
			templateUrl:"tpl/classroom.edit.html",
			controller:"ClassroomEditController"
		})		
		.otherwise({
			redirectTo: "/home"
		});

	$locationProvider.html5Mode(false);
}])

.run(["$rootScope", "API", function($rootScope, API){
	//var ids = [];
	$rootScope.flag = false;
	$rootScope.classnetwrong = false;
	$rootScope.hostnetwrong = false;
	var classrows = {}, hostrows = {}
	$rootScope.classRooms = [];$rootScope.hosts = [];

	function getID(row){ return row.id; }

	$rootScope.getData = function(){
		API.classroom.list(function(res){
			//$rootScope.$broadcast("RowsUpdate", res.results);
			var nids = res.results.map(getID);
			res.results.forEach(function(row){
				var data = classrows[row.id];
				if(data){
					for(var n in row){
						data[n] = row[n];
					}
				}
				else{
					classrows[row.id] = row;
				}
			});
			Object.keys(classrows).forEach(function(id){
				if(nids.indexOf(id) === -1){
					classrows[id].__disabled = true;
				}
			});
			$rootScope.classRooms = Object.keys(classrows)
					.filter(function(row){ return row.__disabled !== true; })
					.map(function(id){
						return classrows[id];
					});
			// $rootScope.classRooms.splice(0, $rootScope.classRooms.length);
				// $rootScope.classRooms.push.apply(
				// 	$rootScope.classRooms,
				// 	Object.keys(classrows)
				// 		.filter(function(row){ return row.__disabled !== true; })
				// 		.map(function(id){
				// 			return classrows[id];
				// 		})
				// );
		},function(){
			$rootScope.classnetwrong = true;
			setTimeout($rootScope.getData, 30000);
		})

		API.server.list(function(res){
			//$rootScope.$broadcast("RowsUpdate", res.results);
			var nids = res.results.map(getID);
			res.results.forEach(function(row){
				var data = hostrows[row.id];
				if(data){
					for(var n in row){
						data[n] = row[n];
					}
				}
				else{
					hostrows[row.id] = row;
				}
			});
			Object.keys(hostrows).forEach(function(id){
				if(nids.indexOf(id) === -1){
					hostrows[id].__disabled = true;
				}
			});
			$rootScope.hosts = Object.keys(hostrows)
					.filter(function(row){ return row.__disabled !== true; })
					.map(function(id){
						return hostrows[id];
					}).sort(function(a,b){
						return a.is_node>b.is_node?-1:1;
					});
		},function(){
			$rootScope.hostnetwrong = true;
			setTimeout($rootScope.getData, 30000);
		})
		var t = setTimeout($rootScope.getData, 3000);
		if($rootScope.flag){
			clearTimeout(t);
		}
	}
	


}])


.directive('swip', ["$swipe", function ($swipe) {
	return {
		restrict: 'A',
		link: function (scope, element, attr) {
			var startX, endX;
			$swipe.bind(element, {
		          'start': function(coords) {
		            startX = coords.x;
		        	element.parent().parent().parent().find(".wrapper").removeClass("show")
		          },
		          'move': function(coords) {
		          	//console.log(111111111,coords)
		            // ...
		          },
		          'end': function(coords) {
		          	endX = coords.x;
		          	if(endX-startX < 0 && attr.isswip == "true"){
		          		element.parent().addClass("show");
		          	}
		            // ...
		          },
		          'cancel': function(coords) {
		          	console.log(3333333,coords)
		            // ...
		          }
		        });
		}

	};
}])
.controller("MainController", ["$rootScope", "$scope", "$location", "API", "db", function($rootScope, $scope, $location, API, db){
	$scope.isLogin = db.isLogin;
	$scope.address = db.host;
	$scope.userName = db.username;
	$scope.password = db.password;
	$scope.loginfalse = false;
	$scope.loading = false;

	console.log(this);

	$scope.$on("auth", function(target, data){
		console.log("auth", data);
		$scope.isLogin = data;
		db.isLogin = data;
	});
	$scope.doLogin = function(){
		var form = this.LoginForm;
		if(form.$valid){
			$scope.loading = true;
			$scope.loginfalse = false;
			API.login({
				host: form.address.$viewValue,
				username: form.username.$viewValue,
				password: form.password.$viewValue
			}).$promise
				.then(function(data){
					console.log();
					$scope.$root.$broadcast("auth", true);
					$scope.loginfalse = false;
					$scope.loading = false;
					$rootScope.flag = false;
					$rootScope.getData();
				})
				.catch(function(){
					$scope.loginfalse = true;
					$scope.loading = false;
					console.log(456, arguments);
				});
		}
	};
	$scope.doLogout = function(){
		// $scope.isLogin = db.isLogin;
		// $scope.address = db.host;
		// $scope.userName = db.username;
		// $scope.password = db.password;
		$scope.$root.$broadcast("auth", false);
		$rootScope.flag = true;
		sessionStorage.clear();
		window.location.reload();
	};
	$scope.path = function(){
		return 	$location.$$path;
	};
}]);
