import React from 'react';
import {Button, Select, DatePicker, Space} from "antd";
import myaxios from "./utils/myaxios";
import './App.css'
import {data, chartData, handleData} from "./data";
import moment from "moment";
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend} from 'recharts';
import ReactEcharts from 'echarts-for-react';

import {
    BarChartOutlined,
    LineChartOutlined,
} from '@ant-design/icons';

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
            weekTime: moment().subtract(4, 'week').format('YYYY-WW') + ' - ' + moment().format('YYYY-WW'),
            monthTime: moment().subtract(3, 'month').format('YYYY-MM') + ' - ' + moment().format('YYYY-MM'),
            dayValue:[moment().subtract(7, 'days'), moment()],
            weekValue:[moment().subtract(4, 'weeks'), moment()],
            monthValue:[moment().subtract(4, 'months'), moment()]
        }
    }

    componentDidMount() {
        // console.log(handleData(chartData))
        // myaxios.post('/app.php?g=App&m=Login&a=index',{
        //     email:'admin',
        //     password:'Asdf843822'
        // }).then(res=>{
        //     console.log(res.data)
        //
        // })
        this.getPlatData()
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
        }).then(res => console.log(res.data)).catch(error => console.log(error))
    }

    render() {
        const data1 = [
            {
                "name": "Page A",
                "uv": 4000,
                "pv": 2400,
                "amt": 2400
            },
            {
                "name": "Page B",
                "uv": 3000,
                "pv": 1398,
                "amt": 2210
            },
            {
                "name": "Page C",
                "uv": 2000,
                "pv": 9800,
                "amt": 2290
            },
            {
                "name": "Page D",
                "uv": 2780,
                "pv": 3908,
                "amt": 2000
            },
            {
                "name": "Page E",
                "uv": 1890,
                "pv": 4800,
                "amt": 2181
            },
            {
                "name": "Page F",
                "uv": 2390,
                "pv": 3800,
                "amt": 2500
            },
            {
                "name": "Page G",
                "uv": 3490,
                "pv": 4300,
                "amt": 2100
            }
        ]
        const fillColor = ['#8884d8', '#D0D879', '#D86252', '#2E98D8', '#3CD865', '#D836CB', '#79D7D8', '#D8A4A9']
        const {subOption, platForms} = this.state
        const faultTypes = this.state.platForms.find(item => item.name === this.state.selectPlatName) || {children: []}
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
                        <Button>重置</Button>
                    </Space>

                </div>
                <div className="chartBox">
                    <div className='titlebox'>
                        <h2>
                            这是图表标题
                        </h2>
                        <div className="tool">
                            <LineChartOutlined style={{fontSize: '20px', marginRight: '10px', cursor: 'pointer'}}/>
                            <BarChartOutlined style={{fontSize: '20px', cursor: 'pointer'}}/>
                        </div>
                    </div>
                    <LineChart width={1600} height={600} data={handleData(chartData).result}
                               margin={{top: 5, right: 30, left: 20, bottom: 5}}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="name"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend layout='vertical' align='right' verticalAlign='top' wrapperStyle={{right: 10}}/>
                        {
                            handleData(chartData).cate_name.map((item, index) => (
                                <Line type="monotone" dataKey={item} stroke={fillColor[index]} key={item}/>
                            ))
                        }
                        {/*<Bar type="monotone" dataKey="【LH项目】" fill="#8884d8" />*/}
                        {/*<Bar type="monotone" dataKey="pv" fill="#82ca9d" />*/}
                        {/*<Bar type="monotone" dataKey="amt" fill="#cccccc" />*/}
                    </LineChart>
                </div>
            </div>
        );
    }
}

export default App;
