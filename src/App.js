import React from 'react';
import {Button, Select, DatePicker, Space} from "antd";
import myaxios from "./utils/myaxios";
import './App.css'
import moment from "moment";
import ReactEcharts from 'echarts-for-react';

const {Option} = Select;
const {RangePicker} = DatePicker;

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sumType: 1,
            platForms: [],
            selectPlat: "-1",
            selectPlatName: '',
            selectFaultType: "-1",
            subOption: 'faultType',
            selectFaultLevel: "-1",
            faultLevel: '',
            dateType: 'day',
            dayTime: moment().subtract(7, 'day').format('YYYY-MM-DD') + ' - ' + moment().format('YYYY-MM-DD'),
            weekTime: moment().subtract(4, 'week').format('YYYY-WW') + ',' + moment().format('YYYY-WW'),
            monthTime: moment().subtract(3, 'month').format('YYYY-MM') + ' - ' + moment().format('YYYY-MM'),
            dayValue:[moment().subtract(7, 'days'), moment()],
            weekValue:[moment().subtract(4, 'weeks'), moment()],
            monthValue:[moment().subtract(4, 'months'), moment()],
            chartData:{},
        }
    }

    componentDidMount() {
        this.getPlatData()
        this.submitSearch()
    }

    getPlatData = () => {
        myaxios.get('/?g=Ticket&m=Summarytrend&a=getAllCatAndtreeDb').then(res => {
            let platForms = []
            for (let name in res.data) {
                let obj = {
                    name: name,
                    id: res.data[name][0].cid,
                    children: res.data[name]
                }
                platForms.push(obj)
            }
            this.setState({
                platForms
            })
        })
    }
    sumTypeChange = e => {
        if (e === 3) {
            this.setState({
                sumType: e,
                subOption: 'faultLevel'
            })
        } else {
            this.setState({
                sumType: e,
                subOption: 'faultType'
            })
        }
    }
    platFormChange = (e, e1) => {
        this.setState({
            selectPlat: e,
            selectPlatName: e1.children
        })
    }
    faultLevelChange = (e) => {
        this.setState({
            faultLevel: e,
            selectFaultLevel: e
        })
    }
    faultTypeChange = e => {
        this.setState({
            selectFaultType: e,
        })
    }
    dateTypeChange = (e) => {
        switch (e) {
            case 'day':
                this.setState({
                    dateType: 'day',
                })
                break;
            case 'week':
                this.setState({
                    dateType: 'week',
                })
                break;
            case 'month':
                this.setState({
                    dateType: 'month',
                })
                break
            default:
                return
        }
    }
    datePickerChange = (date, dateString) => {
        const time = dateString.join(' - ').replace(/周/g, '')
        switch (this.state.dateType) {
            case 'day':
                this.setState({
                    dayTime: time,
                    weekTime: '',
                    monthTime: '',
                    dayValue:date,
                })
                break
            case "week":
                this.setState({
                    dayTime: '',
                    weekTime: time,
                    monthTime: '',
                    weekValue:date,
                })
                break
            case "month":
                this.setState({
                    dayTime: '',
                    weekTime: '',
                    monthTime: time,
                    monthValue:date
                })
                break
            default:
                return
        }
    }
    submitSearch = () => {
        const data = {
            count_type: this.state.sumType,
            category_id: this.state.selectPlat,
            tree_name: this.state.selectFaultType,
            fault_level: this.state.selectFaultLevel,
            dateType: this.state.dateType,
            day_time: this.state.dayTime,
            week_time: this.state.weekTime,
            month_time: this.state.monthTime,
        }
        myaxios.get('/?g=Ticket&m=Summarytrend&a=getInfo', {
            params: data
        }).then(res => {
            this.setState({
                chartData:res.data
            })
        }).catch(error => console.log(error))
    }
    getOption=()=>{
        return {

        }
    }
    resetForm = ()=>{
        console.log(this.state)
    }
    render() {
        const {subOption, platForms} = this.state
        const faultTypes = this.state.platForms.find(item => item.name === this.state.selectPlatName) || {children: []}
        const result = this.state.chartData
        const seriesConfig=()=> {
            try{
                const chartType = result.day_str.length>7?'line':'bar'
                let chartConfig = {}
                chartConfig.sertiesConfig = []
                chartConfig.legendConfig = []
                for(let item in result.data){
                    let obj = {
                        name: item,
                        type: chartType,
                        label:{
                            show:chartType==='bar',
                            align:'left',
                            position:'insideBottom',
                            rotate:90,
                            verticalAlign:'middle',
                            distance:15,
                            formatter: '{a} {c}'
                        },
                        data: result.data[item].split(',')
                    }
                    chartConfig.sertiesConfig.push(obj)
                    chartConfig.legendConfig.push(item)
                }
                return chartConfig
            }
            catch (e) {

            }

        }

        const chartOption = {
            title: {
                text: `统计图`,
                left:'40%',
                top:'-2%',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            grid:{
                right:'20%',
                top:'15%'
            },
            toolbox:{
                show:true,
                right:'25%',
                feature:{
                    magicType: {
                        type: ['line', 'bar'],
                        title:{
                            line :'切换为折线图',
                            bar :'切换为柱状图'
                        },
                        option:{
                            line:{
                                label: false
                            }
                        }
                    },
                    saveAsImage:{title : '保存为图片'},
                }
            },
            legend: {
                left:'83%',
                top:'8%',
                orient:'vertical',
                icon:'roundRect',
                align:'left',
                data:()=>{
                    try{
                        return seriesConfig().legendConfig
                    }
                    catch (e) {

                    }
                }
            },
            xAxis: {
                data: ()=>{
                    try{
                        return result.day_str
                    }
                    catch (e) {

                    }
                }
            },
            yAxis: {},
            series: ()=>{
                try{
                   return  seriesConfig().sertiesConfig
                }
                catch (e) {

                }
            }
        }
        return (
            <div className="App">
                <div className="formBox">
                    <Space>
                        <Select value={this.state.sumType} style={{width: 100}} onChange={(e) => this.sumTypeChange(e)}>
                            <Option value={1}>问题</Option>
                            <Option value={2}>追踪</Option>
                            <Option value={3}>工单</Option>
                        </Select>
                        <Select value={this.state.selectPlat} style={{width: 120}}
                                onChange={(e, e1) => this.platFormChange(e, e1)}>
                            <Option value="-1">所有平台</Option>
                            {
                                platForms.map((item, index) => <Option value={item.id} key={index}>{item.name}</Option>)
                            }
                        </Select>
                        {subOption === 'faultType' ? (
                            <Select value={this.state.selectFaultType} style={{width: 120}}
                                    onChange={(e) => this.faultTypeChange(e)}>
                                <Option value="-1">故障类型</Option>
                                {
                                    faultTypes.children.map(item => <Option value={item.code}
                                                                            key={item.code}>{item.title}</Option>)
                                }
                            </Select>
                        ) : (<Select value={this.state.selectFaultLevel} style={{width: 120}}
                                     onChange={(e) => this.faultLevelChange(e)}>
                            <Option value="-1">故障级别</Option>
                            <Option value="0">P0</Option>
                            <Option value="1">P1</Option>
                            <Option value="2">P2</Option>
                            <Option value="3">P3</Option>
                            <Option value="4">P4</Option>
                            <Option value="5">P5</Option>
                        </Select>)}

                        <Select value={this.state.dateType} style={{width: 120}} onChange={(e) => this.dateTypeChange(e)}>
                            <Option value="day">天</Option>
                            <Option value="week">周</Option>
                            <Option value="month">月</Option>
                        </Select>
                        {
                            this.state.dateType === 'day' ?
                                    <RangePicker value={this.state.dayValue}
                                                 locale={{lang:{locale:'zh_cn'}}}
                                                 onChange={(date, datestring) => this.datePickerChange(date, datestring)}/>
                                : this.state.dateType === 'week' ?
                                     <RangePicker picker='week' value={this.state.weekValue}
                                                  onChange={(date, datestring) => this.datePickerChange(date, datestring)}/>
                                : this.state.dateType === 'month' ?
                                    <RangePicker picker='month' value={this.state.monthValue}
                                                 onChange={(date, datestring) => this.datePickerChange(date, datestring)}/>
                                :null
                        }


                        <Button type="primary" onClick={this.submitSearch}>查询</Button>
                        <Button onClick={this.resetForm}>重置</Button>
                    </Space>

                </div>
                <div className="chartBox">
                    {
                        this.state.chartData.day_str?(<ReactEcharts
                            option={{...this.getOption(),...chartOption}}
                        />):null
                    }

                </div>
            </div>
        );
    }
}

export default App;
