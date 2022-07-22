import logo from './logo.svg';
import './App.css';
import { useFormik } from 'formik';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const [users, setusers] = useState([])
  const [isedit, setisedit] = useState(false)
  const [edituser,setedituser]=useState({})
  let fetchdata = async () => {
    try {
      let res = await axios.get("https://trail-deploy-1.herokuapp.com/");
      setusers(res.data);
    } catch (error) { console.log(error) }
  };
  
  useEffect(() => {
   fetchdata()
  }, []);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    onSubmit: async (values) => {
      try {
         if (!isedit){
         await axios.post("https://trail-deploy-1.herokuapp.com/", values);
         fetchdata();
         }else{
          delete values._id;
          await axios.put(`https://trail-deploy-1.herokuapp.com/${edituser._id}`,values);
          setisedit(false);
          fetchdata();
         }
         } 
         catch (error) { console.log(error) }
    }
  })
  let handleedit = async (id) => {
    try {
      let res=await axios.get(`https://trail-deploy-1.herokuapp.com/${id}`)
      formik.setValues(res.data);
      setedituser(res.data);
      setisedit(true)
    } catch (error) {
      console.log(error)
    }
  }
  let handledelete = async (id) => {
    try {
      await axios.delete(`https://trail-deploy-1.herokuapp.com/${id}`)
      fetchdata();
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-lg-6'>
          <form onSubmit={formik.handleSubmit} autoComplete="off">
            <div className='col-lg-12'>
              <label>Email</label>
              <input className='form-control' type="text" name="email" value={formik.values.email} onChange={formik.handleChange} />
            </div>
            <div className='col-lg-12'>
              <label>Password</label>
              <input className='form-control' type="text" name="password" value={formik.values.password} onChange={formik.handleChange} />
            </div>
            <div className='col-lg-12'>
              <input className='btn btn-primary mt-2' type='submit' value='submit' />
            </div>
          </form>
        </div>
        <div className='col-lg-6'>
          <table class="table table-dark table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Email</th>
                <th scope="col">Password</th>
                <th scope="col">Action</th>

              </tr>
            </thead>
            <tbody>
              {
                users.map((ele) => {
                  return (<tr>
                    <th scope="row">{ele._id}</th>
                    <td>{ele.email}</td>
                    <td>{ele.password}</td>
                    <td>
                      <button className='btn btn-secondary ' style={{marginRight:"5px"}} onClick={() => handleedit(ele._id)}>Edit</button>
                      <button className='btn btn-danger ' onClick={() => handledelete(ele._id)}>Delete</button>
                      </td>
                  </tr>)
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
