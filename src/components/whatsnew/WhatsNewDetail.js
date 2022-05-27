import { useRecoilValue } from 'recoil';
import { Markup } from 'interweave';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Typography from '@mui/material/Typography';
import { appLangState } from '../../appStates/appSettings';

const WhatsNewDetail = ({ announcement, setItem, setIsView }) => {
	const appLang = useRecoilValue(appLangState);

	const handleBack = () => {
		setIsView(false);
		setItem({});
	};

	return (
		<Box>
			<Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
				{announcement[appLang.toUpperCase()].title}
			</Typography>
			<Box>
				<Markup content={announcement[appLang.toUpperCase()].content} />
			</Box>
			<IconButton
				sx={{
					backgroundColor: '#3498DB',
					'&:hover': {
						background: '#AED6F1',
					},
				}}
				onClick={handleBack}
			>
				<KeyboardBackspaceIcon />
			</IconButton>
		</Box>
	);
};

export default WhatsNewDetail;
