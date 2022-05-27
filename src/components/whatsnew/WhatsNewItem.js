import { useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Typography from '@mui/material/Typography';
import { appLangState } from '../../appStates/appSettings';

const WhatsNewItem = ({ announcement, setItem, setIsView }) => {
	const appLang = useRecoilValue(appLangState);

	const handleView = () => {
		setItem(announcement);
		setIsView(true);
	};

	return (
		<Box
			sx={{
				padding: '5px',
				borderRadius: '8px',
				boxShadow: '0 3px 5px 2px rgba(23, 32, 42, .3)',
				backgroundColor: '#F4F6F6',
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<NotificationsActiveIcon
					color='success'
					sx={{ fontSize: '50px', marginRight: '10px' }}
				/>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						width: '100%',
					}}
				>
					<Box>
						<Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
							{announcement[appLang.toUpperCase()].title}
						</Typography>
						<Typography sx={{ fontSize: '14px' }}>
							{announcement[appLang.toUpperCase()].desc}
						</Typography>
					</Box>
					<IconButton onClick={handleView}>
						<OpenInNewIcon />
					</IconButton>
				</Box>
			</Box>
		</Box>
	);
};

export default WhatsNewItem;
