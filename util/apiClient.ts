import axios, { AxiosPromise } from 'axios';

const api = axios.create({
    baseURL: 'https://texttospeech.googleapis.com/v1',
    params: {
        key: process.env.NEXT_PUBLIC_TTS_API_KEY,
    },
});

export default {
    /**
     * @param languageCode BCP-47 language tag
     */
    voices(languageCode?: string): AxiosPromise<VoicesResponse> {
        return api.get('/voices', {
            params: {
                languageCode,
            },
        });
    },
    /**
     *
     * @param ssml The text to be synthesized in SSML format.
     * @param languageCode BCP-47 language tag, e.g. "en-US".
     * @param voiceName The name of the voice.
     * @param ssmlGender The preferred gender of the voice.
     * @param speakingRate Speaking rate/speed, in the range [0.25, 4.0]. 1.0 is the normal native speed supported by the specific voice.
     * @param audioEncoding The format of the audio byte stream.
     */
    textSynthesize(
        ssml: string,
        languageCode: string,
        voiceName: string,
        ssmlGender: SsmlVoiceGender,
        speakingRate: number = 1.0,
        audioEncoding = 'MP3'
    ): AxiosPromise<TextSynthesizeResponse> {
        return api.post('/text:synthesize', {
            input: {
                ssml: `<speak>${ssml}</speak>`,
            },
            voice: {
                languageCode,
                name: voiceName,
                ssmlGender,
            },
            audioConfig: {
                audioEncoding,
                speakingRate,
            },
        });
    },
};

export type VoicesResponse = {
    voices: Voice[];
};

export type Voice = {
    languageCodes: string[];
    name: string;
    ssmlGender: SsmlVoiceGender;
    naturalSampleRateHertz: number;
};

export enum SsmlVoiceGender {
    SSML_VOICE_GENDER_UNSPECIFIED = 'SSML_VOICE_GENDER_UNSPECIFIED',
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    NEUTRAL = 'NEUTRAL',
}

enum AudioEncoding {
    AUDIO_ENCODING_UNSPECIFIED = 'AUDIO_ENCODING_UNSPECIFIED',
    LINEAR16 = 'LINEAR16',
    MP3 = 'MP3',
    OGG_OPUS = 'OGG_OPUS',
}

type TextSynthesizeResponse = {
    audioContent: string;
};
