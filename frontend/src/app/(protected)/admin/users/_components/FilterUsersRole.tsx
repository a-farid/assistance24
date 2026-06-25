import { useTranslations } from "next-intl";
import { ToggleButton, ToggleButtonGroup } from '@mui/material';


export default function FilterUsersRole({setPage, setRoleFilter, roleFilter}: any) {
  const t = useTranslations('GetAllUsersPage');  
  type FilterRoleType = 'all' | 'admin' | 'worker' | 'client';  
  
  const handleRoleChange = (
      event: React.MouseEvent<HTMLElement>,
      newRole: FilterRoleType | null,
    ) => {
      // Enforcement: If a user clicks an already active button, do not let it uncheck to null
      if (newRole !== null) {
        setRoleFilter(newRole);
        setPage(1); 
      }
  };

  return (
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-800 tracking-tight">{t('title')}</h2>          
          <ToggleButtonGroup
            value={roleFilter}
            exclusive
            onChange={handleRoleChange}
            size="small"
            aria-label="System Role Filtering Panel"
            color="primary"
          >
            <ToggleButton value="all" className="capitalize px-4">All Accounts</ToggleButton>
            <ToggleButton value="admin" className="capitalize px-4">Admins</ToggleButton>
            <ToggleButton value="worker" className="capitalize px-4">Workers</ToggleButton>
            <ToggleButton value="client" className="capitalize px-4">Clients</ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>
  );
}