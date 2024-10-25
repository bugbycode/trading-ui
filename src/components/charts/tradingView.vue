<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import { widget } from './../../../public/charting_library';
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
		default: '60',
		type: String,
	},
	/*datafeedUrl: {
		default: 'https://demo_feed.tradingview.com',
		type: String,
	},*/
	libraryPath: {
		default: '/web/charting_library/',
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
			{ text: "1w", resolution: "240", description: "7day", title: "1W"},
			{ text: "30d", resolution: "240", description: "30day", title: "1M"},
			{ text: "365y", resolution: "1d", description: "All", title: "All" },
		]
	}
});

const chartContainer = ref();
let chartWidget;

onMounted(() => {
	const widgetOptions = {
		theme: "Dark",
		symbol: props.symbol,
		datafeed: Datafeed, //new UDFCompatibleDatafeed(props.datafeedUrl),
		interval: props.interval,
		container: chartContainer.value,
		library_path: props.libraryPath,
		volume: true,
		locale: getLanguageFromURL() || 'en',
		//disabled_features: ['use_localstorage_for_settings'],
		//enabled_features: ['study_templates'],
		//charts_storage_url: props.chartsStorageUrl,
		charts_storage_api_version: props.chartsStorageApiVersion,
		client_id: props.clientId,
		user_id: props.userId,
		fullscreen: props.fullscreen,
		autosize: props.autosize,
		time_frames: props.time_frames,
		timezone: "Asia/Shanghai",
		studies_overrides: props.studiesOverrides,
	};

	Datafeed.initPairsInfo(function(cfg){
		//console.log(cfg);
		if(cfg){
			widgetOptions.symbol = cfg.symbol;
			widgetOptions.interval = cfg.inerval;
		}
		chartWidget = new widget(widgetOptions);

		chartWidget.onChartReady(() => {
			console.log('on chart ready.')
			
			Datafeed.initChartWidget(chartWidget);
			//在图表添加绘图时触发的事件
			chartWidget.subscribe('drawing', (event) => {
				console.log(`drawing type as :${event.value}`);
			});
			//创建、修改、删除绘图时触发的事件
			chartWidget.subscribe('drawing_event', (id, type) => {
				console.log(`id:${id}, type:${type}`);
				if(type == 'create'){
					Datafeed.saveShapeInfo(id);
				} else if(type == 'remove'){
					Datafeed.removeShapeInfo(id);
				} else if(type == 'properties_changed' || type == 'points_changed'){
					Datafeed.changeShapeInfo(id);
				}
			});
		});
	});

});

onUnmounted(() => {
	if (chartWidget) {
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
	height: calc(100vh - 63px);
}
.handStyle{
    cursor: pointer
}
</style>
