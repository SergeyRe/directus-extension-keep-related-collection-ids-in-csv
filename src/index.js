import InterfaceComponent from './interface.vue';

export default {
	id: 'collection-ids-csv',
	name: 'Collection ids to csv',
	icon: 'box',
	description: 'keep related collection ids in csv field (Multivalue)',
	component: InterfaceComponent,
	types: ['csv'],
	options: [
		{
			field: 'selectedCollection',
			type: 'string',
			name: '$t:collection',
			meta: {
				required: true,
				interface: 'system-collection',
				options: {
					includeSystem: true,
					includeSingleton: false,
				},
				width: 'half',
			},
		},
		{
			field: 'template',
			name: '$t:display_template',
			type: 'string',
			meta: {
				interface: 'system-display-template',
				width: 'full',
				options: {
					collectionField: 'selectedCollection',
					placeholder: '{{ field }}',
				},
			},
		},
		{
			field:'multi',
			name:'Multivalue possible',
			schema: {
				default_value: false,
			},
			meta:{
				interface:'boolean',
				options: {
					label: 'enable multivalue',
				}
			}
		}
	],
};
