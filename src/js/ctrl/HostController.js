angular.module("vdi")
.controller("HostController", ["$rootScope", "$scope","ConfirmData", function($rootScope,$scope,ConfirmData){
	if(!$rootScope.hosts.length){
		$rootScope.getData();
	}
	$scope.edit = function(){
		location.href = "#/host/edit";
	};
	//单项删除重启操作
	$scope.shutdown = function(item){
		ConfirmData.hostShut = [item];
		location.replace("#/host/confirm/shutdown");
	};
	$scope.reboot = function(item){
		ConfirmData.hostReboot = [item];
		location.replace("#/host/confirm/reboot");
	}
}])
.controller("HostEditController",["$rootScope","$scope","ConfirmData",function($rootScope,$scope,ConfirmData){
	if($scope.hosts.length){
		$scope.hosts = $rootScope.hosts.map(function(h){
			h._selected = false;
			return h;
		}).filter(function(h){
			return h.is_up;
		});
	}else{
		location.replace("#/host/");
	}

	var filterHost = function(){
		var rows = $scope.hosts.filter(function(h){ return h._selected === true;});
		return rows;
	};
	$scope.btnName = function(){
		return  $scope.checked ? "全不选":"全选";
	};
	$scope.cancel = function(){
		location.replace("#/host");
	}
	$scope.checkOne = function(){
		if($scope.hosts){
			return $scope.hosts.some(function(item){ return item._selected; });
		}
	};
	$scope.selectAll = function(bool){
		if(bool){
			$scope.hosts.map(function(h){ 
				h._selected = true;
				return h;
			});
		}else{
			$scope.hosts.map(function(h){ 
				h._selected = false ;
				return h;
			});
		}
	};
	$scope.consoleSelect = function(bool){
		if(bool){
			$scope.hosts.map(function(h){ 
				h._selected = true;
				return h;
			});
		}
	};
	$scope.agentSelect = function(bool){
		var consoleHost = $scope.hosts.filter(function(h){ return h.is_node })[0];
		if(consoleHost._selected && !bool){
			consoleHost._selected =  false;
		}
	};
	//多项删除重启操作
	$scope.shutdown = function(){
		ConfirmData.hostShut = filterHost();
		location.replace("#/host/confirm/shutdown");
	};
	
	$scope.reboot = function(){
		ConfirmData.hostReboot = filterHost();
		location.replace("#/host/confirm/reboot");
	};

	
}]);
