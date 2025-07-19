import { useLocation } from "react-router-dom";
import UpdateForm from "../components/update-form";

const UpdateEmployee = () => {


  const { state } = useLocation();  
  const data = state?.data;
 
  return (
    <div>
       <UpdateForm data={data}/>
    </div>
  );
};

export default UpdateEmployee;