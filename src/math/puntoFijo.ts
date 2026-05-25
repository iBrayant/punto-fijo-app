import { evaluate } from "mathjs";

export interface IterationData {
  i: number;
  x_i: number;
  ea: number;
}

export interface PuntoFijoResult {
  rootFound: boolean;
  root: number | null;
  results: IterationData[];
  errorMsg: string;
}

/**
 * Módulo para encontrar raíces de ecuaciones mediante el Método del Punto Fijo.
 * 
 * Requiere transformar la ecuación original f(x) = 0 a la forma x = g(x).
 */
export function calculatePuntoFijo(
  funcString: string,
  x0String: string,
  tolString: string,
  maxIterString: string
): PuntoFijoResult {

  let rootFound = false;
  let root: number | null = null;
  const iterData: IterationData[] = [];
  let errorMsg = "";

  try {
    // --- INICIO DEL PROCESO MATEMÁTICO ---
    // 1. Captura y validación de parámetros iniciales:
    // x0: El punto de partida (semilla) para la iteración.
    // tol: El umbral de error permitido (criterio de parada).
    // maxI: Límite de seguridad para evitar bucles infinitos si el método diverge.
    let x_curr = parseFloat(x0String);
    const tolerance = parseFloat(tolString);
    const maxI = parseInt(maxIterString);

    if (isNaN(x_curr) || isNaN(tolerance) || isNaN(maxI)) {
      throw new Error("Por favor, ingresa valores numéricos válidos.");
    }

    // 2. Definición de la función g(x):
    // El método del punto fijo requiere transformar la ecuación original f(x) = 0 
    // en la forma x = g(x).
    const g = (x: number) => evaluate(funcString, { x });

    let ea = 100; // Error aproximado inicial (se asume alto para entrar al bucle)
    let iter = 0; // Contador de iteraciones ejecutadas
    let x_next = x_curr;

    // 3. Ciclo Iterativo:
    // Se repite mientras no se supere el número máximo de iteraciones (límite de seguridad).
    while (iter < maxI) {
      iter++;
      
      // FÓRMULA CENTRAL: x_{i+1} = g(x_i)
      // Se calcula el siguiente valor de x evaluando el actual en g(x).
      x_next = g(x_curr);

      // Validación de convergencia/dominio:
      // Si el resultado no es un número real o es infinito, el método diverge.
      if (isNaN(x_next) || !isFinite(x_next)) {
         throw new Error("La función diverge o genera un valor indefinido.");
      }

      // CÁLCULO DEL ERROR RELATIVO PORCENTUAL:
      // ea = |(x_nuevo - x_anterior) / x_nuevo| * 100
      // Este valor nos dice qué tanto está cambiando la aproximación.
      ea = Math.abs((x_next - x_curr) / x_next) * 100;

      // Guardamos los datos para la tabla de resultados
      iterData.push({
        i: iter,
        x_i: x_next,
        ea: ea,
      });

      // (Umbral del error):
      // Si el error calculado es menor o igual a la tolerancia definida por el usuario,
      // consideramos que hemos encontrado una aproximación válida de la raíz.
      if (ea <= tolerance) {
        rootFound = true;
        break;
      }

      // Preparación para la siguiente iteración: el x actual pasa a ser el x anterior.
      x_curr = x_next;
    }

    // 4. Resultado final:
    if (rootFound) {
      root = x_next; // Éxito: se alcanzó la precisión deseada
    } else {
      // El bucle terminó por alcanzar maxI sin llegar a la tolerancia (No hubo convergencia)
      errorMsg = "El método no convergió en el número máximo de iteraciones.";
    }

  } catch (err: any) {
    errorMsg = err.message || "Error al evaluar la función. Verifica la sintaxis.";
  }

  return {
    rootFound,
    root,
    results: iterData,
    errorMsg
  };
}
