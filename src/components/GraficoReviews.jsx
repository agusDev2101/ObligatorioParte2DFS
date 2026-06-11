import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const GraficoReviews = ({ reviewsPorCategoria }) => {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <h3 className="h5 mb-3">Reviews por categoría</h3>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={reviewsPorCategoria}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="cantidad" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GraficoReviews;
