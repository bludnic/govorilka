import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Tooltip,
} from '@material-ui/core';
import SurroundSoundOutlinedIcon from '@material-ui/icons/SurroundSoundOutlined';
import PlayCircleOutlineOutlinedIcon from '@material-ui/icons/PlayCircleOutlineOutlined';
import PauseCircleOutlineOutlinedIcon from '@material-ui/icons/PauseCircleOutlineOutlined';

import { PDFPage } from 'types';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {},
    }),
    { name: 'PLayListItem' },
);

type Props = {
    page: PDFPage;
    onClick: (page: PDFPage) => void;
    selected: boolean;
};

export const PLayListItem: FC<Props> = (props) => {
    const { page, onClick, selected } = props;
    const classes = useStyles();

    const handleClick = () => {
        onClick(page);
    };

    return (
        <ListItem
            className={classes.root}
            onClick={handleClick}
            button
            selected={selected}
        >
            <ListItemIcon>
                {selected ? (
                    <PauseCircleOutlineOutlinedIcon />
                ) : (
                    <PlayCircleOutlineOutlinedIcon />
                )}
            </ListItemIcon>
            <ListItemText primary={`Страница: ${page.pageNum}`} />

            <ListItemSecondaryAction>
                {page.synthesizedAudio ? (
                    <Tooltip title="Synthesized">
                        <SurroundSoundOutlinedIcon fontSize="small" />
                    </Tooltip>
                ) : null}
            </ListItemSecondaryAction>
        </ListItem>
    );
};
