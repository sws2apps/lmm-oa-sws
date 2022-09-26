import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Typography from '@mui/material/Typography';
import AppLanguage from '../components/root/AppLanguage';
import StartMigration from '../components/StartMigration';
import MigrationComplete from '../components/MigrationComplete';
import MigrationLogin from '../components/MigrationLogin';
import MigrationBackup from '../components/MigrationBackup';

const Migration = () => {
	const { t } = useTranslation();

	const [activeStep, setActiveStep] = useState(0);
	const [skipped, setSkipped] = useState(false);

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleReset = () => {
		setSkipped(false);
		setActiveStep(0);
	};

	const handleSkipStep = () => {
		setSkipped(true);
		setActiveStep(3);
	};

	const steps = [
		{
			label: t('migration.migrateData'),
			content: (
				<StartMigration
					handleSkipStep={handleSkipStep}
					handleNext={handleNext}
				/>
			),
		},
		{
			label: t('migration.login'),
			content: (
				<MigrationLogin
					handleSkipStep={handleSkipStep}
					handleNext={handleNext}
				/>
			),
		},
		{
			label: t('migration.sendBackup'),
			content: (
				<MigrationBackup
					handleSkipStep={handleSkipStep}
					handleNext={handleNext}
				/>
			),
		},
	];

	return (
		<Container sx={{ marginTop: '60px' }}>
			<AppLanguage isStartup />
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					marginBottom: '25px',
				}}
			>
				<img
					src='/img/appLogo.png'
					alt='App logo'
					className={'appLogoStartup'}
				/>
				<Typography
					align='center'
					sx={{ lineHeight: 1.2, marginTop: '5px', fontWeight: 'bold' }}
				>
					Life and Ministry Meeting Overseer Assistant
				</Typography>
			</Box>

			<Typography>{t('migration.intro')}</Typography>

			<Box sx={{ marginTop: '20px' }}>
				<Stepper activeStep={activeStep} orientation='vertical'>
					{steps.map((step, index) => (
						<Step key={step.label}>
							<StepLabel
								sx={{
									textDecoration: index > 0 && skipped ? 'line-through' : null,
								}}
							>
								{step.label}
							</StepLabel>
							<StepContent>{step.content}</StepContent>
						</Step>
					))}
				</Stepper>

				{activeStep === 3 && <MigrationComplete handleReset={handleReset} />}
			</Box>
		</Container>
	);
};

export default Migration;
