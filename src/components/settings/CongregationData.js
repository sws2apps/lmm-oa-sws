import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

const CongregationData = () => {
	const { t } = useTranslation();

	return (
		<Box>
			<Typography className={'settingHeader'}>
				{t('settings.onlineDataStorage')}
			</Typography>
			<Divider />
			<Box className={'settingSubItem'}>
				<p>
					Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quia placeat
					illo optio consequuntur quod odit totam, modi minus rerum repellat
					ullam, consequatur architecto vitae amet! Officia non similique est
					itaque?
				</p>
			</Box>
		</Box>
	);
};

export default CongregationData;
