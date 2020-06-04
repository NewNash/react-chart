import React from 'react';
import {Spin} from 'antd'
import ReactEcharts from 'echarts-for-react';


class myChart extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            chartData : {
                data:[],
                day_str:[]
            },
            chartTitle:''
        }
    }

    chartOption = () => {
        const result = this.state.chartData
        const seriesConfig = () => {
            const chartType = result.day_str.length > 7 ? 'line' : 'bar'
            let chartConfig = {}
            chartConfig.sertiesConfig = []
            chartConfig.legendConfig = []
            for (let item in result.data) {
                let obj = {
                    name: item,
                    type: chartType,
                    label: {
                        show: chartType === 'bar',
                        align: 'left',
                        position: 'insideBottom',
                        rotate: 90,
                        verticalAlign: 'middle',
                        distance: 15,
                        formatter: '{a} {c}'
                    },
                    data: result.data[item].split(',')
                }
                chartConfig.sertiesConfig.push(obj)
                chartConfig.legendConfig.push(item)
            }
            return chartConfig
        }
        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            grid: {
                right: '20%',
                top: '15%',
                x:'2%'
            },
            toolbox: {
                show: true,
                right: '25%',
                feature: {
                    magicType: {
                        type: ['line', 'bar'],
                        title: {
                            line: '切换为折线图',
                            bar: '切换为柱状图'
                        },
                        option: {
                            line: {
                                label: false
                            }
                        }
                    },
                    saveAsImage: {title: '保存为图片'},
                }
            },
            legend: {
                left: '83%',
                top: '8%',
                orient: 'vertical',
                icon: 'roundRect',
                align: 'left',
                data: seriesConfig().legendConfig
            },
            xAxis: {
                data: result.day_str
            },
            yAxis: {},
            series: seriesConfig().sertiesConfig
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.chartData!==prevState.chartData){
            return {
                chartData:nextProps.chartData,
                chartTitle:nextProps.chartTitle
            }
        }
        else{
            return null
        }
    }

    render() {
        const staticOption = {
            title: {
                text: this.state.chartTitle,
                left: '25%',
                top: '1%',
            },
        }
        return (
                <div className="chartBox">
                    {
                        !this.props.firstLoading ? (
                            <ReactEcharts
                                showLoading={this.props.showLoading}
                                option={{...this.chartOption(),...staticOption}}
                                style={{height: '600px', width: '100%'}}
                            />
                        ) : (<Spin/>)
                    }
                </div>
        );
    }
}

export default myChart;
