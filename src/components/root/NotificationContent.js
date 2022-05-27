import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

const NotificationContent = ({ id, open, anchorEl, handleClose }) => {
	return (
		<Popover
			id={id}
			open={open}
			anchorEl={anchorEl}
			onClose={handleClose}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
		>
			<Box
				sx={{ backgroundColor: '#EAECEE', maxWidth: '400px', padding: '10px' }}
			>
				<Box
					sx={{
						backgroundColor: 'white',
						marginBottom: '10px',
						padding: '10px',
						borderRadius: '8px',
						boxShadow: '0 3px 5px 2px rgba(23, 32, 42, .3)',
					}}
				>
					<Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
						Notification Title 1
					</Typography>
					<Typography sx={{ fontSize: '14px' }}>
						The content of the Popover. The content of the Popover. The content
						of the Popover. The content of the Popover.
					</Typography>
					<Typography
						sx={{
							marginTop: '10px',
							fontSize: '12px',
							textAlign: 'right',
							fontStyle: 'italic',
						}}
					>
						22 May 2022
					</Typography>
				</Box>
				<Box
					sx={{
						backgroundColor: '#EBEDEF',
						padding: '10px',
						borderRadius: '8px',
						boxShadow: '0 3px 5px 2px rgba(23, 32, 42, .3)',
					}}
				>
					<Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
						Notification Title 2
					</Typography>
					<Typography sx={{ fontSize: '14px' }}>
						The content of the Popover. The content of the Popover. The content
						of the Popover. The content of the Popover.
					</Typography>
					<Typography
						sx={{
							marginTop: '10px',
							fontSize: '12px',
							textAlign: 'right',
							fontStyle: 'italic',
						}}
					>
						22 May 2022
					</Typography>
				</Box>
			</Box>
		</Popover>
	);
};

export default NotificationContent;
