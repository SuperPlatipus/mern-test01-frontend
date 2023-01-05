import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import Webcam from "react-webcam";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";

const Test = () => {
    const webcamRef = useRef(null)
    const canvasRef = useRef(null)
    const { user } = useAuthContext()
    const [poseList, setPoseList] = useState([])
    const [error, setError] = useState('')
    const [emptyFields, setEmptyFields] = useState([])

    // formulario

    const refTitle = useRef('')
    const refDescription = useRef('')
    const refTestee = useRef('')


    let detector = null
    let savedPoses = []
    let recording = false
    let frameCount = 0

    let objectToUpload = {
        title: 'Dummy title',
        description: 'Dummy description',
        testee: 'Dummy testee',
        testPseudo3d: ['asdasd', 123, 'qweqwe'],
        test3d: ['dsadsa', 321, 'ewqewq'],
        keywords: ['Dummy keywords'],
        // shareable: true
    }

    let testPoses = []
    let test3dPoses = []

    const handleSave = async (e) => {

        if (!user) {
            setError('You must be logged in')
            return
        }

        objectToUpload.title = refTitle.current.value
        objectToUpload.description = refDescription.current.value
        objectToUpload.testee = refTestee.current.value
        objectToUpload.testPseudo3d = [...testPoses]
        objectToUpload.test3d = [...test3dPoses]

        const testData = {...objectToUpload}

        console.log(testData)
        

        const response = await fetch(`${process.env.REACT_APP_API_ROUTE}/api/tests`, {
            method: 'POST',
            body: JSON.stringify(testData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()
        if (!response.ok) {
            console.log(json)
            // setEmptyFields(json.emptyFields)
        }

        if (response.ok) {
            setError(null)
            setEmptyFields([])
            console.log('New test added')
            
            //TODO add la cosa para que no lo baje de nuevo
        }

        // title,
        // description,
        // testee,
        // test,
        // test3d,
        // keywords,
        // shareable

    }

    const handlePrint = () => {
        console.log(savedPoses)
        setPoseList(JSON.stringify(savedPoses))
        // setPoseList(savedPoses)
        console.log(JSON.stringify(test3dPoses))
        console.log(JSON.stringify(testPoses))
    }

    const toggleRecord = () => {
        recording = !recording
    }

    const runBlazePose = async () => {
    const blazeNet = poseDetection.SupportedModels.BlazePose;
    const detectorConfig = {
        runtime: "tfjs",
        modelType: "full",
    };

    detector = await poseDetection.createDetector(blazeNet, detectorConfig);
    };

    const runModelLoop = async () => {
    await detect(detector);
    requestAnimationFrame(runModelLoop);
    };

    const detect = async (net) => {
        if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4 &&
        detector !== null
    ) {
        const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;

        // const pose = await net.estimateSinglePose(video)
        const pose = await detector.estimatePoses(video);

        if (pose !== undefined && recording === true) {
        console.log(pose);
        savedPoses.push(pose)
        test3dPoses.push(pose[0].keypoints3D)
        testPoses.push(pose[0].keypoints)
        frameCount++
        console.log(performance.now())
        }
    }
    };
  // runBlazePose()
  // runPosenet()
  // runModelLoop()

    useEffect(() => {

    }, [setPoseList])

    useEffect(() => {
    runBlazePose();
    runModelLoop();
    }, []);

    return (
    <div>
        <h1>Camera Test</h1>
        <Webcam
        ref={webcamRef}
        style={{
            // position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
        }}
        />
        <canvas
        ref={canvasRef}
        style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
        }}
        />
        <div>
            <button onClick={toggleRecord}>Record</button>
            <button>Stop</button>
            <button onClick={handlePrint}>Print</button>
            <button onClick={handleSave}>Save to cloud</button>

        </div>

        <div>
            <label>Title:</label>
            <input
                type="text"
                ref={refTitle}
            />
            <label>Testee:</label>
            <input
                type="text"
                ref={refTestee}
            />
            <label>Description:</label>
            <textarea
                cols="30"
                rows="10"
                ref={refDescription}
            ></textarea>
            <label>Key words:</label>
            <input type="text"/>
            <label>Shareable:</label>
            <input type="checkbox" defaultChecked/>
        </div>

        <div>
            <p>ALOOO: {poseList}</p>
        </div>

    </div>
    );
};

        // title,
        // description,
        // testee,
        // test,
        // test3d,
        // keywords,
        // shareable

export default Test;
