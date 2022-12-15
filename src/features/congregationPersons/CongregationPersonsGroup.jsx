import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CongregationPerson from './CongregationPerson';

const CongregationPersonsGroup = ({ congregationGroup }) => {
  const { persons, label } = congregationGroup;

  return (
    <Box>
      <Typography variant="h6" sx={{ lineHeight: 1.2, marginBottom: '15px' }}>
        {label}
      </Typography>
      <Box>
        {persons.map((person) => (
          <CongregationPerson key={person.id} person={person} />
        ))}
      </Box>
    </Box>
  );
};

export default CongregationPersonsGroup;
