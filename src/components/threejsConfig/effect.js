import * as THREE from 'three'


const tempUp = (color, points, height) => {
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
    textrue_offset(texture, "right", 1);
    return mesh
    // 偏移

}

const ventilateN2 = (config) => {
    const { height, points } = config

    function textrue_offset(texture, direction = "right", speed = 0.5) {
        // 开始时间
        const start = Date.now();
        const h = () => {
            requestAnimationFrame(h);
            const now = Date.now();
            const offset = ((now - start) / 1000) * speed;
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

    let groupN2 = new THREE.Object3D()
    groupN2.add(d1(), d2())
    return groupN2
}
// 贴图偏移
const textrue_offset = (texture, direction = "right", speed = 0.5) => {
    // 开始时间
    const start = Date.now();
    const h = () => {
        requestAnimationFrame(h);
        const now = Date.now();
        const offset = ((now - start) / 1000) * speed;
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
    requestAnimationFrame(h);
}

const label02 = (x, y, z) => {
    //定义线
    // 创建材质
    const material = new THREE.LineBasicMaterial({ color: 0x9ab870 });
    // 创建空几何体
    const geometry = new THREE.BufferGeometry()
    const points = [];

    points.push(new THREE.Vector3(0, 0, 0));
    points.push(new THREE.Vector3(-4, 4, 0));
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



const createWall = (config) => {
    // 定义光幕参数
    const { timer, name, color } = config
    const wallData = {
        position: {
            x: -30,
            y: 60,
            z: -40
        },
        height: 100,
        radius: 30,
        maxRadius: 60,
        color: color ? color : '#98fb98',
        opacity: 0.2,
        period: 10,
    }


    const point1 = new THREE.Vector3()
    const point2 = point1.clone().setY(point1.y + wallData.height)
    const curve = new THREE.LineCurve3(point1, point2);
    const geometry = new THREE.TubeGeometry(curve, 20, wallData.radius, 4, false);
    // 确定光墙包围盒box
    geometry.computeBoundingBox();
    const max = geometry.boundingBox.max;
    const min = geometry.boundingBox.min

    // 创建材质
    const material = new THREE.ShaderMaterial({
        // color: wallData.color,
        opacity: wallData.opacity,
        transparent: true,
        side: THREE.DoubleSide, // 两面都渲染
        depthTest: false, // 关闭材质的深度测试
        depthWrite: false,
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
    wall.renderOrder = 1 // 渲染顺序
    wall.rotation.y = Math.PI / 4
    wall.name = name
    const {
        x,
        y,
        z
    } = wallData.position
    wall.position.set(x, y, z)
    wall.updateMatrix()



    // 解耦
    const originScale = wall.scale.clone()
    let timeChange = 1
    timer.current = setInterval(() => {
        const time = timeChange
        timeChange = timeChange + 0.1
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

    wall.visible = false
    return wall

}
// 创建圆块和光柱
function createCircle() {
    // 所有圆块，共用几何体和材质


    // 定义光柱
    const group = new THREE.Group();
    // !(() => {
    // 光柱参数
    const wallData = {
        position: {
            x: 0,
            y: 0,
            z: 0,
        },
        height: 60, // 光幕高度
        radius: 15, // 光幕半径
        maxRadius: 450, // 光幕扩散最大搬家
        color: "#e7dffa", // 光幕颜色
        opacity: 0.2, // 光幕基本透明度
        period: 10, // 光幕扩散一轮的周期
    };

    const geometry2 = new THREE.CylinderGeometry(wallData.radius, wallData.radius, wallData.height, 100);
    // 包围盒box
    geometry2.computeBoundingBox();
    const max = geometry2.boundingBox.max;
    const min = geometry2.boundingBox.min;

    // 创建材质
    const material2 = new THREE.ShaderMaterial({
        // color: wallData.color,
        transparent: true, // 开启透明
        side: THREE.DoubleSide, // 两面都渲染
        depthTest: false, // 关闭材质的深度测试
        // blend: THREE.AdditiveBlending,
        uniforms: {
            uMax: {
                value: max, // 物体坐标系下的值
            },
            uMin: {
                value: min,
            },
            uColor: {
                value: new THREE.Color(wallData.color),
            },
        },
        vertexShader: `
        varying vec4 vPosition;
        void main() {
          vPosition = vec4(position,1.0) ;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }

      `,
        fragmentShader: `
        uniform vec3 uColor; // 光墙半径
        uniform vec3 uMax; // 最高的坐标(物体坐标系)
        uniform vec3 uMin; // 最低的坐标(物体坐标系)
        varying vec4 vPosition; // 接收顶点着色传递进来的位置数据
        void main() {
          // 根据像素点世界坐标的y轴高度,设置透明度
          float opacity = 1.0 - (vPosition.y - uMin.y) / (uMax.y -uMin.y);
           gl_FragColor = vec4( uColor.x + opacity/2.0, uColor.y + opacity/2.0, uColor.z + opacity/2.0, opacity);
        }
      `,
    });

    // 创建mesh，
    const wall = new THREE.Mesh(geometry2, material2);
    // wall.renderOrder = 1000 // 渲染顺序调高
    wall.name = "wall";
    const { x, y, z } = wallData.position;
    wall.position.set(x, y, z);
    wall.updateMatrix();
    group.add(wall);

    return group
}

const createPartical = ({ color = 'rgb(193, 5, 180)', position = { x: 0, y: 0, z: 100 }, size = 5, count = 500, speed = { x: 0.1, y: 0.2 } } = {}) => {

    let particle = new THREE.Object3D();
    let geometry = new THREE.TetrahedronGeometry(size, 0);
    let material = new THREE.MeshPhongMaterial({
        color: color,
        // shading: THREE.FlatShading
    });

    for (var i = 0; i < count; i++) {
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        mesh.position.multiplyScalar((Math.random() * 200));
        mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);//旋转

        particle.add(mesh);


    }
    particle.position.set(position.x, position.y, position.z)
    animate()
    function animate() {
        requestAnimationFrame(animate);

        particle.rotation.x += speed.x;
        particle.rotation.y -= speed.y;
    }

    // particle.visible = false
    return particle
}
export { tempUp, ventilateN2, label02, createWall, createCircle, createPartical }