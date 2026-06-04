import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { LoginApi } from "../services/services.js";
import { startLoading, stopLoading } from "../redux/features/loadingSlice.js";

const loginSchema = Yup.object({
  email: Yup.string()
    .email("El email no es válido")
    .required("El email es obligatorio"),

  password: Yup.string()
    .min(3, "La contraseña debe tener al menos 3 caracteres")
    .required("La contraseña es obligatoria"),
});

const Login2 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getLoginErrorMessage = (error) => {
    const status = error?.response?.status || error?.status;
    if (status === 401) return "Datos incorrectos";
    return error?.response?.data?.message || error?.message || "Error en el login";
  };

  const onSubmit = async (values) => {
    console.log(values);
    try {
      dispatch(startLoading());
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const token = await LoginApi(values.email, values.password);
      console.log("token", token);
      localStorage.setItem("token", token);
      navigate("/");
    } catch (error) {
      alert(getLoginErrorMessage(error));
    } finally {
      dispatch(stopLoading());
    }
  };

  return (
    <div className="login-page">
      <div className="login-layout">
        
        {/* Columna Izquierda: Formulario */}
        <Card className="login-card" style={{ width: "100%" }}>
          <Card.Body>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={loginSchema}
              onSubmit={(values) => onSubmit(values)}
            >
              {({ values }) => (
                <FormikForm>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Field
                      as={Form.Control}
                      type="email"
                      name="email"
                      placeholder="Enter email"
                    />
                    <div className="text-danger">
                      <ErrorMessage name="email" />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Field
                      as={Form.Control}
                      type="password"
                      name="password"
                      placeholder="Password"
                    />
                    <div className="text-danger">
                      <ErrorMessage name="password" />
                    </div>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    disabled={!values.email || !values.password}
                  >
                    Ingresar
                  </Button>
                  
                  <p className="login-switch" style={{ marginTop: 12 }}>
                    ¿No tenés cuenta?{' '}
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => navigate('/register')}
                    >
                      Registrate
                    </button>
                  </p>
                </FormikForm>
              )}
            </Formik>
          </Card.Body>
        </Card>

        {/* Columna Derecha: Texto Informativo */}
        <div className="login-info-section">
          <h1>¡Te damos la bienvenida de vuelta!</h1>
          <p>
            Ingresá a tu cuenta para gestionar tus películas favoritas.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login2;