<template>
    <div class="lw-chart" ref="chartContainer"></div>
</template>
<script lang="ts" setup>
    import {
        ref,
        onMounted,
        onUnmounted,
        watch,
        defineExpose,
        defineProps,
    } from 'vue';
    import { createChart } from 'lightweight-charts';
    //以下是k线图表逻辑代码
    const chart_props = defineProps({
        type: {
            type: String,
            default: 'Candlestick',
        },
        data: {
            type: Array,
            required: true,
        },
        autosize: {
            default: true,
            type: Boolean,
        },
        chartOptions: {
            type: Object,
        },
        seriesOptions: {
            type: Object,
        },
        timeScaleOptions: {
            type: Object,
        },
        priceScaleOptions: {
            type: Object,
        },
    });

    // Function to get the correct series constructor name for current series type.
    function getChartSeriesConstructorName(type) {
        return `add${type.charAt(0).toUpperCase() + type.slice(1)}Series`;
    }

    // Lightweight Charts™ instances are stored as normal JS variables
    // If you need to use a ref then it is recommended that you use `shallowRef` instead
    let series;
    let chart;

    const chartContainer = ref();

    const fitContent = () => {
        if (!chart) return;
        chart.timeScale().fitContent();
    };

    const getChart = () => {
        return chart;
    };

    defineExpose({ fitContent, getChart });

    // Auto resizes the chart when the browser window is resized.
    const resizeHandler = () => {
        if (!chart || !chartContainer.value) return;
        const dimensions = chartContainer.value.getBoundingClientRect();
        chart.resize(dimensions.width, dimensions.height);
    };

    // Creates the chart series and sets the data.
    const addSeriesAndData = props => {
        const seriesConstructor = getChartSeriesConstructorName(props.type);
        series = chart[seriesConstructor](props.seriesOptions);
        series.setData(chart_props.data);
    };

    // select code end=============================================

    onMounted(() => {
       
        // Create the Lightweight Charts Instance using the container ref.
        chart = createChart(chartContainer.value, chart_props.chartOptions);
        addSeriesAndData(chart_props);

        if (chart_props.priceScaleOptions) {
            chart.priceScale().applyOptions(chart_props.priceScaleOptions);
        }

        if (chart_props.timeScaleOptions) {
            chart.timeScale().applyOptions(chart_props.timeScaleOptions);
        }

        chart.timeScale().fitContent();

        if (chart_props.autosize) {
            window.addEventListener('resize', resizeHandler);
        }
    })

    onUnmounted(() => {
        if (chart) {
            chart.remove();
            chart = null;
        }
        if (series) {
            series = null;
        }
        window.removeEventListener('resize', resizeHandler);
    });

    /*
    * Watch for changes to any of the component properties.

    * If an options property is changed then we will apply those options
    * on top of any existing options previously set (since we are using the
    * `applyOptions` method).
    *
    * If there is a change to the chart type, then the existing series is removed
    * and the new series is created, and assigned the data.
    *
    */
    watch(
        () => chart_props.autosize,
        enabled => {
            if (!enabled) {
                window.removeEventListener('resize', resizeHandler);
                return;
            }
            window.addEventListener('resize', resizeHandler);
        }
    );

    watch(
        () => chart_props.type,
        newType => {
            if (series && chart) {
                chart.removeSeries(series);
            }
            addSeriesAndData(chart_props);
        }
    );

    watch(
        () => chart_props.data,
        newData => {
            if (!series) return;
            series.setData(newData);
        }
    );

    watch(
        () => chart_props.chartOptions,
        newOptions => {
            if (!chart) return;
            chart.applyOptions(newOptions);
        }
    );

    watch(
        () => chart_props.seriesOptions,
        newOptions => {
            if (!series) return;
            series.applyOptions(newOptions);
        }
    );

    watch(
        () => chart_props.priceScaleOptions,
        newOptions => {
            if (!chart) return;
            chart.priceScale().applyOptions(newOptions);
        }
    );

    watch(
        () => chart_props.timeScaleOptions,
        newOptions => {
            if (!chart) return;
            chart.timeScale().applyOptions(newOptions);
        }
    );

</script>