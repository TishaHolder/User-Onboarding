import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

function UserForm({ values, errors, touched, isSubmitting, status }) {

  const [users, setUsers] = useState([]);

  console.log("this is touched", touched);

  //used to display the form data on the screen  
  useEffect(() => {
    if (status) {//status is a default prop on Formik
      setUsers([...users, status]);
    }
  }, [status]);

  return (

    <div className = "user-form">

      <h1>User Onboarding Form</h1>

        <Form>
          <div className = "form-input-div">        
            <Field className = "form-input" type="text" name="username" placeholder="Name" />

            {/*if you touch the username field and there are any errors (if both conditions are true) we will display or
              render the error in the <p> tags */}
            {touched.username && errors.username && <p>{errors.username}</p>}
          </div>

          <div className = "form-input-div">        
            <Field className = "form-input" type="email" name="email" placeholder="Email" />
            {touched.email && errors.email && <p>{errors.email}</p>}
          </div>

          <div className = "form-input-div">       
            <Field className = "form-input" type="password" name="password" placeholder="Password" />
            {touched.password && errors.password && <p>{errors.password}</p>}
          </div>

          <div >
            <label>
              <Field type="checkbox" name="tos" checked={values.tos} />
              {touched.tos && errors.tos && <p>{errors.tos}</p>}
              Accept Terms of Service
            </label>
          </div>
          
          <button disabled={isSubmitting}>Submit</button>

        </Form>

        {/*RENDER USERS TO SCREEN */}

        <div className= "users-list">

            {users.map(user => (

            <div className = "user-card" key={user.id}>

              <h2>Name: {user.username}</h2>
              <p>Email: {user.email}</p>
              <p>Password: {user.password}</p>
              
            </div>
        

            ))}

        </div>

    </div>

   
  );
}

//higher order function that takes UserForm as an argument and returns a new Form:FormikUserForm
const FormikUserForm = withFormik({

  /*mapPropsToValues is used to initialise the values of the form state. Formik transfers the results of 
    mapPropsToValues into updatable form state and makes these values available to the new component as props.values.*/
  mapPropsToValues({ username, email, password, tos }) {
    return {
      username: username || "",
      email: email || "",
      password: password || "",
      tos: tos || false,//handles true or false state of the checked - false means the checkbox is not checked by default
     
    };
  },
  //YUP VALIDATION: validationSchema- helps with validation inside the form
  //shape refers to the shape of the data type that we are looking for, for eg. string is required for text fields
  validationSchema: Yup.object().shape({
    username: Yup.string()
      .min(2, "Your name must be 2 characters or longer")
      .required("Name is required"),
    email: Yup.string()
      .email("Email is not valid")
      .required("Email is required"),
    password: Yup.string()
      .min(5, "Password must be 16 characters or longer")
      .required("Password is required"),    
    tos: Yup.boolean()
      .oneOf([true], "Must Accept Terms and Conditions")
      .required("Must Accept Terms and Conditions")   

  }),

  //formik handles all side effects so we dont need to use useEffect
  handleSubmit(values, { resetForm, setErrors, setStatus, setSubmitting }) {
    //****************************** */STRETCH**********************
   if (values.email === "waffle@syrup.com") {
      setErrors({ email: "That email is already taken" });
    } else {
      axios
         /*we're using reqres.in for this assignment's API. It's a free API that allows us to simulate a POST request 
           for any data that we send it */
        .post("https://reqres.in/api/users", values)
        .then(res => {
          console.log(res); // Data was created successfully and logs to console
          setStatus(res.data);
          resetForm();
          setSubmitting(false);
        })
        .catch(err => {
          console.log(err.response); // There was an error creating the data and logs to console
          setSubmitting(false);
        });

      }//end else
    
  }

})(UserForm); //end FormikUserForm

export default FormikUserForm;