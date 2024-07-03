import './cityManage.scss'
import { React, useRef, useEffect, useState } from 'react'
import { Loading, BorderBox1 } from '@jiaminghi/data-view-react'
import Charts from '@jiaminghi/charts'
import threeInit from '../../components/threejsConfig/threeInit'
import City from '../../components/threejsConfig/city'

const option1 = {
    title: {
        text: '城市设备运行情况',
        style: {
            fill: '#333',
            fontSize: 17,
            fontWeight: 'bold',
            textAlign: 'center',
            textBaseline: 'bottom',
        }
    },
    legend: {
        data: ['在线', '离线', '故障']
    },
    xAxis: {
        name: '设施',
        data: ['路灯', '垃圾桶', '地铁站', '闸机', '发电站', '电信基站']
    },
    yAxis: {
        name: '数量',
        data: 'value'
    },
    series: [
        {
            name: '在线',
            data: [5200, 4230, 200, 2100, 500, 4200],
            type: 'bar',
            stack: 'a'
        },
        {
            name: '离线',
            data: [100, 124, 1, 100, 50, 200],
            type: 'bar',
            stack: 'a'
        },
        {
            name: '故障',
            data: [100, 105, 0, 50, 1, 121],
            type: 'bar',
            stack: 'a'
        }
    ]
}
const optionLine = {
    title: {
        text: '地区生产总值'
    },
    xAxis: {
        name: '2023年',
        data: ['第一季度', '第二季度', '第三季度', '第四季度']
    },
    yAxis: {
        name: '总产值（亿）',
        data: 'value'
    },
    series: [
        {
            data: [10024.98, 10536.22, 10646.25, 11254.08],
            type: 'line',
            lineArea: {
                show: true
            }
        }
    ]
}

const carOption = {
    title: {
        text: '车流量'
    },
    legend: {
        data: ['高速公路', '快速路', '省道']
    },
    xAxis: {
        name: '第一周',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
        name: '数量（万）',
        data: 'value'
    },
    series: [
        {
            name: '高速公路',
            data: [120, 110, 100, 126, 108, 122, 130],
            type: 'bar',
        },
        {
            name: '快速路',
            data: [185, 170, 166, 173, 148, 190, 188],
            type: 'bar',
        }
        ,
        {
            name: '省道',
            data: [65, 58, 62, 50, 68, 64, 70],
            type: 'bar',
        }
    ]
}

const productStruc = {
    title: {
        text: '行业类型分析'
    },
    series: [
        {
            type: 'pie',
            data: [
                { name: '软件研发', value: 93 },
                { name: '电子上午', value: 32 },
                { name: '人工智能', value: 65 },
                { name: '云计算', value: 44 },
                { name: '大数据', value: 52 },
            ],
            insideLabel: {
                show: true
            }
        }
    ]
}


const radarOption =
{
    title: {
        text: '产业结构占比'
    },
    radar: {
        indicator: [
            { name: '第一产业', max: 100 },
            { name: '第二产业', max: 100 },
            { name: '第三产业', max: 100 },
        ]
    },
    splitLine: {
        style: {
            stroke: 'rgba(159, 230, 184, 1)'
        }
    },
    axisLine: {
        style: {
            stroke: 'rgba(159, 230, 184, 1)'
        }
    },
    splitArea: {
        show: true,
        color: ['rgba(159, 230, 184, .2)']
    },

    series: [
        {
            type: 'radar',
            data: [2, 24.6, 75.2],
        }
    ]
}

const gaugeOption = {
    title: {
        text: '企业入驻时间'
    },
    series: [
        {
            type: 'gauge',
            data: [
                { name: '一年以下', value: 320, radius: '40%' },
                { name: '1-5年', value: 407, radius: '60%' },
                { name: '5-10年', value: 223, radius: '20%' },
                { name: '10年以上', value: 282, radius: '20%' },

            ],

            pointer: {
                valueIndex: 2,
                style: {
                    scale: [.6, .6]
                }
            },
            details: {
                show: true,
                formatter: '{name}',
                position: 'start',
                offset: [10, 0],
                style: {
                    fontSize: 13,
                    textAlign: 'left'
                }
            }
        }
    ]
}



function CityManage() {
    const webglRef = useRef()
    const labelDiv = useRef()
    const MLStation = useRef()


    useEffect(() => {
        if (MLStation.current) return
        MLStation.current = new threeInit({ ref: webglRef, "labelDiv": labelDiv })
        // console.log("run----------------");
        MLStation.current.initMLCamera()
        MLStation.current.initMLLight()
        MLStation.current.initControls()


        MLStation.current.initRenderer()

        // MLStation.current.newLabel()

        MLStation.current.camera.position.set(0, 40, 100)
        const city = new City({});
        city.group.scale.set(0.1, 0.1, 0.1)
        MLStation.current.scene.add(city.group);
        MLStation.current.animate()

        setTimeout(() => {
            setIsLoading(true)
        }, 5000);
        // const render = () => {
        //     console.log("city",city);
        //     city.updateData();
        //     window.requestAnimationFrame(render)
        // }
        // render()
        // MLStation?.current?.addGround('eq01')

    }, [])

    const handlePointerClick = () => {

    }

    const onHandelMouseMove = () => {

    }

    const chartRef1 = useRef()
    const myChart = useRef()
    useEffect(() => {
        if (chartRef1.current && !myChart.current) {
            myChart.current = new Charts(chartRef1.current)
            myChart.current.setOption(option1,)
        }
    }, [chartRef1.current])

    const chartLineRef = useRef()
    const lineChart = useRef()
    useEffect(() => {
        if (chartLineRef.current && !lineChart.current) {
            lineChart.current = new Charts(chartLineRef.current)
            lineChart.current.setOption(optionLine)
        }
    }, [chartLineRef.current])

    const line2Ref = useRef()
    const lineChart2 = useRef()
    useEffect(() => {
        if (line2Ref.current && !lineChart2.current) {
            lineChart2.current = new Charts(line2Ref.current)
            lineChart2.current.setOption(carOption)
        }
    }, [line2Ref.current])

    //产量分析
    const productRef = useRef()
    const radarChart = useRef()
    useEffect(() => {
        if (productRef.current && !radarChart.current) {
            radarChart.current = new Charts(productRef.current)
            radarChart.current.setOption(radarOption)
        }
    }, [productRef.current])

    //行业分析
    const pieRef = useRef()
    const pieChart = useRef()
    useEffect(() => {
        if (pieRef.current && !pieChart.current) {
            pieChart.current = new Charts(pieRef.current)
            pieChart.current.setOption(productStruc)
        }
    }, [pieRef.current])

    //企业入驻
    const gaugeRef = useRef()
    const gaugeChart = useRef()
    useEffect(() => {
        if (gaugeRef.current && !gaugeChart.current) {
            gaugeChart.current = new Charts(gaugeRef.current)
            gaugeChart.current.setOption(gaugeOption)
        }
    }, [gaugeRef.current])

    const [isLoading, setIsLoading] = useState(false)
    return (
        <div className={`citymain`}>
            {!isLoading && <Loading style={{ position: 'absolute', zIndex: 100, backgroundColor: 'rgba(0,0,0)', height: '100vh', color: 'white', overflow: 'hidden' }}>Loading...</Loading>}
            <div ref={webglRef} className='simulate' onClick={e => handlePointerClick(e)} onMouseMove={e => onHandelMouseMove(e)}></div>
            <div className='left'>
                <div className='chartBox'>
                    <BorderBox1 >
                        <div className={'boxContent'}>
                            <div className='content' ref={chartRef1}></div>
                        </div>
                    </BorderBox1>
                </div>
                <div className='chartBox'>
                    <BorderBox1 >
                        <div className={'boxContent'}>
                            <div className='content' ref={chartLineRef}></div>
                        </div>
                    </BorderBox1>
                </div>
                <div className='chartBox'>
                    <BorderBox1>
                        <div className={'boxContent'}>
                            <div className='content' ref={line2Ref}></div>
                        </div></BorderBox1>
                </div>
            </div>
            <div className='right'>
                <div className='chartBox'>
                    <BorderBox1>
                        <div className={'boxContent'}>
                            <div className='content' ref={productRef}></div>
                        </div></BorderBox1>
                </div>
                <div className='chartBox'>
                    <BorderBox1>
                        <div className={'boxContent'}>
                            <div className='content' ref={pieRef}></div>
                        </div></BorderBox1>
                </div>
                <div className='chartBox'>
                    <BorderBox1>
                        <div className={'boxContent'} >
                            <div className='content' ref={gaugeRef}></div>
                        </div></BorderBox1>
                </div>
            </div>

            <div className='labelDiv' ref={labelDiv}>
            </div>



        </div>
    )
}
export default CityManage