<script setup>
import { computed, ref, toRefs, unref, watch } from 'vue';
import { useApi } from '@directus/extensions-sdk';
const api = useApi();
const emit = defineEmits(['input'])
import { getEndpoint ,getFieldsFromTemplate } from '@directus/utils';
import MyDrawerCollection from './my-drawer-collection.vue';
const props = defineProps(['selectedCollection', 'value', 'template', 'multi'])
const { selectedCollection, template, multi } = toRefs(props);
const selectDrawerOpen = ref(false)
const loading = ref(false);
const displayItem = ref([]);
const fields =  [...getFieldsFromTemplate(props.template),'id']

const value = computed({
	get: () => props.value,
	set: (val) => {
		emit('input', val);
	},
});
const getDisplayItem = async () => {
	if (!value.value || value.value.length == 0) {
		displayItem.value = [];
		return;
	}

	try {
		loading.value = true;

		const response = await api.get(getEndpoint(unref(selectedCollection)), {
			params: {
				fields: fields,
				filter: { id: { _in: value.value } },
			},
		});

		displayItem.value = response.data.data

	} catch (error) {
		console.log(error);
	} finally {
		loading.value = false;
	}
}
watch(value, getDisplayItem, { immediate: true });
const onSelection = (array) => {
	selectDrawerOpen.value = false;
	value.value = array
}

const remove=(item)=>{
	value.value=value.value.filter(el=>el!=item.id)
	
}








</script>
<template>
	<v-skeleton-loader v-if="loading" type="input" />
	<v-list-item v-if="!displayItem || displayItem.length == 0" :block="true" />
	<v-list-item v-for="item in displayItem" :block="true">

		<render-template :collection="selectedCollection" :item="item" :template="template" />
		<div class="spacer" />
		<VIcon name="delete" @click="remove(item)" :clickable="true"/>

	</v-list-item>
	<div class="actions list" >
	<v-button v-if="multi || (displayItem.length == 0 && !loading)" @click="selectDrawerOpen = true">
		Add new value
	</v-button>
	</div>
	<my-drawer-collection v-model:active="selectDrawerOpen" :collection="selectedCollection" :selection="value ?? []" :multiple="multi" :template="template"
		:fields=fields @input="onSelection" />

</template>
<style>
.actions {	
	&.list {
		margin-top: 8px;
	}
}
</style>