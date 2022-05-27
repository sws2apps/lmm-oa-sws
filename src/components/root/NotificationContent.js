import { useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import WhatsNewItem from '../whatsnew/WhatsNewItem';
import { appNotificationsState } from '../../appStates/appSettings';

const NotificationContent = ({ id, open, anchorEl, handleClose }) => {
	const notifications = useRecoilValue(appNotificationsState);

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
			sx={{ marginTop: '10px' }}
		>
			<Box
				sx={{
					backgroundColor: '#AEB6BF',
					maxWidth: '400px',
					padding: '20px 10px',
				}}
			>
				{notifications.length > 0 && (
					<>
						{notifications.map((notification) => (
							<WhatsNewItem
								key={notification.id}
								announcement={notification}
								handlePopoverClose={handleClose}
							/>
						))}
					</>
				)}
			</Box>
		</Popover>
	);
};

export default NotificationContent;
