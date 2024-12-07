<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import { widget } from './../../../public/charting_library';
import Datafeed from './../../datafeeds/binance_datafeed.js';
import axios from './../../axios';
import { ElLoading } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter();

var subscribe_status = false;

//订阅绘图事件回调函数
var subscribe_drawing_func_call = (event) => {
	//console.log(subscribe_status);
	//console.log(`drawing type as :${event.value}`);
}
var subscribe_drawing_event_func_call = (id, type) => {
	//console.log(subscribe_status);
	axios.get('/user/userInfo').then(function(result){
		if(!(result && result.username)){
			router.push('/login')
		}
	}).catch(function(e){
		router.push('/login');
	})
	//console.log(`id:${id}, type:${type}`);

	if(type == 'create' && subscribe_status){
		Datafeed.saveShapeInfo(id);
	} else if(type == 'remove' && subscribe_status){
		Datafeed.removeShapeInfo(id);
	} else if((type == 'properties_changed' || type == 'points_changed') && subscribe_status){
		Datafeed.changeShapeInfo(id);
	}
}

var last_bar_end_time = 0;

//取消订阅
const unsubscribe_event = (time) => {
	subscribe_status = false;
}

//订阅事件
const subscribe_event = (time) => {
	subscribe_status = true;
	last_bar_end_time = time;
}

Datafeed.init_subscribe_event_func(subscribe_event,unsubscribe_event);

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
		default: window.location.pathname + '/charting_library/',
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
		default: {
			//"volume.volume.color.0": "#FF0000", // 下跌成交量颜色
			//"volume.volume.color.1": "#1aff24", // 上涨成交量颜色
			//"volume.volume.transparency": 0,   // 成交量透明度
			//"volume.volume ma.color": "#0000FF", // 成交量均线颜色
			//"volume.volume ma.transparency": 30, // 成交量均线透明度
			"volume.show_as_panel": true,        // 将成交量显示在单独的面板
			//"mainSeriesProperties.candleStyle.transparency": 0,
		}
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
		locale: 'en',
		//locale: getLanguageFromURL() || 'en',
		//disabled_features: ['use_localstorage_for_settings'],
		//enabled_features: ['study_templates'],
		//charts_storage_url: props.chartsStorageUrl,
		//charts_storage_api_version: props.chartsStorageApiVersion,
		//client_id: props.clientId,
		//user_id: props.userId,
		fullscreen: props.fullscreen,
		autosize: props.autosize,
		time_frames: props.time_frames,
		timezone: "Asia/Shanghai",
		studies_overrides: props.studiesOverrides,
	};

	Datafeed.initPairsInfo(function(cfg){
		var global_symbol = cfg.symbol;
		var global_interval = cfg.inerval;
		//console.log(cfg);
		if(cfg){
			widgetOptions.symbol = global_symbol;
			widgetOptions.interval = global_interval;
		}

		var loading = ElLoading.service({
			lock: true,
			text: 'Loading',
			background: 'rgba(0, 0, 0, 0.7)',
		})

		chartWidget = new widget(widgetOptions);

		chartWidget.onChartReady(() => {
			//console.log('on chart ready.')
			/*
			chartWidget.chart().getSeries().setChartStyleProperties(1, {
				
				upColor: '#1aff24',
				borderUpColor: '#1aff24',
				wickUpColor: '#1aff24',
				downColor: '#FF0000',
				borderDownColor: '#FF0000',
				wickDownColor: '#FF0000',
				transparency: 0,
			});*/

			var chart = chartWidget.activeChart();
			chart.getAllStudies().forEach(study => {
				//console.log(study.name)
				if (study.name === 'Volume') {
					chart.removeEntity(study.id);
				}
			});

			chart.createStudy('Volume', false, true);

			if(loading) {
				loading.close();
			}
			//console.log(chartWidget)
			Datafeed.initChartWidget(chartWidget);

			//在图表添加绘图时触发的事件
			chartWidget.subscribe('drawing', subscribe_drawing_func_call);

			//创建、修改、删除绘图时触发的事件
			chartWidget.subscribe('drawing_event', subscribe_drawing_event_func_call);

			//变更交易对
			chart.onSymbolChanged().subscribe(null, () => {
				//console.log('The symbol is changed');
				subscribe_status = false;
				//console.log(chart.interval());
				global_symbol = chart.symbol();
				Datafeed.saveConfig(global_symbol,global_interval);
			});
			//变更时间级别
			chart.onIntervalChanged().subscribe(null, (interval, timeframeObj) =>{
				//console.log('The Interval is changed');
				//console.log(chart.symbol());
				// 获取当前时间级别
				//console.log(Datafeed.inervalData()[interval]);
				subscribe_status = false;
				global_interval = interval;
				Datafeed.saveConfig(global_symbol,global_interval);
			})
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
