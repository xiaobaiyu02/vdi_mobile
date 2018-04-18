angular.module("vdi")
.service("ConfirmData",function(){
	return {
		home:{},
		hostShut:[],
		hostReboot:[],
		classroomShut:[],
		classroomReboot:[]
	};
})
.controller("HomeConfirmController",["$scope","ConfirmData","API",function($scope,ConfirmData,API){
	$scope.title = "一键下班";$scope.netwrong = false;
	$scope.loading = false;
	var is_console = ConfirmData.home.console;
	var is_agent = ConfirmData.home.agent;
	var is_client = ConfirmData.home.client;
	
	if(!(is_console||is_agent||is_client)){
		location.replace("#/home");
	}
	else{
	if(is_console){
			$scope.message = "执行一键下班后，主控节点，所有计算节点和终端将被关闭，确认执行此操作吗？";
		}
	else{
			if(is_agent && !is_client){
				$scope.message = "执行一键下班后，所有计算节点将被关闭，确认执行此操作吗？";
			}else if(is_client && !is_agent){
				$scope.message = "执行一键下班后，所有终端将被关闭，确认执行此操作吗？";
			}else if(is_agent && is_client){
				$scope.message = "执行一键下班后，所有计算节点和终端将被关闭，确认执行此操作吗？";
			}
		}		
	}
	
	$scope.ok = function(){
		$scope.loading = true;
		if(is_console){
			API.shutAll(null,function(res){
				$scope.loading = false;
				sessionStorage.$$$isLogin = false;
				location.replace("#/home");
				location.reload();
			});
		}else{
			if(is_agent && !is_client){
				API.shutAllNode(null).$promise.then(function(res){
					$scope.loading = false;
					location.replace("#/home");
				}).catch(function(){
					$scope.netwrong = true;
				})
			}else if(is_client && !is_agent){
				API.shutAllTerminal(null).$promise.then(function(res){
					$scope.loading = false;
					location.replace("#/home");
				}).catch(function(){
					$scope.netwrong = true;
				})

			}else if(is_agent && is_client){
				API.shutAllTerminal(null).$promise.then(function(res){
					API.shutAllNode(null,function(res){
						$scope.loading = false;
						location.replace("#/home");
					})
				}).catch(function(){
					$scope.netwrong = true;
				})

			}
		}
		
	};
	$scope.cancel = function(){
		location.replace("#/home");
	};
}])
.controller("HostConfirmShutdownController",["$scope","ConfirmData","API",function($scope,ConfirmData,API){
	var hosts = ConfirmData.hostShut;
	var agent_ids = hosts.filter(function(h){
					return !h.is_node;
				}).map(function(h){ 
					return h.id;
				});
	var console_id = hosts.filter(function(h){ 
					return h.is_node;
				}).map(function(h){
					return h.id;
				});
	$scope.list = hosts.map(function(d){ return d.ip; });
	$scope.loading = false;$scope.netwrong = false;
	if(!hosts.length){
		location.replace("#/host");
	}else{
		$scope.title = "关闭主机";
		if(console_id.length != 0){
			$scope.message = "此操作将退出应用程序，确认关闭以下主机吗?";
		}
		else{
			$scope.message = "确认关闭以下主机吗?";
		}
		$scope.cancel = function(){
			location.replace("#/host");
		};
		$scope.ok = function(){
			$scope.loading = true;
			var postData = {
				agent_action: agent_ids.length ? "poweroff" : undefined,
				console_action: console_id ? "poweroff" : undefined,
				agent_ids: agent_ids,
				console: console_id
			};
			API.server.poweroff(postData).$promise.then(function(res){
				$scope.loading = false;
				if(console_id.length != 0){
					sessionStorage.$$$isLogin = false;
					location.replace("#/host");
					location.reload();
				}
				else{
					location.replace("#/host");
				}
				
			}).catch(function(){ $scope.netwrong = true; });
		}
	}
}])
.controller("HostConfirmRebootController",["$scope","ConfirmData","API",function($scope,ConfirmData,API){
	var hosts = ConfirmData.hostReboot;
	var agent_ids = hosts.filter(function(h){
					return !h.is_node;
				}).map(function(h){ 
					return h.id;
				});
	var console_id = hosts.filter(function(h){ 
					return h.is_node;
				}).map(function(h){
					return h.id;
				});
	$scope.list = hosts.map(function(d){ return d.ip; });
	$scope.loading = false;$scope.netwrong = false;
	if(!hosts.length){
		location.replace("#/host");
	}else{
		$scope.title = "重启";
		if(console_id.length != 0){
			$scope.message = "此操作将退出应用程序，确认重启以下主机吗?";
		}
		else{
			$scope.message = "确认重启以下主机吗?";
		}
		$scope.cancel = function(){
			location.replace("#/host");
		};
		$scope.ok = function(){
			$scope.loading = true;

			var postData = {
				agent_action: agent_ids.length ? "reboot" : undefined,
				console_action: console_id ? "reboot" : undefined,
				agent_ids: agent_ids,
				console: console_id
			};
			API.server.reboot(postData).$promise.then(function(res){
				$scope.loading = false;
				if(console_id.length != 0){
					sessionStorage.$$$isLogin = false;
					location.replace("#/host");
					location.reload();
				}
				else{
					location.replace("#/host");
				}
			}).catch(function(){ $scope.netwrong = true; });
		}
	}
}])
.controller("ClassRoomConfirmShutdownController",["$scope","ConfirmData","API", function($scope,ConfirmData,API){
	$scope.list = ConfirmData.classroomShut.map(function(d){ return d.name; });
	$scope.list_id = ConfirmData.classroomShut.map(function(d){ return d.id; });
	$scope.loading = false;$scope.netwrong = false;
	if(!$scope.list.length){
		location.replace("#/classroom");
	}else{
		$scope.title = "关机";
		$scope.message = "确认关闭以下教室的全部终端吗？ ";
		$scope.cancel = function(){
			location.replace("#/classroom");
		};
		$scope.ok = function(){
			$scope.loading = true;
			console.log(ConfirmData.classroomShut)

			API.classroom.poweroff({
				"terminal_action": "poweroff",
				"classroom_ids": this.list_id
			}).$promise
				.then(function(res){					
					// ConfirmData.classroomShut.forEach(function(item){
					// 	item.total_running_terminals = 0;
					// })
					$scope.loading = false;
					location.replace("#/classroom");
				})
				.catch(function(){
					$scope.netwrong = true;
				})
			
		};
	}
}])
// .controller("ClassRoomConfirmRebootController",["$scope","ConfirmData",function($scope,ConfirmData){
// 	$scope.list = ConfirmData.classroomReboot.map(function(d){ return d.name; });
// 	if(!$scope.list.length){
// 		location.replace("#/classroom");
// 	}else{
// 		$scope.title = "重启";
// 		$scope.message = "确认重启以下教室的全部终端吗？ ";
// 		$scope.cancel = function(){
// 			location.replace("#/classroom");
// 		};
// 	}
// }]);
