import Box from '@mui/material/Box';
import BasicSettings from '../components/settings/BasicSettings';
import CongregationData from '../components/settings/CongregationData';
import DataStorage from '../components/settings/DataStorage';

const sharedStyles = {
	settingItem: {
		margin: '10px 2px',
		padding: '5px',
	},
};

const Settings = () => {
	return (
		<Box
			sx={{
				marginRight: '5px',
			}}
		>
			<Box sx={sharedStyles.settingItem}>
				<BasicSettings />
			</Box>
			<Box sx={sharedStyles.settingItem}>
				<CongregationData />
			</Box>
			<Box sx={sharedStyles.settingItem}>
				<DataStorage />
			</Box>
		</Box>
	);
};

export default Settings;
