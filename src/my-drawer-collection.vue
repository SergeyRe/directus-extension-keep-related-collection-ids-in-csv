<script setup>
import { computed, ref, toRefs, unref, watch, toRef } from 'vue';
import { getEndpoint } from '@directus/utils';
import { useApi } from '@directus/extensions-sdk';
const api = useApi();
const props = defineProps(['collection', 'template', 'multiple', 'active', 'selection','fields'])

const emit = defineEmits(['input', 'update:active'])
const { collection, template, multiple } = toRefs(props);
const internalSelection = toRef(props, 'selection')
const { internalActive } = useActiveState();
const { save, cancel } = useActions();
const loading = ref(false);
const displayItem = ref([]);
const getDisplayItem = async () => {
	if (internalActive.value == false) {
		displayItem.value = [];
		return;
	}
	try {
		loading.value = true;

		const response = await api.get(getEndpoint(unref(collection)), {
			params: {
				fields: props.fields,

			},
		});

		displayItem.value = response.data.data


	} catch (error) {
		console.log(error);
	} finally {
		loading.value = false;
	}
}
function useActiveState() {
	const localActive = ref(false);

	const internalActive = computed({
		get() {
			return props.active === undefined ? localActive.value : props.active;
		},
		set(newActive) {
			localActive.value = newActive;
			emit('update:active', newActive);
		},
	});

	return { internalActive };
}
function useActions() {
	return { save, cancel };

	function save() {
		emit('input', unref(internalSelection));
		internalActive.value = false;
	}

	function cancel() {
		internalActive.value = false;
	}
}

watch(internalActive, getDisplayItem, { immediate: true });



const headers = [{ text: "Name", value: "name",width:500 ,description:'by field interface template'}]

const clickRow = (val) => {
	console.log(val.item)

	if (internalSelection.value.includes(val.item.id)) { internalSelection.value = internalSelection.value.filter(el => el != val.item.id) }
	else { internalSelection.value = props.multiple ? [...internalSelection.value, val.item.id] : [val.item.id] }
	
}
</script>
<template>
	<v-drawer v-model="internalActive" @cancel="cancel" :title="'Select item'">
		<template #actions>
			<v-button icon rounded @click="save">
				<v-icon name="check" />
			</v-button>
		</template>

		<v-table :headers=headers :items="displayItem" :showSelect="multiple ? 'multi' : 'one'" :modelValue="internalSelection"
			:selectionUseKeys='true' @click:row="clickRow" >
			<template v-for="header in headers" :key="header.value" #[`item.${header.value}`]="{ item }">

				<render-template :collection="collection" :item="item" :template="template" />
			</template>
		</v-table>

	</v-drawer>
</template>