import { useTranslation } from 'react-i18next';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import StudentAssignmentItem from './StudentAssignmentItem';

const StudentAssignments = ({ assignments }) => {
	const { t } = useTranslation();

	return (
		<Box id='assignments-container'>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'flex-end',
					marginBottom: '10px',
				}}
			>
				<Button
					variant='outlined'
					color='success'
					startIcon={<AddCircleIcon />}
				>
					{t('students.addAssignment')}
				</Button>
			</Box>
			<StudentAssignmentItem />
		</Box>
	);
};

export default StudentAssignments;
