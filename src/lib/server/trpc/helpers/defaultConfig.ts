import type { configSchemaType } from '$lib/schema/configSchema';

export const defaultConfig = {
	sources: {
		default: {
			title: 'Default',
			type: 'Manual',
			autoDelete: false,
			autoUpdate: false,
			enabled: true,
			parameters: {
				ip: '127.0.0.1'
			},
			routerTemplate: 'defaultConfigRouterTemplate',
			serviceTemplate: 'defaultConfigServiceTemplate'
		}
	},
	routerTemplates: {
		defaultConfigRouterTemplate: {
			title: 'Default Router Template',
			template:
				'{"entrypoints" :["websecure"],"middlewares" : ["basic-auth@docker"], "service" : "{{TITLE.serviceName}}", "rule" : "Host(`{{SOURCE.ip}}:{{HOST.port}}`)", "tls" : {"certresolver" : "certResolver"}}'
		}
	},
	serviceTemplates: {
		defaultConfigServiceTemplate: {
			title: 'Default Service Template',
			template:
				'{"loadBalancer" : { "servers" : [{ "url" : "https://{{HOST.url}}" }], "passHostHeader": "false" }}'
		}
	}
} satisfies configSchemaType;
