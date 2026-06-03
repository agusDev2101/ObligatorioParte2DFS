import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { RegisterApi } from "../services/services.js";
import { startLoading, stopLoading } from "../redux/features/loadingSlice.js";

const registerSchema = Yup.object({
  username: Yup.string()
    .min(3, "El usuario debe tener al menos 3 caracteres")
    .required("El usuario es obligatorio"),
  email: Yup.string()
    .email("El email no es válido")
    .required("El email es obligatorio"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es obligatoria"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    .required("Repetir contraseña es obligatorio"),
});

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loadingSlice.count > 0);

  const onSubmit = async (values, { setStatus }) => {
    try {
      setStatus("");
      dispatch(startLoading());

      const result = await RegisterApi(values.username, values.email, values.password);

      const token = result?.token || result?.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      setStatus(error?.message || "Error en el registro");
    } finally {
      dispatch(stopLoading());
    }
  };

  return (
    <main className="login-page">
      <section className="login-layout">
        <div className="login-copy">
          <span className="login-tag">Movie Hub</span>
          <h1>Crea tu cuenta y empezá a usar la app.</h1>
          <p>
            Registro con validación, confirmación de contraseña y auto-login si el backend devuelve token.
          </p>
        </div>

        <Card className="login-card">
          <Card.Body>
            <div className="login-card__header">
              <h2>Registro</h2>
              <p>Completá tus datos para crear tu usuario.</p>
            </div>

            <Formik
              initialValues={{
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={registerSchema}
              onSubmit={onSubmit}
            >
              {({ values, isValid, dirty, status }) => (
                <FormikForm className="login-form">
                  {status ? <div className="login-alert">{status}</div> : null}

                  <Form.Group className="login-field mb-3">
                    <Form.Label>Usuario</Form.Label>
                    <Field
                      as={Form.Control}
                      type="text"
                      name="username"
                      placeholder="user1234"
                    />
                    <div className="text-danger login-error">
                      <ErrorMessage name="username" />
                    </div>
                  </Form.Group>

                  <Form.Group className="login-field mb-3">
                    <Form.Label>Email</Form.Label>
                    <Field
                      as={Form.Control}
                      type="email"
                      name="email"
                      placeholder="user1@example.com"
                    />
                    <div className="text-danger login-error">
                      <ErrorMessage name="email" />
                    </div>
                  </Form.Group>

                  <Form.Group className="login-field mb-3">
                    <Form.Label>Password</Form.Label>
                    <Field
                      as={Form.Control}
                      type="password"
                      name="password"
                      placeholder="••••••••"
                    />
                    <div className="text-danger login-error">
                      <ErrorMessage name="password" />
                    </div>
                  </Form.Group>

                  <Form.Group className="login-field mb-3">
                    <Form.Label>Repetir contraseña</Form.Label>
                    <Field
                      as={Form.Control}
                      type="password"
                      name="confirmPassword"
                      placeholder="••••••••"
                    />
                    <div className="text-danger login-error">
                      <ErrorMessage name="confirmPassword" />
                    </div>
                  </Form.Group>

                  <Button
                    className="login-button"
                    variant="primary"
                    type="submit"
                    disabled={!values.username || !values.email || !values.password || !values.confirmPassword || !isValid || !dirty || isLoading}
                  >
                    Crear cuenta
                  </Button>

                  <p className="login-switch">
                    ¿Ya tenés cuenta? <Link to="/login">Ingresá</Link>
                  </p>
                </FormikForm>
              )}
            </Formik>
          </Card.Body>
        </Card>
      </section>
    </main>
  );
};

export default Register;