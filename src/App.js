import React from 'react';
import {Button,Select,DatePicker  } from "antd";
import myaxios from "./utils/myaxios";
import './App.css'
import {data,chartData,handleData} from "./data";
import { LineChart, Line,CartesianGrid,XAxis,YAxis,Tooltip,Legend ,BarChart ,Bar} from 'recharts';
import {
    BarChartOutlined,
    LineChartOutlined ,
    SmileOutlined,
    SyncOutlined,
    LoadingOutlined,
} from '@ant-design/icons';
const { Option } = Select;
const { RangePicker } = DatePicker;
class App extends React.Component{
    constructor(props){
        super(props)
        this.state={
            platform:'',
            faultType:'',
            faultLevel:'',
            dateType:'',
            dateRange:[],
        }
    }
    componentDidMount() {
        console.log(handleData(chartData))
        // let res = []
        // let name = chartData.cate_name.split(',')
        // let cdata = []
        // for(let d in chartData.date){
        //     let a = chartData.date[d].split(',')
        //     cdata .push(a)
        // }
        // chartData.day_str.split(',').forEach((item,index)=>{
        //     let obj = {}
        //     obj['name']=item
        //     for(let i in name ){
        //         obj[name[i]] = cdata[i][index]
        //     }
        //     res.push(obj)
        // })
        // console.log(res)
        // myaxios.get(myaxios.baseUrl+'/?g=Ticket&m=Summarytrend&a=getMenu').then(res=>console.log(res)).catch(error=>console.log(error))
    }
    paltformChange=(e)=>{
        console.log(e)
    }
    faultLevelChange=(e)=>{
        this.setState({
            faultLevel:e
        })
    }
    dateTypeChange=(e)=>{
        switch (e) {
            case 'day':
                this.setState({dateType:'date'})
                break;
            case 'week':
                this.setState({dateType:'week'})
                break;
            case 'month':
                this.setState({dateType:'month'})
                break
            default:
                return
        }
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

        return (
            <div className="App">
               <div className="formBox">
                   <Select defaultValue="-1" style={{ width: 120,marginRight:'15px' }} onChange={(e)=>this.paltformChange(e)}>
                       <Option value="-1">所有项目</Option>
                       {
                           data.platform.map((item)=> <Option value={item.category_id} key={item.category_id}>{item.category_name}</Option>)
                       }
                   </Select>
                   <Select defaultValue="-1" style={{ width: 120 ,marginRight:'15px'}} onChange={(e)=>this.paltformChange(e)}>
                       <Option value="-1">故障类型</Option>
                       <Option value="lucy">Lucy</Option>
                       <Option value="Yiminghe">yiminghe</Option>
                   </Select>
                   <Select defaultValue="-1" style={{ width: 120 ,marginRight:'15px'}} onChange={(e)=>this.faultLevelChange(e)}>
                       <Option value="-1">故障级别</Option>
                       <Option value="1">P0</Option>
                       <Option value="2">P1</Option>
                       <Option value="3">P2</Option>
                       <Option value="4">P3</Option>
                       <Option value="5">P4</Option>
                   </Select>
                   <Select defaultValue="day" style={{ width: 120 ,marginRight:'15px'}} onChange={(e)=>this.dateTypeChange(e)}>
                       <Option value="day">天</Option>
                       <Option value="week">周</Option>
                       <Option value="month">月</Option>
                   </Select>
                   <RangePicker picker={this.state.dateType} style={{marginRight:'15px'}} />
                   <Button type="primary" style={{marginRight:'15px'}}>查询</Button>
                   <Button>重置</Button>
               </div>
                <div className="chartBox">
                    <div className='titlebox'>
                        <h2>
                            这是图表标题
                        </h2>
                        <div className="tool">
                            <LineChartOutlined style={{fontSize:'20px',marginRight:'10px',cursor:'pointer'}}/>
                            <BarChartOutlined style={{fontSize:'20px',cursor:'pointer'}}/>
                        </div>
                    </div>

                    <LineChart width={1600} height={600} data={handleData(chartData).result}
                               margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend layout='vertical' align='right' verticalAlign='top' wrapperStyle={{right:10}}/>
                        {
                            handleData(chartData).cate_name.map(item=>(
                                <Line type="monotone" dataKey={item} fill="#8884d8" key={item}/>
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
