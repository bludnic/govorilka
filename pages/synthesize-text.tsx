import React, { KeyboardEvent, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import GetAppIcon from '@material-ui/icons/GetApp';
import Grid from '@material-ui/core/Grid';
import { NextPage } from 'next';
import { TextField } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { VoicesCombobox } from 'components/VoicesCombobox';
import apiClient, { SsmlVoiceGender, Voice } from 'util/apiClient';
import { downloadMp3 } from 'util/downloadMp3';
import { MenuPropsBottom } from 'util/mui';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: '#fff',
        },
        container: {
            maxWidth: 880,
            padding: theme.spacing(4),
        },
        spacer: {
            flewGrow: 1,
        },
        formControl: {
            minWidth: 120,
        },
    }),
    { name: 'SynthesizeText' },
);

type Props = {};

const defaultVoice: Voice = {
    languageCodes: ['ru-RU'],
    name: 'ru-RU-Wavenet-D',
    ssmlGender: SsmlVoiceGender.MALE,
    naturalSampleRateHertz: 24000,
};

const SynthesizeText: NextPage<Props> = () => {
    const classes = useStyles();

    const [loading, setLoading] = useState(false);

    const [voices, setVoices] = useState<Voice[]>([]);

    const [text, setText] = useState('');
    const [voice, setVoice] = useState<Voice | null>(defaultVoice);
    const [voiceGender, setVoiceGender] = useState<SsmlVoiceGender>(
        SsmlVoiceGender.MALE,
    );
    const [speakingRate, setSpeakingRate] = useState<number | ''>(1.0);
    const [filename, setFilename] = useState('');

    useEffect(() => {
        async function fetchVoices() {
            try {
                const { data } = await apiClient.voices();
                setVoices(data.voices);
            } catch (err) {
                console.error(err);
            }
        }

        fetchVoices();
    }, []);

    const handleDownload = () => {
        async function synthesize() {
            if (!voice) {
                console.error('No voice selected');
                return;
            }

            setLoading(true);

            try {
                const { data } = await apiClient.textSynthesize(
                    text,
                    voice.languageCodes[0],
                    voice.name,
                    voiceGender || voice.ssmlGender,
                    speakingRate || 1,
                );

                downloadMp3(data.audioContent, filename);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        synthesize();
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            if (text) handleDownload();
        }
    };

    return (
        <div className={classes.root}>
            <Container className={classes.container}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <VoicesCombobox
                            value={voice}
                            onChange={setVoice}
                            voices={voices}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <FormControl
                            variant="outlined"
                            fullWidth
                            className={classes.formControl}
                        >
                            <InputLabel id="gender-label">
                                Voice gender
                            </InputLabel>
                            <Select
                                labelId="gender-label"
                                id="gender"
                                value={voiceGender}
                                onChange={(e) =>
                                    setVoiceGender(
                                        e.target.value as SsmlVoiceGender,
                                    )
                                }
                                label="Voice gender"
                                MenuProps={MenuPropsBottom}
                            >
                                {Object.keys(SsmlVoiceGender).map((gender) => (
                                    <MenuItem key={gender} value={gender}>
                                        {gender}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField
                            label="Speaking rate"
                            fullWidth
                            variant="outlined"
                            type="number"
                            value={speakingRate}
                            onChange={(e) => {
                                setSpeakingRate(
                                    e.target.value === ''
                                        ? ''
                                        : Number(e.target.value),
                                );
                            }}
                            InputProps={{
                                inputProps: {
                                    min: 0.25,
                                    max: 4,
                                },
                            }}
                            required
                            helperText="Speaking rate/speed, in the range [0.25, 4.0]"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            multiline
                            fullWidth
                            rows={16}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                            placeholder="File name"
                            fullWidth
                            variant="outlined"
                            size="small"
                            onKeyPress={handleKeyPress}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            disabled={!voice || !text || loading}
                            onClick={handleDownload}
                            startIcon={<GetAppIcon />}
                            endIcon={
                                loading ? <CircularProgress size={18} /> : null
                            }
                        >
                            MP3
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default SynthesizeText;
