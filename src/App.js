import React from 'react';
import {Button, Select, DatePicker, Space,message} from "antd";
import myaxios from "./utils/myaxios";
import './App.css'
import Mychart from './components/myChart'
import moment from "moment";
const {Option} = Select;
const {RangePicker} = DatePicker;

const initState = {
    sumType: 1,
    sumTypeName:'问题',
    selectPlat: "-1",
    selectPlatName: '所有平台',
    selectFaultType: "-1",
    selectFaultTypeName:'所有类型',
    subOption: 'faultType',
    selectFaultLevel: "-1",
    selectFaultLevelName:'全部级别',
    dateType: 'day',
    dayTime: moment().subtract(7, 'day').format('YYYY-MM-DD') + ' - ' + moment().format('YYYY-MM-DD'),
    weekTime: moment().subtract(4, 'week').format('YYYY-WW') + ',' + moment().format('YYYY-WW'),
    monthTime: moment().subtract(3, 'month').format('YYYY-MM') + ' - ' + moment().format('YYYY-MM'),
    dayValue: [moment().subtract(7, 'days'), moment()],
    weekValue: [moment().subtract(4, 'weeks'), moment()],
    monthValue: [moment().subtract(4, 'months'), moment()],
}

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            platForms: [],
            chartData: {},
            showLoading: true,
            firstLoading: true,
            ...initState
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
    sumTypeChange = (value,option) => {
        if (value === 3) {
            this.setState({
                sumType: value,
                sumTypeName:option.children,
                subOption: 'faultLevel'
            })
        } else {
            this.setState({
                sumType: value,
                sumTypeName:option.children,
                subOption: 'faultType'
            })
        }
    }
    platFormChange = (value, option) => {
        this.setState({
            selectPlat: value,
            selectPlatName: option.children
        })
    }
    faultLevelChange = (value, option) => {
        this.setState({
            selectFaultLevel: value,
            selectFaultLevelName:option.children
        })
    }
    faultTypeChange = (value, option) => {
        this.setState({
            selectFaultType: value,
            selectFaultTypeName:option.children
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
                    dayValue: date,
                })
                break
            case "week":
                let weekTime = time.replace(' - ',',')
                this.setState({
                    weekTime,
                    weekValue: date,
                })
                break
            case "month":
                this.setState({
                    monthTime: time,
                    monthValue: date
                })
                break
            default:
                return
        }
    }
    submitSearch = () => {

        this.setState({
            showLoading: true,
        })
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
                chartData: res.data,
                showLoading: false,
                firstLoading: false
            })
        }).catch(error => {
            message.error('获取数据失败，请刷新页面重试')
        })
    }

    resetForm = () => {
        this.setState({
            ...initState
        })
    }

    render() {
        const {subOption, platForms} = this.state
        const faultTypes = this.state.platForms.find(item => item.name === this.state.selectPlatName) || {children: []}
        const platFormName = this.state.selectPlatName
        const faultTypeName = this.state.selectFaultTypeName
        const faultLevelName = this.state.selectFaultLevelName
        const sumTypeName = this.state.sumTypeName

        const timeStr = ()=>{
            switch (this.state.dateType) {
                case "day":
                    return this.state.dayTime
                case "week":
                    return this.state.weekTime.replace(/,/g,'周 至 ').replace(/-/g,'第')+'周'
                case "month":
                    return this.state.monthTime
                default:
                    return ''
            }
        }
        const chartTitle = `${platFormName} ${subOption==='faultType'?faultTypeName:faultLevelName} ${timeStr()} ${sumTypeName}统计图`
        return (
            <div className="App">
                <div className="formBox">
                    <Space>
                        <Select value={this.state.sumType} style={{width: 100}} onChange={(e,e1) => this.sumTypeChange(e,e1)}>
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
                                    onChange={(e,e1) => this.faultTypeChange(e,e1)}>
                                <Option value="-1">所有类型</Option>
                                {
                                    faultTypes.children.map(item => <Option value={item.code}
                                                                            key={item.code}>{item.title}</Option>)
                                }
                            </Select>
                        ) : (<Select value={this.state.selectFaultLevel} style={{width: 120}}
                                     onChange={(e,e1) => this.faultLevelChange(e,e1)}>
                            <Option value="-1">全部级别</Option>
                            <Option value="0">P0</Option>
                            <Option value="1">P1</Option>
                            <Option value="2">P2</Option>
                            <Option value="3">P3</Option>
                            <Option value="4">P4</Option>
                            <Option value="5">P5</Option>
                        </Select>)}

                        <Select value={this.state.dateType} style={{width: 120}}
                                onChange={(e) => this.dateTypeChange(e)}>
                            <Option value="day">天</Option>
                            <Option value="week">周</Option>
                            <Option value="month">月</Option>
                        </Select>
                        {
                            this.state.dateType === 'day' ?
                                <RangePicker value={this.state.dayValue}
                                             onChange={(date, datestring) => this.datePickerChange(date, datestring)}/>
                                : this.state.dateType === 'week' ?
                                <RangePicker picker='week' value={this.state.weekValue}
                                             onChange={(date, datestring) => this.datePickerChange(date, datestring)}/>
                                : this.state.dateType === 'month' ?
                                    <RangePicker picker='month' value={this.state.monthValue}
                                                 onChange={(date, datestring) => this.datePickerChange(date, datestring)}/>
                                    : null
                        }


                        <Button type="primary" onClick={this.submitSearch}>查询</Button>
                        <Button onClick={this.resetForm}>重置</Button>
                    </Space>

                </div>
                <Mychart
                    chartData={this.state.chartData}
                    firstLoading={this.state.firstLoading}
                    showLoading={this.state.showLoading}
                    chartTitle={chartTitle}
                />
            </div>
        );
    }
}

export default App;
