"use client";

import { useState, useMemo } from "react";
import { evaluate, parse } from "mathjs";
import { BlockMath, InlineMath } from "react-katex";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
} from "recharts";
import { Calculator, AlertCircle, RefreshCw } from "lucide-react";
import { calculatePuntoFijo, IterationData } from "../math/puntoFijo";

export default function FixedPointApp() {
  const [func, setFunc] = useState("sqrt(x + 2)"); // Example g(x)
  const [x0, setX0] = useState("1");
  const [tol, setTol] = useState("0.001");
  const [maxIter, setMaxIter] = useState("50");

  const [results, setResults] = useState<IterationData[]>([]);
  const [root, setRoot] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [chartData, setChartData] = useState<{ x: number; y: number; y_x: number }[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);

  const texFunc = useMemo(() => {
    try {
      if (!func.trim()) return "";
      return parse(func).toTex();
    } catch {
      return "\\text{...escribiendo...}";
    }
  }, [func]);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setResults([]);
    setRoot(null);
    setChartData([]);
    setHasCalculated(true);

    try {
      const result = calculatePuntoFijo(func, x0, tol, maxIter);

      if (result.errorMsg) {
        setErrorMsg(result.errorMsg);
      }

      setResults(result.results);
      if (result.rootFound) {
        setRoot(result.root);
      }

      // Generate chart data for visualization (y = g(x) and y = x)
      const g = (x: number) => evaluate(func, { x });
      const cData = [];
      const allX = [parseFloat(x0), ...result.results.map(d => d.x_i)];
      const minX = Math.min(...allX) - 2;
      const maxX = Math.max(...allX) + 2;
      const step = (maxX - minX) / 200;
      for (let i = 0; i <= 200; i++) {
        const x = minX + i * step;
        let y;
        try {
           y = g(x);
        } catch {
           y = NaN;
        }
        if (!isNaN(y) && isFinite(y)) {
          cData.push({ x, y: y, y_x: x });
        }
      }
      setChartData(cData);
    } catch (err: any) {
      setErrorMsg(err.message || "Error al evaluar la función. Verifica la sintaxis.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      <header className="bg-white border-b border-slate-200 shadow-sm py-6">
        <div className="max-w-5xl mx-auto px-4 flex items-center gap-3">
          <Calculator className="text-purple-600" size={28} />
          <h1 className="text-2xl font-bold text-slate-800">
            Método del Punto Fijo
          </h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-4 text-slate-800">Parámetros</h2>
            <form onSubmit={calculate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Función despejada <InlineMath math="g(x)" />
                </label>
                <input
                  type="text"
                  value={func}
                  onChange={(e) => setFunc(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-mono"
                  placeholder="ej. sqrt(x + 2)"
                  required
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 overflow-x-auto min-h-[4rem] flex items-center justify-center">
                <BlockMath math={`g(x) = ${texFunc}`} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <InlineMath math="x_0" /> (Valor Inicial)
                </label>
                <input
                  type="number"
                  step="any"
                  value={x0}
                  onChange={(e) => setX0(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tolerancia (<InlineMath math="\text{tol}" />)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={tol}
                    onChange={(e) => setTol(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Iteraciones máx.
                  </label>
                  <input
                    type="number"
                    value={maxIter}
                    onChange={(e) => setMaxIter(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                <RefreshCw size={18} />
                Calcular Raíz
              </button>
            </form>
          </div>
          
          {/* Visualización de Fórmulas Matemáticas (LaTeX) */}
          <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100">
            <h3 className="text-sm font-semibold text-purple-900 mb-3 uppercase tracking-wider">Fórmula de Iteración</h3>
            <div className="text-center overflow-x-auto py-2">
              {/* x_{i+1} = g(x_i) es la base del método */}
              <BlockMath math="x_{i+1} = g(x_i)" />
            </div>
            <div className="text-center overflow-x-auto py-2 mt-2">
              {/* Fórmula del error aproximado relativo porcentual */}
              <BlockMath math="\varepsilon_a = \left| \frac{x_{i+1} - x_i}{x_{i+1}} \right| \times 100\%" />
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-6">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="shrink-0 mt-0.5" size={20} />
              <p>{errorMsg}</p>
            </div>
          )}

          {!hasCalculated && !errorMsg && (
            <div className="bg-white border border-slate-200 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center text-slate-400">
              <Calculator size={48} className="mb-4 opacity-50" />
              <p className="text-lg">Ingresa los parámetros y presiona Calcular</p>
            </div>
          )}

          {hasCalculated && root !== null && (
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div>
                <h3 className="text-emerald-800 font-semibold mb-1">Raíz Aproximada Encontrada</h3>
                <p className="text-emerald-600 text-sm">El método convergió exitosamente.</p>
              </div>
              <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-emerald-100">
                <span className="text-2xl font-bold text-emerald-700">
                  <InlineMath math={`x \\approx ${root.toFixed(6)}`} />
                </span>
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-semibold text-slate-800">Tabla de Iteraciones</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 font-medium">Iter (<InlineMath math="i" />)</th>
                      <th className="px-6 py-3 font-medium"><InlineMath math="x_{i+1}" /></th>
                      <th className="px-6 py-3 font-medium">Error <InlineMath math="\varepsilon_a" /> (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {results.map((r) => (
                      <tr key={r.i} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{r.i}</td>
                        <td className="px-6 py-4 font-mono">{r.x_i.toFixed(6)}</td>
                        <td className="px-6 py-4 font-mono">
                          {r.ea.toFixed(4)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {chartData.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-6">Visualización de la Función</h3>
              {/* 
                  GRÁFICA:
                  - La línea morada representa g(x).
                  - La línea punteada gris es y = x.
                  - La raíz es la intersección entre g(x) y y = x.
                  - El punto verde es la raíz encontrada.
              */}
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="x" 
                      type="number" 
                      domain={['dataMin', 'dataMax']} 
                      tickFormatter={(val) => val.toFixed(1)}
                    />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip 
                      formatter={(value: any) => typeof value === 'number' ? value.toFixed(4) : value}
                      labelFormatter={(label: any) => typeof label === 'number' ? `x = ${label.toFixed(4)}` : label}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="y" 
                      stroke="#9333ea" 
                      strokeWidth={2} 
                      dot={false}
                      name="g(x)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="y_x" 
                      stroke="#94a3b8" 
                      strokeDasharray="5 5"
                      strokeWidth={2} 
                      dot={false}
                      name="y = x"
                    />
                    {root !== null && (
                      <ReferenceDot 
                        x={root} 
                        y={root} 
                        r={6} 
                        fill="#10b981" 
                        stroke="#fff" 
                        strokeWidth={2} 
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
