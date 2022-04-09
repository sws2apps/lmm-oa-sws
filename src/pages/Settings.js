import Box from '@mui/material/Box';
import BasicSettings from '../components/settings/BasicSettings';
import DataStorage from '../components/settings/DataStorage';

const sharedStyles = {
	settingItem: {
		flex: '1 1 350px',
		borderRadius: '10px',
		margin: '10px 2px',
		padding: '5px',
	},
};

const Settings = () => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexWrap: 'wrap',
				marginRight: '5px',
			}}
		>
			<Box sx={sharedStyles.settingItem}>
				<BasicSettings />
			</Box>
			<Box sx={sharedStyles.settingItem}>
				<DataStorage />
			</Box>
		</Box>
	);
};

export default Settings;
