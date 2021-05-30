import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
export const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#fff',
        },
        secondary: {
            main: '#ddd',
        },
        error: {
            main: red.A400,
        },
        // background: {
        //     default: '#000',
        //     paper: '#222',
        // },
        text: {
            primary: '#fff',
            secondary: '#ddd',
        },
        divider: '#fff',
    },
});
