angular.module("vdi")
.controller("ClassRoomController", ["$rootScope", "$scope", "ConfirmData", function($rootScope, $scope, ConfirmData){
	if(!$rootScope.classRooms.length){
		$rootScope.getData();
	}
	$scope.replace = function(){
		location.href = "#/classroom/edit";
	};
	$scope.shutdown = function(item){
		ConfirmData.classroomShut = [item];
		location.replace("#/classroom/confirm/shutdown");
	};
	$scope.reboot = function(item){
		ConfirmData.classroomReboot = [item];
		location.replace("#/classroom/confirm/reboot");
	};
}])

.controller("ClassroomEditController", ["$rootScope","$scope","ConfirmData",function($rootScope,$scope,ConfirmData){
		if($scope.classRooms.length){
			$scope.classRooms = $rootScope.classRooms.map(function(c){
				c._selected = false;
				return c;
			}).filter(function(c){
				return c.total_running_terminals;
			});
		}
		else{
			location.replace("#/classroom/");
		}
		

	var filterclassRoom = function(){
		var rows = $scope.classRooms.filter(function(h){ 
			return h._selected === true;
		});
		return rows;
	};	
	$scope.shutdown = function(){
		var rows = filterclassRoom();
		ConfirmData.classroomShut = rows;
		location.replace("#/classroom/confirm/shutdown");
	};
	// $scope.reboot = function(){
	// 	var rows = filterclassRoom();
	// 	ConfirmData.classroomReboot = rows;
	// 	location.replace("#/classroom/confirm/reboot");
	// };
	$scope.btnName = function(){
		return  $scope.checked ? "全不选":"全选";
	};
	$scope.selectAll = function(bool){
		if(bool){
			$scope.classRooms .map(function(h){ 
				h._selected = true;
				return h;
			});
		}else{
			$scope.classRooms .map(function(h){ 
				h._selected = false ;
				return h;
			});
		}
	};
	$scope.selectOne = function(){
		var hosts = filterclassRoom();
		var len = $scope.classRooms.length;
		$scope.checked = hosts.length === len;
	};
}]);
