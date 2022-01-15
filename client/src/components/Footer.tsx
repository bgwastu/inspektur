import {Box, Button, IconButton, Link} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
function Footer() {
    return <Box
        display="flex"
        justifyContent="center"
    >
        <Link href="https://github.com/bagaswastu/inspektur" target="_blank">
            <IconButton aria-label="GitHub" component="span">
                <GitHubIcon/>
            </IconButton>
        </Link>
    </Box>;
}

export default Footer;