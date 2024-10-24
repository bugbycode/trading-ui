import axios_ from 'axios';
import axios from './../axios'
import { generateSymbol, parseFullSymbol } from './helpers.js';
import { ElMessage,ElLoading } from 'element-plus'
//binance klines http url https://fapi.binance.com
const baseHttpUrl = 'https://fapi.binance.com';
const baseWebSocketUrl = 'wss://fstream.binance.com';
//当前已订阅的交易对
var clientMap = new Map();
//交易所、交易对、时间级别等配置信息
const configurationData = {
    supports_search: true,
    supports_group_request: false,
    supports_marks: true,
    supports_timescale_marks: true,
    supports_time: true,
    exchanges: [
        { value: "Binance", name: "Binance", desc: "Binance" },
    ],
    symbols_types: [
        { name: "Crypto", value: "futures" },
    ],
    supported_resolutions: ["1","5","15","60","240","1D", "1W", "1M",]
}

const inervalData = {
    "1":"1m",
    "5":"5m",
    "15":"15m",
    "60":"1H",
    "240":"4H",
    "1D":"1D",
    "1W":"1W",
    "1M":"1M",
};

var coinInfo = [
    'BTCUSDT',
    'ETHUSDT',
    'BNBUSDT',
    'ZECUSDT',
    'DOGEUSDT',
    'SAGAUSDT',
    '1000PEPEUSDT'
]

const shapeType = new Map();
shapeType.set('LineToolTrendLine','trend_line');//趋势线
shapeType.set('LineToolRay','ray');//射线
shapeType.set('LineToolParallelChannel','parallel_channel')//平行通道
shapeType.set('LineToolHorzRay','horizontal_ray')//水平射线
shapeType.set('LineToolTrianglePattern','triangle_pattern')//三角形
shapeType.set('LineToolRectangle','rectangle');//矩形
shapeType.set('LineToolFibRetracement','fib_retracement')//斐波那契回撤
shapeType.set('LineTool5PointsPattern','xabcd_pattern')//XABCD
shapeType.set('LineToolRiskRewardLong','long_position')//做多交易计划
shapeType.set('LineToolRiskRewardShort','short_position')//做空交易计划
shapeType.set('LineToolFixedRangeVolumeProfile','fixed_range_volume_profile')//成交量密集分布

var widget = null;
var shapeMap = new Map();
//画图
const drowBySymbol = (symbol,time) => {
    var shapeArr = shapeMap.get(symbol);
	//console.log(`drow : ${symbol}`)
    //console.log(shapeArr)
	if(shapeArr){
		for(var index = 0;index < shapeArr.length;index++){
			var shapeInfo = shapeArr[index];
			var shape_type = shapeType.get(shapeInfo.shape);
			if(shape_type){
				if(shapeInfo.draw_status == 0 && time <= shapeInfo.points[0].time && widget){
					var entityId = widget.activeChart().createMultipointShape(
						shapeInfo.points,
						{
							shape: shapeType.get(shapeInfo.shape),
							overrides: shapeInfo.properties,
						}
					);
					if(entityId){
						shapeInfo.draw_status = 1;
						shapeInfo.draw_id = entityId
					}
				}
			}
		}
	}
}

export default {

    drowBySymbol: drowBySymbol,
    //获取服务端配置的交易对
    initPairsInfo: async(call) => {
        
        var cfg = await axios.get('/tradingview/getConfig');

        //获取币安合约所有交易对
        axios_.get(baseHttpUrl + '/fapi/v1/exchangeInfo').then(function(result){
            if(result && result.status == 200){
                coinInfo = [];
                var symbols = result.data.symbols;
                for(var index = 0;index < symbols.length;index++){
                    if(symbols[index].contractType == 'PERPETUAL' && symbols[index].status == 'TRADING'){
                        //console.log(JSON.stringify(symbols[index]))
                        coinInfo.push(symbols[index].symbol)
                    }
                }
            }
        }).catch(function(e){
            console.log(e);
        });
        
        //初始化已存储的图纸
        axios.get('/shape/getAllShapeInfo').then(function(all_shape){
            if(all_shape && all_shape.length > 0 && all_shape[0].symbol){
                for(var index = 0;index < all_shape.length;index++){
                    var shapeInfo = all_shape[index];
                    var shapeArr = shapeMap.get(shapeInfo.symbol);
                    if(shapeArr == undefined){
                        shapeArr = [];
                        shapeMap.set(shapeInfo.symbol,shapeArr);
                    }
                    shapeArr.push({
                        _id: shapeInfo.id,//服务端存储的数据库唯一标识
                        draw_id: '',//界面绘图生成的id
                        owner: shapeInfo.owner,
                        symbol: shapeInfo.symbol,
                        shape: shapeInfo.shape,
                        points: JSON.parse(shapeInfo.points),
                        properties: JSON.parse(shapeInfo.properties),
                        draw_status: 0,//是否已在界面绘图 0：未绘图 1：已绘图
                    })
                }
            };

            if(call){
                call(cfg);
            }

        }).catch(function(e){
            console.log(e);
            call(cfg);
        });
        
    },
    initChartWidget: (chartWidget)=>{
        widget = chartWidget;
    },
    //保存图纸
    saveShapeInfo: async(id) => {
        //图纸实例
        var iLineDataSourceApi = widget.activeChart().getShapeById(id);
        //绘图属性
        var properties = iLineDataSourceApi.getProperties();
        //绘图坐标 [{price:double,time:Long}]
        var points = iLineDataSourceApi.getPoints();
        console.log(iLineDataSourceApi)
        var shape_type = shapeType.get(iLineDataSourceApi._source.toolname);
        if(shape_type){
            var jsonData = {
                draw_id: id,
                symbol: widget.activeChart().symbol(),
                shape: iLineDataSourceApi._source.toolname,
                points: JSON.stringify(points),
                properties: JSON.stringify(properties),
                draw_status: 1,
            }
            var result = await axios.post('/shape/saveShapeInfo',jsonData);
            jsonData._id = result.id;
            //console.log(result);
            var shapeArray = shapeMap.get(jsonData.symbol);
            if(shapeArray==undefined){
                shapeArray = [];
            }
            shapeArray.push(jsonData);

        }
    },
    //删除图纸
    removeShapeInfo: (id) => {
        var symbol = widget.activeChart().symbol();
        var shapeArray = shapeMap.get(symbol);
        if(shapeArray){
            for(var index = 0;index < shapeArray.length;index++){
                var shapeInfo = shapeArray[index];
                if(shapeInfo.draw_id == id){
                    axios.post('/shape/deleteShapeInfo/'+ shapeInfo._id);
                }
            }
        }
    },
    //修改图纸
    changeShapeInfo: (id) => {
        var symbol = widget.activeChart().symbol();
        //图纸实例
        var iLineDataSourceApi = widget.activeChart().getShapeById(id);
        //绘图属性
        var properties = iLineDataSourceApi.getProperties();
        //绘图坐标 [{price:double,time:Long}]
        var points = iLineDataSourceApi.getPoints();
        //已存储的
        var shapeArray = shapeMap.get(symbol);
        if(shapeArray){
            for(var index = 0;index < shapeArray.length;index++){
                var shapeInfo = shapeArray[index];
                if(shapeInfo.draw_id == id && shapeInfo._id != ''){
                    shapeInfo.id = shapeInfo._id;
                    shapeInfo.properties = JSON.stringify(properties);
                    shapeInfo.points = JSON.stringify(points);
                    axios.post('/shape/updateShapeInfo',shapeInfo).then(function(result){
                        console.log(result)
                    }).catch(function(e){
                        console.log(e);
                    });
                }
            }
        }
    },
    //图表初始化时调用该函数
    onReady: (callback) => {
        console.log('[onReady]: Method call');
        setTimeout(() => callback(configurationData));
    },
    //处理用户搜索交易对信息
    searchSymbols: async ( userInput, exchange, symbolType, onResultReadyCallback) => {
        console.log('[searchSymbols]: Method call');
        var dataArr = [];
        for(var index = 0;index < coinInfo.length;index++){
            var pair = coinInfo[index];
            if(pair.toLowerCase().indexOf(userInput.toLowerCase()) > -1 || userInput == ''){
                dataArr.push(
                    {
                        symbol: pair,          // 符号名称（如股票代码）
                        full_name: 'Binance:' + pair, // 全名，包含交易所（如交易所:符号）
                        description: '.', // 对符号的简短描述
                        exchange: 'Binance exchange',       // 交易所名称
                        ticker: pair,           // 符号的缩写形式（与 symbol 相同或相似）
                        type: 'crypto'             // 符号类型（例如 'stock'、'forex'、'crypto'）
                    }
                );
            }
        };
        onResultReadyCallback(dataArr)
    },
    resolveSymbol: async ( symbolName, onSymbolResolvedCallback, onResolveErrorCallback, extension ) => {
        console.log('resolveSymbol call.....')

        var url = baseHttpUrl + "/fapi/v1/continuousKlines?pair=" + symbolName + 
            '&contractType=PERPETUAL&interval=15m&limit=1';
        var response = await axios_.get(url);
        var price = response.data[0][3];
        var index = price.indexOf('.');
        var endPrice = price.substring(index + 1);
        const symbolInfo = {
            ticker: symbolName,
            name: symbolName,
            description: symbolName,
            type: 'crypto',
            session: '24x7',
            timezone: 'Asia/Shanghai',
            exchange: 'Binance exchange',
            minmov: 1,
            pricescale: 100 * Math.pow(10, endPrice.length - 2),
            has_intraday: true,
            visible_plots_set: 'ohlcv',
            has_weekly_and_monthly: false,
            supported_resolutions: ["1","5","15","60","240","1D"/*, "1W", "1M",*/],
            volume_precision: 2,
            data_status: 'streaming',
        };
        setTimeout(() => onSymbolResolvedCallback(symbolInfo));
        
    },
    //获取k线信息
    getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
        console.log('getBars call')
        //data.value.push({ time: '2018-12-22', open: 75.16, high: 82.84, low: 36.16, close: 45.72 })
        var loeading = ElLoading.service({
            lock: true,
            text: 'Loading',
            background: 'rgba(0, 0, 0, 0.7)',
        })
        var newData = [];
        if(!(periodParams.from < 0 || periodParams.to < 0)){
            var url = baseHttpUrl + "/fapi/v1/continuousKlines?pair=" + symbolInfo.name + 
            '&contractType=PERPETUAL&interval=' + inervalData[resolution].toLowerCase() + '&startTime=' + (periodParams.from * 1000) 
            + '&endTime=' + (periodParams.to * 1000);
            var response = await axios_.get(url);
            response.data.forEach(function(d,i){
                newData.push({
                    time:d[0],
                    open:Number(d[1]),
                    high:Number(d[2]),
                    low:Number(d[3]),
                    close:Number(d[4]),
                    volume: Number(d[5]),
                });
            })
            drowBySymbol(symbolInfo.name,periodParams.from);
        }
        
        setTimeout(() => {
            loeading.close();
            onHistoryCallback(newData,{ noData: newData.length == 0 });
        }, 1000);
    },
    //实时行情订阅
    subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
        console.log('[subscribeBars]: Method call with subscriberUID:', subscriberUID);
        
        axios.post('/tradingview/save',{
            inerval: resolution,
            symbol: symbolInfo.name,
        }).then(function(result){
            console.log(result);
        }).catch(function(e){
            console.log(e)
        })

        var socketClient = new WebSocket(baseWebSocketUrl + "/ws/" + symbolInfo.name.toLowerCase() + '_perpetual@continuousKline_' + inervalData[resolution].toLowerCase());
        socketClient.onopen = () => {
            console.log('WebSocket connection opened,' + socketClient.url);
        };

        socketClient.onmessage = (event) => {
            const kline = JSON.parse(event.data);
            var k = kline.k;
            onRealtimeCallback({
                time: k.t,
                open: Number(k.o),
                close: Number(k.c),
                high: Number(k.h),
                low: Number(k.l),
                volume: Number(k.v),
            });
            document.title = k.c + ' | ' + symbolInfo.name + ' U本位永续合约';
        };

        socketClient.onclose = () => {
            var client = clientMap.get(subscriberUID);
            if(client){
                client.init();
            }
            console.log('WebSocket connection closed,' + socketClient.url);
        };

        socketClient.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
        clientMap.set(subscriberUID,socketClient);
    },
    //取消订阅
    unsubscribeBars: (subscriberUID) => {
        console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
        var client = clientMap.get(subscriberUID);
        clientMap.delete(subscriberUID);
        client.close();
    },
}