import Recorder from './recorder';

let microphoneStream; // stream from getUserMedia()
let rec = Recorder; // Recorder.js object
let input; // MediaStreamAudioSourceNode we'll be recording
let frame;

/**
 *
 * @param {{
 * audioContext: AudioContext
 * setVol: Function
 * errHandler?: () => void
 * onStreamLoad?: () => void
 * }}
 * @returns {Promise<MediaStream>}
 */
export async function startRecording({
  audioContext,
  setVol,
  errHandler,
  onStreamLoad,
}) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    if (onStreamLoad) {
      onStreamLoad();
    }

    /*  assign stream for later use  */
    microphoneStream = stream;

    /* use the stream */
    input = audioContext.createMediaStreamSource(stream);
    
    const analyserNode = audioContext.createAnalyser();

    analyserNode.smoothingTimeConstant = 0.8;
    analyserNode.fftSize = 1024;

    input.connect(analyserNode);
    setVol(0);

    const onFrame = () => {
        frame = undefined;
        const array =  new Uint8Array(analyserNode.frequencyBinCount);
        analyserNode.getByteFrequencyData(array);
        const averageVolume = getAverageVolume(array);
        setVol(averageVolume); 
        if (!frame) {
            frame = window.requestAnimationFrame(onFrame);
        }
    };

    frame = window.requestAnimationFrame(onFrame);

    rec = new Recorder(input);

    // start the recording process
    rec.record();

    return stream;
  } catch (err) {
    console.log(err);

    if (errHandler) {
      errHandler();
    }
  }
}

/**
 *
 * @param {{
 * exportWAV: boolean
 * wavCallback?: (blob: Blob) => void
 * }}
 */
export function stopRecording({ exportWAV, wavCallback }) {
  // stop recorder.js recording
  rec.stop();

  // stop microphone access
  microphoneStream.getAudioTracks()[0].stop();
  window.cancelAnimationFrame(frame)

  // create the wav blob
  if (exportWAV && wavCallback) {
    rec.exportWAV((blob) => wavCallback(blob));
  }

  rec.clear();
}

function getAverageVolume( array ) {
  var amplitudeSum = 0;

  for (let i = 0; i < array.length; i++) {
      amplitudeSum += array[i];
  }

  return ((amplitudeSum / array.length) * 1.75) / 100;
}