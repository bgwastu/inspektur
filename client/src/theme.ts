import {createTheme} from '@mui/material';
import {blueGrey, grey} from '@mui/material/colors';

const theme = createTheme({
    palette: {
        primary: {
            main: grey[800],
            light: grey[500],
        },
        secondary: blueGrey
    },
});

export default theme;