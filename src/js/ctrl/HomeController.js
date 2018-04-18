angular.module("vdi")
.controller("HomeController", function($scope, db, $interval, ConfirmData){
	$scope.console = true;
	$scope.agent = true;
	$scope.client = true;
	$scope.selectAll =function(){
		$scope.agent = true;
		$scope.client = true;
	}
	$scope.shutdownAll = function(){
		ConfirmData.home = {
			console:$scope.console,
			agent: $scope.agent,
			client: $scope.client
		};
		location.replace("#/home/confirm");

	};
});