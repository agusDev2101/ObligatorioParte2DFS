const PanelPlan = ({
  plan,
  reviewsCantidad,
  actualizandoPlan,
  handleCambiarPlan,
}) => {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <h3 className="h5 mb-3">Plan de usuario</h3>

        <p className="mb-1">
          <strong>Plan actual:</strong> {plan}
        </p>

        {plan === "plus" ? (
          <>
            <p className="mb-2">
              <strong>Uso:</strong> {reviewsCantidad} / 4 reviews creadas
            </p>

            <div className="progress mb-3">
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${Math.min((reviewsCantidad / 4) * 100, 100)}%`,
                }}
              >
                {Math.min(Math.round((reviewsCantidad / 4) * 100), 100)}%
              </div>
            </div>

            <button
              className="btn btn-warning"
              type="button"
              onClick={handleCambiarPlan}
              disabled={actualizandoPlan}
            >
              {actualizandoPlan ? "Actualizando..." : "Cambiar a Premium"}
            </button>
          </>
        ) : (
          <p className="mb-0">
            <strong>Uso:</strong> {reviewsCantidad} reviews creadas. Tu plan es
            ilimitado.
          </p>
        )}
      </div>
    </div>
  );
};

export default PanelPlan;
