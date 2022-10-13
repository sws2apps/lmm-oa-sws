import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const AppInProgress = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', height: '60vh'}}>
            <AccessTimeFilledIcon color='primary' sx={{ fontSize: '100px', marginBottom: '20px'}} />
            <Typography align='center' sx={{ fontSize: '20px'}}>This application is still under construction</Typography>
        </Box>
    )
}

export default AppInProgress;