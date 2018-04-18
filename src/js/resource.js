angular.module("vdi")

.factory("API", ["$resource", "db", "$rootScope", function($resource, db, $rootScope){
	window.$API = $resource(null, null, {
		login: {
			url: "/login",
			isAPI: true,
			method: "POST",
			transformRequest: function(data){
				return JSON.stringify(data);
			},
			transformResponse: function(res){
				return res;
			}
		},
		logout: {
			url: "/logout",
			isAPI: true,
			method: "POST"
		},
		version: {
			url: "/thor/version",
			isAPI: true,
			method: "GET"
		},
		shutAll: {
			url: "/thor/mobile",
			isAPI: true,
			method: "POST",
			transformRequest: function(){
				return JSON.stringify({
					console_action: "poweroff",
					console: [-1]
				});
			}
		},
		shutAllNode: {
			url: "/thor/mobile",
			isAPI: true,
			method: "POST",
			transformRequest: function(){
				return JSON.stringify({
					agent_action: "poweroff",
					agent_ids: [-1]
				});
			}
		},
		shutAllTerminal: {
			url: "/thor/mobile",
			isAPI: true,
			method: "POST",
			transformRequest: function(){
				return JSON.stringify({
					terminal_action: "poweroff",
					classroom_ids: [-1]
				});
			}
		}
	});
	$API.server = $resource("/thor/mobile", null, {
		list: {
			isAPI: true,
			params: {
				entity: "server"
			},
			method: "GET"
		},
		poweroff: {
			/*
			params: {
				agent_action: "poweroff",
				console_action: "poweroff",//, reboot 
				agent_ids: "",// 即 agent 服务器的id 
				console: ""// 即 console 服务器的id
			},
			*/
			isAPI: true,
			method: "POST"
		},
		reboot: {
			/*
			params: {
				agent_action: "reboot",
				console_action: "reboot",//, reboot 
				agent_ids: "",// 即 agent 服务器的id 
				console: ""// 即 console 服务器的id
			},
			*/
			isAPI: true,
			method: "POST"
		}
	});
	$API.classroom = $resource("/thor/mobile", null, {
		list: {
			isAPI: true,
			method: "GET",
			isArray: false,
			params: {
				entity: "classroom"
			}
		},
		poweroff: {
			/*
			params: {
				"terminal_action": "poweroff"
				"classroom_ids": [] 即 教室id 
			},
			*/
			isAPI: true,
			method: "POST",
			isArray: false
		}
	});
	return $API;
}]);

/*



H
hanxiaoxiang 今天 13:52
查询 服务端 http://10.1.41.188:8081/thor/mobile?entity=server

查询 教室 http://10.1.41.188:8081/thor/mobile?entity=pool

post 请求http://10.1.41.188:8081/thor/mobile

参数： 
agent_action : 值：poweroff, reboot 
console_action : 值：poweroff, reboot 
terminal_action : poweroff
agent_ids, 即 agent 服务器的id 
classroom_ids 即 教室id 
console 即 console 服务器的id
*/