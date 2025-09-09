import { useEffect, useState, type ChangeEvent, type ReactNode } from "react";

/**
 * CAUJARAL — 3) Modelos organizativos y arquetipo (90 min)
 * Tema oscuro (paleta de referencia) · Exportar TXT legible
 *
 * Incluye:
 * - Paleta: fondo #0b1220 · cards #0e1726 · controles #0f1b2e · bordes #22314a
 * - Línea superior 3px (cian→azul→fucsia) en header y cards
 * - 🟦 Cuadrito azul del header con icono dentro (🏛️)
 * - ❌ Sin botón de importar
 * - ✅ SID por pestaña (sessionStorage) + autosave/localStorage por SID
 * - ✅ Carga automática por SID si existe en localStorage
 * - ✍️ G con labels visibles fuera de los campos
 * - 🛠️ Fix TS: tipado explícito de `children`
 */

type UUID = string;

/* ---------- Meta ---------- */
interface Meta {
  titulo: string;
  sessionId: string;
  lastSavedAt: string | null;
}

/* ---------- Parte 1 ---------- */
interface Regla {
  id: UUID;
  principio: string;
  explicacion: string;
  capacidad: string;
}
type Viable = "Sí" | "No" | "Depende";
interface ModeloRow {
  id: UUID;
  nombre: string;
  fortalezas: string;
  riesgos: string;
  viable: Viable;
  impactoCapacidad: string;
}

/* ---------- Parte 2 ---------- */
interface CriterioRow {
  id: UUID;
  criterio: string;
  puntaje: number; // 1..5
  justificacion: string;
}
interface CondicionesExito {
  resistencia: string;
  condicionMinima: string;
  accion90: string;
}
interface PropuestaFinal {
  modeloElegido: string;
  porque: string;
  primerPaso: string;
}

/* ---------- App State ---------- */
interface AppState {
  version: string;
  meta: Meta;
  parte1: {
    A_reglas: Regla[];
    B_modelos: ModeloRow[];
  };
  parte2: {
    E_eval: CriterioRow[];
    F_condiciones: CondicionesExito;
    G_propuesta: PropuestaFinal;
  };
}

const VERSION = "CaujaralCanvas-Modelos-v3" as const;
const DEFAULT_CAPTION =
  "Modelos organizativos y arquetipo — Comparar centralized / decentralized / center-led y elegir arquetipo con criterios (90 min)";

const newId = () => crypto.randomUUID();

/* ---------- Inicialización por SID ---------- */
const initialState = (sid: string): AppState => ({
  version: VERSION,
  meta: { titulo: DEFAULT_CAPTION, sessionId: sid, lastSavedAt: null },
  parte1: {
    A_reglas: [
      { id: newId(), principio: "", explicacion: "", capacidad: "" },
      { id: newId(), principio: "", explicacion: "", capacidad: "" },
      { id: newId(), principio: "", explicacion: "", capacidad: "" },
    ],
    B_modelos: [
      {
        id: newId(),
        nombre: "Funcional",
        fortalezas: "",
        riesgos: "",
        viable: "Depende",
        impactoCapacidad: "",
      },
      {
        id: newId(),
        nombre: "Divisional",
        fortalezas: "",
        riesgos: "",
        viable: "Depende",
        impactoCapacidad: "",
      },
      {
        id: newId(),
        nombre: "Matricial",
        fortalezas: "",
        riesgos: "",
        viable: "Depende",
        impactoCapacidad: "",
      },
      {
        id: newId(),
        nombre: "Híbrido / Center-led",
        fortalezas: "",
        riesgos: "",
        viable: "Depende",
        impactoCapacidad: "",
      },
    ],
  },
  parte2: {
    E_eval: [
      {
        id: newId(),
        criterio: "Alineación con la estrategia del Club",
        puntaje: 3,
        justificacion: "",
      },
      {
        id: newId(),
        criterio: "Claridad de funciones y responsabilidades",
        puntaje: 3,
        justificacion: "",
      },
      {
        id: newId(),
        criterio: "Agilidad en la operación diaria",
        puntaje: 3,
        justificacion: "",
      },
      {
        id: newId(),
        criterio: "Coordinación entre áreas",
        puntaje: 3,
        justificacion: "",
      },
      {
        id: newId(),
        criterio: "Viabilidad de implementación (costos, cultura)",
        puntaje: 3,
        justificacion: "",
      },
    ],
    F_condiciones: { resistencia: "", condicionMinima: "", accion90: "" },
    G_propuesta: { modeloElegido: "", porque: "", primerPaso: "" },
  },
});

/* ---------- Export TXT legible ---------- */
function toReadableTxt(s: AppState): string {
  const L: string[] = [];
  const ts = new Date().toLocaleString();
  L.push("CAUJARAL — Modelos organizativos y arquetipo (90 min)");
  L.push("Resumen legible para lectura posterior");
  L.push("—".repeat(72));
  L.push(`Sesión: ${s.meta.sessionId}`);
  L.push(`Exportado: ${ts}`);
  L.push("");

  /* Parte 1 */
  L.push("📝 PARTE 1 — ¿Cómo nos organizamos sin enredarnos?");
  L.push("");
  // A) Reglas
  L.push("🎯 A) Reglas del juego (principios no negociables)");
  if (s.parte1.A_reglas.length === 0) {
    L.push("  [Sin reglas]");
  } else {
    s.parte1.A_reglas.forEach((r, i) => {
      L.push(
        `  ${i + 1}. Principio: ${r.principio || "[…]"} — Explicación: ${
          r.explicacion || "[…]"
        } — Capacidad: ${r.capacidad || "[…]"}`
      );
    });
  }
  L.push("");

  // B) Modelos
  L.push("📦 B) Modelos organizativos y su pertinencia");
  s.parte1.B_modelos.forEach((m) => {
    L.push(`  • Modelo: ${m.nombre || "—"}`);
    L.push(`    Fortalezas: ${m.fortalezas || "—"}`);
    L.push(`    Riesgos: ${m.riesgos || "—"}`);
    L.push(`    ¿Viable?: ${m.viable}`);
    L.push(
      `    Capacidad que fortalece/debilita: ${m.impactoCapacidad || "—"}`
    );
  });
  L.push("");

  /* Parte 2 */
  L.push("📝 PARTE 2 — ¿Cómo nos organizamos sin enredos?");
  L.push("");
  // E) Evaluación
  L.push("⭐ E) Evaluación del modelo propuesto (1–5⭐)");
  s.parte2.E_eval.forEach((c) => {
    L.push(
      `  - ${c.criterio}: ${"★".repeat(c.puntaje)}${"☆".repeat(
        5 - c.puntaje
      )}  |  ${c.puntaje}/5`
    );
    if (c.justificacion) L.push(`    Justificación: ${c.justificacion}`);
  });
  L.push("");

  // F) Condiciones
  L.push("🛠️ F) Condiciones de éxito y próximos pasos");
  L.push(`  Resistencia interna: ${s.parte2.F_condiciones.resistencia || "—"}`);
  L.push(
    `  Condición mínima: ${s.parte2.F_condiciones.condicionMinima || "—"}`
  );
  L.push(
    `  Acción de validación (90 días): ${
      s.parte2.F_condiciones.accion90 || "—"
    }`
  );
  L.push("");

  // G) Propuesta final
  L.push("🤝 G) Propuesta final del grupo");
  L.push(`  Modelo elegido: ${s.parte2.G_propuesta.modeloElegido || "—"}`);
  L.push(`  Porque nos permite: ${s.parte2.G_propuesta.porque || "—"}`);
  L.push(
    `  Primer paso para iniciar su implementación: ${
      s.parte2.G_propuesta.primerPaso || "—"
    }`
  );
  L.push("");
  L.push("FIN");
  return L.join("\n");
}

/* ---------- File helpers ---------- */
function downloadFile(
  content: string,
  filename: string,
  mime = "text/plain;charset=utf-8"
) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ---------- UI (paleta referencia) ---------- */
const Badge: React.FC<{
  children: ReactNode;
  tone?: "indigo" | "sky" | "emerald";
}> = ({ children, tone = "indigo" }) => {
  const tones = {
    indigo: "bg-blue-600/15 text-blue-200 border-blue-700",
    sky: "bg-cyan-600/15 text-cyan-200 border-cyan-700",
    emerald: "bg-emerald-600/15 text-emerald-200 border-emerald-700",
  } as const;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${tones[tone]}`}
    >
      {children}
    </span>
  );
};

const ToolbarButton = ({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: ReactNode;
}) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-2 rounded-xl border border-[#22314a] bg-[#0b1220] px-3 py-2 text-sm font-medium text-slate-200 shadow-sm hover:bg-[#0f1b2e] active:scale-[0.99]"
  >
    {children}
  </button>
);

const SectionCard = ({
  title,
  subtitle,
  emoji,
  children,
  anchor,
}: {
  title: string;
  subtitle?: string;
  emoji?: string;
  children: ReactNode;
  anchor?: string;
}) => (
  <section id={anchor} className="relative">
    <div className="relative rounded-2xl border border-[#22314a] bg-[#0e1726]/80 shadow-sm backdrop-blur-sm overflow-hidden">
      {/* Línea superior 3px */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500" />
      <div className="flex items-start justify-between gap-4 border-b border-[#22314a] p-4 md:p-5">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-slate-100 flex items-center gap-2">
            <span className="text-xl md:text-2xl">{emoji}</span>
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-300 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {/* sin símbolo # en el extremo derecho */}
      </div>
      <div className="p-4 md:p-6 text-slate-200">{children}</div>
    </div>
  </section>
);

const Pill = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <span
    className={`rounded-full bg-[#0f1b2e] px-2.5 py-1 text-xs text-slate-200 border border-[#2a3a52] ${className}`}
  >
    {children}
  </span>
);

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
const Input = (props: InputProps) => {
  const { className = "", ...rest } = props;
  return (
    <input
      {...rest}
      className={`w-full rounded-xl border border-[#2a3a52] bg-[#0f1b2e] px-3 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
const TextArea = (props: TextAreaProps) => {
  const { className = "", ...rest } = props;
  return (
    <textarea
      {...rest}
      className={`w-full min-h-[76px] rounded-xl border border-[#2a3a52] bg-[#0f1b2e] px-3 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};

const Select = ({
  value,
  onChange,
  children,
  className = "",
}: {
  value: string | number;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
  className?: string;
}) => (
  <select
    value={value}
    onChange={onChange}
    className={`rounded-lg border border-[#2a3a52] bg-[#0f1b2e] px-2 py-1 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  >
    {children}
  </select>
);

const Stars = ({ value }: { value: number }) => (
  <span className="font-medium tracking-tight">{`${"★".repeat(
    value
  )}${"☆".repeat(5 - value)}`}</span>
);

/* ---------- App ---------- */
export default function ModelosOrganizativosCanvas() {
  /** SID por pestaña (estable entre recargas de la pestaña) */
  const [sid] = useState<string>(() => {
    const KEY = "modelos_sid";
    let s = sessionStorage.getItem(KEY);
    if (!s) {
      s = crypto.randomUUID();
      sessionStorage.setItem(KEY, s);
    }
    return s;
  });

  /** Estado inicial: si hay datos guardados para este SID, cargarlos */
  const [state, setState] = useState<AppState>(() => {
    const key = `caujaral_modelos_${sid}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved) as AppState;
      } catch {
        /* fallback si está corrupto */
      }
    }
    return initialState(sid);
  });

  // Autosave por SID
  useEffect(() => {
    const key = `caujaral_modelos_${state.meta.sessionId}`;
    const next: AppState = {
      ...state,
      meta: { ...state.meta, lastSavedAt: new Date().toISOString() },
    };
    localStorage.setItem(key, JSON.stringify(next));
  }, [state]);

  /* Helpers por path */
  const updateValue = (path: string[], value: unknown) => {
    setState((prev) => {
      const clone: any = structuredClone(prev);
      let ref: any = clone;
      for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
      ref[path[path.length - 1]] = value;
      return clone;
    });
  };
  const updateField = (
    path: string[],
    id: UUID,
    field: string,
    value: unknown
  ) => {
    setState((prev) => {
      const clone: any = structuredClone(prev);
      let ref: any = clone;
      for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
      const last = path[path.length - 1];
      ref[last] = ref[last].map((it: any) =>
        it.id === id ? { ...it, [field]: value } : it
      );
      return clone;
    });
  };
  const pushRow = (path: string[], row: unknown) => {
    setState((prev) => {
      const clone: any = structuredClone(prev);
      let ref: any = clone;
      for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
      const last = path[path.length - 1];
      ref[last] = [...ref[last], row];
      return clone;
    });
  };
  const removeRow = (path: string[], id: UUID) => {
    setState((prev) => {
      const clone: any = structuredClone(prev);
      let ref: any = clone;
      for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
      const last = path[path.length - 1];
      ref[last] = ref[last].filter((it: any) => it.id !== id);
      return clone;
    });
  };

  /* Reglas: min 3, max 5 */
  const addRegla = () => {
    if (state.parte1.A_reglas.length >= 5) return;
    pushRow(["parte1", "A_reglas"], {
      id: newId(),
      principio: "",
      explicacion: "",
      capacidad: "",
    } as Regla);
  };
  const removeRegla = (id: UUID) => {
    if (state.parte1.A_reglas.length <= 3) return;
    removeRow(["parte1", "A_reglas"], id);
  };

  /* Modelos: añadir fila extra si se desea */
  const addModelo = () => {
    pushRow(["parte1", "B_modelos"], {
      id: newId(),
      nombre: "",
      fortalezas: "",
      riesgos: "",
      viable: "Depende",
      impactoCapacidad: "",
    } as ModeloRow);
  };

  /* Export / Reset */
  const handleExportTxt = () => {
    downloadFile(
      toReadableTxt(state),
      `Modelos_${state.meta.sessionId}.txt`,
      "text/plain;charset=utf-8"
    );
  };
  const handleReset = () => {
    if (
      confirm(
        "¿Restablecer? Se creará una nueva sesión y se limpiarán los datos de esta pestaña."
      )
    ) {
      const newSid = crypto.randomUUID();
      sessionStorage.setItem("modelos_sid", newSid);
      setState(() => initialState(newSid));
    }
  };

  // Smoke tests básicos
  useEffect(() => {
    try {
      console.assert(
        state.parte1.A_reglas.length >= 3,
        "Debe haber mínimo 3 reglas"
      );
      console.assert(
        state.parte2.E_eval.length === 5,
        "Debe haber 5 criterios de evaluación"
      );
    } catch (e) {
      console.warn("Smoke test:", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0b1220] text-slate-100">
      {/* Top Bar (SID oculto) */}
      <div className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-[#0b1220]/85 bg-[#0b1220]/90 border-b border-[#22314a]">
        <div className="mx-auto max-w-7xl px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-inner shadow-blue-900/30 flex items-center justify-center">
                <span className="text-white text-lg" aria-hidden>
                  🏛️
                </span>
              </div>
              <div>
                <h1 className="text-base md:text-lg font-semibold">
                  Modelos Organizativos y Arquetipo (Parte 3)
                </h1>
                <p className="text-xs md:text-sm text-slate-300">
                  Comparar centralized / decentralized / center-led y elegir
                  arquetipo con criterios · 90 min
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ToolbarButton onClick={handleExportTxt}>
                <span className="i-lucide-download h-4 w-4" /> Exportar TXT
              </ToolbarButton>

              <ToolbarButton onClick={handleReset}>
                <span className="i-lucide-rotate-ccw h-4 w-4" /> Reset
              </ToolbarButton>
            </div>
          </div>
        </div>
        {/* Línea superior 3px del header */}
        <div className="h-[3px] bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500" />
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 md:py-8 space-y-6">
        {/* Intro */}
        <section className="relative rounded-2xl border border-[#22314a] bg-[#0e1726]/80 shadow-sm p-5 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <Badge>🧭 Objetivo</Badge>
              <h2 className="text-xl md:text-2xl font-semibold">
                Acordar un arquetipo organizativo con reglas claras y criterios
                objetivos
              </h2>
              <p className="text-sm text-slate-300 max-w-3xl">
                Evalúen modelos, definan reglas no negociables y cierren con
                evaluación, condiciones de éxito y propuesta final.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="sky">⏱️ 90 min</Badge>
              <Badge tone="emerald">Local ✓</Badge>
            </div>
          </div>
        </section>

        {/* PARTE 1 */}
        <div className="space-y-6">
          {/* A — Reglas del juego */}
          <SectionCard
            anchor="a-reglas"
            emoji="🎯"
            title="SECCIÓN A — Reglas del juego (principios no negociables)"
            subtitle="Enumeren entre 3 y 5 condiciones que deben cumplirse en cualquier modelo organizativo."
          >
            <div className="overflow-auto">
              <table className="w-full min-w-[980px] text-sm">
                <thead>
                  <tr className="text-left text-slate-300">
                    <th className="py-2 pr-4 w-[26%]">Principio</th>
                    <th className="py-2 pr-4 w-[42%]">Explicación breve</th>
                    <th className="py-2 pr-4 w-[22%]">Capacidad relacionada</th>
                    <th className="py-2 pr-0 w-[10%]"></th>
                  </tr>
                </thead>
                <tbody>
                  {state.parte1.A_reglas.map((r) => (
                    <tr key={r.id} className="border-t border-[#22314a]">
                      <td className="py-2 pr-4">
                        <Input
                          value={r.principio}
                          onChange={(e) =>
                            updateField(
                              ["parte1", "A_reglas"],
                              r.id,
                              "principio",
                              e.target.value
                            )
                          }
                          placeholder='p. ej., "No duplicar funciones innecesarias"'
                        />
                      </td>
                      <td className="py-2 pr-4">
                        <Input
                          value={r.explicacion}
                          onChange={(e) =>
                            updateField(
                              ["parte1", "A_reglas"],
                              r.id,
                              "explicacion",
                              e.target.value
                            )
                          }
                          placeholder="¿Por qué es no negociable?"
                        />
                      </td>
                      <td className="py-2 pr-4">
                        <Input
                          value={r.capacidad}
                          onChange={(e) =>
                            updateField(
                              ["parte1", "A_reglas"],
                              r.id,
                              "capacidad",
                              e.target.value
                            )
                          }
                          placeholder="p. ej., Servicio al socio"
                        />
                      </td>
                      <td className="py-2 pr-0 text-right">
                        <button
                          onClick={() => removeRegla(r.id)}
                          className={`text-sm ${
                            state.parte1.A_reglas.length <= 3
                              ? "text-slate-600 cursor-not-allowed"
                              : "text-slate-300 hover:text-slate-100"
                          }`}
                          disabled={state.parte1.A_reglas.length <= 3}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3">
              <ToolbarButton onClick={addRegla}>
                + Agregar principio
              </ToolbarButton>
              <Pill className="ml-2">mín. 3 / máx. 5</Pill>
            </div>
          </SectionCard>

          {/* B — Modelos organizativos */}
          <SectionCard
            anchor="b-modelos"
            emoji="📦"
            title="SECCIÓN B — Modelos organizativos y su pertinencia"
            subtitle="Revisen cada modelo, sus fortalezas, riesgos, viabilidad y relación con capacidades críticas."
          >
            <div className="overflow-auto">
              <table className="w-full min-w-[1100px] text-sm">
                <thead>
                  <tr className="text-left text-slate-300">
                    <th className="py-2 pr-4 w-[16%]">Modelo organizativo</th>
                    <th className="py-2 pr-4 w-[28%]">
                      Fortalezas para el Club
                    </th>
                    <th className="py-2 pr-4 w-[28%]">Riesgos o fricciones</th>
                    <th className="py-2 pr-4 w-[12%]">¿Viable?</th>
                    <th className="py-2 pr-4 w-[16%]">Capacidad impactada</th>
                    <th className="py-2 pr-0 w-[8%]"></th>
                  </tr>
                </thead>
                <tbody>
                  {state.parte1.B_modelos.map((m) => (
                    <tr key={m.id} className="border-t border-[#22314a]">
                      <td className="py-2 pr-4">
                        <Input
                          value={m.nombre}
                          onChange={(e) =>
                            updateField(
                              ["parte1", "B_modelos"],
                              m.id,
                              "nombre",
                              e.target.value
                            )
                          }
                          placeholder='p. ej., "Funcional"'
                        />
                      </td>
                      <td className="py-2 pr-4">
                        <Input
                          value={m.fortalezas}
                          onChange={(e) =>
                            updateField(
                              ["parte1", "B_modelos"],
                              m.id,
                              "fortalezas",
                              e.target.value
                            )
                          }
                          placeholder="Beneficios clave para el Club"
                        />
                      </td>
                      <td className="py-2 pr-4">
                        <Input
                          value={m.riesgos}
                          onChange={(e) =>
                            updateField(
                              ["parte1", "B_modelos"],
                              m.id,
                              "riesgos",
                              e.target.value
                            )
                          }
                          placeholder="Riesgos o posibles fricciones"
                        />
                      </td>
                      <td className="py-2 pr-4">
                        <Select
                          value={m.viable}
                          onChange={(e) =>
                            updateField(
                              ["parte1", "B_modelos"],
                              m.id,
                              "viable",
                              e.target.value
                            )
                          }
                        >
                          <option>Sí</option>
                          <option>No</option>
                          <option>Depende</option>
                        </Select>
                      </td>
                      <td className="py-2 pr-4">
                        <Input
                          value={m.impactoCapacidad}
                          onChange={(e) =>
                            updateField(
                              ["parte1", "B_modelos"],
                              m.id,
                              "impactoCapacidad",
                              e.target.value
                            )
                          }
                          placeholder="¿Qué capacidad fortalece/debilita?"
                        />
                      </td>
                      <td className="py-2 pr-0 text-right">
                        <button
                          onClick={() =>
                            removeRow(["parte1", "B_modelos"], m.id)
                          }
                          className={`text-sm ${
                            state.parte1.B_modelos.length <= 4
                              ? "text-slate-600 cursor-not-allowed"
                              : "text-slate-300 hover:text-slate-100"
                          }`}
                          disabled={state.parte1.B_modelos.length <= 4}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3">
              <ToolbarButton onClick={addModelo}>
                + Agregar modelo
              </ToolbarButton>
              <Pill className="ml-2">
                incluye: Funcional, Divisional, Matricial, Híbrido/Center-led
              </Pill>
            </div>
          </SectionCard>
        </div>

        {/* PARTE 2 */}
        <div className="space-y-6">
          {/* E — Evaluación */}
          <SectionCard
            anchor="e-evaluacion"
            emoji="⭐"
            title="SECCIÓN C — Evaluación del modelo propuesto"
            subtitle="Califiquen el modelo con base en cinco criterios (1–5 ⭐) y justifiquen brevemente."
          >
            <div className="overflow-auto">
              <table className="w-full min-w-[980px] text-sm">
                <thead>
                  <tr className="text-left text-slate-300">
                    <th className="py-2 pr-4">Criterio</th>
                    <th className="py-2 pr-4">Puntaje (1–5 ⭐)</th>
                    <th className="py-2 pr-4">Justificación breve</th>
                  </tr>
                </thead>
                <tbody>
                  {state.parte2.E_eval.map((c) => (
                    <tr key={c.id} className="border-t border-[#22314a]">
                      <td className="py-2 pr-4">{c.criterio}</td>
                      <td className="py-2 pr-4">
                        <div className="flex items-center gap-2">
                          <Select
                            value={c.puntaje}
                            onChange={(e) =>
                              updateField(
                                ["parte2", "E_eval"],
                                c.id,
                                "puntaje",
                                Number(e.target.value)
                              )
                            }
                          >
                            {[1, 2, 3, 4, 5].map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </Select>
                          <Stars value={c.puntaje} />
                        </div>
                      </td>
                      <td className="py-2 pr-4">
                        <Input
                          value={c.justificacion}
                          onChange={(e) =>
                            updateField(
                              ["parte2", "E_eval"],
                              c.id,
                              "justificacion",
                              e.target.value
                            )
                          }
                          placeholder="Justificación breve…"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* F — Condiciones de éxito */}
          <SectionCard
            anchor="f-condiciones"
            emoji="🛠️"
            title="SECCIÓN D — Condiciones de éxito y próximos pasos"
            subtitle="Identifiquen resistencias, condiciones mínimas y una acción inicial para validar el modelo en 90 días."
          >
            <div className="grid md:grid-cols-3 gap-4">
              <TextArea
                value={state.parte2.F_condiciones.resistencia}
                onChange={(e) =>
                  updateValue(
                    ["parte2", "F_condiciones", "resistencia"],
                    e.target.value
                  )
                }
                placeholder="Posible resistencia interna…"
              />
              <TextArea
                value={state.parte2.F_condiciones.condicionMinima}
                onChange={(e) =>
                  updateValue(
                    ["parte2", "F_condiciones", "condicionMinima"],
                    e.target.value
                  )
                }
                placeholder="Condición mínima que debe cumplirse…"
              />
              <TextArea
                value={state.parte2.F_condiciones.accion90}
                onChange={(e) =>
                  updateValue(
                    ["parte2", "F_condiciones", "accion90"],
                    e.target.value
                  )
                }
                placeholder="Acción concreta de validación (90 días)…"
              />
            </div>
          </SectionCard>

          {/* G — Propuesta final (labels fuera) */}
          <SectionCard
            anchor="g-propuesta"
            emoji="🤝"
            title="SECCIÓN E — Propuesta final del grupo"
            subtitle="Entregable final a presentar en plenaria."
          >
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-slate-300">
                  Modelo más adecuado (p. ej., Híbrido / Center-led)
                </label>
                <Input
                  value={state.parte2.G_propuesta.modeloElegido}
                  onChange={(e) =>
                    updateValue(
                      ["parte2", "G_propuesta", "modeloElegido"],
                      e.target.value
                    )
                  }
                  placeholder=""
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-300">
                  Porque nos permite… (beneficios/razones)
                </label>
                <TextArea
                  value={state.parte2.G_propuesta.porque}
                  onChange={(e) =>
                    updateValue(
                      ["parte2", "G_propuesta", "porque"],
                      e.target.value
                    )
                  }
                  placeholder=""
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-300">
                  Primer paso para iniciar la implementación
                </label>
                <TextArea
                  value={state.parte2.G_propuesta.primerPaso}
                  onChange={(e) =>
                    updateValue(
                      ["parte2", "G_propuesta", "primerPaso"],
                      e.target.value
                    )
                  }
                  placeholder=""
                />
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="pb-12" />
      </main>

      {/* Iconos mínimos (fallback) */}
      <style>{`
        .i-lucide-download::before{content:"\\2193";}
        .i-lucide-rotate-ccw::before{content:"\\21BA";}
      `}</style>
    </div>
  );
}
