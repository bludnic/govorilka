import { MenuProps } from '@material-ui/core';

// Align <Select> popper to bottom helper
export const MenuPropsBottom: Partial<MenuProps> = {
    anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
    },
    transformOrigin: {
        vertical: 'top',
        horizontal: 'left',
    },
    getContentAnchorEl: null,
};
