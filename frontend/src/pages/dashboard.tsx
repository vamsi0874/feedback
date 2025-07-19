import EmployeeDashboard from "../components/employee-dashboard";
import ManagerDashboard from "../components/manager-dashboard";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const {user} = useAuth()
 const role = user?.role || 'employee';
 
  return (
    <div>
   
      {role==='manager' ? <ManagerDashboard /> : <EmployeeDashboard/>}
    </div>
  );
};

export default DashboardPage;