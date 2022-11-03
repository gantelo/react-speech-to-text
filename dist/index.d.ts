/// <reference types="react" />
import { GoogleCloudRecognitionConfig } from './GoogleCloudRecognitionConfig';
export interface SpeechRecognitionProperties {
    grammars?: SpeechGrammarList;
    interimResults?: boolean;
    lang?: string;
    maxAlternatives?: number;
}
export declare type ResultType = {
    speechBlob?: Blob;
    timestamp: number;
    transcript: string;
    confidence: number;
};
export interface UseSpeechToTextTypes {
    continuous?: boolean;
    fullAudio?: boolean;
    crossBrowser?: boolean;
    googleApiKey?: string;
    googleCloudRecognitionConfig?: GoogleCloudRecognitionConfig;
    onStartSpeaking?: () => any;
    onStoppedSpeaking?: () => any;
    speechRecognitionProperties?: SpeechRecognitionProperties;
    timeout?: number;
    useLegacyResults?: boolean;
    useOnlyGoogleCloud?: boolean;
    threshold?: number;
}
export default function useSpeechToText({ continuous, fullAudio, crossBrowser, googleApiKey, googleCloudRecognitionConfig, onStartSpeaking, onStoppedSpeaking, speechRecognitionProperties, timeout, useOnlyGoogleCloud, useLegacyResults, threshold }: UseSpeechToTextTypes): {
    error: string;
    interimResult: string | undefined;
    isRecording: boolean;
    results: string[] | ResultType[];
    recordingVolume: number | undefined;
    setResults: import("react").Dispatch<import("react").SetStateAction<ResultType[]>>;
    startSpeechToText: () => Promise<void>;
    stopSpeechToText: (reset?: boolean | undefined) => void;
    stopSpeechToTextNoData: () => void;
};
