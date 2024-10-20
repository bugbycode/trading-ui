<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import { widget } from './../../../public/charting_library';
//import { UDFCompatibleDatafeed } from './../../../public/datafeeds/udf/src/udf-compatible-datafeed';
import Datafeed from './../../datafeeds/binance_datafeed.js';
function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null
		? null
		: decodeURIComponent(results[1].replace(/\+/g, ' '));
}

const props = defineProps({
	symbol: {
		default: 'BTCUSDT',
		type: String,
	},
	interval: {
		default: '',
		type: String,
	},
	datafeedUrl: {
		default: 'https://demo_feed.tradingview.com',
		type: String,
	},
	libraryPath: {
		default: '/charting_library/',
		type: String,
	},
	chartsStorageUrl: {
		default: 'https://saveload.tradingview.com',
		type: String,
	},
	chartsStorageApiVersion: {
		default: '1.1',
		type: String,
	},
	clientId: {
		default: 'tradingview.com',
		type: String,
	},
	userId: {
		default: 'public_user_id',
		type: String,
	},
	fullscreen: {
		default: false,
		type: Boolean,
	},
	autosize: {
		default: true,
		type: Boolean,
	},
	studiesOverrides: {
		type: Object,
	},
	time_frames: {
		type: Array,
		default: [
			{ text: "1d", resolution: "15", description: "1day", title: "1D"},
			{ text: "5d", resolution: "60", description: "5day", title: "5D"},
			{ text: "1000y", resolution: "1W", description: "All", title: "All" },
		]
	}
});

const chartContainer = ref();
let chartWidget;

onMounted(() => {
	const widgetOptions = {
		symbol: props.symbol,
		datafeed: Datafeed, //new UDFCompatibleDatafeed(props.datafeedUrl),
		interval: props.interval,
		container: chartContainer.value,
		library_path: props.libraryPath,

		locale: getLanguageFromURL() || 'en',
		disabled_features: ['use_localstorage_for_settings'],
		enabled_features: ['study_templates'],
		charts_storage_url: props.chartsStorageUrl,
		charts_storage_api_version: props.chartsStorageApiVersion,
		client_id: props.clientId,
		user_id: props.userId,
		fullscreen: props.fullscreen,
		autosize: props.autosize,
		studies_overrides: props.studiesOverrides,
		time_frames: props.time_frames,
	};
	chartWidget = new widget(widgetOptions);
	
	chartWidget.onChartReady(() => {
		chartWidget.headerReady().then(() => {
			const button = chartWidget.createButton();

			button.setAttribute('title', 'Click to show a notification popup');
			button.classList.add('apply-common-tooltip');

			button.addEventListener('click', () =>
				chartWidget.showNoticeDialog({
					title: 'Notification',
					body: 'TradingView Charting Library API works correctly',
					callback: () => {
						// eslint-disable-next-line no-console
						console.log('Noticed!');
					},
				})
			);

			button.innerHTML = 'Check API';
		});
	});
});

onUnmounted(() => {
	if (chartWidget !== null) {
		chartWidget.remove();
		chartWidget = null;
	}
});
</script>

<template>
	<div class="TVChartContainer" ref="chartContainer" />
</template>

<style scoped>
.TVChartContainer {
	height: calc(100vh - 80px);
}
</style>
