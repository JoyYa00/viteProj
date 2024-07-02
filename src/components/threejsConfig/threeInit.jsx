import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

let ultrasoundFly, planeA, planeB, planeD, lTempA, lTempB, hA1, hA2, hA3, hA4, hB1, hB2, hB3, hB4, n2A1, n2A2, n2B1, n2B2, n2LabelA, n2LabelB, n2LineA, n2LineB, vacuumLineA, vacuumLineB, vacuumLabelA, vacuumLabelB, vacuumLineD, vacuumLabelD, ultraLabel, ultraLine

let channelA, channelB, moduleA, moduleB, moduleAN2, moduleBN2, n21

export default class threeInit {
    constructor(props) {
        this.scene = new THREE.Scene();
        this.camera = null;
        this.renderer = new THREE.WebGLRenderer(
            //增加下面两个属性，可以抗锯齿
            {
                antialias: true,
                alpha: true,
                logarithmicDepthBuffer: true,
            }
        );
        this.renderer.setClearColor('rgb(254,254,254)', 1.0)
        this.scene.background = null;
        this.labelRenderer = new CSS2DRenderer();
        this.controls = null;
        this.raycaster = new THREE.Raycaster()
        this.pointer = new THREE.Vector2()
        this.INTERSECTED = null
        this.MLSELECTED = null
        this.canvas = props.ref
        this.selectedObj = null
        props.labelDiv && (this.labelDiv = props.labelDiv.current)
        this.width = this.canvas.current.clientWidth
        this.height = this.canvas.current.clientHeight
        this.near = 0
        // window.addEventListener('resize', this.onWindowResize);
        this.clock = new THREE.Clock()
        this.time = { value: 0 };
        this.isStart = true
        this.startTime = { value: 0 };
        this.startLength = { value: 2 }
        this.timer = {}


    }

    destrory = () => {
        try {
            this.renderer.dispose();
            this.renderer.forceContextLoss();
            this.renderer.content = null;
            let gl = this.renderer.domElement.getContext("webgl");
            if (gl && gl.getExtension("WEBGL_lose_context")) {
                gl.getExtension("WEBGL_lose_context").loseContext();
            }
            this.renderer = null;
            this.camera = null;
            this.scene.traverse((child) => {
                // console.log(child);
                if (child.material) {
                    child.material.dispose();
                }
                if (child.geometry) {
                    child.geometry.dispose();
                }
                child = null;
            });
            // console.log("scene--------------------", this.scene);
            this.scene = null;
        } catch (e) {
            console.error("Failed to destroy threejs", e);
        }

    }
    deleteEffect = () => {
        let effectArr = [ultrasoundFly, planeA, planeB, planeD, lTempA, lTempB, hA1, hA2, hA3, hA4, hB1, hB2, hB3, hB4, n2A1, n2A2, n2B1, n2B2, n2LabelA, n2LabelB, n2LineA, n2LineB, vacuumLineA, vacuumLineB, vacuumLabelA, vacuumLabelB, ultraLabel, ultraLine]
        effectArr.forEach(item => {
            item && this.scene.remove(item)
            item = null
        })
        for (let key in this.timer) {
            window.cancelAnimationFrame(this.timer[key])
        }
    }

    initPipCamera = () => {
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
        this.camera.position.set(-15, 10, 70)
        this.scene.add(this.camera)
    }
    initDeskMLCamera = () => {
        this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 1000);
        this.camera.position.set(0.784, 10, 25)
        this.scene.add(this.camera)
    }

    css2DLabel = (text, layer = 1) => {
        const moonDiv = this.labelDiv.cloneNode()
        // moonDiv.className = 'label';
        moonDiv.textContent = text;
        // layer && (moonDiv.style.marginTop = '-15em');

        // moonDiv.style.backgroundColor = "rgba(0, 0, 255, 0.68)"
        moonDiv.style.display = "block"
        const moonLabel = new CSS2DObject(moonDiv);
        moonLabel.position.set(0, 20, 0);
        moonLabel.layers.set(layer);
        return moonLabel
    }
    addLabelBox = () => {

        const moonDiv = document.createElement('div');
        moonDiv.style.cssText = 'width: 100px;padding: 10px;color: #fff;font-size: 14px;background-color: rgba(20, 143, 211, 0.68);border: 1px solid rgba(127, 177, 255, 0.75);'

        moonDiv.textContent = "配置";
        moonDiv.style.marginTop = '-1em';
        const moonLabel = new CSS2DObject(moonDiv);
        moonLabel.position.set(0, 0, 0);
        // box.add(moonLabel);
        moonLabel.layers.set(0);

        return moonLabel

    }
    initTreeRootLight = () => {
        // 添加点光源
        // this.scene.background = new THREE.Color("#fff");


        // 添加点光源
        let light1 = new THREE.DirectionalLight("#fff", 1);
        light1.position.set(0, 1160, 2160);
        this.scene.add(light1);

        //环境光
        let ambient = new THREE.AmbientLight("#fff", 0.6);
        this.scene.add(ambient);

        let point = new THREE.PointLight("#fff", 0.5);
        point.position.set(0, 1160, 2160);
        this.scene.add(point);
    }
    initPipLight = () => {
        const light = new THREE.SpotLight(0xffffff, 2)
        light.position.set(-50, 100, -100);
        this.scene.add(light);
        let point = new THREE.PointLight(0xffffff);
        point.position.set(-300, 150, 300); //点光源位置
        this.scene.add(point); //点光源添加到场景中
        //环境光
        let ambient = new THREE.AmbientLight(0xffffff, 1);
        // point.position.set(100, 100, 100)
        this.scene.add(ambient);
    }
    initDeskMLLight = () => {



        // const pointLight = new THREE.PointLight(0xffffff)
        // pointLight.position.set(0, 9, 9);
        // pointLight.intensity = 1
        // const dirLight1 = new THREE.DirectionalLight(0xffffff)
        // dirLight1.position.set(5, 20, 80);
        // this.scene.add(pointLight);
        let dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.name = 'Dir. Light';
        dirLight.position.set(20, 40, 10);
        dirLight.castShadow = true;
        dirLight.shadow.camera.near = 1;
        dirLight.shadow.camera.far = 100;
        dirLight.shadow.camera.right = 150;
        dirLight.shadow.camera.left = - 150;
        dirLight.shadow.camera.top = 150;
        dirLight.shadow.camera.bottom = - 150;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        dirLight.rotateY = Math.PI / 2
        this.scene.add(dirLight);

    }

    initMLCamera = () => {
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
        this.camera.position.set(0, 0, 400)
        this.scene.add(this.camera)


    }
    initDeskCamera = () => {
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
        this.camera.position.set(1, 2, 2)
        this.scene.add(this.camera)
    }
    initQDCamera = () => {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set(0, 5, 25);
        this.scene.add(this.camera)
    }
    initMLLight = () => {
        // const light = new THREE.SpotLight(0xffffff, 2)
        // light.position.set(50, 100, 100);
        // this.scene.add(light);
        // const light = new THREE.DirectionalLight(0xffffff)
        // light.position.set(-5, 100, -7.5);
        const pointLight = new THREE.PointLight(0xffffff)
        pointLight.position.set(0, 9, 9);
        pointLight.intensity = 1
        // const dirLight1 = new THREE.DirectionalLight(0xffffff)
        // dirLight1.position.set(5, 20, 80);
        this.scene.add(pointLight);
        let dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.name = 'Dir. Light';
        dirLight.position.set(20, 40, 10);
        dirLight.castShadow = true;
        dirLight.shadow.camera.near = 1;
        dirLight.shadow.camera.far = 500;
        dirLight.shadow.camera.right = 550;
        dirLight.shadow.camera.left = - 550;
        dirLight.shadow.camera.top = 550;
        dirLight.shadow.camera.bottom = - 550;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        dirLight.rotateY = Math.PI / 2
        this.scene.add(dirLight);
    }
    initQDLight = () => {
        // const light = new THREE.DirectionalLight(0xffffff)
        // light.position.set(-5, 100, -7.5);
        const pointLight = new THREE.PointLight(0xffffff)
        pointLight.position.set(0, 0, 15);
        pointLight.intensity = 0.7
        // const dirLight1 = new THREE.DirectionalLight(0xffffff)
        // dirLight1.position.set(5, 20, 80);
        this.scene.add(pointLight);
        let dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.name = 'Dir. Light';
        dirLight.position.set(20, 40, 10);
        dirLight.castShadow = true;
        dirLight.shadow.camera.near = 1;
        dirLight.shadow.camera.far = 100;
        dirLight.shadow.camera.right = 150;
        dirLight.shadow.camera.left = - 150;
        dirLight.shadow.camera.top = 150;
        dirLight.shadow.camera.bottom = - 150;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        dirLight.rotateY = Math.PI / 2
        this.scene.add(dirLight);


    }

    initRenderer = () => {
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap;
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(
            this.width,
            this.height
        )
        // this.renderer.shadowMap.enable = true
        this.renderer.sortObjects = true//不再透明度排序
        this.canvas.current.appendChild(this.renderer.domElement)
        this.labelRenderer.setSize(this.width, this.height);
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.top = '0px';
        // let renderer2 = new CSS3DRenderer();
        // renderer2.setSize(window.innerWidth, window.innerHeight);
        // document.getElementById('container').appendChild(renderer2.domElement);
        this.canvas.current.appendChild(this.labelRenderer.domElement);
    }

    initControls = () => {
        this.controls = new OrbitControls(this.camera, this.labelRenderer.domElement)
        this.controls.enableDamping = true//阻尼
        this.controls.enableZoom = true//缩放
        this.controls.autoRotate = false//自动旋转
        this.controls.minDistance = 0
        this.controls.maxDistance = 900
        this.controls.enablePan = true
    }


    animate = () => {
        this.timer['animate'] = requestAnimationFrame(this.animate)
        this.renderer.render(this.scene, this.camera)
        // this.selectedObj && this.divRender(this.selectedObj.position)
        this.labelRenderer.render(this.scene, this.camera);

        this.controls.update()
        this.updateData()
    }



    onPointerClick = (event, type, currentCanvas) => {
        let tempCanvas = currentCanvas ? currentCanvas : this.canvas.current
        this.controls.autoRotate = false
        this.isStart = !this.isStart
        this.pointer.x = ((event.clientX - tempCanvas.getBoundingClientRect().left) / tempCanvas.clientWidth) * 2 - 1;
        this.pointer.y = - ((event.clientY - tempCanvas.getBoundingClientRect().top) / tempCanvas.clientHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);
        if (intersects.length > 0) {
            const selectedObj = intersects[0].object
            const { parent } = intersects[0].object
            // console.log(intersects[0].point);
            if (selectedObj.name === 'massSpectrometer') {
                return selectedObj.parent.parent.parent.parent.cfObj
            }
            if (type === 'pip' && (parent.cfType === 'model' || selectedObj.cfType === 'model')) {
                // console.log(selectedObj.parent);
                let target = selectedObj

                if (parent.type !== 'Scene') {
                    target = parent
                }
                return target.cfObj || selectedObj.cfObj
            } else if (type === 'ML') {
                this.selectedObj = parent.parent
                return selectedObj
            } else if (type === 'treeRoot') {
                let clickObj = { point: intersects[0].point, selectedObj: selectedObj }
                return clickObj
            }
        }
        else return null

    }

    gainCoord = (event) => {
        event.preventDefault();
        var vector = new THREE.Vector3();//三维坐标对象
        vector.set(
            ((event.clientX - this.canvas.current.getBoundingClientRect().left) / this.width) * 2 - 1,
            - ((event.clientY - this.canvas.current.getBoundingClientRect().top) / this.height) * 2 + 1,
            0.5);
        vector.unproject(this.camera);
        var raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());
        var intersects = raycaster.intersectObjects(this.scene.children);
        if (intersects.length > 0) {
            var selected = intersects[0];//取第一个物体
            console.log("x坐标:" + selected.point.x);
            console.log("y坐标:" + selected.point.y);
            console.log("z坐标:" + selected.point.z);
        }
    }

    onWindowResize = () => {
        if (this.canvas.current) {
            const { clientWidth, clientHeight } = this.canvas.current
            // console.log("🌲🌲🌲🌲", clientWidth, clientHeight);
            this.camera.aspect = clientWidth / clientHeight;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(clientWidth, clientHeight);
            this.labelRenderer.setSize(clientWidth, clientHeight);
        }


    }


    divRender = (position) => {
        //计算三维坐标对应的屏幕坐标
        // console.log(position);
        var windowPosition = this.transPosition(position);
        var left = windowPosition.x;
        var top = windowPosition.y;
        //设置div屏幕位置
        let div = this.labelDiv;
        div.textContent = "text000000";
        div.style.display = 'block'
        div.style.left = left + 'px';
        div.style.top = top + 'px';
    }
    transPosition = (position) => {
        let world_vector = new THREE.Vector3(position.x, position.y, position.z);
        let vector = world_vector.project(this.camera);
        let halfWidth = this.width / 2,
            halfHeight = this.height / 2;
        return {
            x: Math.round(vector.x * halfWidth + halfWidth),
            y: Math.round(-vector.y * halfHeight + halfHeight)
        };
    }
    // 加载模型
    loadAsset = (path) => {
        const manager = new THREE.LoadingManager();
        const loader = new ThreeMFLoader(manager);
        manager.onLoad = function () {
            console.log('Loading complete!');
        };
        const getFrame = new Promise((resolve, reject) => {
            loader
                .loadAsync(`https://fine-fanta.oss-cn-hangzhou.aliyuncs.com/static/model/${path}.3mf`)
                .then((objGroup) => {
                    resolve(objGroup);
                })
                .catch((err) => {
                    reject(err);
                });
        })
            .catch((err) => {
                console.log(err);
            });
        return getFrame



    }

    // 飞线（液体上升特效）
    fly = (flyP) => {
        let sCoord = flyP


        const flyData = {
            source: {
                x: sCoord[0],
                y: sCoord[1],
                z: sCoord[2]
            },
            target: {
                x: sCoord[0],
                y: sCoord[1] < 0 ? sCoord[1] + 38 : sCoord[1] - 38,
                z: sCoord[2]
            },
            color: '#efad35',
            number: 150,
            size: 0.5,
            period: 3,
            opacity: 0.5,
        }

        const source = new THREE.Vector3(flyData.source.x, flyData.source.y, flyData.source.z)
        const target = new THREE.Vector3(flyData.target.x, flyData.target.y, flyData.target.z)
        // const center = source.clone().lerp(target, 0.5)
        // center.setY(260)
        // const distance = parseInt(source.distanceTo(center) + center.distanceTo(target))

        // // 定义贝塞尔曲线
        // console.log("distance", distance);
        const curve = new THREE.LineCurve3(source, target);
        const points = curve.getPoints(554)

        // 创建组对象
        const group = new THREE.Group()
        for (let i = 0; i < flyData.number; i++) {

            const geometry = new THREE.SphereGeometry(flyData.size, 30, 30)
            const scale = (i + 1) / flyData.number * 0.7 + 0.3
            geometry.applyMatrix4(new THREE.Matrix4().makeScale(scale, scale, scale))// 缩小小球的几何体


            const material = new THREE.MeshBasicMaterial({
                color: flyData.color,
                transparent: true,
                opacity: flyData.opacity,
                depthTest: true,
            })


            const sphere = new THREE.Mesh(geometry, material)
            sphere.renderOrder = 1000
            sphere.position.copy(points[i])
            sphere.updateMatrix()// 更新相对矩阵
            group.add(sphere)

        }
        return group


        // setInterval(() => {

        //     const rate = (this.time.value % flyData.period) / flyData.period

        //     const position = parseInt(points.length * rate)
        //     for (let i = 0; i < flyData.number; i++) {

        //         if (position + i >= points.length) {
        //             group.children[i].material.opacity = 0
        //         } else {

        //             group.children[i].material.opacity = flyData.opacity
        //             group.children[i].position.copy(points[position + i])
        //             group.children[i].updateMatrix()

        //         }

        //     }
        // }, 50)
    }

    // 更新数据
    updateData = () => {

        if (!this.isStart) return false;
        const dt = this.clock.getDelta();
        this.time.value += dt;
        this.startTime.value += dt;
        if (this.startTime.value >= this.startLength.value) {
            this.startTime.value = this.startLength.value;
        }
    }

    // 温度升高
    tempUp = (color, points, height) => {
        // 坐标
        // const height = 10; // 高度
        const color1 = color; // 颜色
        const textureUrl1 = "https://fine-fanta.oss-cn-hangzhou.aliyuncs.com/static/hts/texture-gradient-left.png"; // 纹理
        // 围栏距离
        const points2 = points
        const pointDistance = [];
        const distance = points2.reduce((totalDistance, point, index) => {
            let segmentDistance = 0;
            if (index > 0) {
                let lastPoint = new THREE.Vector3(...points2[index - 1]);
                let currPoint = new THREE.Vector3(...point);
                segmentDistance = lastPoint.distanceTo(currPoint);
            }
            totalDistance += segmentDistance;
            pointDistance.push(totalDistance);
            return totalDistance;
        }, 0);
        // 几何体
        const geometry = new THREE.BufferGeometry(); // 缓冲几何体
        const posArr = [];
        const uvArr = [];
        // 遍历坐标
        points2.forEach((point, index) => {
            if (index === 0) return;
            const lastPoint = points2[index - 1];

            // 三角面1
            posArr.push(...lastPoint);
            uvArr.push(pointDistance[index - 1] / distance, 0);
            posArr.push(...point);
            uvArr.push(pointDistance[index] / distance, 0);
            posArr.push(lastPoint[0], lastPoint[1] + height, lastPoint[2]);
            uvArr.push(pointDistance[index - 1] / distance, 1);

            // 三角面2
            posArr.push(...point);
            uvArr.push(pointDistance[index] / distance, 0);
            posArr.push(point[0], point[1] + height, point[2]);
            uvArr.push(pointDistance[index] / distance, 1);
            posArr.push(lastPoint[0], lastPoint[1] + height, lastPoint[2]);
            uvArr.push(pointDistance[index - 1] / distance, 1);
        });
        geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(posArr), 3));
        geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvArr), 2));

        // 纹理
        const texture = new THREE.TextureLoader().load(textureUrl1);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        // 材质
        const material = new THREE.MeshBasicMaterial({
            color: color1,
            map: texture,
            transparent: true,
            opacity: 0.9,
            depthWrite: false,
            side: THREE.DoubleSide,
        });
        // 围栏
        const mesh = new THREE.Mesh(geometry, material);
        this.textrue_offset(texture, "right", 1);
        return mesh
        // 偏移

    }

    heatWayAOne = () => {
        if (!hA1) {
            hA1 = this.tempUp("#ff5679", channelA[0], 10)
            this.scene.add(hA1)
        }
    }
    heatWayATwo = () => {
        if (!hA2) {
            hA2 = this.tempUp("#ff5679", channelA[1], 10)
            this.scene.add(hA2)
        }
    }
    heatWayAThree = () => {
        if (!hA3) {
            hA3 = this.tempUp("#ff5679", channelA[2], 10)
            this.scene.add(hA3)
        }
    }
    heatWayAFour = () => {
        if (!hA4) {
            hA4 = this.tempUp("#ff5679", channelA[3], 10)
            this.scene.add(hA4)
        }
    }
    heatWayBOne = () => {
        if (!hB1) {
            hB1 = this.tempUp("#ff5679", channelB[0], 10)
            this.scene.add(hB1)
        }
    }
    heatWayBTwo = () => {
        if (!hB2) {
            hB2 = this.tempUp("#ff5679", channelB[1], 10)
            this.scene.add(hB2)
        }
    }
    heatWayBThree = () => {
        if (!hB3) {
            hB3 = this.tempUp("#ff5679", channelB[2], 10)
            this.scene.add(hB3)
        }
    }
    heatWayBFour = () => {
        if (!hB4) {
            hB4 = this.tempUp("#ff5679", channelB[3], 10)
            this.scene.add(hB4)
        }
    }
    heatWayAOneStop = () => {
        this.scene.remove(hA1)
        hA1 = null
    }
    heatWayATwoStop = () => {
        this.scene.remove(hA2)
        hA2 = null
    }
    heatWayAThreeStop = () => {
        this.scene.remove(hA3)
        hA3 = null
    }
    heatWayAFourStop = () => {
        this.scene.remove(hA4)
        hA4 = null
    }
    heatWayBOneStop = () => {
        this.scene.remove(hB1)
        hB1 = null
    }
    heatWayBTwoStop = () => {
        this.scene.remove(hB2)
        hB2 = null
    }
    heatWayBThreeStop = () => {
        this.scene.remove(hB3)
        hB3 = null
    }
    heatWayBFourStop = () => {
        this.scene.remove(hB4)
        hB4 = null
    }
    //低温
    lowTemperatureA = () => {
        if (!lTempA) {
            lTempA = this.tempUp("#0028ff", moduleA, 10)
            this.scene.add(lTempA)
        }

    }
    lowTemperatureAStop = () => {

        lTempA && this.scene.remove(lTempA)
        lTempA = null

    }
    lowTemperatureB = () => {
        if (!lTempB) {
            lTempB = this.tempUp("#0028ff", moduleB, 10)
            this.scene.add(lTempB)
        }
    }
    lowTemperatureBStop = () => {
        lTempB && this.scene.remove(lTempB)
        lTempB = null
    }
    // 贴图偏移
    textrue_offset = (texture, direction = "right", speed = 0.5) => {
        // 开始时间
        const start = Date.now();
        const h = () => {
            this.timer['textrue_offset'] = requestAnimationFrame(h);
            const now = Date.now();
            const offset = ((now - start) * 1) * speed;
            switch (direction) {
                case "left":
                    texture.offset = new THREE.Vector2(offset, 0); //纹理偏移
                    break;
                case "right":
                    texture.offset = new THREE.Vector2(-offset, 0);
                    break;
                case "top":
                    texture.offset = new THREE.Vector2(0, -offset);
                    break;
                case "bot":
                    texture.offset = new THREE.Vector2(-offset, offset);
                    break;
                default:
                    break;
            }
        };
        this.timer['textrue_offset2'] = requestAnimationFrame(h);
    }
    // 标签
    label02 = (x, y, z) => {
        //定义线
        // 创建材质
        const material = new THREE.LineBasicMaterial({ color: 0x9ab870 });
        // 创建空几何体
        const geometry = new THREE.BufferGeometry()
        const points = [];

        points.push(new THREE.Vector3(0, 0, 0));
        points.push(new THREE.Vector3(-7, 8, -2));
        geometry.setFromPoints(points);

        const line = new THREE.Line(geometry, material);

        //定义标记点
        var radius = 0.5, segemnt = 16, rings = 16;
        var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x9afc00 });
        var sphere101 = new THREE.Mesh(new THREE.SphereGeometry(radius, segemnt, rings), sphereMaterial);
        sphere101.position.set(0, 0, 0);

        // 定义标签
        let group = new THREE.Object3D();
        group.add(line)
        group.add(sphere101)
        group.position.set(x, y, z)
        return group
    }

    addN2 = (m, time) => {
        let config = { m: m, time: time, height: 20, equipmentType: 1, labelPosition: [], linePosition: [] }
        this.ventilateN2(config)
    }
    // 通氮
    ventilateN2 = (config) => {
        const { m, time, height, equipmentType } = config
        let points
        if (equipmentType == 1) {
            if (m === 'A') {
                points = moduleAN2
            } else {
                points = moduleBN2
            }
        } else if (equipmentType == 2) {
            points = n21
        } else if (equipmentType == 4) {
            points = [
                [-5 + 5, 3, 2],
                [-2.7 + 5, 3, 2],

                [-2.7 + 5, 3, -2],
                [-5 + 5, 3, -2],

                [-5 + 5, 3, 2],
            ]
        }


        function textrue_offset(texture, direction = "right", speed = 0.5) {
            // 开始时间
            const start = Date.now();
            const h = () => {
                requestAnimationFrame(h);
                const now = Date.now();
                const offset = ((now - start) * 1) * speed;
                switch (direction) {
                    case "left":
                        texture.offset = new THREE.Vector2(offset, 0); //纹理偏移
                        break;
                    case "right":
                        texture.offset = new THREE.Vector2(-offset, 0);
                        break;
                    case "top":
                        texture.offset = new THREE.Vector2(0, -offset);
                        break;
                    case "bot":
                        texture.offset = new THREE.Vector2(0, offset);
                        break;
                    default: break;
                }
            };
            requestAnimationFrame(h);
        }
        const pointDistance = [];
        const distance = points.reduce((totalDistance, point, index) => {
            let segmentDistance = 0;
            if (index > 0) {
                let lastPoint = new THREE.Vector3(...points[index - 1]);
                let currPoint = new THREE.Vector3(...point);
                segmentDistance = lastPoint.distanceTo(currPoint);
            }
            totalDistance += segmentDistance;
            pointDistance.push(totalDistance);
            return totalDistance;
        }, 0);
        const color2 = "#ffff00"; // 围栏2的颜色
        const textureUrl2 = "https://fine-fanta.oss-cn-hangzhou.aliyuncs.com/static/hts/texture-vertical-line.png";
        function d1() {
            // 几何体
            const geometry = new THREE.BufferGeometry(); // 缓冲几何体
            const posArr = [];
            const uvArr = [];

            // 遍历坐标
            points.forEach((point, index) => {
                if (index === 0) return;
                const lastPoint = points[index - 1];

                // 三角面1
                posArr.push(...lastPoint);
                uvArr.push(pointDistance[index - 1] / distance, 0);
                posArr.push(...point);
                uvArr.push(pointDistance[index] / distance, 0);
                posArr.push(lastPoint[0], lastPoint[1] + height, lastPoint[2]);
                uvArr.push(pointDistance[index - 1] / distance, 1);

                // 三角面2
                posArr.push(...point);
                uvArr.push(pointDistance[index] / distance, 0);
                posArr.push(point[0], point[1] + height, point[2]);
                uvArr.push(pointDistance[index] / distance, 1);
                posArr.push(lastPoint[0], lastPoint[1] + height, lastPoint[2]);
                uvArr.push(pointDistance[index - 1] / distance, 1);
            });
            geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(posArr), 3));
            geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvArr), 2));

            // 纹理
            const texture = new THREE.TextureLoader().load(textureUrl2);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;

            // 材质
            const material = new THREE.MeshBasicMaterial({
                color: color2,
                map: texture,
                transparent: true,
                opacity: 1,
                depthWrite: false,
                side: THREE.DoubleSide,
            });

            // 创建围栏
            const mesh2 = new THREE.Mesh(geometry, material);


            texture.repeat.set(10, 1); // 平铺
            textrue_offset(texture, "top", 0.5);

            return mesh2
        }


        const color3 = "#fff"; // 围栏3的颜色
        const textureUrl3 = "https://fine-fanta.oss-cn-hangzhou.aliyuncs.com/static/hts/texture-gradient-top.png";
        function d2() {

            // 几何体
            const geometry = new THREE.BufferGeometry(); // 缓冲几何体
            const posArr = [];
            const uvArr = [];
            // 遍历坐标
            points.forEach((point, index) => {
                if (index === 0) return;
                const lastPoint = points[index - 1];
                // 三角面1
                posArr.push(...lastPoint);
                uvArr.push(pointDistance[index - 1] / distance, 0);
                posArr.push(...point);
                uvArr.push(pointDistance[index] / distance, 0);
                posArr.push(lastPoint[0], lastPoint[1] + height, lastPoint[2]);
                uvArr.push(pointDistance[index - 1] / distance, 1);

                // 三角面2
                posArr.push(...point);
                uvArr.push(pointDistance[index] / distance, 0);
                posArr.push(point[0], point[1] + height, point[2]);
                uvArr.push(pointDistance[index] / distance, 1);
                posArr.push(lastPoint[0], lastPoint[1] + height, lastPoint[2]);
                uvArr.push(pointDistance[index - 1] / distance, 1);
            });
            geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(posArr), 3));
            geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvArr), 2));

            // 纹理
            const texture = new THREE.TextureLoader().load(textureUrl3);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;

            // 材质
            const material = new THREE.MeshBasicMaterial({
                color: color3,
                map: texture,
                transparent: true,
                opacity: 1,
                depthWrite: false,
                side: THREE.DoubleSide,
            });

            // 创建围栏
            const mesh3 = new THREE.Mesh(geometry, material);
            // this.scene.add(mesh3);
            return mesh3
        }

        if (equipmentType == 1) {
            if (m === 'A') {
                n2LineA = this.label02(-35, -10 + 20, 28)
                this.scene.add(n2LineA)
                n2LabelA = this.css2DLabel("通氮中...", 0)
                n2LabelA.position.set(-45, 10 + 10, 28)
                this.scene.add(n2LabelA)
                n2A1 = d1()
                this.scene.add(n2A1)
                n2A2 = d2()
                this.scene.add(n2A2)
            } else {
                n2LineB = this.label02(-15, -10 + 20, 28)
                this.scene.add(n2LineB)
                n2LabelB = this.css2DLabel("通氮中...", 0)
                n2LabelB.position.set(-25, 10 + 10, 28)
                this.scene.add(n2LabelB)
                n2B1 = d1()
                this.scene.add(n2B1)
                n2B2 = d2()
                this.scene.add(n2B2)
            }
        } else if (equipmentType == 4) {
            n2LineA = this.label02(-5 + 5, 8, 2)
            // this.scene.add(n2LineA)
            n2LabelA = this.css2DLabel("通氮中...", 0)
            n2LabelA.position.set(-5 + 5, 8, 2)
            this.scene.add(n2LabelA)
            n2A1 = d1()
            this.scene.add(n2A1)
            n2A2 = d2()
            this.scene.add(n2A2)
        } else if (equipmentType == 2) {
            n2A1 = d1()
            this.scene.add(n2A1)
            n2A2 = d2()
            this.scene.add(n2A2)
        }
        time && setTimeout(() => {
            m === 'A' && this.n2AStop()
            m === 'B' && this.n2BStop()
        }, time * 1000);

    }

    //停止A通氮
    n2AStop = () => {
        n2LineA && this.scene.remove(n2LineA)
        n2A1 && this.scene.remove(n2A1)
        n2A2 && this.scene.remove(n2A2)
        n2LabelA && this.scene.remove(n2LabelA)
    }
    //停止B通氮
    n2BStop = () => {
        n2LineB && this.scene.remove(n2LineB)
        n2B1 && this.scene.remove(n2B1)
        n2B2 && this.scene.remove(n2B2)
        n2LabelB && this.scene.remove(n2LabelB)

    }
    // 光墙
    wallData = () => {

        // 定义光幕参数
        const wallData = {
            position: {
                x: 0,
                y: 20,
                z: 0
            },
            height: 30,
            radius: 10,
            maxRadius: 40,
            color: '#efad35',
            opacity: 0.3,
            period: 2,
        }


        const point1 = new THREE.Vector3()
        const point2 = point1.clone().setY(point1.y + wallData.height)
        const curve = new THREE.LineCurve3(point1, point2);
        const geometry = new THREE.TubeGeometry(curve, 2, wallData.radius, 22, false);
        // 确定光墙包围盒box
        geometry.computeBoundingBox();
        const max = geometry.boundingBox.max;
        const min = geometry.boundingBox.min

        // 创建材质
        const material = new THREE.ShaderMaterial({
            color: wallData.color,
            opacity: wallData.opacity,
            transparent: true,
            side: THREE.DoubleSide, // 两面都渲染
            depthTest: false, // 关闭材质的深度测试
            uniforms: {
                uMax: {
                    value: max
                },
                uMin: {
                    value: min
                },
                uColor: {
                    value: new THREE.Color(wallData.color)
                }

            },
            vertexShader: `
                varying vec4 vPosition;
                void main() {
                  vPosition = modelMatrix * vec4(position,1.0);
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
        
              `,
            fragmentShader: `
                uniform vec3 uColor; // 光墙半径        
                uniform vec3 uMax; 
                uniform vec3 uMin;
                uniform mat4 modelMatrix; // 世界矩阵
                varying vec4 vPosition; // 接收顶点着色传递进来的位置数据
                
               
                void main() {
                  // 转世界坐标
                  vec4 uMax_world = modelMatrix * vec4(uMax,1.0);
                  vec4 uMin_world = modelMatrix * vec4(uMin,1.0);
                  // 根据像素点世界坐标的y轴高度,设置透明度
                  float opacity =1.0 - (vPosition.y - uMin_world.y) / (uMax_world.y -uMin_world.y); 
        
                   gl_FragColor = vec4( uColor, opacity);
                }
              `,
        })

        // 创建wall
        const wall = new THREE.Mesh(geometry, material)
        wall.renderOrder = 1000 // 渲染顺序

        wall.name = 'wall'
        const {
            x,
            y,
            z
        } = wallData.position
        wall.position.set(x, y, z)
        wall.updateMatrix()


        // const cityGroup = this.group.children[0]
        this.scene.add(wall)

        // 解耦
        const originScale = wall.scale.clone()
        setInterval(() => {
            const time = this.time.value
            const {
                period,
                radius,
                maxRadius
            } = wallData
            const rate = (time % period) / period
            const currRadius = rate * (maxRadius - radius) + radius
            const scaleRate = currRadius / radius
            const matrix = new THREE.Matrix4().makeScale(scaleRate, 1, scaleRate)

            wall.scale.copy(originScale.clone().applyMatrix4(matrix))
            wall.updateMatrix()
        }, 50)


    }
    // 飞行旋转特效
    ultrasound = () => {
        let flyLine;

        const length = 10;
        // 创建点数组
        const curve = new THREE.CubicBezierCurve3(new THREE.Vector3(-length, 0, 0), new THREE.Vector3(-length * (2 / 3), 0, -0), new THREE.Vector3(-length / 3, 0, -0), new THREE.Vector3(0, 0, 0));
        const pointsPosition = curve.getPoints(100); // 点数组
        const pointsGeometry = new THREE.BufferGeometry(); // 创建缓冲几何体
        // 填充点位
        const arr = pointsPosition.reduce((arr, point) => {
            const { x, y, z } = point;
            arr.push(x, y, z);
            return arr;
        }, []);
        pointsGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(arr), 3)); // 一个顶点由3个坐标构成

        // 缩放量
        const aScaleArr = pointsPosition.map((point, index) => {
            const scale = index / pointsPosition.length;
            // if (scale < 0.1) scale = 0.1
            return scale;
        });
        pointsGeometry.setAttribute("aScale", new THREE.BufferAttribute(new Float32Array(aScaleArr), 1)); // 一个缩放量由1个浮点数表示

        // 纹理和材质
        const pointTexture = new THREE.TextureLoader().load("https://fine-fanta.oss-cn-hangzhou.aliyuncs.com/static/hts/circle3.png");
        const pointsMaterial = new THREE.PointsMaterial({
            color: "#6A5ACD",
            map: pointTexture,
            // alphaTest: 0.1, 
            transparent: true, // 开启透明度
            depthWrite: false, // 禁止深度写入
            opacity: 0.6,
            size: 1, // 点大小
            sizeAttenuation: true, // 大小是否随相机深度衰减
            blending: THREE.AdditiveBlending,
        });

        // 修正着色器
        pointsMaterial.onBeforeCompile = (shader) => {
            // 包围盒box
            pointsGeometry.computeBoundingBox();
            const { max, min } = pointsGeometry.boundingBox;
            shader.uniforms.uMax = { value: max };
            shader.uniforms.uMin = { value: min };
            const vertex = `
        attribute float aScale; // 缩放量
        varying vec3 vPosition;
        void main() {
          vPosition = position; 
        `;
            const vertex1 = "gl_PointSize = size * aScale;"; // 设置点图元的不同大小
            shader.vertexShader = shader.vertexShader.replace("void main() {", vertex);
            shader.vertexShader = shader.vertexShader.replace("gl_PointSize = size;", vertex1);
            const fragment = `
        uniform vec3 uMax; 
        uniform vec3 uMin; 
        varying vec3 vPosition; // 接收顶点着色传递进来的位置数据
        void main() {
      `;
            const fragment1 = `
      float uOpacity = (vPosition.x - uMin.x) / (uMax.x - uMin.x)*opacity ;
      vec4 diffuseColor = vec4( diffuse, uOpacity);
      `;
            shader.fragmentShader = shader.fragmentShader.replace("void main() {", fragment);
            shader.fragmentShader = shader.fragmentShader.replace("vec4 diffuseColor = vec4( diffuse, opacity );", fragment1);
        };
        // 创建飞线
        flyLine = new THREE.Group();
        const points = new THREE.Points(pointsGeometry, pointsMaterial);
        points.rotateY((Math.PI / 180) * -30);
        flyLine.add(points);
        // 复用飞线
        const num = 500;
        let flyLineGroup = new THREE.Group();
        flyLineGroup.position.set(26, -19, -42)
        flyLineGroup.rotation.x = Math.PI / 2

        for (let i = 0; i < num; i++) {
            const flyLineCopy = flyLine.clone();
            // const scale = Math.random() * 0.7 + 0.3
            // flyLineCopy.scale.set(scale, scale, scale)
            flyLineCopy.updateMatrix();

            // 初始位置和姿态设置
            const range = 20;
            const offset = 15;
            let x = Math.random() * range * 2;
            const y = Math.random() * range * 0.3;
            let z = Math.random() * range * 2;
            if (x < range) x = -x - offset;
            if (x > range) x = x - range + offset;
            if (z < range) z = -z - offset;
            if (z > range) z = z - range + offset;

            flyLineCopy.position.set(x, y, z);
            const q = new THREE.Quaternion();
            q.setFromUnitVectors(new THREE.Vector3(0, 0, -1), new THREE.Vector3(flyLineCopy.position.x, 0, flyLineCopy.position.z).normalize());
            flyLineCopy.quaternion.premultiply(q);
            flyLineCopy.updateMatrix();

            // 其他数据设置
            flyLineCopy.angleSpeed = 5 + Math.random() * 50; // 每秒旋转速度
            flyLineCopy.offsetSpeed = 1500; // 聚拢时长
            flyLineGroup.add(flyLineCopy);
        }
        // 更新飞线
        const start = Date.now();
        let last = start;
        let stop = false;
        this.timer['ultrasound'] = requestAnimationFrame(function h() {
            const now = Date.now();
            const dt = now - last;
            last = now;
            if (stop) return; // 停止后，则不执行
            this.timer['ultrasound2'] = requestAnimationFrame(h);
            if (dt <= 0) return;
            flyLineGroup.children.forEach((flyLineCopy) => {
                flyLineCopy.visible = true;
                const { angleSpeed, offsetSpeed } = flyLineCopy;
                const dAngle = (-angleSpeed * dt) * 1;
                const q = new THREE.Quaternion();
                q.setFromAxisAngle(new THREE.Vector3(0, 1, 0).normalize(), (Math.PI / 180) * dAngle);
                flyLineCopy.position.applyQuaternion(q);

                // 位置聚拢
                const { x, y, z } = flyLineCopy.position;
                const dOffset = 1 - dt / offsetSpeed;
                flyLineCopy.position.set(x * dOffset, y * dOffset, z * dOffset);
                flyLineCopy.quaternion.premultiply(q);
                flyLineCopy.updateMatrix();
            });
        });
        return flyLineGroup
    }
    //打开超声
    openUltrasound = (time) => {
        ultrasoundFly = this.ultrasound()
        this.scene.add(ultrasoundFly);
        ultraLine = this.label02(50, -10, -38)
        this.scene.add(ultraLine)
        ultraLabel = this.css2DLabel("超声中...", 0)
        ultraLabel.position.set(50, -10, -38)
        this.scene.add(ultraLabel)
        time && setTimeout(() => {
            this.closeUltrasound()
        }, time * 1000);
    }
    //关闭超声
    closeUltrasound = () => {
        ultrasoundFly && this.scene.remove(ultrasoundFly);
        ultraLabel && this.scene.remove(ultraLabel)
        ultraLine && this.scene.remove(ultraLine)

    }
    //真空
    vacuumA = (time) => {
        planeA = this.createPlane([-26, -5, 4])
        this.scene.add(planeA);
        vacuumLineA = this.label02(-35, -5, 20)
        this.scene.add(vacuumLineA)
        vacuumLabelA = this.css2DLabel("抽真空中...", 0)
        vacuumLabelA.position.set(-45, 5, 20)
        this.scene.add(vacuumLabelA)
        time && setTimeout(() => {
            this.vacuumAStop()
        }, time * 1000);

    }
    vacuumB = (time) => {
        planeB = this.createPlane([-10, -5, 4])
        this.scene.add(planeB);
        vacuumLineB = this.label02(-19, -5, 20)
        this.scene.add(vacuumLineB)
        vacuumLabelB = this.css2DLabel("抽真空中...", 0)
        vacuumLabelB.position.set(-29, 10, 20)
        this.scene.add(vacuumLabelB)
        time && setTimeout(() => {
            this.vacuumBStop()
        }, time * 1000);
    }


    vacuumD = (time) => {
        // console.log("run---真空D=======================================");
        planeD = this.createPlane([20, -7, 4])
        this.scene.add(planeD)
        vacuumLineD = this.label02(9, -5, 20)
        this.scene.add(vacuumLineD)
        vacuumLabelD = this.css2DLabel("抽真空中...", 0)
        vacuumLabelD.position.set(-9, 10, 20)
        this.scene.add(vacuumLabelD)
        time && setTimeout(() => {
            this.vacuumDStop()
        }, time * 1000);
    }
    vacuumAStop = () => {
        this.scene.remove(vacuumLineA)
        this.scene.remove(vacuumLabelA)
        this.scene.remove(planeA)
    }
    vacuumBStop = () => {
        this.scene.remove(vacuumLineB)
        this.scene.remove(vacuumLabelB)
        this.scene.remove(planeB)
    }
    vacuumDStop = () => {
        this.scene.remove(vacuumLineD)
        this.scene.remove(vacuumLabelD)
        this.scene.remove(planeD);
    }
    createPlane = (position) => {

        // 贝塞尔曲线
        function bezier(P0, P1, P2, P3, t) {
            const x = P0.x * (1 - t) * (1 - t) * (1 - t) + 3 * P1.x * t * (1 - t) * (1 - t) + 3 * P2.x * t * t * (1 - t) + P3.x * t * t * t;
            const y = P0.y * (1 - t) * (1 - t) * (1 - t) + 3 * P1.y * t * (1 - t) * (1 - t) + 3 * P2.y * t * t * (1 - t) + P3.y * t * t * t;
            const z = P0.z * (1 - t) * (1 - t) * (1 - t) + 3 * P1.z * t * (1 - t) * (1 - t) + 3 * P2.z * t * t * (1 - t) + P3.z * t * t * t;
            return { x, y, z };
        }
        // 创建几何体
        const width = 16; // 宽度
        const height = 40; // 高度
        const positionArr = []; // 顶点
        const normalArr = []; // 法线
        const uvArr = []; // uv
        const geometry = new THREE.PlaneGeometry(width, height, 1 * width, 1 * height);
        Array.from(geometry.index.array).forEach((vertexIndex) => {
            let tArr = geometry.attributes.position.array;
            let i = vertexIndex * 3;
            positionArr.push(tArr[i], tArr[i + 1], tArr[i + 2]); // 顶点

            tArr = geometry.attributes.normal.array;
            i = vertexIndex * 3;
            normalArr.push(tArr[i], tArr[i + 1], tArr[i + 2]); // 法线

            tArr = geometry.attributes.uv.array;
            i = vertexIndex * 2;
            uvArr.push(tArr[i], tArr[i + 1]); // uv
        });
        let bufferGeometry = new THREE.BufferGeometry(); // 缓冲几何体
        bufferGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positionArr), 3));
        bufferGeometry.setAttribute("originPosition", new THREE.BufferAttribute(new Float32Array(positionArr), 3));
        bufferGeometry.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(normalArr), 3));
        bufferGeometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvArr), 2));
        bufferGeometry.faceAnimateArr = [];
        for (let i = 0; i < bufferGeometry.attributes.position.count; i++) {
            // 三角面
            if (i % 3 === 0) {
                const y = bufferGeometry.attributes.position.array[i * 3 + 1];
                const y_sign = Math.sign(y);
                let obj = {
                    circle: 1500, // 周期
                    startTime: null, // 起始时间
                    progress: 0, // 进度
                    bezier: null, // 贝赛尔曲线
                };
                const start = { x: 0, y: 0, z: 0 }; // 起点
                const end = start; // 终点
                let control1 = { x: Math.random() * 50, y: y_sign * (Math.random() * 80), z: 0 }; // 控制点1
                let control2 = { x: Math.random() * 50, y: -y_sign * 20, z: 0 }; // 控制点2
                obj.bezier = { start, control1, control2, end };
                bufferGeometry.faceAnimateArr.push(obj);
            }
        }

        // 材质
        const material = new THREE.MeshStandardMaterial({
            color: '#4BE992',
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8,
            depthWrite: false
        });

        // 平面
        const plane = new THREE.Mesh(bufferGeometry, material);
        plane.rotateX(Math.PI / 2)
        plane.position.set(...position)
        // 碎片运动
        let startTime = Date.now(); // 开始时间
        const circle = 1500; // 周期
        let progress = 0; // 进度
        this.timer['createPlane1'] = requestAnimationFrame(function h() {
            this.timer['createPlane2'] = requestAnimationFrame(h);
            progress = (Date.now() - startTime) / circle; // 计算进度
            if (progress > 1) progress = 1;
            let startX = -width / 2;
            let currX = startX + width * progress;

            // 遍历三角面
            bufferGeometry.faceAnimateArr.forEach((face, index) => {
                const tArr = bufferGeometry.attributes.originPosition.array; // 类数组对象
                const face_firstVertex = { x: tArr[index * 3 * 3], y: tArr[index * 3 * 3 + 1], z: tArr[index * 3 * 3 + 2] };
                if (!face.startTime && face_firstVertex.x < currX) {
                    face.startTime = Date.now();
                }

                if (face.startTime && face.progress < 1) {
                    face.progress = (Date.now() - face.startTime) / face.circle;
                    if (face.progress > 1) face.progress = 1;
                    for (let i = 0; i < 3; i++) {
                        const currVertexIndex = index * 3 + i;
                        const originPos = { x: tArr[currVertexIndex * 3], y: tArr[currVertexIndex * 3 + 1], z: tArr[currVertexIndex * 3 + 2] }; // 原始位置
                        const { start, control1, control2, end } = bufferGeometry.faceAnimateArr[index].bezier;
                        const bezierPos = bezier(start, control1, control2, end, face.progress); // 计算贝塞尔点位置
                        const newPos = { x: originPos.x + bezierPos.x, y: originPos.y + bezierPos.y, z: originPos.z + bezierPos.z };
                        bufferGeometry.attributes.position.setXYZ(currVertexIndex, newPos.x, newPos.y, newPos.z); // 更新位置
                    }
                }
            });
            plane.geometry.dispose();
            plane.geometry = bufferGeometry.clone();
        });
        return plane
    }
    createGroundGrid(width, height, widthSegment, heightSegment, materialParams) {
        // adjust segments when they are not integer
        widthSegment = width / Math.floor(width / widthSegment)
        heightSegment = height / Math.floor(height / heightSegment)
        const DELTA = 0.000001 // used to ignore digital error
        const points = []
        const halfWidth = width / 2
        const halfHeight = height / 2
        let i = 0
        // draw horizontal lines first, from bottom to top
        for (let h = -halfHeight; h <= halfHeight + DELTA; h += heightSegment, i++) {
            const endWidth = (i % 2 === 0) ? halfWidth : -halfWidth
            if (i === 0) {
                points.push(new THREE.Vector2(-halfWidth, h))
            }
            points.push(new THREE.Vector2(endWidth, h))
            if (h < halfHeight) {
                points.push(new THREE.Vector2(endWidth, h + heightSegment))
            }
        }
        const startFromLeft = !!(i % 2 === 0) // check if the last point is in right or left
        // then, draw vertical lines, from left or right, depends on where the last point is
        if (startFromLeft) {
            for (let w = -halfWidth, i = 0; w <= halfWidth + DELTA; w += widthSegment, i++) {
                const endHeight = (i % 2 === 0) ? -halfHeight : halfHeight
                points.push(new THREE.Vector2(w, endHeight))
                if (w < halfWidth) {
                    points.push(new THREE.Vector2(w + widthSegment, endHeight))
                }
            }
        } else {
            for (let w2 = halfWidth, j = 0; w2 + DELTA >= -halfWidth; w2 -= widthSegment, j++) {
                const endHeight2 = (j % 2 === 0) ? -halfHeight : halfHeight
                points.push(new THREE.Vector2(w2, endHeight2))
                if (w2 > -halfWidth) {
                    points.push(new THREE.Vector2(w2 - widthSegment, endHeight2))
                }
            }
        }

        const DEFAULT_PARAMS = { color: 0x000, transparent: false, wireframeLinewidth: 0.5 }
        const params = { ...DEFAULT_PARAMS, ...materialParams }
        const mat = new THREE.MeshBasicMaterial(params)
        mat.wireframe = false

        const geometry = new THREE.BufferGeometry()
        geometry.setFromPoints(points)
        const line = new THREE.Line(geometry, mat)
        line.rotation.x = -0.5 * Math.PI // make the panel horizontal
        line.position.y = -5
        return line
    }

    createGroundPlane(position, length, width) {
        const originMaterial = {
            color: 'rgb(192,192,192)',
            metalness: 1.0,
            roughness: 0.6,
            // reflectivity: 0.5,
        }
        let planeMaterial = new THREE.MeshPhysicalMaterial(originMaterial)
        let cubeGeometry = new THREE.BoxGeometry(length, width, 1)
        let cube = new THREE.Mesh(cubeGeometry, planeMaterial)
        let edges = new THREE.EdgesGeometry(cubeGeometry)
        let edgesMaterials = new THREE.LineBasicMaterial({ color: 0x000 })
        let line = new THREE.LineSegments(edges, edgesMaterials)
        line.position.set(position[0], position[1], position[2])
        cube.position.set(position[0], position[1], position[2])
        cube.rotation.x -= Math.PI * 0.5;
        cube.position.y -= 1.5;
        line.rotation.x -= Math.PI * 0.5;
        line.position.y -= 1.5;
        return cube
    }

    // 创建一个地面,用来接收正方体的阴影
    addGround(type) {

        if (type == 'eq01') {
            const geometry = new THREE.PlaneGeometry(1000, 1000);
            const material = new THREE.MeshPhongMaterial({ color: 0xe9e9e9, depthWrite: false });

            const ground = new THREE.Mesh(geometry, material);
            ground.position.set(0, - 100, 0);
            ground.rotation.x = - Math.PI / 2;
            ground.receiveShadow = true;
            this.scene.add(ground);

            const grid = new THREE.GridHelper(1000, 50, 0x000000, 0x000000);
            grid.position.y = - 100;
            grid.material.opacity = 0.2;
            grid.material.transparent = true;
            this.scene.add(grid);
        } else {
            const geometry = new THREE.PlaneGeometry(500, 500);
            const material = new THREE.MeshPhongMaterial({ color: 0xe9e9e9, depthWrite: false });

            const ground = new THREE.Mesh(geometry, material);
            ground.position.set(0, - 5, 0);
            ground.rotation.x = - Math.PI / 2;
            ground.receiveShadow = true;
            this.scene.add(ground);

            const grid = new THREE.GridHelper(500, 100, 0x000000, 0x000000);
            grid.position.y = - 5;
            grid.material.opacity = 0.2;
            grid.material.transparent = true;
            this.scene.add(grid);
        }

    }

}
