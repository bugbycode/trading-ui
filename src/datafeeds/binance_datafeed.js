import axios from 'axios';
import { generateSymbol, parseFullSymbol } from './helpers.js';
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

const coinInfo = [
    'BTCUSDT',
    'ETHUSDT',
    'BNBUSDT',
    'ZECUSDT',
    'DOGEUSDT',
    'SAGAUSDT',
    '1000PEPEUSDT'
]

export default {
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
    resolveSymbol: ( symbolName, onSymbolResolvedCallback, onResolveErrorCallback, extension ) => {
        const symbolInfo = {
            ticker: symbolName,
            name: symbolName,
            description: symbolName,
            type: 'crypto',
            session: '24x7',
            timezone: 'Asia/Shanghai',
            exchange: 'Binance exchange',
            minmov: 1,
            pricescale: 1000000,
            has_intraday: true,
            visible_plots_set: 'ohlcv',
            has_weekly_and_monthly: false,
            supported_resolutions: ["1","5","15","60","240","1D", "1W", "1M",],
            volume_precision: 2,
            data_status: 'streaming',
        };
        setTimeout(() => onSymbolResolvedCallback(symbolInfo));
        
    },
    //获取k线信息
    getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
        
        //data.value.push({ time: '2018-12-22', open: 75.16, high: 82.84, low: 36.16, close: 45.72 })
        var newData = [];
        if(!(periodParams.from < 0 || periodParams.to < 0)){
            var url = baseHttpUrl + "/fapi/v1/continuousKlines?pair=" + symbolInfo.name + 
            '&contractType=PERPETUAL&interval=' + inervalData[resolution].toLowerCase() + '&startTime=' + (periodParams.from * 1000) 
            + '&endTime=' + (periodParams.to * 1000);
            var response = await axios.get(url);
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
        }
        
        onHistoryCallback(newData);
    },
    //实时行情订阅
    subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
        console.log('[subscribeBars]: Method call with subscriberUID:', subscriberUID);
        
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
        clientMap.get(subscriberUID).close();
        clientMap.delete(subscriberUID);
    },
}