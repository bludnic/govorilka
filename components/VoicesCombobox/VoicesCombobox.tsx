import React, { ChangeEvent, FC } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'next-i18next';

import { Voice } from 'util/apiClient';

const useStyles = makeStyles(
    () => ({
        /* Styles applied to the root element. */
        root: {},
    }),
    { name: 'VoicesCombobox' },
);

type Props = {
    value: Voice | null;
    onChange: (voice: Voice | null) => void;
    voices: Voice[];
};

export const VoicesCombobox: FC<Props> = (props) => {
    const { voices, value, onChange } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    const handleChange = (e: ChangeEvent<{}>, value: Voice | null) => {
        onChange(value);
    };

    return (
        <Autocomplete<Voice>
            value={value}
            onChange={handleChange}
            className={classes.root}
            options={voices}
            getOptionLabel={(voice) => voice.name}
            getOptionSelected={(option, value) => option.name === value.name}
            renderInput={(params) => (
                <TextField {...params} label={t('voice')} variant="outlined" />
            )}
            renderOption={(option) => (
                <ListItemText
                    primary={option.name}
                    secondary={option.ssmlGender}
                />
            )}
        />
    );
};
