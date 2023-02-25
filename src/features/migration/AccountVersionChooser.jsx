import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import { getAuth, signOut } from 'firebase/auth';
import { isOAuthAccountUpgradeState } from '../../states/main';

const AccountVersionChooser = ({ accountVersion, setAccountVersion, setActiveStep }) => {
  const { t } = useTranslation('ui');

  const setIsOAuthAccountUpgrade = useSetRecoilState(isOAuthAccountUpgradeState);

  const handleBackStep = () => {
    setActiveStep(0);
  };

  const handleMoveStep = async () => {
    const auth = await getAuth();
    await signOut(auth);
    setActiveStep(2);

    if (accountVersion === 'v2') setIsOAuthAccountUpgrade(false);
  };

  const handleChangeAccountType = (value) => {
    setAccountVersion(value);
  };

  return (
    <Box>
      <Typography>{t('cpeAccountVersionCheckDesc')}</Typography>
      <Box>
        <FormControl>
          <RadioGroup
            aria-labelledby="radio-buttons-group-account-type"
            value={accountVersion}
            name="radio-buttons-group"
            onChange={(e) => handleChangeAccountType(e.target.value)}
            sx={{ marginTop: '15px', gap: '10px' }}
          >
            <FormControlLabel value="v1" control={<Radio />} label={t('cpeAccountWithPassword')} />
            <FormControlLabel value="v2" control={<Radio />} label={t('cpeAccountWithoutPassword')} />
          </RadioGroup>
        </FormControl>
      </Box>
      <Box sx={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
        <Button variant="contained" onClick={handleBackStep}>
          {t('previous')}
        </Button>
        <Button variant="contained" onClick={handleMoveStep}>
          {t('next')}
        </Button>
      </Box>
    </Box>
  );
};

export default AccountVersionChooser;
