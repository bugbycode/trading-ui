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
		default: '1D',
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
		
		chartWidget.activeChart().createMultipointShape(
			[{"price":72144,"time":1717718400},{"price":53329.5,"time":1720137600},{"price":70081,"time":1722211200},{"price":48888,"time":1722816000},{"price":68749,"time":1729382400}],
			{ 
				shape:'xabcd_pattern',
				overrides: {"color":"#2962FF","textcolor":"#ffffff","fillBackground":true,"backgroundColor":"#2962FF","fontsize":12,"bold":false,"italic":false,"transparency":85,"linewidth":1,"visible":true,"frozen":false,"intervalsVisibilities":{"ticks":true,"seconds":true,"secondsFrom":1,"secondsTo":59,"minutes":true,"minutesFrom":1,"minutesTo":59,"hours":true,"hoursFrom":1,"hoursTo":24,"days":true,"daysFrom":1,"daysTo":366,"weeks":true,"weeksFrom":1,"weeksTo":52,"months":true,"monthsFrom":1,"monthsTo":12,"ranges":true},"title":""}
			}
		);
		chartWidget.activeChart().createMultipointShape(
			[{"price":73881.4,"time":1710374400}],
			{
				shape:'horizontal_ray',
			}
		)
	});

	chartWidget.subscribe('drawing', (event) => {
		console.log(event.value);
		/*var allShapes = chartWidget.activeChart().getAllShapes();
		for(var index = 0;index < allShapes.length;index++){
			var shape = chartWidget.activeChart().getShapeById(allShapes[index].id);
			console.log(shape.id);
			console.log(JSON.stringify(shape.getProperties()));
			console.log(JSON.stringify(shape.getPoints()))
		}*/
	});

	chartWidget.subscribe('drawing_event', (id, type) => {
		if(type == 'create'){
			console.log(chartWidget.activeChart().symbol())
			var shape = chartWidget.activeChart().getShapeById(id);
			console.log(shape._source.toolname);
			console.log(JSON.stringify(shape.getProperties()));
			console.log(JSON.stringify(shape.getPoints()))
			console.log(shape)
		}
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
	height: calc(100vh - 63px);
}
</style>
