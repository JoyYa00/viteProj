
import './cityManage.scss'
import { React, useRef, useEffect, useState } from 'react'
import { Loading, BorderBox1 } from '@jiaminghi/data-view-react'
import threeInit from '../../components/threejsConfig/threeInit'
import City from '../../components/threejsConfig/city'
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

    const [isLoading, setIsLoading] = useState(false)
    return (
        <div className={`citymain`}>
            {!isLoading && <Loading style={{ position: 'absolute', zIndex: 100, backgroundColor: 'rgba(0,0,0,0.5)', height: 'calc(100vh - 60px)', color: 'white' }}>Loading...</Loading>}
            <div ref={webglRef} className='simulate' onClick={e => handlePointerClick(e)} onMouseMove={e => onHandelMouseMove(e)}></div>
            <div className='left'>
                <div className='leftBox1'>
                    <BorderBox1>BorderBox1</BorderBox1>
                </div>
                <div className='leftBox1'>
                    <BorderBox1>BorderBox1</BorderBox1>
                </div>
                <div className='leftBox1'>
                    <BorderBox1>BorderBox1</BorderBox1>
                </div>
            </div>
            <div className='right'>
                <div className='leftBox1'>
                    <BorderBox1>BorderBox1</BorderBox1>
                </div>
                <div className='leftBox1'>
                    <BorderBox1>BorderBox1</BorderBox1>
                </div>
                <div className='leftBox1'>
                    <BorderBox1>BorderBox1</BorderBox1>
                </div>
            </div>

            <div className='labelDiv' ref={labelDiv}>
            </div>



        </div>
    )
}
export default CityManage