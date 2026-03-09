import React, { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const levels = [
  {
    number: "I",
    phase: "ORIGEN",
    name: "Gross Revenues",
    subtitle: "Ingresos Brutos Totales",
    accent: "#2C4A8C",
    light: "#EEF2FB",
    description:
      "Representa el 100% del dinero generado por la película en todas sus ventanas de explotación. Es el punto de partida del waterfall: de aquí se irán deduciendo todos los costos, fees y recoupments hasta llegar al beneficio neto.",
    streams: [
      {
        label: "Taquilla (theatrical)",
        detail:
          "Porcentaje variable según acuerdo con exhibidores. En Colombia, el exhibidor retiene aprox. 50% del box office y remite el restante al distribuidor.",
      },
      {
        label: "Ventas de territorios (MG)",
        detail:
          "Minimum guarantees pagados por distribuidores territoriales al momento de la venta. Son ingresos 'seguros' que pueden usarse como colateral para financiamiento previo (pre-sales).",
      },
      {
        label: "Plataformas SVOD / AVOD",
        detail:
          "Netflix, Amazon, Disney+, Claro Video, etc. Pagan fees de licencia por ventana exclusiva o no exclusiva. Los montos varían enormemente por territorio y tipo de contenido.",
      },
      {
        label: "TV abierta y paga",
        detail:
          "Licencias para cadenas nacionales e internacionales. En Colombia, RCN, Caracol y canales regionales son compradores habituales de cine nacional.",
      },
      {
        label: "Ancillary (DVD, VOD, merch)",
        detail:
          "Ventanas secundarias que representan ingresos marginales en la era del streaming, pero relevantes en mercados emergentes o para proyectos con fanbase específico.",
      },
    ],
    nota: "Punto técnico: los Gross Revenues no son el ingreso 'real' del productor. Antes de ver un peso, se deben cubrir todos los tramos siguientes del waterfall.",
    alerta: null,
  },
  {
    number: "II",
    phase: "DISTRIBUCIÓN",
    name: "Distributor's Fee & P&A",
    subtitle: "Comisión y Gastos del Distribuidor",
    accent: "#8C3A2C",
    light: "#FBF0EE",
    description:
      "El distribuidor retiene su comisión pactada sobre los ingresos brutos y adicionalmente recupera todos los gastos en que incurrió para lanzar la película. Este tramo puede consumir entre el 40% y el 60% de los ingresos totales en distribuciones agresivas.",
    streams: [
      {
        label: "Distributor's Fee (comisión)",
        detail:
          "Oscila entre el 15% y el 35% sobre gross revenues, dependiendo del territorio (EEUU: 30–35%, Europa: 20–25%, Colombia/LatAm: 15–20%). Se descuenta antes de cualquier gasto.",
      },
      {
        label: "P&A — Prints & Advertising",
        detail:
          "El mayor costo de distribución. Incluye materiales de campaña, trailers, pauta en medios, publicidad digital, screeners, materiales de prensa y costos de entrega de copias DCP a los exhibidores.",
      },
      {
        label: "Gastos técnicos de entrega",
        detail:
          "Subtitulaje, doblaje (cuando aplica), conformado de DCP, versiones de accesibilidad (audiodescripción, subtítulos para sordos), costos de certificación de rating (MPAA/DACMI).",
      },
      {
        label: "Marketing digital y PR",
        detail:
          "Campañas en redes sociales, influencer marketing, ruedas de prensa, apariciones en medios. En lanzamientos de plataforma, este rubro puede ser menor o absorbido por el SVOD.",
      },
      {
        label: "Gastos de festivales",
        detail:
          "Inscripciones, materiales para prensa, viajes y gastos de representación si el distribuidor gestiona la estrategia de festivales como parte del lanzamiento.",
      },
    ],
    nota: "El productor debe negociar un cap (techo) a los gastos de P&A y exigir aprobación previa de gastos que superen cierto umbral. Sin este control, el distribuidor puede inflar costos indefinidamente.",
    alerta:
      "⚠ Creative accounting: distribuidores pueden cargar overhead y costos administrativos propios dentro de los 'gastos de distribución'. Revisar el contrato cláusula por cláusula.",
  },
  {
    number: "III",
    phase: "DISTRIBUCIÓN",
    name: "Net Revenues",
    subtitle: "Ingresos Netos — Rentable al Productor",
    accent: "#2C6B4A",
    light: "#EEF8F2",
    description:
      "Es el dinero que queda después de que el distribuidor tomó su comisión y recuperó sus gastos. Representa el flujo que regresa hacia el productor y los financiadores. Fórmula: Gross Revenues − Distributor's Fee − Distribution Expenses = Net Revenues.",
    streams: [
      {
        label: "Cálculo ilustrativo",
        detail:
          "Si la película recauda USD 1.000.000 en taquilla y el exhibidor retiene 50% → USD 500.000 llegan al distribuidor. Si cobra 25% de fee → USD 125.000 de comisión. Si P&A costaron USD 200.000 → Net Revenue = USD 175.000.",
      },
      {
        label: "Relevancia contractual",
        detail:
          "Muchos contratos definen las participaciones de productores, actores o inversores sobre los Net Revenues y no sobre los Gross. Esto cambia radicalmente los números y es un punto de negociación crítico.",
      },
      {
        label: "Sales statement (reporte de ventas)",
        detail:
          "El distribuidor tiene obligación contractual de reportar periódicamente (trimestral o semestral) los ingresos, gastos y el net revenue generado. El productor debe tener derecho de auditoría incluido en el contrato.",
      },
      {
        label: "Royalty vs. profit share",
        detail:
          "En ventas territoriales, el MG (advance) se descuenta del royalty que generaría ese territorio. Solo cuando el MG es 'earned out' comienzan a fluir royalties reales al productor.",
      },
    ],
    nota: "La mayoría de películas independientes no generan Net Revenues positivos después de distribución. Por eso el producer fee upfront es la remuneración real del productor — no el back end. Para el inversionista colombiano, los CIC (Ley 814) y CoCrea (Ley 1955/2019) son el verdadero motor de retorno: el 57.75% de su inversión no depende de que la película genere Net Revenues positivos.",
    alerta: null,
  },
  {
    number: "IV",
    phase: "RECOUPMENT",
    name: "Senior Debt Recoupment",
    subtitle: "Recuperación de Deuda Garantizada",
    accent: "#5C2C8C",
    light: "#F5F0FB",
    description:
      "Los prestamistas con deuda garantizada (secured debt) tienen prioridad absoluta de cobro. Cobran capital más intereses antes que cualquier inversor de equity. Esta es la capa más segura del waterfall para los acreedores, y la más costosa para el productor.",
    streams: [
      {
        label: "Bancos y gap lenders",
        detail:
          "Instituciones financieras que prestaron contra contratos de pre-venta o presupuesto comprometido. El gap lender financia la brecha entre el presupuesto y los recursos confirmados, tomando como garantía los ingresos proyectados de ventas territoriales o plataformas.",
      },
      {
        label: "Completion guarantor (CBG)",
        detail:
          "Si se contrató un completion bond, la aseguradora que financió la finalización del proyecto cuando hubo sobrecostos cobra en este tramo. La tasa de interés suele ser penalizatoria.",
      },
      {
        label: "Intereses y fees de estructuración",
        detail:
          "Los préstamos de producción suelen tener tasas entre 8% y 15% anual más fees de originación (1–2%). En proyectos con gap financing, los costos financieros pueden ser significativos.",
      },
      {
        label: "Carta de crédito (LC) o colateral",
        detail:
          "Algunos financiadores requieren cartas de crédito o activos en garantía. El costo de estos instrumentos también entra en este tramo de recoupment.",
      },
    ],
    nota: "En estructuras colombianas con CIC (Ley 814), los certificados no son descontados por bancos. El mecanismo es puramente tributario: el productor emite el CIC al inversionista, quien lo presenta ante la DIAN para deducir el 165% de su inversión en su declaración de renta. La deuda senior en este tramo proviene de créditos de producción ordinarios, no del CIC.",
    alerta:
      "⚠ Si la película no genera suficientes Net Revenues, el productor puede quedar personalmente responsable si firmó garantías personales sobre la deuda senior. Nunca firmar garantías sin analizar el riesgo de la cascada completa.",
  },
  {
    number: "V",
    phase: "RECOUPMENT",
    name: "Equity Recoupment",
    subtitle: "Recuperación del Capital de Riesgo",
    accent: "#8C6A2C",
    light: "#FBF7EE",
    description:
      "Después de cubrir la deuda senior, los inversores de equity recuperan su inversión. A diferencia de la deuda, el equity no tiene garantía de cobro: si los Net Revenues no alcanzan, los inversores pierden su capital. Este riesgo justifica su participación en el back end.",
    streams: [
      {
        label: "Recoupment 1x o 1.2x (mínimo garantizado)",
        detail:
          "Los inversores de equity generalmente tienen derecho a recuperar 1x su inversión antes del profit split. En Colombia, es usual pactar un retorno mínimo del 120% — es decir, el productor se compromete a que el inversionista recibirá al menos un 20% adicional sobre su capital antes de cualquier split.",
      },
      {
        label: "Orden entre co-productores",
        detail:
          "En co-producciones internacionales, el waterfall debe especificar si los inversores de distintos países cobran pari passu (al mismo tiempo, proporcionalmente) o en cascada según su nivel de riesgo y prioridad negociada.",
      },
      {
        label: "CIC (Ley 814) — cómo funciona la recuperación",
        detail:
          "El inversionista colombiano recupera aprox. el 57.75% de su inversión directamente vía la deducción tributaria del 165% ante la DIAN. No hay banco de por medio: el beneficio es del inversionista, no del productor. El productor simplemente emite el certificado. El restante ~42.25% de la inversión debe recuperarse por explotación de la obra en todas las ventanas comerciales.",
      },
      {
        label: "CIC — ejemplo numérico genérico",
        detail:
          "Si un inversionista aporta $1.000 a una producción bajo Ley 814: recupera ~$577,50 vía beneficio tributario (DIAN), y debe recuperar ~$422,50 por ingresos de la película. El productor se compromete contractualmente a que el inversionista recuperará primero esos $422,50 antes de cualquier reparto de utilidades.",
      },
      {
        label: "Fondos no reembolsables (FDC, Ibermedia)",
        detail:
          "Los aportes del FDC (Fondo para el Desarrollo Cinematográfico) o de Ibermedia son subsidios no reembolsables: no aparecen en el recoupment de equity porque no son capital en riesgo. Sin embargo, pueden existir obligaciones de reinversión, reporte o restricciones sobre derechos territoriales. Distinto de CoCrea, que sí es inversión con beneficio tributario y sí genera recoupment.",
      },
      {
        label: "Producer's equity",
        detail:
          "Si el productor puso capital propio en el proyecto (en dinero o servicios diferidos valorados), ese aporte también va en este tramo. Es fundamental que esté documentado desde el inicio en el acuerdo de inversión para que quede en igualdad de condiciones con los demás inversores de equity.",
      },
      {
        label: "El productor nunca 'recupera' — su compensación es el fee",
        detail:
          "El productor no aparece como acreedor en el waterfall de recoupment. Su remuneración por servicios de producción es el producer fee, que ya está incluido en el presupuesto como costo y se paga durante la producción. El waterfall existe para los inversionistas que pusieron capital en riesgo. El back end del productor (Producers Pool, nivel VIII) es profit participation negociada — no recuperación de capital.",
      },
      {
        label:
          "Co-producciones: inversionistas de distintas partes en el mismo waterfall",
        detail:
          "En una co-producción internacional, los inversionistas del coproductor extranjero (ej. Francia) participan en el mismo waterfall que los colombianos. Su posición — pari passu, prioridad o subordinada — se negocia contractualmente. El coproductor como entidad no 'recupera': recuperan sus inversionistas.",
      },
      {
        label:
          "Rebate / tax credit del país coproductor: efecto sobre el recoupment",
        detail:
          "Si el país del coproductor otorga un rebate o tax credit (ej. 30% sobre el aporte), ese monto ya fue cobrado por los inversionistas del coproductor antes de que los ingresos de explotación lleguen al waterfall. Por tanto, solo deben recuperar por el waterfall el neto: aporte bruto − incentivo. Es funcionalmente idéntico al CIC para el lado colombiano. No importa si es rebate o tax credit: para efectos del waterfall, ambos reducen el toRecover de los inversionistas del coproductor.",
      },
      {
        label:
          "Exclusividad territorial: operativa, no separación del waterfall",
        detail:
          "La exclusividad territorial pacta quién gestiona y licencia cada territorio — quién negocia con el distribuidor local, quién cobra el MG, quién firma el contrato de licencia. No significa que esos ingresos queden fuera del waterfall común. El dinero que entra por Francia lo recibe el coproductor francés como operador de ese territorio, pero lo reporta y consolida en el waterfall compartido donde todos los inversionistas — colombianos y franceses, pari passu o no — tienen derecho de recoupment sobre el total. Dicho de otra forma: la exclusividad resuelve quién distribuye, no a quién le pertenece el ingreso para efectos del recoupment.",
      },
      {
        label: "CoCrea (Ley 1955/2019) no es soft money",
        detail:
          "CoCrea es un mecanismo de inversión con beneficio tributario para inversionistas colombianos en economía naranja. Es análogo al CIC/Ley 814: el inversionista aporta capital en riesgo y recupera vía deducción del 165% ante la DIAN (~57.75% efectivo). Sí aparece en el waterfall de recoupment, igual que el CIC. No confundir con FDC o Ibermedia, que sí son subsidios no reembolsables y no generan derechos de recoupment.",
      },
    ],
    nota: "El CIC (Ley 814) y CoCrea (Ley 1955/2019) reducen el riesgo real del inversionista porque el 57.75% de su recuperación no depende del mercado sino de su declaración de renta ante la DIAN. Esto cambia el perfil de riesgo del proyecto y el poder de negociación del productor. En co-producciones, el rebate o tax credit del país coproductor tiene el mismo efecto estructural para sus inversionistas. No confundir con el CINA (Ley 1556), que es un tax credit del ~30% para productores extranjeros que filman en Colombia — son instrumentos completamente distintos.",
    alerta: null,
  },
  {
    number: "VI",
    phase: "DEFERMENTS",
    name: "Deferments",
    subtitle: "Pagos Diferidos Contractuales",
    accent: "#2C6B6B",
    light: "#EEF8F8",
    description:
      "Son obligaciones contractuales de pago que se difieren al momento en que los ingresos lo permitan. No son participaciones en ganancias sino remuneraciones pactadas que el talento o proveedor aceptó no cobrar upfront para facilitar el financiamiento de la producción.",
    streams: [
      {
        label: "Deferments de talentos principales",
        detail:
          "Actores de nombre o directores con poder de negociación pueden aceptar cobrar solo una fracción de su fee durante la producción y diferir el resto. Esto mejora el presupuesto upfront y les da interés en el éxito del proyecto.",
      },
      {
        label: "Deferments de crew técnico",
        detail:
          "Directores de fotografía, productores de línea, jefes de arte u otros key crew pueden diferir parte de su salario. Debe documentarse como obligación contractual, no como voluntad futura.",
      },
      {
        label: "Deferments de servicios de producción",
        detail:
          "Empresas de post-producción, estudios de sonido o laboratorios de color que trabajaron a crédito. Su cobro diferido aparece en este tramo antes del break-even.",
      },
      {
        label: "Deferment ≠ back end point",
        detail:
          "Un deferment es una deuda del productor: DEBE pagarlo cuando haya dinero. Un back end point es una participación condicional en ganancias: el talento solo cobra si hay ganancia neta. Son instrumentos completamente distintos.",
      },
    ],
    nota: "En Colombia, los deferments deben quedar explícitos en el contrato laboral o de prestación de servicios con el talento. Si no están documentados como obligación, pueden perderse en caso de disputa o insolvencia del proyecto.",
    alerta:
      "⚠ Riesgo de doble exposición: si el proyecto fracasa, el productor puede quedar con deferments impagos como deuda personal. Siempre limitar los deferments al 'net proceeds' del proyecto, nunca a la responsabilidad personal del productor.",
  },
  {
    number: "◆",
    phase: "PUNTO DE EQUILIBRIO",
    name: "BREAK-EVEN POINT",
    subtitle: "Frontera entre Front End y Back End Real",
    accent: "#1A1A1A",
    light: "#F5F0E8",
    special: true,
    description:
      "El break-even es el momento en que los ingresos netos han cubierto completamente toda la deuda senior, el capital de equity y los deferments. A partir de este punto, cada peso adicional es ganancia pura. Es la frontera legal y económica entre el 'front end' y el 'back end' verdadero.",
    streams: [
      {
        label: "Por qué la mayoría no llega",
        detail:
          "Estadísticamente, entre el 70% y el 80% de las películas independientes no recuperan su inversión de distribución. El productor que diseñó su remuneración solo en el back end frecuentemente no cobra nada.",
      },
      {
        label: "Creative accounting en Hollywood",
        detail:
          "Prácticas contables legales pero agresivas por las que estudios cargan overhead corporativo, costos de financiamiento y fees de subsidiarias a los gastos del proyecto. Caso célebre: 'El rey León' (1994) reportó pérdidas contables a pesar de recaudar USD 987 millones en taquilla.",
      },
      {
        label: "Break-even en proyectos colombianos con CIC",
        detail:
          "Con CIC (Ley 814), el break-even real está más cerca porque el inversionista ya recuperó ~57.75% vía DIAN. Por explotación solo necesita recuperar el ~42.25% restante, lo que reduce el monto que la película debe generar antes del profit split.",
      },
      {
        label: "Definición contractual del break-even",
        detail:
          "Las partes pueden negociar un 'Defined Gross' o 'Modified Gross' que excluye ciertos costos del cálculo. El productor debe insistir en definiciones precisas y cerradas para evitar manipulación posterior.",
      },
    ],
    nota: "El break-even no es un número que surge naturalmente de la contabilidad. Es una construcción contractual. El productor que no negocia cómo se define puede firmar un contrato que matemáticamente hace imposible que alguna vez reciba back end.",
    alerta:
      "⚠ REGLA DE ORO: el productor nunca debe depender exclusivamente del back end para su remuneración. El producer fee upfront, los incentivos fiscales y los MG de ventas de territorios son la remuneración real en el 80% de los proyectos independientes.",
  },
  {
    number: "VII",
    phase: "BACK END",
    name: "Profit Split",
    subtitle: "División de Ganancias — Back End Amplio",
    accent: "#8C2C5C",
    light: "#FBEEf4",
    description:
      "Después del break-even, las ganancias se dividen entre todos los participantes que tienen 'points' o participación en beneficios. La proporción típica es 50/50 entre el lado financiador y el lado productor, pero es completamente negociable.",
    streams: [
      {
        label: "50% Lado Financiador",
        detail:
          "Los inversores de equity que ya recuperaron su capital ahora participan en las ganancias como retorno adicional. En algunas estructuras, este porcentaje disminuye escalonadamente a medida que el proyecto genera más ingresos.",
      },
      {
        label: "50% Lado Productor (Producers Pool)",
        detail:
          "La mitad que va al productor no es para una sola persona: se divide entre todos los productores con derechos sobre la película. Este es el Producers Pool propiamente dicho.",
      },
      {
        label: "Participaciones de talento ('points')",
        detail:
          "Actores, directores o guionistas con poder de negociación pueden obtener 'net points' o 'gross points'. Los net points son sobre el back end total; los gross points son sobre los gross revenues — mucho más valioso y raramente concedido.",
      },
      {
        label: "Splits escalonados (tiered waterfall)",
        detail:
          "Algunos acuerdos tienen splits que mejoran para el productor a medida que aumentan las ganancias. Ej: 40/60 para las primeras ganancias, 50/50 entre umbrales X e Y, y 60/40 para ganancias superiores a Z.",
      },
      {
        label: "Impacto del CIC en el profit split",
        detail:
          "Un inversionista colombiano que ya recuperó ~57.75% de su capital vía CIC tiene menor exposición al riesgo. Esto le da al productor argumentos para negociar un split más favorable. En estructuras habituales, el split es 50/50 sobre el excedente una vez cubierto el retorno mínimo garantizado (típicamente 120%).",
      },
    ],
    nota: "El profit split es el nivel donde se juega la estrategia de monetización del productor. Quien negocia bien puede obtener más del 50% del back end si aporta derechos de IP, co-producción con fondos públicos o presales que reducen el riesgo del financiador.",
    alerta: null,
  },
  {
    number: "VIII",
    phase: "PRODUCERS POOL",
    name: "Producers Pool",
    subtitle: "Distribución Interna entre Productores — Back End Específico",
    accent: "#2C6B2C",
    light: "#EEF8EE",
    description:
      "El Producers Pool es la porción del profit split asignada al 'lado productor'. No va a una sola persona: se distribuye entre todos los productores con derechos contractuales sobre el proyecto. Es la remuneración aspiracional del productor, real pero incierta.",
    streams: [
      {
        label: "Participantes típicos del pool",
        detail:
          "Productor ejecutivo (EP), productor de línea (line producer), co-productores internacionales, productores asociados. Cada uno tiene un porcentaje negociado del pool total, no del back end total de la película.",
      },
      {
        label: "Cálculo en cascada — ejemplo genérico",
        detail:
          "Suponga una inversión de $3.000 y un retorno mínimo garantizado del 120% ($3.600). El inversionista recupera ~57.75% vía DIAN ($1.732) y el restante ~42.25% ($1.268) por explotación, más el 20% adicional pactado ($600). Solo los ingresos que superen $3.600 se dividen 50/50. Si la película genera exactamente $3.600, el Producers Pool es $0.",
      },
      {
        label: "Producers Pool ≠ Back End total",
        detail:
          "El 'back end' incluye tanto el lado financiador como el producers pool. Cuando un actor dice tener '5 puntos de back end', probablemente tiene un % sobre el profit split total, no solo sobre el producers pool.",
      },
      {
        label: "Productores colombianos en co-producciones",
        detail:
          "En una co-producción colombo-francesa, el productor colombiano puede haber conseguido los CIC que redujeron el riesgo real del proyecto. Ese aporte intangible debe reflejarse en el reparto del producers pool, aunque no sea en dinero efectivo.",
      },
      {
        label: "Producer fee vs. Producers Pool",
        detail:
          "El producer fee es remuneración upfront por servicios de producción: va en el presupuesto como costo. El producers pool es el upside por el riesgo asumido. Confundirlos es el error más común de productores novatos.",
      },
      {
        label: "Cap table del producers pool",
        detail:
          "En proyectos complejos existe un 'cap table' del pool que documenta exactamente quién tiene qué porcentaje, en qué condiciones cobra, y si hay dilución por ingreso de nuevos productores durante el desarrollo. Este documento debe firmarse desde el inicio.",
      },
    ],
    nota: "Síntesis: el Producers Pool es un subconjunto del back end. El back end es todo lo que viene después del break-even. El Producers Pool es la fracción de ese back end que le corresponde al lado productor, la cual a su vez se divide entre los productores con derechos contractuales.",
    alerta:
      "⚠ Error frecuente: pactar '50% del back end' sin definir si ese 50% es sobre el profit split total o solo sobre el producers pool. La diferencia puede equivaler al 100% del valor económico del acuerdo.",
  },
];

const glossary = [
  {
    term: "Ancillary rights",
    def: "Derechos de explotación secundarios: DVD, merchandising, música, libros, videojuegos. Generalmente representan ingresos marginales, pero en franquicias pueden superar los ingresos principales.",
  },
  {
    term: "Back end",
    def: "Participación en ganancias que se recibe después del break-even. Contrasta con el front end, que son pagos fijos e independientes del rendimiento comercial de la película.",
  },
  {
    term: "Break-even",
    def: "Punto en que los ingresos netos cubren todos los costos, deudas y recoupments. Es una construcción contractual, no un resultado contable automático. A partir de este punto comienzan las ganancias.",
  },
  {
    term: "Cap de P&A",
    def: "Límite máximo negociado sobre los gastos de distribución (Prints & Advertising). Sin este cap, el distribuidor puede inflar costos indefinidamente, retrasando o eliminando el break-even.",
  },
  {
    term: "CIC",
    def: "Certificado de Inversión Cinematográfica (Ley 814 de 2003). El inversionista colombiano deduce el 165% de su inversión en su declaración de renta ante la DIAN. Como la tarifa corporativa es ~35%, el ahorro tributario equivale al 57.75% del capital invertido (165% × 35%). La DIAN no gira dinero: el inversionista simplemente paga menos impuesto ese año. El 42.25% restante debe recuperarse por explotación comercial de la película.",
  },
  {
    term: "CINA",
    def: "Certificado de Inversión en la Actividad Audiovisual (Ley 1556 de 2012). Cash rebate de ~40% para productores EXTRANJEROS que filman en Colombia sobre gastos elegibles en el país. El beneficio es para el productor foráneo, no para el inversionista colombiano. No es combinable con CIC/Ley 814. No confundir: el CIC financia producción colombiana; el CINA atrae rodajes extranjeros.",
  },
  {
    term: "CoCrea",
    def: "Mecanismo de inversión en economía naranja (Ley 1955 de 2019, Art. 165). Funciona igual que el CIC: el inversionista deduce el 165% en renta y ahorra el 57.75% de su capital. A diferencia del FDC o Ibermedia, CoCrea SÍ es capital en riesgo con derechos de recoupment en el waterfall. No es soft money. Aplica a proyectos del sector cultural y creativo, con un universo más amplio que la Ley 814.",
  },
  {
    term: "Completion bond",
    def: "Garantía de terminación. Seguro contratado para garantizar que la película se terminará dentro del presupuesto y el cronograma. El completion guarantor puede tomar el control del proyecto si hay sobrecostos.",
  },
  {
    term: "Deferment",
    def: "Remuneración pactada que se pospone al momento en que haya ingresos suficientes. Es una deuda del productor, no una participación condicional. Debe documentarse explícitamente en el contrato.",
  },
  {
    term: "Distributor's fee",
    def: "Comisión del distribuidor sobre los ingresos brutos. Oscila entre 15% y 35% según territorio y tipo de distribución. Se descuenta antes de cualquier gasto de distribución.",
  },
  {
    term: "Earned out",
    def: "Punto en que los royalties generados por un territorio superan el MG (advance) pagado inicialmente. Solo entonces fluyen royalties reales hacia el productor provenientes de ese territorio.",
  },
  {
    term: "Equity",
    def: "Capital de riesgo invertido en el proyecto sin garantía de retorno. El inversor de equity cobra después de la deuda senior pero participa en las ganancias. En cine, el equity es la inversión más riesgosa y la que más potencial de upside tiene.",
  },
  {
    term: "FDC",
    def: "Fondo para el Desarrollo Cinematográfico. Fondo público colombiano administrado por Proimágenes Colombia que otorga estímulos no reembolsables (soft money) para producción, distribución y exhibición de cine nacional. Al ser no reembolsable, no genera derechos de recoupment en el waterfall. Distinto del CIC y CoCrea, que sí son inversión con recoupment.",
  },
  {
    term: "Front end",
    def: "Pagos fijos independientes del rendimiento comercial: producer fee, salarios, MGs. Contrasta con el back end. El productor nunca debe depender exclusivamente del back end.",
  },
  {
    term: "Gap financing",
    def: "Financiamiento que cubre la brecha entre el presupuesto total y los recursos ya comprometidos. El gap lender toma como garantía los ingresos proyectados de ventas territoriales aún no cerradas.",
  },
  {
    term: "Gross points",
    def: "Participación en los ingresos brutos de la película (Gross Revenues), antes de cualquier deducción. Extremadamente valioso y raramente concedido — solo actores o directores con altísimo poder de negociación lo obtienen.",
  },
  {
    term: "Gross revenues",
    def: "Ingresos brutos totales generados por la película en todas sus ventanas de explotación. Es el punto de partida del waterfall, antes de cualquier deducción.",
  },
  {
    term: "MG (Minimum Guarantee)",
    def: "Garantía mínima pagada por un distribuidor territorial al momento de adquirir los derechos de distribución. Es un advance contra futuras regalías. Proporciona liquidez al productor antes del estreno.",
  },
  {
    term: "Net points",
    def: "Participación en las ganancias netas de la película, es decir, después del break-even. Mucho más común que los gross points pero menos valioso, ya que depende de que la película supere todos los costos.",
  },
  {
    label: "Net revenues",
    def: "Ingresos netos: lo que queda después de deducir la comisión y los gastos del distribuidor de los gross revenues. Es el dinero que fluye de regreso hacia el productor y los financiadores.",
  },
  {
    term: "P&A",
    def: "Prints & Advertising. Costos de distribución que incluyen materiales de campaña, pauta publicitaria, copias DCP, prensa y marketing. El mayor rubro de gastos del distribuidor, que se descuenta antes de que llegue dinero al productor.",
  },
  {
    term: "Pari passu",
    def: "Expresión latina que significa 'en igualdad de condiciones'. En el waterfall, indica que varios inversionistas o acreedores cobran al mismo tiempo y en proporción a su inversión, sin que ninguno tenga prelación sobre los otros.",
  },
  {
    term: "Producers Pool",
    def: "La porción del profit split asignada al lado productor, que se divide entre todos los productores con derechos contractuales. Es un subconjunto del back end, no el back end total.",
  },
  {
    term: "Profit split",
    def: "División de las ganancias netas entre las partes del proyecto una vez superado el break-even. La proporción típica es 50/50 entre financiadores y productores, pero es completamente negociable.",
  },
  {
    term: "Recoupment",
    def: "Recuperación de la inversión. Proceso por el cual los financiadores recuperan el capital invertido antes de que comience el profit split. Puede ser de deuda (senior debt) o de equity, con distintas prioridades en el waterfall.",
  },
  {
    term: "Sales agent",
    def: "Agente de ventas internacionales. Representa la película ante distribuidores de distintos territorios, negocia los MGs y cobra una comisión (típicamente 10–15%) sobre las ventas cerradas.",
  },
  {
    term: "Waterfall",
    def: "Estructura contractual que determina el orden de prioridad en que se distribuyen los ingresos de una película entre todos los participantes. Como el agua que cae en cascada, el dinero va llenando cada nivel antes de pasar al siguiente.",
  },
  {
    term: "TIR",
    def: "Tasa Interna de Retorno. La tasa de interés anual equivalente que produce una inversión dado su cronograma de flujos de caja. Permite comparar invertir en cine con alternativas como un CDT o un fondo de renta fija. Con CIC, la TIR sube drásticamente porque el 57.75% del capital se recupera en el año 1, antes de que la película genere un peso de explotación.",
  },
  {
    term: "Múltiplo",
    def: "Total recibido dividido entre total invertido. Un múltiplo de 1.78x significa que por cada $100 invertidos se reciben $178. Complementa la TIR: el múltiplo mide cuánto dinero total se recupera; la TIR mide a qué velocidad. Una película puede tener TIR alta y múltiplo bajo (recupera rápido pero poco), o TIR baja y múltiplo alto (recupera mucho pero lento).",
  },
  {
    term: "Net revenues",
    def: "Ingresos netos sobre los que se aplica el waterfall de recoupment. Se calculan restando al gross bruto todas las comisiones de distribución (exhibidor, distribuidor local, cadena internacional) y los gastos de P&A. Es la base contractual del waterfall: a partir de aquí empieza el pago de acreedores en orden de prioridad.",
  },
  {
    term: "Soft money",
    def: "Financiación no reembolsable que no genera derechos de recoupment en el waterfall. Incluye subsidios públicos (FDC, Ibermedia, EFICINE) y fondos de coproducción. Reduce el equity en riesgo y mejora la viabilidad financiera del proyecto. No confundir con CIC y CoCrea, que sí son inversión con recoupment.",
  },
  {
    term: "Retorno mínimo garantizado",
    def: "Porcentaje de retorno que el productor garantiza contractualmente al inversionista antes de cualquier profit split. Un retorno mínimo del 120% significa que el inversionista debe recuperar su capital más un 20% adicional antes de que exista back end. Funciona como colchón de protección para el financiador.",
  },
  {
    term: "Box office",
    def: "Recaudación total de taquilla en salas de cine. Es el ingreso bruto antes de cualquier deducción. Del box office, el exhibidor retiene típicamente 50%, el distribuidor cobra su fee sobre el remanente, y solo entonces llega dinero al productor. En Colombia, el precio promedio de entrada multiplicado por los espectadores da el box office bruto.",
  },
  {
    term: "Exhibidor",
    def: "El cine o sala de exhibición. Retiene una parte del box office (típicamente 45–55%) directamente en taquilla antes de transferir el resto al distribuidor. Es el primer participante en cobrar en la cadena de distribución local. Su porcentaje puede variar por semana de exhibición según lo pactado.",
  },
  {
    term: "Ventana de explotación",
    def: "Período exclusivo en que la película se comercializa a través de un canal específico: salas (theatrical), VOD premium, plataformas SVOD, TV de pago, TV abierta. Cada ventana tiene su secuencia y duración negociada contractualmente. Las plataformas han comprimido estos plazos significativamente respecto al modelo tradicional.",
  },
  {
    term: "Cadena internacional",
    def: "La cadena de intermediarios en la distribución internacional: sales agent + distribuidor territorial. Entre ambos retienen típicamente 30–55% de los ingresos brutos internacionales. El sales agent cobra ~10–15% sobre ventas cerradas; el distribuidor territorial cobra su fee sobre el ingreso bruto de su territorio.",
  },
  {
    term: "Co-producción",
    def: "Acuerdo entre productores de dos o más países para financiar y producir conjuntamente una película. Puede ser formal (bajo un tratado bilateral) o informal (acuerdo contractual). En el waterfall, los inversionistas del coproductor tienen sus propios derechos de recoupment, que pueden ser pari passu, prioritarios o subordinados al lado colombiano.",
  },
  {
    term: "Rebate / Tax credit",
    def: "Incentivo del país coproductor que reduce el monto que sus inversionistas deben recuperar por explotación. Funcionalmente idéntico al CIC para el lado colombiano: adelanta parte de la recuperación fuera del waterfall de explotación. Ejemplos: EFICINE en México, tax credit en Francia, Ibermedia. Reduce el toRecover de los inversionistas del coproductor.",
  },
  {
    term: "Producer fee",
    def: "Remuneración del productor por su trabajo de desarrollo y producción. Se paga como costo del presupuesto (front end), no como participación en ganancias. Es la compensación real del productor en la mayoría de proyectos independientes, ya que el back end frecuentemente no se materializa. Nunca aparece como acreedor en el waterfall de recoupment.",
  },
  {
    term: "Long tail",
    def: "Ingresos tardíos generados por la película años después del estreno: ventas residuales en plataformas, televisión, mercados secundarios y catálogo. Pequeños individualmente pero acumulativamente significativos. En el modelo se refleja en la distribución temporal de TV y plataformas en los años 4–10 del horizonte de explotación.",
  },
  {
    term: "Ibermedia",
    def: "Programa iberoamericano de coproducción y desarrollo cinematográfico. Otorga fondos no reembolsables (soft money) a proyectos de países miembros. Al ser subsidio, no genera derechos de recoupment. Se combina frecuentemente con CIC para estructurar el financiamiento mixto de una producción colombiana.",
  },
].sort((a, b) =>
  (a.term || a.label || "").localeCompare(b.term || b.label || "")
);

const timelineEvents = [
  {
    phase: "Desarrollo",
    time: "Año –2 a –1",
    color: "#2C4A8C",
    items: [
      "Guión y derechos de IP",
      "Presupuesto y plan financiero",
      "Negociación de CIC / CoCrea con inversionistas",
      "Primeras negociaciones de co-producción",
      "Solicitud FDC / Ibermedia",
    ],
  },
  {
    phase: "Pre-producción",
    time: "Meses –6 a 0",
    color: "#5C2C8C",
    items: [
      "Cierre de financiamiento (equity + deuda)",
      "Emisión de CIC a inversionistas colombianos",
      "Contratos de pre-venta territoriales (MGs)",
      "Gap financing si aplica",
      "Completion bond",
    ],
  },
  {
    phase: "Producción",
    time: "Semanas 0–12",
    color: "#8C3A2C",
    items: [
      "Rodaje — ejecución del presupuesto",
      "Deferments se devengan (no se pagan)",
      "Informes periódicos a financiadores",
      "Posibles sobrecostos → completion bond activa",
    ],
  },
  {
    phase: "Post-producción",
    time: "Meses 3–9",
    color: "#8C6A2C",
    items: [
      "Edición, color, sonido",
      "Subtitulaje y versiones internacionales",
      "Entrega de materiales DCP",
      "Primeras proyecciones de ventas",
    ],
  },
  {
    phase: "Estreno y distribución",
    time: "Mes 9–18",
    color: "#2C6B4A",
    items: [
      "Estreno en salas — Gross Revenues nivel I",
      "Fee y P&A del distribuidor — nivel II",
      "Net Revenues inician flujo — nivel III",
      "Festivales internacionales",
      "Earned out de MGs territoriales",
    ],
  },
  {
    phase: "Ventas & Recoupment",
    time: "Año 1–3",
    color: "#2C6B6B",
    items: [
      "Ventas a plataformas SVOD/AVOD",
      "Ventas de TV abierta y paga",
      "Recoupment deuda senior — nivel IV",
      "Recoupment equity — nivel V",
      "Pago de deferments — nivel VI",
    ],
  },
  {
    phase: "Back end",
    time: "Año 3+",
    color: "#2C6B2C",
    items: [
      "Break-even (si se alcanza)",
      "Profit split 50/50 — nivel VII",
      "Distribución Producers Pool — nivel VIII",
      "Auditorías y sales statements",
      "Explotación ancillary long tail",
    ],
  },
];

const checklist = [
  {
    cat: "Contrato de distribución",
    items: [
      "Negociar un cap (techo) sobre los gastos de P&A",
      "Exigir aprobación previa para gastos que superen umbral pactado",
      "Incluir cláusula de auditoría del distribuidor (al menos 1 vez/año)",
      "Definir qué costos pueden incluirse en 'gastos de distribución'",
      "Establecer periodicidad de los sales statements (mínimo semestral)",
      "Verificar que la comisión aplica sobre Net Revenues, no sobre Gross",
    ],
  },
  {
    cat: "Acuerdo de inversión / Waterfall",
    items: [
      "Definir el break-even contractualmente con una fórmula precisa y cerrada",
      "Separar el producer fee del producers pool (son cosas distintas)",
      "Documentar el cap table del producers pool desde el inicio",
      "Precisar si el profit split aplica sobre el total o solo sobre el producers pool",
      "Acordar si el recoupment es pari passu o en cascada entre co-productores",
      "Documentar cualquier aporte del productor en servicios como equity",
    ],
  },
  {
    cat: "CIC / Ley 814 (Colombia)",
    items: [
      "Verificar que el proyecto tiene la Resolución de Reconocimiento de DACMI/MinCulturas",
      "Confirmar que el inversionista entiende que el CIC es su beneficio, no del productor",
      "Documentar en el contrato la obligación del productor de emitir el certificado",
      "Aclarar la distinción entre la recuperación vía DIAN (57.75%) y la recuperación por explotación (42.25%)",
      "Si hay retorno mínimo garantizado (ej. 120%), definirlo expresamente en el contrato",
      "Verificar que los CIC no se confundan con CINA (son mecanismos distintos)",
    ],
  },
  {
    cat: "Deferments",
    items: [
      "Documentar todo deferment en el contrato con el talento o proveedor",
      "Limitar la obligación de pago a 'net proceeds' del proyecto, no responsabilidad personal",
      "Distinguir deferment de back end point en cada contrato",
      "Establecer el orden de pago de deferments si hay varios (pari passu o cascada)",
    ],
  },
  {
    cat: "Garantías y deuda senior",
    items: [
      "Nunca firmar garantías personales sobre deuda senior sin análisis completo del waterfall",
      "Revisar qué activos propios quedan expuestos ante el completion guarantor",
      "Verificar que el completion bond no transfiere derechos IP al guarantor",
      "Documentar las condiciones exactas bajo las cuales el gap lender puede ejecutar la garantía",
    ],
  },
];

const incentivos = [
  {
    name: "CIC",
    ley: "Ley 814 de 2003",
    entidad: "DACMI / MinCulturas",
    color: "#2C4A8C",
    light: "#EEF2FB",
    beneficiario: "Inversionista colombiano (persona natural o jurídica)",
    mecanismo:
      "Deducción tributaria del 165% de la inversión en declaración de renta",
    porcentaje: "~57.75% de recuperación efectiva del capital",
    quien_recibe: "El inversionista (ante la DIAN)",
    obligacion_productor:
      "Emitir el CIC una vez terminada y reconocida la obra",
    reconocimiento: "Requiere Resolución de Reconocimiento de DACMI",
    limitaciones:
      "Solo para obras reconocidas como colombianas. La inversión debe hacerse antes del reconocimiento final.",
    nota: "El beneficio tributario NO es del productor. El productor solo emite el certificado.",
  },
  {
    name: "CINA",
    ley: "Ley 1556 de 2012",
    entidad: "Proimágenes Colombia",
    color: "#8C3A2C",
    light: "#FBF0EE",
    beneficiario: "Productor EXTRANJERO que filma en Colombia",
    mecanismo:
      "Reembolso en efectivo (cash rebate) de gastos locales elegibles",
    porcentaje: "Aprox. 30–40% del gasto local elegible en Colombia",
    quien_recibe: "El productor extranjero (en efectivo, post-producción)",
    obligacion_productor:
      "Cumplir mínimo de gasto local, presentar auditoría de gastos",
    reconocimiento:
      "Aprobación previa de Proimágenes. Auditoría de gastos elegibles.",
    limitaciones:
      "Solo para productores extranjeros. El gasto debe ser local y auditable. No aplica para productores colombianos.",
    nota: "El CINA NO es un mecanismo de inversión doméstica. Es un incentivo de atracción de rodajes extranjeros a Colombia.",
  },
  {
    name: "CoCrea",
    ley: "Ley 1955 de 2019 (Art. 165)",
    entidad: "MinCulturas/Cocrea",
    color: "#2C6B4A",
    light: "#EEF8F2",
    beneficiario: "Empresa colombiana contribuyente del impuesto de renta",
    mecanismo:
      "Descuento tributario del 165% sobre inversiones en proyectos de economía naranja",
    porcentaje: "~57.75% de recuperación efectiva (similar al CIC)",
    quien_recibe: "El inversionista (ante la DIAN)",
    obligacion_productor:
      "Inscribir el proyecto en el sistema de economía naranja. Cumplir requisitos de MinCulturas.",
    reconocimiento:
      "Inscripción y aprobación del proyecto ante MinCulturas o la entidad territorial.",
    limitaciones:
      "Universo más amplio que el CIC (incluye música, artes, videojuegos, etc.). Los proyectos audiovisuales compiten con otros sectores creativos por los cupos.",
    nota: "CoCrea amplía el universo de proyectos elegibles más allá del cine. Es útil para proyectos transmedia o series.",
  },
];

// ─── FONT STYLE ──────────────────────────────────────────────────────────────
const PD = "'Playfair Display', Georgia, serif";
const SS = "'Source Serif 4', Georgia, serif";

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function WaterfallTable() {
  const [activeRow, setActiveRow] = useState(null);
  return (
    <div>
      <div
        style={{
          border: "1px solid #BFB49C",
          borderRadius: "4px",
          background: "#FDFAF5",
          overflow: "hidden",
          boxShadow: "0 4px 32px rgba(0,0,0,0.07)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "40px 1fr auto 24px",
            gap: "0 12px",
            padding: "10px 20px",
            background: "#F0EAE0",
            borderBottom: "1px solid #BFB49C",
          }}
        >
          {["#", "Nivel del Waterfall", "Etapa", ""].map((h, i) => (
            <span
              key={i}
              style={{
                fontFamily: PD,
                fontSize: "12px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#6A5F4E",
              }}
            >
              {h}
            </span>
          ))}
        </div>
        {levels.map((level, i) => {
          const isOpen = activeRow === i;
          const isBreak = level.special;
          return (
            <div
              key={i}
              className={`wf-row${isOpen ? " active" : ""}${
                isBreak ? " wf-special-row" : ""
              }`}
              onClick={() => setActiveRow(isOpen ? null : i)}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "40px 1fr auto 24px",
                  gap: "0 12px",
                  padding: "16px 20px",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: SS,
                    fontStyle: "italic",
                    fontWeight: 300,
                    fontSize: isBreak ? "26px" : "28px",
                    color: "#8A7A62",
                    width: "40px",
                    flexShrink: 0,
                  }}
                >
                  {level.number}
                </span>
                <div>
                  <div
                    style={{
                      fontFamily: PD,
                      fontSize: "25px",
                      color: "#1A1410",
                      fontWeight: isBreak ? "bold" : "normal",
                      letterSpacing: isBreak ? "0.04em" : "0",
                    }}
                  >
                    {level.name}
                  </div>
                  <div
                    style={{
                      fontFamily: SS,
                      fontStyle: "italic",
                      fontSize: "20px",
                      color: "#6A5F4E",
                      marginTop: "3px",
                    }}
                  >
                    {level.subtitle}
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: PD,
                    fontSize: "12px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    padding: "4px 10px",
                    borderRadius: "2px",
                    background: level.light,
                    color: level.accent,
                    border: `1px solid ${level.accent}55`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {level.phase}
                </span>
                <span className={`wf-chevron${isOpen ? " open" : ""}`}>▶</span>
              </div>
              {isOpen && (
                <div
                  className="wf-animate"
                  style={{
                    padding: "0 20px 24px 72px",
                    borderTop: "1px solid #EDE8DF",
                  }}
                >
                  <p
                    style={{
                      fontFamily: SS,
                      fontSize: "24px",
                      lineHeight: 1.8,
                      color: "#221C12",
                      margin: "16px 0 20px",
                    }}
                  >
                    {level.description}
                  </p>
                  <div
                    style={{
                      fontFamily: PD,
                      fontSize: "12px",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "#6A5F4E",
                      marginBottom: "12px",
                    }}
                  >
                    Componentes y consideraciones clave
                  </div>
                  {level.streams.map((s, j) => (
                    <div
                      key={j}
                      className="wf-stream-item"
                      style={{ borderColor: level.accent + "88" }}
                    >
                      <div
                        className="wf-stream-label"
                        style={{ color: level.accent }}
                      >
                        {s.label}
                      </div>
                      <div className="wf-stream-detail">{s.detail}</div>
                    </div>
                  ))}
                  <div
                    style={{
                      fontFamily: SS,
                      fontStyle: "italic",
                      fontSize: "22px",
                      lineHeight: 1.75,
                      color: "#3D3220",
                      padding: "12px 16px",
                      borderLeft: "3px solid #B0A080",
                      marginTop: "16px",
                      background: "rgba(255,255,255,0.6)",
                    }}
                  >
                    <strong
                      style={{
                        fontStyle: "normal",
                        fontFamily: PD,
                        fontSize: "13px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#6A5F4E",
                      }}
                    >
                      Nota para clase —{" "}
                    </strong>
                    {level.nota}
                  </div>
                  {level.alerta && (
                    <div
                      style={{
                        fontFamily: SS,
                        fontSize: "22px",
                        lineHeight: 1.75,
                        padding: "12px 16px",
                        marginTop: "10px",
                        borderRadius: "3px",
                        background: "#FFF4EC",
                        borderLeft: "4px solid #B05C18",
                        color: "#5A2A08",
                      }}
                    >
                      {level.alerta}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── HELPERS ────────────────────────────────────────────────────────────────

function calcIRR(cashflows) {
  // Newton-Raphson con múltiples puntos de inicio para mayor robustez
  const npvAt = (r) =>
    cashflows.reduce((s, cf, t) => s + cf / Math.pow(1 + r, t), 0);
  for (const guess of [-0.5, -0.2, 0, 0.1, 0.3, 0.6, 1.0]) {
    let r = guess;
    for (let i = 0; i < 300; i++) {
      let npv = 0,
        dnpv = 0;
      for (let t = 0; t < cashflows.length; t++) {
        const d = Math.pow(1 + r, t);
        npv += cashflows[t] / d;
        if (t > 0) dnpv -= (t * cashflows[t]) / ((1 + r) * d);
      }
      if (Math.abs(dnpv) < 1e-12) break;
      const nr = r - npv / dnpv;
      if (Math.abs(nr - r) < 1e-7) {
        if (isFinite(nr) && nr > -0.9999 && nr < 50) return nr;
        break;
      }
      r = nr;
      if (!isFinite(r)) break;
    }
  }
  return null;
}

const TOOLTIPS = {
  MG: "Minimum Guarantee: advance que paga el distribuidor al cerrar el acuerdo. Se descuenta de royalties futuros.",
  "P&A":
    "Prints & Advertising: costos de lanzamiento y marketing. Puede ser adelantado por el distribuidor o pre-financiado por el productor.",
  "Cadena int'l":
    "Porcentaje combinado del distribuidor territorial local + el sales agent internacional. Rango habitual: 30–40%.",
  CIC: "Certificado de Inversión Cinematográfica (Ley 814/2003). El inversionista colombiano deduce el 165% en renta, ahorrando impuestos equivalentes al 57.75% de su capital (165% × tarifa 35%). No es un reembolso de la DIAN — es menor impuesto a pagar.",
  CINA: "Cash rebate ~30% para productores EXTRANJEROS que filman en Colombia. No confundir con el CIC.",
  TIR: "Tasa Interna de Retorno. Tasa anual de descuento que hace cero el VPN de los flujos de caja del inversionista.",
  "Break-even":
    "Punto en que los ingresos netos cubren toda deuda, equity y deferments. Construcción contractual, no contable.",
  Deferments:
    "Remuneraciones pactadas que se difieren al momento en que haya ingresos. Son deuda del productor, no participación condicional.",
  "Pari passu":
    "Los inversionistas cobran al mismo tiempo y en proporción a su participación, sin prelación entre ellos.",
  "Gap financing":
    "Financia la brecha entre presupuesto total y recursos confirmados. El lender toma como garantía ingresos proyectados.",
};

function Tip({ term }) {
  const [pos, setPos] = useState(null);
  const def = TOOLTIPS[term];
  if (!def) return null;
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        marginLeft: "5px",
      }}
    >
      <span
        onMouseEnter={(e) => setPos({ x: e.clientX, y: e.clientY })}
        onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
        onMouseLeave={() => setPos(null)}
        style={{
          cursor: "help",
          fontSize: "13px",
          color: "#8A7A62",
          border: "1px solid #BFB49C",
          borderRadius: "50%",
          width: "17px",
          height: "17px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          userSelect: "none",
        }}
      >
        ⓘ
      </span>
      {pos && (
        <span
          style={{
            position: "fixed",
            top: pos.y - 12,
            left: Math.min(pos.x + 14, window.innerWidth - 280),
            background: "#221C12",
            color: "#F8F4EC",
            padding: "8px 12px",
            borderRadius: "4px",
            fontFamily: SS,
            fontSize: "13px",
            lineHeight: 1.5,
            width: "260px",
            zIndex: 99999,
            boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
            pointerEvents: "none",
            transform: "translateY(-100%)",
          }}
        >
          <strong style={{ fontFamily: PD, color: "#C8A060" }}>{term}:</strong>{" "}
          {def}
        </span>
      )}
    </span>
  );
}

function SliderRow({
  label,
  val,
  set,
  min,
  max,
  step = 1,
  unit = "",
  color = "#2C4A8C",
  tip = null,
  fmt: fmtFn,
  efectivo = null,
  factor = 100,
}) {
  const display = fmtFn
    ? fmtFn(val)
    : unit === "%"
    ? `${val}%`
    : val.toLocaleString("es-CO") + (unit ? ` ${unit}` : "");
  const showEfectivo = efectivo !== null && factor !== 100;
  return (
    <div style={{ marginBottom: "12px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "4px",
        }}
      >
        <span
          style={{
            fontFamily: SS,
            fontSize: "17px",
            color: "#3D3220",
            display: "flex",
            alignItems: "center",
          }}
        >
          {label}
          {tip && <Tip term={tip} />}
        </span>
        <span
          style={{ fontFamily: PD, fontSize: "17px", color, fontWeight: "700" }}
        >
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={(e) => set(Number(e.target.value))}
        style={{ width: "100%", accentColor: color }}
      />
      {showEfectivo && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "2px",
          }}
        >
          <span
            style={{
              fontFamily: SS,
              fontSize: "12px",
              color: "#8A7A62",
              fontStyle: "italic",
            }}
          >
            base {val.toLocaleString("es-CO")} × {(factor / 100).toFixed(2)} ={" "}
          </span>
          <span
            style={{
              fontFamily: PD,
              fontSize: "13px",
              color,
              fontWeight: "700",
              marginLeft: "4px",
            }}
          >
            {efectivo.toLocaleString("es-CO")}M efectivos
          </span>
        </div>
      )}
    </div>
  );
}

function Panel({ title, color, children, first, last }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #D4C9B4",
        borderTop: first ? "1px solid #D4C9B4" : "none",
        borderRadius: first ? "6px 6px 0 0" : last ? "0 0 6px 6px" : "0",
        padding: "18px",
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div
        style={{
          fontFamily: PD,
          fontSize: "13px",
          color,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "14px",
          borderBottom: `2px solid ${color}33`,
          paddingBottom: "8px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: color,
            flexShrink: 0,
          }}
        />
        {title}
      </div>
      {children}
    </div>
  );
}

// ─── CORE CALCULATION ENGINE ─────────────────────────────────────────────────

function calcWaterfall(p) {
  const f = p.escenario / 100;
  const taquillaNet = p.taquilla * f * (1 - p.exhibitorSplit / 100);
  const distFeeLocalAmt = taquillaNet * (p.distFeeLocal / 100);
  const taquillaAlProductor = taquillaNet - distFeeLocalAmt;
  const mgBruto = p.mgActivo ? p.mgInt * f : 0;
  const mgNeto = mgBruto * (1 - p.cadenaIntPct / 100);
  const ventasIntBruto = p.ventasInt * f;
  const ventasIntNeto = ventasIntBruto * (1 - p.cadenaIntPct / 100);
  const plataformasNet = p.plataformas * f;
  const tvNet = p.tv * f;
  const paDistAmt =
    p.paMode === "dist" ? taquillaAlProductor * (p.paDistPct / 100) : 0;
  const netAlProductorTotal =
    taquillaAlProductor + mgNeto + ventasIntNeto + plataformasNet + tvNet;
  const netRevenues = netAlProductorTotal - paDistAmt;
  const afterSenior = netRevenues - p.sDebt;
  const totalInversion = p.inversionistas.reduce((s, inv) => s + inv.monto, 0);

  // ── Recoupment con pari passu real por grupo de prioridad ────────────────
  // Inversores con la misma prioridad comparten el tramo disponible en
  // proporción a su toRecover (no secuencialmente).
  let equityRecoupRows = [];
  let remaining = afterSenior;
  const sorted = [...p.inversionistas].sort(
    (a, b) => a.prioridad - b.prioridad
  );
  // Agrupar por prioridad
  const grupos = [];
  for (const inv of sorted) {
    const last = grupos[grupos.length - 1];
    if (last && last[0].prioridad === inv.prioridad) last.push(inv);
    else grupos.push([inv]);
  }
  for (const grupo of grupos) {
    // Calcular toRecover de cada miembro
    const miembros = grupo.map((inv) => {
      // Coproductor extranjero: su rebate/tax credit reduce lo que debe recuperar
      // por explotación — igual que el CIC reduce el toRecover del inversionista colombiano.
      const toRecover =
        inv.esCoproductor && inv.incentivoMonto > 0
          ? Math.max(0, inv.monto - inv.incentivoMonto)
          : inv.incentivo && inv.incentivo !== "ninguno" && p.useCIC
          ? Math.ceil(inv.monto * 0.4225)
          : inv.monto;
      return { ...inv, toRecover };
    });
    const totalGrupo = miembros.reduce((s, m) => s + m.toRecover, 0);
    const disponible = Math.max(0, remaining);
    const cubreGrupo = Math.min(disponible, totalGrupo);
    for (const m of miembros) {
      // Pari passu: cada uno recibe proporción de su toRecover
      const paid = totalGrupo > 0 ? cubreGrupo * (m.toRecover / totalGrupo) : 0;
      equityRecoupRows.push({ ...m, paid, shortfall: m.toRecover - paid });
    }
    remaining -= cubreGrupo;
  }
  const afterEquity = remaining;
  const retornoMinAmt = totalInversion * (p.retornoMin / 100) - totalInversion;
  const afterDeferments = afterEquity - p.deferments;
  const afterRetMin =
    afterDeferments - (p.retornoMin > 100 ? retornoMinAmt : 0);
  // ── Back end de terceros ─────────────────────────────────────────────────
  // Base "total": % del afterRetMin completo (antes del split prod/inv)
  // Base "productor": % que sale del pool del productor (acuerdo bilateral)
  const backEndRows = [];
  let afterTerceros = afterRetMin;
  for (const p3 of p.backEndParticipantes || []) {
    if (p3.base === "total") {
      const amt = afterRetMin > 0 ? afterRetMin * (p3.pct / 100) : 0;
      backEndRows.push({ ...p3, amt });
      afterTerceros -= amt;
    }
  }
  // Productor + inversionista sobre lo que queda tras terceros "total"
  const baseProducerInvestor = Math.max(0, afterTerceros);
  const producerPoolBruto =
    baseProducerInvestor > 0
      ? baseProducerInvestor * ((100 - p.investorSplitPct) / 100)
      : 0;
  // Terceros "productor" salen del pool del productor
  let producerPoolNeto = producerPoolBruto;
  for (const p3 of p.backEndParticipantes || []) {
    if (p3.base === "productor") {
      const amt =
        producerPoolBruto > 0 ? producerPoolBruto * (p3.pct / 100) : 0;
      backEndRows.push({ ...p3, amt });
      producerPoolNeto -= amt;
    }
  }
  const producerPool = producerPoolNeto;
  const investorPool =
    baseProducerInvestor > 0
      ? baseProducerInvestor * (p.investorSplitPct / 100)
      : 0;
  // CIC/CoCrea — misma tasa (165% deducción ≈ 57.75% recuperado vía DIAN)
  const cicTotal = p.useCIC
    ? p.inversionistas
        .filter((i) => i.incentivo && i.incentivo !== "ninguno")
        .reduce((s, i) => s + Math.floor(i.monto * 0.5775), 0)
    : 0;
  const grossBruto =
    (p.taquilla +
      (p.mgActivo ? p.mgInt : 0) +
      p.ventasInt +
      p.plataformas +
      p.tv) *
    f;
  return {
    netRevenues,
    afterSenior,
    afterEquity,
    afterDeferments,
    afterRetMin,
    producerPool,
    investorPool,
    producerPoolBruto,
    afterTerceros,
    backEndRows,
    cicTotal,
    grossBruto,
    totalInversion,
    equityRecoupRows,
    taquillaAlProductor,
    mgBruto,
    mgNeto,
    ventasIntBruto,
    ventasIntNeto,
    paDistAmt,
    distFeeLocalAmt,
    taquillaNet,
    netAlProductorTotal,
    plataformasNet,
    tvNet,
  };
}

// ── TIR sub-components (hooks válidos fuera de render map) ───────────────────

function FuenteNota({ nota, SS }) {
  const [open, setOpen] = React.useState(false);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span
        onClick={() => setOpen((o) => !o)}
        style={{
          fontFamily: SS,
          fontSize: "11px",
          color: "#5C2C8C",
          marginLeft: "8px",
          cursor: "pointer",
          textDecoration: "underline dotted",
        }}
      >
        {open ? "▲ cómo se calcula" : "▼ cómo se calcula"}
      </span>
      {open && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "20px",
            zIndex: 10,
            background: "#fff",
            border: "1px solid #5C2C8C44",
            borderRadius: "4px",
            padding: "8px 10px",
            width: "300px",
            fontFamily: SS,
            fontSize: "11px",
            color: "#3D3220",
            lineHeight: 1.6,
            boxShadow: "0 2px 8px #0002",
          }}
        >
          {nota}
        </div>
      )}
    </span>
  );
}

function DistribucionPersonalizada({
  distMode,
  setDistMode,
  distPersonalizada,
  setDistCell,
  anosExplot,
  srcTaq,
  srcVen,
  srcPlat,
  srcTv,
  exhibitorSplit,
  distFeeLocal,
  cadenaIntPct,
  paMode,
  paDistPct,
  taquillaNet,
  distFeeLocalAmt,
  paDistAmt,
  mgActivo,
  fmt,
  PD,
  SS,
}) {
  // Textos explicativos por fuente: detallan exactamente qué deduccionesse ya aplicaron
  const notaTaq = (() => {
    const parts = [`Split exhibidor ${exhibitorSplit}%`];
    if (distFeeLocal > 0) parts.push(`fee dist. local ${distFeeLocal}%`);
    const paSuffix =
      paMode === "dist" && paDistPct > 0
        ? ` El distribuidor adelanta el P&A (${paDistPct}% = $${Math.round(
            (taquillaNet * (1 - distFeeLocal / 100) * paDistPct) / 100
          )}M sobre la taquilla al productor) — ese costo se descuenta en el año 1 del estreno porque se paga al momento del lanzamiento, no en cuotas.`
        : paMode === "prod"
        ? ` El P&A lo pre-financia el productor desde el presupuesto de producción — no aparece como deducción de los ingresos de distribución.`
        : "";
    return `Monto neto al productor después de: ${parts.join(
      " → "
    )}. El distribuidor local liquida trimestralmente; el ciclo teatral completo termina en ~6 meses.${paSuffix}`;
  })();
  const notaVen = `Neto después de cadena int'l (${cadenaIntPct}% compartido entre sales agent y distribuidor territorial).${
    mgActivo
      ? " El MG se cobra al momento de firmar el contrato — aparece en Año 1."
      : ""
  }`;
  const notaPlat = `Monto total del contrato de licencia con plataformas (Netflix, Amazon, etc.). Sin deducción adicional en este modelo — el fee del agente digital ya fue negociado al precio bruto.`;
  const notaTv = `Monto total del contrato de licencia con canales de TV. Sin deducción adicional — el fee del vendedor de TV ya está reflejado en el monto pactado.`;

  const fuentes = [
    {
      key: "taquilla",
      label: "🎬 Taquilla",
      src: srcTaq,
      color: "#2C4A8C",
      nota: notaTaq,
    },
    {
      key: "ventas",
      label: "🌍 Ventas int'l",
      src: srcVen,
      color: "#2C6B6B",
      nota: notaVen,
    },
    {
      key: "plat",
      label: "📱 Plataformas",
      src: srcPlat,
      color: "#5C2C8C",
      nota: notaPlat,
    },
    { key: "tv", label: "📺 TV", src: srcTv, color: "#8C6A2C", nota: notaTv },
  ].filter((f) => f.src > 0);

  return (
    <div style={{ marginBottom: "14px" }}>
      {/* Toggle modo */}
      <div
        style={{
          display: "flex",
          gap: "0",
          marginBottom: "10px",
          border: "1.5px solid #5C2C8C",
          borderRadius: "5px",
          overflow: "hidden",
        }}
      >
        {[
          ["empirico", "📊 Empírico (automático)"],
          ["personalizado", "✏️ Personalizado"],
        ].map(([val, lbl]) => (
          <button
            key={val}
            onClick={() => setDistMode(val)}
            style={{
              flex: 1,
              fontFamily: PD,
              fontSize: "12px",
              padding: "7px 4px",
              background: distMode === val ? "#5C2C8C" : "#FAF7FF",
              color: distMode === val ? "#fff" : "#5C2C8C",
              border: "none",
              cursor: "pointer",
              fontWeight: distMode === val ? "700" : "normal",
            }}
          >
            {lbl}
          </button>
        ))}
      </div>

      {/* Aviso modo empírico */}
      {distMode === "empirico" && (
        <div
          style={{
            fontFamily: SS,
            fontSize: "12px",
            color: "#8A7A62",
            background: "#FAF7FF",
            borderRadius: "4px",
            padding: "8px 12px",
            border: "1px solid #5C2C8C22",
            lineHeight: 1.6,
          }}
        >
          ⚠️ <strong>Estimado empírico.</strong> Los totales ya reflejan las
          deducciones del waterfall (exhibidor, fees de distribución, P&A,
          cadena int'l). La distribución temporal usa curvas de mercado:
          taquilla 95% año 1, plataformas años 2–3, TV años 3–5. Activa
          «Personalizado» para ingresar tu propio calendario por ventana.
        </div>
      )}

      {/* Sliders por fuente y por año */}
      {distMode === "personalizado" && fuentes.length > 0 && (
        <div>
          <div
            style={{
              fontFamily: SS,
              fontSize: "12px",
              color: "#3D3220",
              marginBottom: "10px",
              background: "#FAF7FF",
              borderRadius: "4px",
              padding: "8px 12px",
              border: "1px solid #5C2C8C22",
              lineHeight: 1.6,
            }}
          >
            Mueve los sliders para distribuir cada fuente de ingreso entre los
            años. El <strong>último año se calcula automáticamente</strong> como
            el residuo — la suma siempre iguala el total del waterfall.{" "}
            <strong style={{ color: "#5C2C8C" }}>El waterfall no cambia</strong>
            ; solo cambia el timing para la TIR.
          </div>

          {fuentes.map((f) => {
            // Calcular valores: años 0..n-2 editables, año n-1 = residuo automático
            const vals = Array.from(
              { length: anosExplot },
              (_, i) => Number(distPersonalizada[f.key]?.[i]) || 0
            );
            const sumEditables = vals
              .slice(0, anosExplot - 1)
              .reduce((s, v) => s + v, 0);
            const lastAuto = Math.max(0, Math.round(f.src - sumEditables));
            // Máximo disponible para cada slider = total - lo asignado a los otros años editables
            const maxForYear = (i) => {
              const otherSum = vals
                .slice(0, anosExplot - 1)
                .reduce((s, v, j) => (j === i ? s : s + v), 0);
              return Math.max(0, Math.round(f.src - otherSum));
            };
            const pct = (v) => (f.src > 0 ? Math.round((v / f.src) * 100) : 0);

            return (
              <div
                key={f.key}
                style={{
                  background: "#F5F0FB",
                  borderRadius: "6px",
                  padding: "12px 14px",
                  marginBottom: "10px",
                  border: `1px solid ${f.color}33`,
                }}
              >
                {/* Header fuente */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: "10px",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontFamily: PD,
                        fontSize: "14px",
                        color: f.color,
                        fontWeight: "700",
                      }}
                    >
                      {f.label}
                    </span>
                    <FuenteNota nota={f.nota} SS={SS} />
                  </div>
                  <span
                    style={{
                      fontFamily: PD,
                      fontSize: "13px",
                      color: "#3D3220",
                    }}
                  >
                    Total waterfall:{" "}
                    <strong style={{ color: f.color }}>
                      {fmt(Math.round(f.src))}
                    </strong>
                  </span>
                </div>

                {/* Sliders año por año */}
                {Array.from({ length: anosExplot }, (_, i) => {
                  const isLast = i === anosExplot - 1;
                  const val = isLast ? lastAuto : vals[i];
                  const max = isLast ? f.src : maxForYear(i);
                  const p = pct(val);
                  // Barra de progreso visual
                  const barW = f.src > 0 ? Math.round((val / f.src) * 100) : 0;
                  return (
                    <div
                      key={i}
                      style={{ marginBottom: i < anosExplot - 1 ? "8px" : "0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                          marginBottom: "2px",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: PD,
                            fontSize: "12px",
                            color: isLast ? "#8A7A62" : "#3D3220",
                          }}
                        >
                          Año {i + 1}
                          {isLast ? " (residuo automático)" : ""}
                        </span>
                        <span
                          style={{
                            fontFamily: PD,
                            fontSize: "13px",
                            color: isLast ? "#8A7A62" : f.color,
                            fontWeight: "700",
                            fontStyle: isLast ? "italic" : "normal",
                          }}
                        >
                          {fmt(Math.round(val))}
                          <span
                            style={{
                              fontFamily: SS,
                              fontSize: "11px",
                              color: "#8A7A62",
                              marginLeft: "5px",
                            }}
                          >
                            ({p}%)
                          </span>
                        </span>
                      </div>
                      {isLast ? (
                        /* Barra estática para el año automático */
                        <div
                          style={{
                            height: "6px",
                            background: "#E8E0F8",
                            borderRadius: "3px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${barW}%`,
                              background: "#C0B0D0",
                              borderRadius: "3px",
                              transition: "width 0.2s",
                            }}
                          />
                        </div>
                      ) : (
                        <input
                          type="range"
                          min={0}
                          max={max}
                          step={1}
                          value={vals[i]}
                          onChange={(e) =>
                            setDistCell(f.key, i, Number(e.target.value))
                          }
                          style={{
                            width: "100%",
                            accentColor: f.color,
                            cursor: "pointer",
                          }}
                        />
                      )}
                    </div>
                  );
                })}

                {/* Barra de progreso total */}
                <div
                  style={{
                    marginTop: "10px",
                    borderTop: "1px solid #E8E0F8",
                    paddingTop: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "3px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: SS,
                        fontSize: "11px",
                        color: "#6A5F4E",
                      }}
                    >
                      Distribuido
                    </span>
                    <span
                      style={{
                        fontFamily: PD,
                        fontSize: "12px",
                        color:
                          Math.abs(sumEditables + lastAuto - f.src) < 2
                            ? "#2C6B4A"
                            : "#8C3A2C",
                        fontWeight: "700",
                      }}
                    >
                      {fmt(Math.round(sumEditables + lastAuto))} /{" "}
                      {fmt(Math.round(f.src))}
                    </span>
                  </div>
                  <div
                    style={{
                      height: "8px",
                      background: "#E8E0F8",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    {Array.from({ length: anosExplot }, (_, i) => {
                      const v = i === anosExplot - 1 ? lastAuto : vals[i];
                      const w = f.src > 0 ? (v / f.src) * 100 : 0;
                      // Colores ligeramente distintos por año para distinguirlos
                      const lightness = 35 + i * 8;
                      return (
                        <div
                          key={i}
                          style={{
                            display: "inline-block",
                            height: "100%",
                            width: `${w}%`,
                            background:
                              i === anosExplot - 1
                                ? "#C0B0D0"
                                : f.color +
                                  ([
                                    "FF",
                                    "DD",
                                    "BB",
                                    "99",
                                    "77",
                                    "55",
                                    "44",
                                    "33",
                                    "22",
                                    "11",
                                  ][i] || "88"),
                            transition: "width 0.2s",
                          }}
                        />
                      );
                    })}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      marginTop: "4px",
                      flexWrap: "wrap",
                    }}
                  >
                    {Array.from({ length: anosExplot }, (_, i) => {
                      const v = i === anosExplot - 1 ? lastAuto : vals[i];
                      if (v === 0) return null;
                      return (
                        <span
                          key={i}
                          style={{
                            fontFamily: SS,
                            fontSize: "10px",
                            color: "#6A5F4E",
                          }}
                        >
                          A{i + 1}: {pct(v)}%
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TirCalendario({ desglosePorAno, totalNetRev, fmt, PD, SS }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ marginBottom: "12px" }}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: open ? "8px" : "0",
        }}
      >
        <span style={{ fontFamily: PD, fontSize: "12px", color: "#5C2C8C" }}>
          {open ? "▼" : "▶"} Ver calendario de ingresos del proyecto (por
          ventana)
        </span>
      </div>
      {open && (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: SS,
              fontSize: "12px",
            }}
          >
            <thead>
              <tr style={{ background: "#2C3E6B", color: "#fff" }}>
                <th
                  style={{
                    padding: "6px 8px",
                    textAlign: "left",
                    fontFamily: PD,
                  }}
                >
                  Año
                </th>
                <th
                  style={{
                    padding: "6px 8px",
                    textAlign: "right",
                    fontFamily: PD,
                    color: "#B0C8FF",
                  }}
                >
                  🎬 Taquilla
                </th>
                <th
                  style={{
                    padding: "6px 8px",
                    textAlign: "right",
                    fontFamily: PD,
                    color: "#90E0B0",
                  }}
                >
                  🌍 Ventas int'l
                </th>
                <th
                  style={{
                    padding: "6px 8px",
                    textAlign: "right",
                    fontFamily: PD,
                    color: "#C8A0FF",
                  }}
                >
                  📱 Plataformas
                </th>
                <th
                  style={{
                    padding: "6px 8px",
                    textAlign: "right",
                    fontFamily: PD,
                    color: "#F0D080",
                  }}
                >
                  📺 TV
                </th>
                <th
                  style={{
                    padding: "6px 8px",
                    textAlign: "right",
                    fontFamily: PD,
                  }}
                >
                  Total año
                </th>
                <th
                  style={{
                    padding: "6px 8px",
                    textAlign: "right",
                    fontFamily: PD,
                  }}
                >
                  % del total
                </th>
              </tr>
            </thead>
            <tbody>
              {desglosePorAno.map((d, i) => (
                <tr
                  key={i}
                  style={{
                    background: i % 2 === 0 ? "#F8F4EC" : "#F2EDE3",
                    borderBottom: "1px solid #D4C9B4",
                  }}
                >
                  <td
                    style={{
                      padding: "5px 8px",
                      fontFamily: PD,
                      color: "#2C3E6B",
                    }}
                  >
                    Año {d.año}
                  </td>
                  <td
                    style={{
                      padding: "5px 8px",
                      textAlign: "right",
                      color: "#2C4A8C",
                    }}
                  >
                    {d.taquilla > 0 ? fmt(d.taquilla) : "—"}
                  </td>
                  <td
                    style={{
                      padding: "5px 8px",
                      textAlign: "right",
                      color: "#2C6B6B",
                    }}
                  >
                    {d.mg + d.ventas > 0 ? fmt(d.mg + d.ventas) : "—"}
                  </td>
                  <td
                    style={{
                      padding: "5px 8px",
                      textAlign: "right",
                      color: "#5C2C8C",
                    }}
                  >
                    {d.plat > 0 ? fmt(d.plat) : "—"}
                  </td>
                  <td
                    style={{
                      padding: "5px 8px",
                      textAlign: "right",
                      color: "#8C6A2C",
                    }}
                  >
                    {d.tv > 0 ? fmt(d.tv) : "—"}
                  </td>
                  <td
                    style={{
                      padding: "5px 8px",
                      textAlign: "right",
                      fontFamily: PD,
                      fontWeight: "700",
                      color: "#3D3220",
                    }}
                  >
                    {fmt(d.total)}
                  </td>
                  <td
                    style={{
                      padding: "5px 8px",
                      textAlign: "right",
                      color: "#6A5F4E",
                    }}
                  >
                    {totalNetRev > 0
                      ? ((d.total / totalNetRev) * 100).toFixed(1) + "%"
                      : "—"}
                  </td>
                </tr>
              ))}
              <tr
                style={{
                  background: "#E8E2D8",
                  borderTop: "2px solid #BFB49C",
                }}
              >
                <td
                  style={{
                    padding: "5px 8px",
                    fontFamily: PD,
                    fontWeight: "700",
                    color: "#3D3220",
                  }}
                >
                  Total
                </td>
                <td
                  style={{
                    padding: "5px 8px",
                    textAlign: "right",
                    fontFamily: PD,
                    fontWeight: "700",
                    color: "#2C4A8C",
                  }}
                >
                  {fmt(desglosePorAno.reduce((s, d) => s + d.taquilla, 0))}
                </td>
                <td
                  style={{
                    padding: "5px 8px",
                    textAlign: "right",
                    fontFamily: PD,
                    fontWeight: "700",
                    color: "#2C6B6B",
                  }}
                >
                  {fmt(desglosePorAno.reduce((s, d) => s + d.mg + d.ventas, 0))}
                </td>
                <td
                  style={{
                    padding: "5px 8px",
                    textAlign: "right",
                    fontFamily: PD,
                    fontWeight: "700",
                    color: "#5C2C8C",
                  }}
                >
                  {fmt(desglosePorAno.reduce((s, d) => s + d.plat, 0))}
                </td>
                <td
                  style={{
                    padding: "5px 8px",
                    textAlign: "right",
                    fontFamily: PD,
                    fontWeight: "700",
                    color: "#8C6A2C",
                  }}
                >
                  {fmt(desglosePorAno.reduce((s, d) => s + d.tv, 0))}
                </td>
                <td
                  style={{
                    padding: "5px 8px",
                    textAlign: "right",
                    fontFamily: PD,
                    fontWeight: "700",
                    color: "#3D3220",
                  }}
                >
                  {fmt(Math.round(totalNetRev))}
                </td>
                <td
                  style={{
                    padding: "5px 8px",
                    textAlign: "right",
                    fontFamily: PD,
                    color: "#6A5F4E",
                  }}
                >
                  100%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TirExplicacion({
  PD,
  SS,
  inversionistas,
  cicTotal,
  netRevYear,
  anosExplot,
  fmt,
  useCIC,
}) {
  const [open, setOpen] = React.useState(false);

  // Construir flujos del primer inversionista (o ejemplo genérico si no hay datos)
  const inv0 = inversionistas && inversionistas[0];
  const monto = inv0 ? inv0.monto : 1000;
  const cic = useCIC && inv0 ? Math.floor(monto * 0.5775) : 0;
  // Distribuir netRevYear proporcionalmente al peso del inv0 en el equity total
  const totalMonto = inversionistas
    ? inversionistas.reduce((s, i) => s + i.monto, 0)
    : monto;
  const peso = totalMonto > 0 ? monto / totalMonto : 1;
  const flujosSim = netRevYear
    ? Array.from({ length: anosExplot }, (_, i) =>
        Math.round((netRevYear[i] || 0) * peso)
      )
    : [480, 336, 192, 108, 84];

  const flujosConCIC = flujosSim.map((v, i) => (i === 0 ? v + cic : v));
  const totalConCIC = cic + flujosSim.reduce((s, v) => s + v, 0);
  const totalSinCIC = flujosSim.reduce((s, v) => s + v, 0);

  // TIR simple por ensayo y error (bisección) para mostrar al usuario
  const calcTIR = (cfs) => {
    let lo = -0.5,
      hi = 5.0;
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      const npv = cfs.reduce((s, cf, t) => s + cf / Math.pow(1 + mid, t), 0);
      if (Math.abs(npv) < 0.01) return mid;
      npv > 0 ? (lo = mid) : (hi = mid);
    }
    return (lo + hi) / 2;
  };
  const cfCon = [-monto, ...flujosConCIC];
  const cfSin = [-monto, ...flujosSim];
  const tirCon = calcTIR(cfCon);
  const tirSin = calcTIR(cfSin);

  const fmtPct = (r) =>
    r !== null && isFinite(r) ? `${(r * 100).toFixed(0)}%` : "N/A";
  const fmtM =
    fmt || ((v) => `$${Math.round(Math.abs(v)).toLocaleString("es-CO")}M`);
  const maxBar = Math.max(monto, ...flujosConCIC);

  return (
    <div style={{ marginBottom: "14px" }}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          background: "#F5F0FB",
          borderRadius: "6px",
          padding: "10px 14px",
          border: "1px solid #5C2C8C33",
        }}
      >
        <span
          style={{
            fontFamily: PD,
            fontSize: "13px",
            color: "#5C2C8C",
            fontWeight: "700",
          }}
        >
          {open ? "▼" : "▶"} ¿Qué es la TIR y cómo se calcula?
        </span>
      </div>
      {open && (
        <div
          style={{
            background: "#FAF7FF",
            border: "1px solid #5C2C8C22",
            borderTop: "none",
            borderRadius: "0 0 6px 6px",
            padding: "16px 18px",
          }}
        >
          {/* ── CAPA 1: Analogía CDT ── */}
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              padding: "14px 16px",
              border: "1px solid #5C2C8C22",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                fontFamily: PD,
                fontSize: "15px",
                color: "#5C2C8C",
                fontWeight: "700",
                marginBottom: "8px",
              }}
            >
              💡 La idea en una frase
            </div>
            <div
              style={{
                fontFamily: SS,
                fontSize: "14px",
                color: "#3D3220",
                lineHeight: 1.8,
                marginBottom: "10px",
              }}
            >
              La TIR responde una sola pregunta:{" "}
              <strong style={{ color: "#5C2C8C" }}>
                ¿a qué tasa de interés equivale esta inversión?
              </strong>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                gap: "10px",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  background: "#F0F4FF",
                  borderRadius: "6px",
                  padding: "12px",
                  textAlign: "center",
                  border: "1px solid #2C4A8C33",
                }}
              >
                <div
                  style={{
                    fontFamily: SS,
                    fontSize: "12px",
                    color: "#6A5F4E",
                    marginBottom: "4px",
                  }}
                >
                  🏦 CDT en el banco
                </div>
                <div
                  style={{
                    fontFamily: PD,
                    fontSize: "22px",
                    color: "#2C4A8C",
                    fontWeight: "700",
                  }}
                >
                  7% anual
                </div>
                <div
                  style={{
                    fontFamily: SS,
                    fontSize: "11px",
                    color: "#8A9ABE",
                    marginTop: "4px",
                  }}
                >
                  Seguro, líquido, sin sorpresas
                </div>
              </div>
              <div
                style={{ fontFamily: PD, fontSize: "20px", color: "#8A7A62" }}
              >
                vs
              </div>
              <div
                style={{
                  background: "#F0FFF4",
                  borderRadius: "6px",
                  padding: "12px",
                  textAlign: "center",
                  border: "1px solid #2C6B4A33",
                }}
              >
                <div
                  style={{
                    fontFamily: SS,
                    fontSize: "12px",
                    color: "#6A5F4E",
                    marginBottom: "4px",
                  }}
                >
                  🎬 Invertir en la película
                </div>
                <div
                  style={{
                    fontFamily: PD,
                    fontSize: "22px",
                    color: "#2C6B4A",
                    fontWeight: "700",
                  }}
                >
                  {fmtPct(tirCon)} anual
                </div>
                <div
                  style={{
                    fontFamily: SS,
                    fontSize: "11px",
                    color: "#5A8A6A",
                    marginTop: "4px",
                  }}
                >
                  Con CIC — según tu simulador
                </div>
              </div>
            </div>
            <div
              style={{
                fontFamily: SS,
                fontSize: "13px",
                color: "#6A5F4E",
                lineHeight: 1.6,
                background: "#F8F4EC",
                borderRadius: "4px",
                padding: "8px 12px",
              }}
            >
              Si la TIR de la película supera la tasa del CDT, el inversionista
              gana <em>más</em> que en el banco — y asume más riesgo a cambio.
              El CIC cambia radicalmente esta comparación porque devuelve el
              57.75% de la inversión{" "}
              <strong>en el año 1, antes de que la película estrene</strong>.
            </div>
          </div>

          {/* ── CAPA 2: Línea de tiempo visual con barras ── */}
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              padding: "14px 16px",
              border: "1px solid #5C2C8C22",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                fontFamily: PD,
                fontSize: "15px",
                color: "#5C2C8C",
                fontWeight: "700",
                marginBottom: "4px",
              }}
            >
              📅 El dinero en el tiempo — tu caso
            </div>
            <div
              style={{
                fontFamily: SS,
                fontSize: "12px",
                color: "#8A7A62",
                marginBottom: "12px",
              }}
            >
              Basado en los parámetros actuales del simulador · Primer
              inversionista
            </div>

            {/* Año 0 — inversión */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  fontFamily: PD,
                  fontSize: "13px",
                  color: "#8C3A2C",
                  width: "46px",
                  flexShrink: 0,
                }}
              >
                Año 0
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: SS,
                    fontSize: "12px",
                    color: "#8C3A2C",
                    marginBottom: "3px",
                  }}
                >
                  ⬇ Invierte {fmtM(monto)}{" "}
                  <span style={{ color: "#8A7A62" }}>
                    (sale de tu bolsillo)
                  </span>
                </div>
                <div
                  style={{
                    height: "18px",
                    background: "#8C3A2C22",
                    borderRadius: "3px",
                    border: "2px solid #8C3A2C44",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${(monto / maxBar) * 100}%`,
                      background: "#8C3A2C88",
                      borderRadius: "3px",
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  fontFamily: PD,
                  fontSize: "14px",
                  color: "#8C3A2C",
                  width: "70px",
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                –{fmtM(monto)}
              </div>
            </div>

            {/* Años de ingreso */}
            {flujosConCIC.map((v, i) => {
              const cicEsteAno = i === 0 ? cic : 0;
              const explotEsteAno = flujosSim[i] || 0;
              const barW = v > 0 ? `${Math.round((v / maxBar) * 100)}%` : "2%";
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: i < flujosConCIC.length - 1 ? "8px" : "0",
                  }}
                >
                  <div
                    style={{
                      fontFamily: PD,
                      fontSize: "13px",
                      color: i === 0 ? "#2C6B4A" : "#2C4A8C",
                      fontWeight: i === 0 ? "700" : "normal",
                      width: "46px",
                      flexShrink: 0,
                    }}
                  >
                    Año {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: SS,
                        fontSize: "12px",
                        color: i === 0 ? "#2C6B4A" : "#2C4A8C",
                        marginBottom: "3px",
                      }}
                    >
                      ⬆{" "}
                      {cicEsteAno > 0 && (
                        <span style={{ color: "#2C6B4A", fontWeight: "700" }}>
                          {fmtM(cicEsteAno)} CIC (DIAN)
                          {explotEsteAno > 0 ? " + " : ""}
                        </span>
                      )}
                      {explotEsteAno > 0 && (
                        <span>{fmtM(explotEsteAno)} explotación</span>
                      )}
                    </div>
                    {/* Barra apilada CIC + explotación */}
                    <div
                      style={{
                        height: "18px",
                        background: "#E8E4F8",
                        borderRadius: "3px",
                        overflow: "hidden",
                        display: "flex",
                      }}
                    >
                      {cicEsteAno > 0 && (
                        <div
                          style={{
                            height: "100%",
                            width: `${Math.round(
                              (cicEsteAno / maxBar) * 100
                            )}%`,
                            background: "#2C6B4A",
                            borderRadius: "3px 0 0 3px",
                            flexShrink: 0,
                          }}
                        />
                      )}
                      {explotEsteAno > 0 && (
                        <div
                          style={{
                            height: "100%",
                            width: `${Math.round(
                              (explotEsteAno / maxBar) * 100
                            )}%`,
                            background: "#2C4A8C",
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: PD,
                      fontSize: "14px",
                      color: i === 0 ? "#2C6B4A" : "#2C4A8C",
                      fontWeight: i === 0 ? "700" : "normal",
                      width: "70px",
                      textAlign: "right",
                      flexShrink: 0,
                    }}
                  >
                    +{fmtM(v)}
                  </div>
                </div>
              );
            })}

            {/* Leyenda */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                marginTop: "10px",
                paddingTop: "8px",
                borderTop: "1px solid #E8E0F8",
              }}
            >
              {cic > 0 && (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      background: "#2C6B4A",
                      borderRadius: "2px",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: SS,
                      fontSize: "11px",
                      color: "#6A5F4E",
                    }}
                  >
                    CIC — devuelve la DIAN (año 1)
                  </span>
                </div>
              )}
              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "#2C4A8C",
                    borderRadius: "2px",
                  }}
                />
                <span
                  style={{ fontFamily: SS, fontSize: "11px", color: "#6A5F4E" }}
                >
                  Explotación — depende de la película
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "#8C3A2C88",
                    borderRadius: "2px",
                  }}
                />
                <span
                  style={{ fontFamily: SS, fontSize: "11px", color: "#6A5F4E" }}
                >
                  Lo que pusiste
                </span>
              </div>
            </div>
          </div>

          {/* ── CAPA 3: Resultado interactivo con y sin CIC ── */}
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              padding: "14px 16px",
              border: "1px solid #5C2C8C22",
            }}
          >
            <div
              style={{
                fontFamily: PD,
                fontSize: "15px",
                color: "#5C2C8C",
                fontWeight: "700",
                marginBottom: "10px",
              }}
            >
              🎯 ¿Cuánto rinde esta inversión?
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                marginBottom: "12px",
              }}
            >
              {/* Con CIC */}
              <div
                style={{
                  background: "#EEF8F2",
                  borderRadius: "6px",
                  padding: "14px",
                  border: "1px solid #2C6B4A44",
                }}
              >
                <div
                  style={{
                    fontFamily: SS,
                    fontSize: "12px",
                    color: "#2C6B4A",
                    marginBottom: "4px",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  Con CIC (Ley 814)
                </div>
                <div
                  style={{
                    fontFamily: PD,
                    fontSize: "32px",
                    color: "#2C6B4A",
                    fontWeight: "700",
                    lineHeight: 1,
                  }}
                >
                  {fmtPct(tirCon)}
                </div>
                <div
                  style={{
                    fontFamily: SS,
                    fontSize: "11px",
                    color: "#5A8A6A",
                    marginTop: "4px",
                  }}
                >
                  anual equivalente
                </div>
                <div
                  style={{
                    marginTop: "8px",
                    height: "6px",
                    background: "#C0E8D0",
                    borderRadius: "3px",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min(100, tirCon * 100)}%`,
                      background: "#2C6B4A",
                      borderRadius: "3px",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontFamily: SS,
                    fontSize: "11px",
                    color: "#6A5F4E",
                    marginTop: "6px",
                  }}
                >
                  Total recibido: {fmtM(totalConCIC)} · Múltiplo{" "}
                  {(totalConCIC / monto).toFixed(2)}x
                </div>
              </div>

              {/* Sin CIC */}
              <div
                style={{
                  background: "#FFF8F0",
                  borderRadius: "6px",
                  padding: "14px",
                  border: "1px solid #C0503044",
                }}
              >
                <div
                  style={{
                    fontFamily: SS,
                    fontSize: "12px",
                    color: "#C05030",
                    marginBottom: "4px",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  Sin CIC (mismo riesgo)
                </div>
                <div
                  style={{
                    fontFamily: PD,
                    fontSize: "32px",
                    color: "#C05030",
                    fontWeight: "700",
                    lineHeight: 1,
                  }}
                >
                  {fmtPct(tirSin)}
                </div>
                <div
                  style={{
                    fontFamily: SS,
                    fontSize: "11px",
                    color: "#A07060",
                    marginTop: "4px",
                  }}
                >
                  anual equivalente
                </div>
                <div
                  style={{
                    marginTop: "8px",
                    height: "6px",
                    background: "#F0D0C0",
                    borderRadius: "3px",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min(100, Math.max(0, tirSin) * 100)}%`,
                      background: "#C05030",
                      borderRadius: "3px",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontFamily: SS,
                    fontSize: "11px",
                    color: "#6A5F4E",
                    marginTop: "6px",
                  }}
                >
                  Total recibido: {fmtM(totalSinCIC)} · Múltiplo{" "}
                  {(totalSinCIC / monto).toFixed(2)}x
                </div>
              </div>
            </div>

            {/* Comparativa contextual */}
            <div
              style={{
                background: "#F8F4EC",
                borderRadius: "6px",
                padding: "10px 14px",
              }}
            >
              <div
                style={{
                  fontFamily: PD,
                  fontSize: "13px",
                  color: "#3D3220",
                  marginBottom: "6px",
                }}
              >
                ¿Qué significa esto en la vida real?
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "5px" }}
              >
                {[
                  { label: "CDT bancario", pct: 0.07, color: "#8A7A62" },
                  { label: "Fondo de renta fija", pct: 0.1, color: "#8A7A62" },
                  {
                    label: "📊 Sin CIC",
                    pct: Math.max(0, tirSin),
                    color: "#C05030",
                  },
                  {
                    label: "Fondo de private equity",
                    pct: 0.2,
                    color: "#8A7A62",
                  },
                  {
                    label: "🎬 Con CIC (tu simulador)",
                    pct: Math.max(0, tirCon),
                    color: "#2C6B4A",
                  },
                ]
                  .sort((a, b) => a.pct - b.pct)
                  .map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: SS,
                          fontSize: "12px",
                          color: item.color,
                          width: "180px",
                          flexShrink: 0,
                          fontWeight:
                            item.label.startsWith("🎬") ||
                            item.label.startsWith("📊")
                              ? "700"
                              : "normal",
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{
                          flex: 1,
                          height: "8px",
                          background: "#E8E2D8",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${Math.min(100, item.pct * 200)}%`,
                            background: item.color,
                            borderRadius: "4px",
                            transition: "width 0.4s",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          fontFamily: PD,
                          fontSize: "12px",
                          color: item.color,
                          width: "40px",
                          textAlign: "right",
                          flexShrink: 0,
                        }}
                      >
                        {(item.pct * 100).toFixed(0)}%
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TirInvCard({ inv, anosExplot, fmt, PD, SS }) {
  const [flowOpen, setFlowOpen] = React.useState(false);
  const tirCol =
    inv.tirCon === null
      ? "#8A7A62"
      : inv.tirCon > 0.5
      ? "#2C6B4A"
      : inv.tirCon > 0.15
      ? "#8C6A2C"
      : inv.tirCon > 0
      ? "#C05030"
      : "#8C3A2C";
  const hasTv = inv.tablaFlujos.some((f) => f.dTv > 0);
  const hasPlat = inv.tablaFlujos.some((f) => f.dPlat > 0);
  const hasMg = inv.tablaFlujos.some((f) => f.dMg > 0);
  const hasVen = inv.tablaFlujos.some((f) => f.dVentas > 0);
  return (
    <div
      style={{
        background: "#F5F0FB",
        borderRadius: "6px",
        padding: "14px 16px",
        marginBottom: "10px",
        border: "1px solid #5C2C8C33",
      }}
    >
      <div
        style={{
          fontFamily: PD,
          fontSize: "15px",
          color: "#3D3220",
          fontWeight: "700",
          marginBottom: "10px",
        }}
      >
        {inv.nombre}
      </div>
      {/* KPI cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
          gap: "8px",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "4px",
            padding: "8px 10px",
            border: "1px solid #5C2C8C22",
          }}
        >
          <div style={{ fontFamily: SS, fontSize: "11px", color: "#6A5F4E" }}>
            Inversión
          </div>
          <div
            style={{
              fontFamily: PD,
              fontSize: "16px",
              color: "#8C3A2C",
              fontWeight: "700",
            }}
          >
            –{fmt(inv.monto)}
          </div>
        </div>
        {inv.viaCIC > 0 && (
          <div
            style={{
              background: "#EEF8F2",
              borderRadius: "4px",
              padding: "8px 10px",
              border: "1px solid #2C6B4A44",
            }}
          >
            <div style={{ fontFamily: SS, fontSize: "11px", color: "#2C6B4A" }}>
              Vía CIC — año 1
            </div>
            <div
              style={{
                fontFamily: PD,
                fontSize: "16px",
                color: "#2C6B4A",
                fontWeight: "700",
              }}
            >
              {fmt(inv.viaCIC)}
            </div>
            <div
              style={{
                fontFamily: SS,
                fontSize: "10px",
                color: "#5A8A6A",
                marginTop: "2px",
              }}
            >
              DIAN, ind. del mercado
            </div>
          </div>
        )}
        <div
          style={{
            background: "#EEF4FB",
            borderRadius: "4px",
            padding: "8px 10px",
            border: "1px solid #2C4A8C44",
          }}
        >
          <div style={{ fontFamily: SS, fontSize: "11px", color: "#2C4A8C" }}>
            Vía explotación
          </div>
          <div
            style={{
              fontFamily: PD,
              fontSize: "16px",
              color: "#2C4A8C",
              fontWeight: "700",
            }}
          >
            {fmt(Math.round(inv.viaExplot))}
          </div>
          <div
            style={{
              fontFamily: SS,
              fontSize: "10px",
              color: "#5A6A8A",
              marginTop: "2px",
            }}
          >
            recoup + back end
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: "4px",
            padding: "8px 10px",
            border: "1px solid #8C6A2C44",
          }}
        >
          <div style={{ fontFamily: SS, fontSize: "11px", color: "#8C6A2C" }}>
            Múltiplo total
          </div>
          <div
            style={{
              fontFamily: PD,
              fontSize: "16px",
              color: "#8C6A2C",
              fontWeight: "700",
            }}
          >
            {inv.multiplo.toFixed(2)}x
          </div>
        </div>
        <div
          style={{
            background:
              inv.tirCon !== null && inv.tirCon > 0 ? "#EEF8F2" : "#FFF0F0",
            borderRadius: "4px",
            padding: "8px 10px",
            border: `1px solid ${tirCol}44`,
          }}
        >
          <div style={{ fontFamily: SS, fontSize: "11px", color: tirCol }}>
            TIR · {anosExplot} año{anosExplot > 1 ? "s" : ""}
          </div>
          <div
            style={{
              fontFamily: PD,
              fontSize: "20px",
              color: tirCol,
              fontWeight: "700",
            }}
          >
            {inv.tirCon !== null ? `${(inv.tirCon * 100).toFixed(1)}%` : "N/A"}
          </div>
        </div>
        {inv.viaCIC > 0 &&
          inv.tirSin !== null &&
          inv.tirCon !== null &&
          Math.abs(inv.tirCon - inv.tirSin) > 0.001 && (
            <div
              style={{
                background: "#FFF8F0",
                borderRadius: "4px",
                padding: "8px 10px",
                border: "1px solid #C0503044",
              }}
            >
              <div
                style={{ fontFamily: SS, fontSize: "11px", color: "#C05030" }}
              >
                TIR sin CIC
              </div>
              <div
                style={{
                  fontFamily: PD,
                  fontSize: "20px",
                  color: "#C05030",
                  fontWeight: "700",
                }}
              >{`${(inv.tirSin * 100).toFixed(1)}%`}</div>
            </div>
          )}
      </div>
      {/* Impacto CIC */}
      {inv.viaCIC > 0 &&
        inv.tirCon !== null &&
        inv.tirSin !== null &&
        Math.abs(inv.tirCon - inv.tirSin) > 0.001 && (
          <div
            style={{
              fontFamily: SS,
              fontSize: "12px",
              color: "#2C6B4A",
              background: "#EEF8F2",
              borderRadius: "4px",
              padding: "7px 10px",
              marginBottom: "8px",
              lineHeight: 1.5,
            }}
          >
            El CIC mejora la TIR en{" "}
            <strong>{((inv.tirCon - inv.tirSin) * 100).toFixed(1)} pp</strong>{" "}
            porque devuelve {fmt(inv.viaCIC)} en el año 1 sin depender del
            mercado. Sin CIC, el inversionista esperaría taquilla y plataformas
            para empezar a recuperar.
          </div>
        )}
      {/* Tabla flujos */}
      <div
        onClick={() => setFlowOpen((o) => !o)}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginTop: "4px",
        }}
      >
        <span style={{ fontFamily: PD, fontSize: "12px", color: "#5C2C8C" }}>
          {flowOpen ? "▼" : "▶"} Ver flujos año por año (por ventana)
        </span>
      </div>
      {flowOpen && (
        <div style={{ marginTop: "10px", overflowX: "auto" }}>
          {/* Leyenda de ventanas */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            {[
              ["🎬 Taquilla", "#2C4A8C", "Año 1 (95%) · Año 2 (5%)"],
              ...(hasMg ? [["💼 MG int'l", "#2C6B4A", "Año 1 (100%)"]] : []),
              ...(hasVen
                ? [
                    [
                      "🌍 Ventas int'l",
                      "#2C6B6B",
                      "Año 1–2 (65%) · Año 3–4 (35%)",
                    ],
                  ]
                : []),
              ...(hasPlat
                ? [
                    [
                      "📱 Plataformas",
                      "#5C2C8C",
                      "Año 2–3 (76%) · Año 4+ (24%)",
                    ],
                  ]
                : []),
              ...(hasTv
                ? [["📺 TV", "#8C6A2C", "Año 3–4 (70%) · Año 5+ (30%)"]]
                : []),
              ...(inv.viaCIC > 0
                ? [["🏛 CIC/DIAN", "#2C6B4A", "Año 1 (100%) — independiente"]]
                : []),
            ].map(([lbl, col, nota]) => (
              <div
                key={lbl}
                style={{
                  background: "#fff",
                  border: `1px solid ${col}44`,
                  borderLeft: `3px solid ${col}`,
                  borderRadius: "4px",
                  padding: "4px 8px",
                }}
              >
                <div style={{ fontFamily: PD, fontSize: "11px", color: col }}>
                  {lbl}
                </div>
                <div
                  style={{ fontFamily: SS, fontSize: "10px", color: "#8A7A62" }}
                >
                  {nota}
                </div>
              </div>
            ))}
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: SS,
              fontSize: "12px",
            }}
          >
            <thead>
              <tr style={{ background: "#3D1A6A", color: "#E0C8FF" }}>
                <td
                  style={{
                    padding: "5px 8px",
                    fontFamily: PD,
                    fontWeight: "700",
                  }}
                >
                  Año 0
                </td>
                <td
                  style={{
                    padding: "5px 8px",
                    textAlign: "right",
                    color: "#FFB0A0",
                  }}
                >
                  —
                </td>
                <td
                  style={{
                    padding: "5px 8px",
                    textAlign: "right",
                    color: "#FFB0A0",
                  }}
                >
                  —
                </td>
                {hasMg && (
                  <td style={{ padding: "5px 8px", textAlign: "right" }}>—</td>
                )}
                {hasVen && (
                  <td style={{ padding: "5px 8px", textAlign: "right" }}>—</td>
                )}
                {hasPlat && (
                  <td style={{ padding: "5px 8px", textAlign: "right" }}>—</td>
                )}
                {hasTv && (
                  <td style={{ padding: "5px 8px", textAlign: "right" }}>—</td>
                )}
                {inv.viaCIC > 0 && (
                  <td style={{ padding: "5px 8px", textAlign: "right" }}>—</td>
                )}
                <td
                  style={{
                    padding: "5px 8px",
                    textAlign: "right",
                    color: "#FFB0A0",
                    fontFamily: PD,
                    fontWeight: "700",
                  }}
                >
                  –{fmt(inv.monto)}
                </td>
                <td
                  style={{
                    padding: "5px 8px",
                    textAlign: "right",
                    color: "#FFB0A0",
                  }}
                >
                  –{fmt(inv.monto)}
                </td>
              </tr>
              <tr style={{ background: "#5C2C8C", color: "#fff" }}>
                <th
                  style={{
                    padding: "6px 8px",
                    textAlign: "left",
                    fontFamily: PD,
                    whiteSpace: "nowrap",
                  }}
                >
                  Año
                </th>
                <th
                  style={{
                    padding: "6px 8px",
                    textAlign: "right",
                    fontFamily: PD,
                    color: "#B0C8FF",
                  }}
                >
                  🎬 Taquilla
                </th>
                <th
                  style={{
                    padding: "6px 8px",
                    textAlign: "right",
                    fontFamily: PD,
                    color: "#90E0B0",
                  }}
                >
                  🌍 Ventas
                </th>
                {hasMg && (
                  <th
                    style={{
                      padding: "6px 8px",
                      textAlign: "right",
                      fontFamily: PD,
                      color: "#90E0B0",
                    }}
                  >
                    💼 MG
                  </th>
                )}
                {hasPlat && (
                  <th
                    style={{
                      padding: "6px 8px",
                      textAlign: "right",
                      fontFamily: PD,
                      color: "#C8A0FF",
                    }}
                  >
                    📱 Plat.
                  </th>
                )}
                {hasTv && (
                  <th
                    style={{
                      padding: "6px 8px",
                      textAlign: "right",
                      fontFamily: PD,
                      color: "#F0D080",
                    }}
                  >
                    📺 TV
                  </th>
                )}
                {inv.viaCIC > 0 && (
                  <th
                    style={{
                      padding: "6px 8px",
                      textAlign: "right",
                      fontFamily: PD,
                      color: "#80FFB0",
                    }}
                  >
                    🏛 CIC
                  </th>
                )}
                <th
                  style={{
                    padding: "6px 8px",
                    textAlign: "right",
                    fontFamily: PD,
                  }}
                >
                  Total año
                </th>
                <th
                  style={{
                    padding: "6px 8px",
                    textAlign: "right",
                    fontFamily: PD,
                  }}
                >
                  Neto acum.
                </th>
              </tr>
            </thead>
            <tbody>
              {inv.tablaFlujos.map((fl, fi) => {
                const acum =
                  -inv.monto +
                  inv.tablaFlujos
                    .slice(0, fi + 1)
                    .reduce((s, f) => s + f.total, 0);
                const recoupYear =
                  acum >= 0 &&
                  (fi === 0 ||
                    -inv.monto +
                      inv.tablaFlujos
                        .slice(0, fi)
                        .reduce((s, f) => s + f.total, 0) <
                      0);
                return (
                  <tr
                    key={fi}
                    style={{
                      background: recoupYear
                        ? "#D4F0DC"
                        : fi % 2 === 0
                        ? "#FAF7FF"
                        : "#F5F0FB",
                      borderBottom: "1px solid #E8E0F8",
                    }}
                  >
                    <td
                      style={{
                        padding: "5px 8px",
                        fontFamily: PD,
                        color: "#5C2C8C",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Año {fl.año}
                      {recoupYear ? " ✓ recoup" : ""}
                    </td>
                    <td
                      style={{
                        padding: "5px 8px",
                        textAlign: "right",
                        color: "#2C4A8C",
                      }}
                    >
                      {fl.dTaquilla > 0 ? fmt(fl.dTaquilla) : "—"}
                    </td>
                    <td
                      style={{
                        padding: "5px 8px",
                        textAlign: "right",
                        color: "#2C6B6B",
                      }}
                    >
                      {fl.dVentas > 0 ? fmt(fl.dVentas) : "—"}
                    </td>
                    {hasMg && (
                      <td
                        style={{
                          padding: "5px 8px",
                          textAlign: "right",
                          color: "#2C6B4A",
                        }}
                      >
                        {fl.dMg > 0 ? fmt(fl.dMg) : "—"}
                      </td>
                    )}
                    {hasPlat && (
                      <td
                        style={{
                          padding: "5px 8px",
                          textAlign: "right",
                          color: "#5C2C8C",
                        }}
                      >
                        {fl.dPlat > 0 ? fmt(fl.dPlat) : "—"}
                      </td>
                    )}
                    {hasTv && (
                      <td
                        style={{
                          padding: "5px 8px",
                          textAlign: "right",
                          color: "#8C6A2C",
                        }}
                      >
                        {fl.dTv > 0 ? fmt(fl.dTv) : "—"}
                      </td>
                    )}
                    {inv.viaCIC > 0 && (
                      <td
                        style={{
                          padding: "5px 8px",
                          textAlign: "right",
                          color: "#2C6B4A",
                          fontWeight: fl.cic > 0 ? "700" : "normal",
                        }}
                      >
                        {fl.cic > 0 ? fmt(fl.cic) : "—"}
                      </td>
                    )}
                    <td
                      style={{
                        padding: "5px 8px",
                        textAlign: "right",
                        fontFamily: PD,
                        fontWeight: "700",
                        color: fl.total > 0 ? "#3D3220" : "#8A7A62",
                      }}
                    >
                      {fl.total > 0 ? fmt(fl.total) : "—"}
                    </td>
                    <td
                      style={{
                        padding: "5px 8px",
                        textAlign: "right",
                        fontFamily: PD,
                        fontWeight: "700",
                        color: acum >= 0 ? "#2C6B4A" : "#8C3A2C",
                      }}
                    >
                      {acum >= 0 ? "+" : "–"}
                      {fmt(Math.abs(Math.round(acum)))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── SIMULADOR ───────────────────────────────────────────────────────────────

function NegociacionTab({
  distFeeLocal,
  paMode,
  paDistPct,
  investorSplitPct,
  retornoMin,
}) {
  const [distFeeMaxP, setDistFeeMaxP] = useState(25);
  const [paCapP, setPaCapP] = useState(20);
  const [splitMinP, setSplitMinP] = useState(45);
  const [retornoMaxP, setRetornoMaxP] = useState(130);
  const [retornoMinI, setRetornoMinI] = useState(115);
  const [splitMinI, setSplitMinI] = useState(40);

  const XS = 100,
    XE = 140,
    YS = 30,
    YE = 80;
  const xLeft = Math.max(XS, retornoMinI);
  const xRight = Math.min(XE, retornoMaxP);
  const yBot = Math.max(YS, splitMinP);
  const yTop = Math.min(YE, 100 - splitMinI);
  const zoneExists = xLeft <= xRight && yBot <= yTop;

  const curX = Math.min(XE, Math.max(XS, retornoMin));
  const curY = Math.min(YE, Math.max(YS, 100 - investorSplitPct));
  const curInZone =
    zoneExists &&
    curX >= xLeft &&
    curX <= xRight &&
    curY >= yBot &&
    curY <= yTop;

  const W = 500,
    H = 280,
    PAD = { l: 52, r: 16, t: 18, b: 48 };
  const cx = (v) => PAD.l + ((v - XS) / (XE - XS)) * (W - PAD.l - PAD.r);
  const cy = (v) => H - PAD.b - ((v - YS) / (YE - YS)) * (H - PAD.t - PAD.b);

  const AZUL = "#2C4A8C",
    DORADO = "#8C6A2C",
    VERDE = "#2C6B4A",
    ROJO = "#8C3A2C",
    GRIS = "#6A5F4E";

  return (
    <div>
      <p
        style={{
          fontFamily: SS,
          fontSize: "17px",
          color: "#3D3220",
          lineHeight: 1.7,
          marginBottom: "20px",
        }}
      >
        Define las posiciones de cada parte. El mapa muestra la{" "}
        <strong>zona de acuerdo viable</strong> — el espacio donde
        simultáneamente el productor no cede más de lo aceptable y el
        inversionista obtiene al menos lo que exige. El punto rojo representa
        los parámetros actuales del simulador.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <Panel title="🎬 Posición del Productor" color={AZUL}>
          <div
            style={{
              fontFamily: SS,
              fontStyle: "italic",
              fontSize: "14px",
              color: GRIS,
              marginBottom: "14px",
            }}
          >
            Lo máximo que el productor está dispuesto a conceder
          </div>
          <SliderRow
            label="Dist. fee máximo aceptado (%)"
            val={distFeeMaxP}
            set={setDistFeeMaxP}
            min={10}
            max={40}
            unit="%"
            color={AZUL}
          />
          <SliderRow
            label="Cap P&A máximo (%)"
            val={paCapP}
            set={setPaCapP}
            min={5}
            max={40}
            unit="%"
            color={AZUL}
          />
          <SliderRow
            label="Split mínimo para el productor (%)"
            val={splitMinP}
            set={setSplitMinP}
            min={20}
            max={75}
            unit="%"
            color={AZUL}
          />
          <SliderRow
            label="Retorno máximo que acepta dar al inv. (%)"
            val={retornoMaxP}
            set={setRetornoMaxP}
            min={100}
            max={140}
            unit="%"
            color={AZUL}
          />
        </Panel>
        <Panel title="💰 Posición del Inversionista" color={DORADO}>
          <div
            style={{
              fontFamily: SS,
              fontStyle: "italic",
              fontSize: "14px",
              color: GRIS,
              marginBottom: "14px",
            }}
          >
            Lo mínimo que el inversionista exige para cerrar
          </div>
          <SliderRow
            label="Retorno mínimo exigido (%)"
            val={retornoMinI}
            set={setRetornoMinI}
            min={100}
            max={140}
            unit="%"
            color={DORADO}
          />
          <SliderRow
            label="Split mínimo para el inversionista (%)"
            val={splitMinI}
            set={setSplitMinI}
            min={20}
            max={70}
            unit="%"
            color={DORADO}
          />
        </Panel>
      </div>

      <div
        style={{
          background: "#FDFAF5",
          border: "2px solid #D4C9B4",
          borderRadius: "8px",
          padding: "18px 20px",
        }}
      >
        <div
          style={{
            fontFamily: PD,
            fontSize: "16px",
            color: "#3D3220",
            fontWeight: "700",
            marginBottom: "4px",
          }}
        >
          Mapa de Zona de Acuerdo
        </div>
        <div
          style={{
            fontFamily: SS,
            fontSize: "13px",
            color: GRIS,
            marginBottom: "14px",
          }}
        >
          Eje X: retorno mínimo garantizado al inversionista · Eje Y: % del back
          end para el productor
        </div>
        <div style={{ overflowX: "auto" }}>
          <svg
            width={W}
            height={H}
            style={{ display: "block", fontFamily: SS }}
          >
            <rect
              x={PAD.l}
              y={PAD.t}
              width={W - PAD.l - PAD.r}
              height={H - PAD.t - PAD.b}
              fill="#F5F0E8"
              rx="3"
            />
            {zoneExists && (
              <rect
                x={cx(xLeft)}
                y={cy(yTop)}
                width={Math.max(0, cx(xRight) - cx(xLeft))}
                height={Math.max(0, cy(yBot) - cy(yTop))}
                fill="#2C6B4A22"
                stroke="#2C6B4A"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                rx="2"
              />
            )}
            {zoneExists && Math.max(0, cx(xRight) - cx(xLeft)) > 40 && (
              <text
                x={(cx(xLeft) + cx(xRight)) / 2}
                y={(cy(yTop) + cy(yBot)) / 2 + 5}
                textAnchor="middle"
                fill={VERDE}
                fontSize="12"
                fontWeight="700"
              >
                ZONA DE ACUERDO
              </text>
            )}
            {[100, 110, 120, 130, 140].map((v) => (
              <g key={v}>
                <line
                  x1={cx(v)}
                  y1={PAD.t}
                  x2={cx(v)}
                  y2={H - PAD.b}
                  stroke="#D4C9B4"
                  strokeWidth="1"
                />
                <text
                  x={cx(v)}
                  y={H - PAD.b + 16}
                  textAnchor="middle"
                  fill={GRIS}
                  fontSize="11"
                >
                  {v}%
                </text>
              </g>
            ))}
            {[30, 40, 50, 60, 70, 80].map((v) => (
              <g key={v}>
                <line
                  x1={PAD.l}
                  y1={cy(v)}
                  x2={W - PAD.r}
                  y2={cy(v)}
                  stroke="#D4C9B4"
                  strokeWidth="1"
                />
                <text
                  x={PAD.l - 6}
                  y={cy(v) + 4}
                  textAnchor="end"
                  fill={GRIS}
                  fontSize="11"
                >
                  {v}%
                </text>
              </g>
            ))}
            {retornoMinI >= XS && retornoMinI <= XE && (
              <g>
                <line
                  x1={cx(retornoMinI)}
                  y1={PAD.t}
                  x2={cx(retornoMinI)}
                  y2={H - PAD.b}
                  stroke={DORADO}
                  strokeWidth="2"
                  strokeDasharray="6 3"
                />
                <text
                  x={cx(retornoMinI) + 4}
                  y={PAD.t + 12}
                  fill={DORADO}
                  fontSize="10"
                >
                  Ret.mín.inv.
                </text>
              </g>
            )}
            {retornoMaxP >= XS && retornoMaxP <= XE && (
              <g>
                <line
                  x1={cx(retornoMaxP)}
                  y1={PAD.t}
                  x2={cx(retornoMaxP)}
                  y2={H - PAD.b}
                  stroke={AZUL}
                  strokeWidth="2"
                  strokeDasharray="6 3"
                />
                <text
                  x={cx(retornoMaxP) - 4}
                  y={PAD.t + 12}
                  fill={AZUL}
                  fontSize="10"
                  textAnchor="end"
                >
                  Ret.máx.prod.
                </text>
              </g>
            )}
            {splitMinP >= YS && splitMinP <= YE && (
              <g>
                <line
                  x1={PAD.l}
                  y1={cy(splitMinP)}
                  x2={W - PAD.r}
                  y2={cy(splitMinP)}
                  stroke={AZUL}
                  strokeWidth="2"
                  strokeDasharray="6 3"
                />
                <text
                  x={PAD.l + 4}
                  y={cy(splitMinP) - 4}
                  fill={AZUL}
                  fontSize="10"
                >
                  Split mín. prod.
                </text>
              </g>
            )}
            {100 - splitMinI >= YS && 100 - splitMinI <= YE && (
              <g>
                <line
                  x1={PAD.l}
                  y1={cy(100 - splitMinI)}
                  x2={W - PAD.r}
                  y2={cy(100 - splitMinI)}
                  stroke={DORADO}
                  strokeWidth="2"
                  strokeDasharray="6 3"
                />
                <text
                  x={PAD.l + 4}
                  y={cy(100 - splitMinI) - 4}
                  fill={DORADO}
                  fontSize="10"
                >
                  Split máx. prod. (inv.)
                </text>
              </g>
            )}
            <circle
              cx={cx(curX)}
              cy={cy(curY)}
              r="9"
              fill={curInZone ? VERDE : ROJO}
              stroke="#fff"
              strokeWidth="2"
            />
            <text
              x={cx(curX) + 13}
              y={cy(curY) + 4}
              fill={curInZone ? VERDE : ROJO}
              fontSize="12"
              fontWeight="700"
            >
              Actual
            </text>
            <line
              x1={PAD.l}
              y1={H - PAD.b}
              x2={W - PAD.r}
              y2={H - PAD.b}
              stroke="#8A7A62"
              strokeWidth="1.5"
            />
            <line
              x1={PAD.l}
              y1={PAD.t}
              x2={PAD.l}
              y2={H - PAD.b}
              stroke="#8A7A62"
              strokeWidth="1.5"
            />
            <text
              x={W / 2}
              y={H - 2}
              textAnchor="middle"
              fill={GRIS}
              fontSize="11"
            >
              Retorno mínimo garantizado al inversionista
            </text>
            <text
              x={10}
              y={H / 2}
              textAnchor="middle"
              fill={GRIS}
              fontSize="11"
              transform={`rotate(-90,10,${H / 2})`}
            >
              % back end para el productor
            </text>
          </svg>
        </div>
        <div
          style={{
            marginTop: "14px",
            padding: "14px 18px",
            background: curInZone
              ? "#EEF8EE"
              : zoneExists
              ? "#FFF8EC"
              : "#FFF0F0",
            border: `2px solid ${
              curInZone ? VERDE : zoneExists ? "#B08040" : ROJO
            }`,
            borderRadius: "6px",
          }}
        >
          <div
            style={{
              fontFamily: PD,
              fontSize: "17px",
              fontWeight: "700",
              color: curInZone ? VERDE : zoneExists ? "#8C5A10" : ROJO,
              marginBottom: "6px",
            }}
          >
            {curInZone
              ? "✓ El escenario actual está en la zona de acuerdo"
              : zoneExists
              ? "⚠ Existe zona de acuerdo, pero el escenario actual está fuera"
              : "✗ No existe zona de acuerdo con estas posiciones"}
          </div>
          <div
            style={{
              fontFamily: SS,
              fontSize: "14px",
              color: "#3D3220",
              lineHeight: 1.6,
            }}
          >
            {!zoneExists
              ? `Posiciones incompatibles: el inversionista exige retorno ≥${retornoMinI}% pero el productor acepta máximo ${retornoMaxP}%, y/o el split suma más del 100% (prod. exige ≥${splitMinP}% + inv. exige ≥${splitMinI}% = ${
                  splitMinP + splitMinI
                }%).`
              : curInZone
              ? `Retorno actual: ${curX}% (viable: ${xLeft}–${xRight}%) · Split productor actual: ${curY}% (viable: ${yBot}–${Math.min(
                  YE,
                  yTop
                )}%).`
              : `Zona viable: retorno ${xLeft}–${xRight}%, split del productor ${yBot}–${Math.min(
                  YE,
                  yTop
                )}%. Ajusta el simulador para entrar en esa región.`}
          </div>
          {!curInZone && zoneExists && (
            <div
              style={{
                marginTop: "8px",
                fontFamily: SS,
                fontSize: "13px",
                color: GRIS,
                fontStyle: "italic",
              }}
            >
              {curX < xLeft
                ? `↑ Sube el retorno de ${curX}% a al menos ${xLeft}%. `
                : ""}
              {curX > xRight
                ? `↓ Baja el retorno de ${curX}% a máximo ${xRight}%. `
                : ""}
              {curY < yBot
                ? `↑ Sube el split del productor de ${curY}% a al menos ${yBot}%. `
                : ""}
              {curY > yTop
                ? `↓ Reduce el split del productor de ${curY}% a máximo ${yTop}%. `
                : ""}
            </div>
          )}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            marginTop: "12px",
          }}
        >
          {[
            {
              ok: distFeeLocal <= distFeeMaxP,
              label: "Distributor's fee",
              det:
                distFeeLocal <= distFeeMaxP
                  ? `${distFeeLocal}% ≤ máx. prod. (${distFeeMaxP}%)`
                  : `${distFeeLocal}% supera máx. prod. (${distFeeMaxP}%)`,
            },
            {
              ok: paMode === "prod" || paDistPct <= paCapP,
              label: "Cap de P&A",
              det:
                paMode === "prod"
                  ? "P&A pre-financiado — sin conflicto"
                  : paDistPct <= paCapP
                  ? `${paDistPct}% ≤ cap (${paCapP}%)`
                  : `${paDistPct}% supera cap (${paCapP}%)`,
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: item.ok ? "#EEF8EE" : "#FFF4EC",
                border: `1px solid ${item.ok ? "#2C6B2C55" : "#B05C1855"}`,
                borderRadius: "4px",
                padding: "10px 14px",
                borderLeft: `4px solid ${item.ok ? VERDE : "#B05C18"}`,
              }}
            >
              <div
                style={{
                  fontFamily: PD,
                  fontSize: "14px",
                  color: item.ok ? VERDE : "#B05C18",
                  fontWeight: "700",
                  marginBottom: "3px",
                }}
              >
                {item.ok ? "✓" : "✗"} {item.label}
              </div>
              <div
                style={{ fontFamily: SS, fontSize: "13px", color: "#3D3220" }}
              >
                {item.det}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Simulador() {
  const [simTab, setSimTab] = useState("principal");
  const [presentMode, setPresentMode] = useState(false);

  // ── Ingresos ──────────────────────────────────────────────────────────────
  const [espectadores, setEspRaw] = useState(300000);
  const [taquilla, setTaqRaw] = useState(3000);
  const setEsp = (v) => {
    setEspRaw(v);
    setTaqRaw(Math.round(v * 0.01));
  };
  const setTaq = (v) => {
    setTaqRaw(v);
    setEspRaw(Math.round(v * 100));
  };
  const [mgInt, setMgInt] = useState(800);
  const [ventasInt, setVentasInt] = useState(300);
  const [plataformas, setPlat] = useState(400);
  const [tv, setTv] = useState(200);
  const [mgActivo, setMgActivo] = useState(false);

  // ── Distribución ─────────────────────────────────────────────────────────
  const [exhibitorSplit, setExhibitorSplit] = useState(50);
  const [distFeeLocal, setDistFeeLocal] = useState(20);
  const [cadenaIntPct, setCadenaIntPct] = useState(35);
  const [paMode, setPaMode] = useState("dist");
  const [paDistPct, setPaDistPct] = useState(15);
  const [paProdM, setPaProdM] = useState(300);

  // ── Recoupment ───────────────────────────────────────────────────────────
  const [sDebt, setSDebt] = useState(0);
  const [deferments, setDeferments] = useState(0);
  const [retornoMin, setRetornoMin] = useState(120);
  const [investorSplitPct, setInvestorSplitPct] = useState(50);

  // ── Inversionistas ───────────────────────────────────────────────────────
  // Cada inversionista tiene un PORCENTAJE del equity disponible.
  // Su monto absoluto = pct/100 * equityTotal  (calculado abajo, no en estado)
  const [useCIC, setUseCIC] = useState(true);
  const [inversionistas, setInversionistas] = useState([
    { nombre: "Inv. A (CIC)", pct: 67, prioridad: 1, incentivo: "CIC" },
    { nombre: "Inv. B (equity)", pct: 33, prioridad: 2, incentivo: "ninguno" },
  ]);

  // ── Soft money ────────────────────────────────────────────────────────────
  // FDC, Ibermedia, CoCrea, subvenciones, etc.
  // Reduce el equity que deben financiar los inversionistas.
  const [softMoney, setSoftMoney] = useState([]);
  const [backEndParticipantes, setBackEndParticipantes] = useState([]);

  // ── Helpers de inversionistas (operaciones sobre pct, siempre suman 100) ──
  const redistribuir = (arr, idxCambiado, nuevoPct) => {
    // Fija el pct del idx cambiado; redistribuye el resto proporcional a los demás
    const capped = Math.min(100, Math.max(0, nuevoPct));
    const otros = arr.filter((_, i) => i !== idxCambiado);
    const sumaOtros = otros.reduce((s, x) => s + x.pct, 0);
    const restante = 100 - capped;
    return arr.map((inv, i) => {
      if (i === idxCambiado) return { ...inv, pct: capped };
      if (sumaOtros === 0)
        return { ...inv, pct: Math.round(restante / otros.length) };
      return { ...inv, pct: Math.round((inv.pct / sumaOtros) * restante) };
    });
  };

  const agregarInversionista = () => {
    const n = inversionistas.length;
    // Nuevo inversionista toma 1/(n+1) del total, los demás se reducen proporcionalmente
    const nuevoPct = Math.floor(100 / (n + 1));
    const resto = 100 - nuevoPct;
    const nuevos = inversionistas.map((inv) => ({
      ...inv,
      pct: Math.round((inv.pct / 100) * resto),
    }));
    setInversionistas([
      ...nuevos,
      {
        nombre: `Inv. ${String.fromCharCode(65 + n)}`,
        pct: nuevoPct,
        prioridad: n + 1,
        incentivo: "ninguno",
      },
    ]);
  };

  const eliminarInversionista = (idx) => {
    const arr = inversionistas.filter((_, i) => i !== idx);
    if (arr.length === 0) return;
    // Redistribuye el pct eliminado proporcionalmente
    const sumaArr = arr.reduce((s, x) => s + x.pct, 0);
    const factor = sumaArr > 0 ? 100 / sumaArr : 1;
    setInversionistas(
      arr.map((inv) => ({ ...inv, pct: Math.round(inv.pct * factor) }))
    );
  };

  // ── Escenario ────────────────────────────────────────────────────────────
  const escenario = 100; // factor de sensibilidad eliminado — siempre 100%

  // ── Presupuesto desglosado ───────────────────────────────────────────────
  const [presupuesto, setPresupuesto] = useState(3000);
  const [showDesglose, setShowDesglose] = useState(false);
  const [desglose, setDesglose] = useState({
    desarrollo: 5,
    produccion: 60,
    post: 15,
    contingencia: 10,
    producerFee: 10,
  });
  const updateDesglose = (key, val) =>
    setDesglose((d) => ({ ...d, [key]: val }));
  const totalDesglose = Object.values(desglose).reduce((a, b) => a + b, 0);

  // ── Co-producción ────────────────────────────────────────────────────────
  const [coProd, setCoProd] = useState(false);
  const [coProdNombre, setCoProdNombre] = useState("Francia");
  const [coProdPct, setCoProdPct] = useState(40);
  const [coProdTipo, setCoProdTipo] = useState("equity"); // "equity" | "soft_money"
  const [coProdModo, setCoProdModo] = useState("pari_passu"); // prioridad rel. a Colombia
  const [coProdPrioridad, setCoProdPrioridad] = useState(1); // número de prioridad absoluta
  const [coProdIncentivo, setCoProdIncentivo] = useState("none"); // "none" | "incentivo"
  const [coProdIncentivoNombre, setCoProdIncentivoNombre] = useState(""); // ej. "EFICINE México"
  const [coProdIncentivoPct, setCoProdIncentivoPct] = useState(30); // % del incentivo (0–100)

  // ── Financiamiento: invariante presupuesto = softMoney + equity ─────────────
  const coProdMonto = coProd ? Math.round((presupuesto * coProdPct) / 100) : 0;
  // Monto del incentivo extranjero (rebate/tax credit) sobre la aportación del coproductor
  // El incentivo del país coproductor (rebate / tax credit) reduce lo que sus
  // inversionistas deben recuperar por explotación en el waterfall.
  // Solo aplica cuando el coproductor entra como equity (no como soft money).
  const coProdIncentivoMonto =
    coProd && coProdTipo === "equity" && coProdIncentivo === "incentivo"
      ? Math.round((coProdMonto * coProdIncentivoPct) / 100)
      : 0;
  // Si el coproductor es soft money, su aporte suma al totalSoftMoney
  const totalSoftMoney =
    softMoney.reduce((s, i) => s + i.monto, 0) +
    (coProd && coProdTipo === "soft_money" ? coProdMonto : 0);
  const equityTotal = Math.max(0, presupuesto - totalSoftMoney);
  // Montos absolutos derivados de los porcentajes (siempre suman = equityTotal
  // excluyendo la parte del coproductor equity, que es fija)
  const equityPrivado =
    coProd && coProdTipo === "equity"
      ? Math.max(0, equityTotal - coProdMonto)
      : equityTotal;
  const inversionistasConMonto = inversionistas.map((inv) => ({
    ...inv,
    monto: Math.round((inv.pct / 100) * equityPrivado),
  }));
  // Si el coproductor es equity, se inyecta como inversionista sintético
  // Su prioridad absoluta depende de coProdModo:
  //   prioridad = coProd pari_passu → misma que coProdPrioridad
  //   prioridad = prioridad → 0 (antes de todos)
  //   prioridad = subordinado → 999 (después de todos)
  const coProdPrioridadCalc =
    !coProd || coProdTipo !== "equity"
      ? null
      : coProdModo === "prioridad"
      ? 0
      : coProdModo === "subordinado"
      ? 999
      : coProdPrioridad; // pari_passu: usa el número configurado
  const inversionistasConCoprod =
    coProd && coProdTipo === "equity"
      ? [
          ...inversionistasConMonto,
          {
            nombre: coProdNombre,
            monto: coProdMonto,
            prioridad: coProdPrioridadCalc,
            incentivo: "ninguno",
            esCoproductor: true,
            incentivoMonto: coProdIncentivoMonto,
            incentivoTipo: coProdIncentivo,
            incentivoNombre: coProdIncentivoNombre,
          },
        ]
      : inversionistasConMonto;

  // ── Parámetros consolidados ───────────────────────────────────────────────
  const params = {
    taquilla,
    mgInt,
    ventasInt,
    plataformas,
    tv,
    mgActivo,
    exhibitorSplit,
    distFeeLocal,
    cadenaIntPct,
    paMode,
    paDistPct,
    sDebt,
    deferments,
    retornoMin,
    investorSplitPct,
    useCIC,
    inversionistas: inversionistasConCoprod,
    backEndParticipantes,
    escenario: 100,
  };
  const R = calcWaterfall(params);
  const totalInversion = R.totalInversion;

  // ── TIR ─────────────────────────────────────────────────────────────────
  // Horizonte temporal pactado contractualmente
  const [anosExplot, setAnosExplot] = useState(5);
  const [tirOpen, setTirOpen] = useState(false);
  // Modo de distribución temporal: "empirico" = curvas automáticas; "personalizado" = inputs usuario
  const [distMode, setDistMode] = useState("empirico");
  // Distribución personalizada: montos absolutos brutos por fuente por año
  // Se inicializa vacía — se rellena al activar el modo personalizado
  const [distPersonalizada, setDistPersonalizada] = useState({
    taquilla: [],
    ventas: [],
    plat: [],
    tv: [],
  });
  // Helper para actualizar una celda de distPersonalizada
  const setDistCell = (fuente, idx, val) => {
    setDistPersonalizada((prev) => {
      const arr = [...(prev[fuente] || [])];
      arr[idx] = val;
      return { ...prev, [fuente]: arr };
    });
  };
  // Inicializar distPersonalizada cuando cambia anosExplot o srcXxx (primera vez o reset)
  // Se hace lazy en el render — ver abajo.

  // ── Curvas temporales por fuente ─────────────────────────────────────────
  // Cada ventana de explotación tiene su propio calendario de mercado.
  // Los valores representan la proporción del total de esa fuente que llega
  // en cada año (índice 0 = año 1). Modelo empírico para cine independiente.
  // Curvas empíricas por fuente (índice 0 = año 1, hasta año 10)
  const CURVAS_EMP = {
    taquilla: [0.95, 0.05, 0, 0, 0, 0, 0, 0, 0, 0],
    mg: [1.0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ventas: [0.2, 0.45, 0.2, 0.1, 0.05, 0, 0, 0, 0, 0],
    plat: [0, 0.48, 0.28, 0.14, 0.06, 0.02, 0.01, 0.01, 0, 0],
    tv: [0, 0, 0.35, 0.35, 0.18, 0.08, 0.03, 0.01, 0, 0],
  };
  const normCurva = (c) => {
    const sl = c.slice(0, anosExplot);
    const tot = sl.reduce((s, v) => s + v, 0);
    return tot > 0 ? sl.map((v) => v / tot) : sl.map(() => 1 / anosExplot);
  };

  // Ingresos netos por fuente (resultado del waterfall ya calculado)
  // Fuentes netas al productor — cada una muestra lo que el waterfall asigna a esa ventana
  // Taquilla: después de split exhibidor + fee dist. local. Muestra 1:1 con el waterfall.
  // El P&A (si distribuidor lo adelanta) se descuenta en el año 1 del calendario — no aquí.
  const srcTaq = R.taquillaAlProductor; // sin restar P&A: el slider muestra lo que el waterfall muestra
  const srcMg = R.mgNeto; // neto después de cadena int'l
  const srcVen = R.ventasIntNeto; // neto después de cadena int'l
  const srcPlat = R.plataformasNet; // licencia directa
  const srcTv = R.tvNet; // licencia directa
  // Nota: R.paDistAmt se descuenta del año 1 en netRevYear para que
  // sum(netRevYear) === R.netRevenues (base exacta del waterfall)
  const totalNetRev = srcTaq + srcMg + srcVen + srcPlat + srcTv - R.paDistAmt;

  // Construir curvas finales según distMode
  // En modo personalizado: usar inputs del usuario (normalizados al total de cada fuente)
  // El último año absorbe automáticamente el residuo para garantizar consistencia.
  const buildCurva = (fuente, srcTotal) => {
    if (
      distMode === "personalizado" &&
      distPersonalizada[fuente] &&
      distPersonalizada[fuente].length > 0
    ) {
      const raw = Array.from({ length: anosExplot }, (_, i) => {
        const v = Number(distPersonalizada[fuente][i]) || 0;
        return v < 0 ? 0 : v;
      });
      // Sumar años 0..n-2, el último año absorbe el residuo
      const sumPrev = raw.slice(0, anosExplot - 1).reduce((s, v) => s + v, 0);
      const lastVal = Math.max(0, srcTotal - sumPrev);
      const adjusted = [...raw.slice(0, anosExplot - 1), lastVal];
      const tot = adjusted.reduce((s, v) => s + v, 0);
      return tot > 0
        ? adjusted.map((v) => v / tot)
        : adjusted.map(() => 1 / anosExplot);
    }
    return normCurva(CURVAS_EMP[fuente] || Array(10).fill(1 / 10));
  };

  const cTaq = buildCurva("taquilla", srcTaq);
  const cMg = normCurva(CURVAS_EMP.mg); // MG siempre empírico (año 1)
  const cVen = buildCurva("ventas", srcVen);
  const cPlat = buildCurva("plat", srcPlat);
  const cTv = buildCurva("tv", srcTv);

  // Ingresos netos por año
  // El P&A adelantado por el distribuidor (paDistAmt) se paga en el año 1 del estreno.
  // Se descuenta de ese año para que sum(netRevYear) === R.netRevenues exactamente.
  const netRevYear = Array.from({ length: anosExplot }, (_, i) => {
    const bruto =
      srcTaq * (cTaq[i] || 0) +
      srcMg * (cMg[i] || 0) +
      srcVen * (cVen[i] || 0) +
      srcPlat * (cPlat[i] || 0) +
      srcTv * (cTv[i] || 0);
    return i === 0 ? Math.max(0, bruto - R.paDistAmt) : bruto;
  });

  // Desglose por fuente por año
  const desglosePorAno = Array.from({ length: anosExplot }, (_, i) => ({
    año: i + 1,
    taquilla: Math.round(srcTaq * (cTaq[i] || 0)),
    mg: Math.round(srcMg * (cMg[i] || 0)),
    ventas: Math.round(srcVen * (cVen[i] || 0)),
    plat: Math.round(srcPlat * (cPlat[i] || 0)),
    tv: Math.round(srcTv * (cTv[i] || 0)),
    total: Math.round(netRevYear[i]),
  }));

  // TIR por inversionista — flujos construidos con timing real por fuente
  const tirPorInversionista = R.equityRecoupRows
    .filter((r) => !r.esCoproductor)
    .map((r) => {
      const monto = r.monto;
      const propInversion = totalInversion > 0 ? monto / totalInversion : 0;
      // Total que este inversionista recibe vía explotación (waterfall + back end)
      const viaExplot = r.paid + R.investorPool * propInversion;
      // Distribución temporal: proporcional a los ingresos netos de cada año
      const wYear =
        totalNetRev > 0
          ? netRevYear.map((y) => y / totalNetRev)
          : netRevYear.map(() => 1 / anosExplot);
      // Lo que recibe vía CIC (año 1, declaración de renta — independiente del mercado)
      const viaCIC =
        r.incentivo && r.incentivo !== "ninguno" && useCIC
          ? Math.floor(monto * 0.5775)
          : 0;
      // Flujos CON CIC
      const cfCIC = new Array(anosExplot + 1).fill(0);
      cfCIC[0] = -monto;
      cfCIC[1] += viaCIC; // CIC llega en año 1
      wYear.forEach((w, i) => {
        cfCIC[i + 1] += Math.round(viaExplot * w);
      });
      // Flujos SIN CIC (comparativo hipotético)
      const cfSin = new Array(anosExplot + 1).fill(0);
      cfSin[0] = -monto;
      wYear.forEach((w, i) => {
        cfSin[i + 1] += Math.round(viaExplot * w);
      });
      const tirCon = calcIRR(cfCIC);
      const tirSin = viaCIC > 0 ? calcIRR(cfSin) : tirCon;
      // Tabla de flujos año por año con desglose por fuente
      const tablaFlujos = Array.from({ length: anosExplot }, (_, i) => {
        const prop = wYear[i] || 0;
        return {
          año: i + 1,
          taquilla: Math.round(
            (srcTaq *
              (cTaq[i] || 0) *
              propInversion *
              (viaExplot / (totalNetRev || 1)) *
              (totalNetRev / (srcTaq + srcMg + srcVen + srcPlat + srcTv || 1)) *
              (totalNetRev || 1)) /
              (totalNetRev || 1)
          ),
          explot: Math.round(viaExplot * prop),
          cic: i === 0 ? viaCIC : 0,
          total: Math.round(viaExplot * prop) + (i === 0 ? viaCIC : 0),
          // desglose de dónde viene el explot de este año
          dTaquilla: Math.round(srcTaq * (cTaq[i] || 0) * propInversion),
          dMg: Math.round(srcMg * (cMg[i] || 0) * propInversion),
          dVentas: Math.round(srcVen * (cVen[i] || 0) * propInversion),
          dPlat: Math.round(srcPlat * (cPlat[i] || 0) * propInversion),
          dTv: Math.round(srcTv * (cTv[i] || 0) * propInversion),
        };
      });
      return {
        ...r,
        monto,
        viaCIC,
        viaExplot,
        tirCon,
        tirSin,
        tablaFlujos,
        cfCIC,
        cfSin,
        multiplo: monto > 0 ? (viaCIC + viaExplot) / monto : 0,
      };
    });

  // TIR del coproductor
  const tirCoprod = (() => {
    const cop = R.equityRecoupRows.find((r) => r.esCoproductor);
    if (!cop) return null;
    const propInversion = totalInversion > 0 ? cop.monto / totalInversion : 0;
    const viaExplot = cop.paid + R.investorPool * propInversion;
    const incentivo = cop.incentivoMonto || 0;
    const wYear =
      totalNetRev > 0
        ? netRevYear.map((y) => y / totalNetRev)
        : netRevYear.map(() => 1 / anosExplot);
    const cf = new Array(anosExplot + 1).fill(0);
    cf[0] = -cop.monto;
    cf[1] += incentivo;
    wYear.forEach((w, i) => {
      cf[i + 1] += Math.round(viaExplot * w);
    });
    const tirV = calcIRR(cf);
    return {
      nombre: cop.nombre,
      monto: cop.monto,
      incentivo,
      viaExplot,
      tirV,
      multiplo: cop.monto > 0 ? (incentivo + viaExplot) / cop.monto : 0,
    };
  })();

  // TIR agregada para KPI header
  const tir = (() => {
    if (totalInversion <= 0) return null;
    const totalViaExplot =
      R.equityRecoupRows.reduce((s, r) => s + r.paid, 0) + R.investorPool;
    const wYear =
      totalNetRev > 0
        ? netRevYear.map((y) => y / totalNetRev)
        : netRevYear.map(() => 1 / anosExplot);
    const cf = new Array(anosExplot + 1).fill(0);
    cf[0] = -totalInversion;
    cf[1] += R.cicTotal;
    wYear.forEach((w, i) => {
      cf[i + 1] += Math.round(totalViaExplot * w);
    });
    try {
      return calcIRR(cf);
    } catch {
      return null;
    }
  })();

  const totalNecesarioRecoup =
    sDebt +
    R.equityRecoupRows.reduce((s, r) => s + r.toRecover, 0) +
    deferments +
    (retornoMin > 100
      ? totalInversion * (retornoMin / 100) - totalInversion
      : 0);
  // Años hasta recoupment: acumulado año a año hasta cubrir el recoup necesario
  const anosHastaRecoup = (() => {
    let acum = 0;
    for (let i = 0; i < anosExplot; i++) {
      acum += netRevYear[i] || 0;
      if (acum >= totalNecesarioRecoup) return i + 1;
    }
    return null;
  })();

  // ── KPIs ────────────────────────────────────────────────────────────────
  const grossBruto = R.grossBruto;
  const roiRatio = presupuesto > 0 ? grossBruto / presupuesto : 0;
  const roiColor =
    roiRatio < 0.8 ? "#E07070" : roiRatio < 1.5 ? "#C8A060" : "#70C070";

  // ── Espectadores para break-even ────────────────────────────────────────
  const netPorEsp =
    10000 *
    (1 - exhibitorSplit / 100) *
    (1 - distFeeLocal / 100) *
    (paMode === "dist" ? 1 - paDistPct / 100 : 1);
  const totalNecBE =
    sDebt +
    R.equityRecoupRows.reduce((s, r) => s + r.toRecover, 0) +
    deferments +
    (retornoMin > 100
      ? totalInversion * (retornoMin / 100) - totalInversion
      : 0);
  const espBE =
    netPorEsp > 0 ? Math.ceil((totalNecBE * 1e6) / netPorEsp) : Infinity;
  const pctBE =
    espBE > 0 && isFinite(espBE)
      ? Math.min(100, Math.round((espectadores / espBE) * 100))
      : 100;

  // ── Formato ──────────────────────────────────────────────────────────────
  const fmt = (n) => {
    if (n === null || n === undefined) return "—";
    const a = Math.abs(Math.round(n));
    return (n < 0 ? "–$" : "$") + a.toLocaleString("es-CO") + "M";
  };
  const pct = (p, t) =>
    t === 0 ? "0%" : Math.round((Math.abs(p) / Math.abs(t)) * 100) + "%";
  const fmtEsp = (n) =>
    n === Infinity
      ? "∞"
      : n >= 1e6
      ? (n / 1e6).toFixed(2) + "M esp."
      : n.toLocaleString("es-CO") + " esp.";

  // ── Modo presentación ─────────────────────────────────────────────────────
  if (presentMode) {
    const beColor = R.afterRetMin >= 0 ? "#2C6B2C" : "#8C3A2C";
    return (
      <div
        style={{
          background: "#FDFAF5",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "#1A1410",
            padding: "20px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: PD,
                fontSize: "13px",
                color: "#8A7A62",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              Simulador · Modo Presentación
            </div>
            <div
              style={{
                fontFamily: PD,
                fontSize: "28px",
                color: "#F8F4EC",
                marginTop: "4px",
              }}
            >
              Presupuesto: {fmt(presupuesto)}
            </div>
          </div>
          <button
            onClick={() => setPresentMode(false)}
            style={{
              background: "#F8F4EC",
              border: "none",
              borderRadius: "4px",
              padding: "8px 16px",
              fontFamily: PD,
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            ✕ Salir
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1px",
            background: "#BFB49C",
          }}
        >
          {[
            { label: "Gross bruto", val: fmt(grossBruto), color: "#2C4A8C" },
            {
              label: "Net revenues",
              val: fmt(R.netRevenues),
              color: "#2C6B4A",
            },
            {
              label: "Break-even",
              val: R.afterRetMin >= 0 ? "✓ Alcanzado" : "✗ No alcanzado",
              color: beColor,
            },
            {
              label: "Producers Pool",
              val: R.producerPool > 0 ? fmt(R.producerPool) : "—",
              color: "#2C6B2C",
            },
            {
              label: "Espectadores",
              val: espectadores.toLocaleString("es-CO"),
              color: "#5C2C8C",
            },
            { label: "Esp. para BE", val: fmtEsp(espBE), color: "#8C6A2C" },
            {
              label: "TIR estimada",
              val: tir !== null ? `${(tir * 100).toFixed(1)}%` : "—",
              color: "#2C6B6B",
            },
            {
              label: "Años a recoup.",
              val: anosHastaRecoup !== null ? `~${anosHastaRecoup} años` : "—",
              color: "#8C2C5C",
            },
          ].map((k, i) => (
            <div
              key={i}
              style={{
                background: "#FDFAF5",
                padding: "24px 20px",
                borderLeft: `4px solid ${k.color}`,
              }}
            >
              <div
                style={{
                  fontFamily: PD,
                  fontSize: "12px",
                  color: "#8A7A62",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                {k.label}
              </div>
              <div
                style={{
                  fontFamily: PD,
                  fontSize: "28px",
                  color: k.color,
                  fontWeight: "700",
                }}
              >
                {k.val}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <p
          style={{
            fontFamily: SS,
            fontSize: "19px",
            color: "#3D3220",
            lineHeight: 1.7,
            margin: 0,
            maxWidth: "600px",
          }}
        >
          Define el presupuesto base y los parámetros. Cifras en{" "}
          <strong>millones de pesos COP</strong>.
        </p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            onClick={() => window.print()}
            style={{
              fontFamily: PD,
              fontSize: "13px",
              padding: "8px 14px",
              background: "#F0EAE0",
              border: "1px solid #BFB49C",
              borderRadius: "4px",
              cursor: "pointer",
              color: "#1A1410",
            }}
          >
            🖨 Imprimir / PDF
          </button>
          <button
            onClick={() => setPresentMode(true)}
            style={{
              fontFamily: PD,
              fontSize: "13px",
              padding: "8px 14px",
              background: "#221C12",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              color: "#F8F4EC",
            }}
          >
            ⊞ Modo presentación
          </button>
        </div>
      </div>

      {/* ── SUB-TABS ── */}
      <div
        style={{
          display: "flex",
          gap: "0",
          marginBottom: "20px",
          borderBottom: "2px solid #D4C9B4",
        }}
      >
        {[
          ["principal", "◎ Simulador"],
          ["negociacion", "⇄ Negociación"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setSimTab(id)}
            style={{
              fontFamily: PD,
              fontSize: "14px",
              padding: "10px 16px",
              background: "none",
              border: "none",
              borderBottom:
                simTab === id ? "3px solid #2C4A8C" : "3px solid transparent",
              cursor: "pointer",
              color: simTab === id ? "#2C4A8C" : "#8A7A62",
              fontWeight: simTab === id ? "700" : "normal",
              marginBottom: "-2px",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          TAB: SIMULADOR PRINCIPAL
      ══════════════════════════════════════════════════════════════════════ */}
      {simTab === "principal" && (
        <>
          {/* ── PRESUPUESTO BASE ── */}
          <div
            style={{
              background: "linear-gradient(135deg, #2C3E6B 0%, #1E2D52 100%)",
              borderRadius: "8px",
              padding: "22px 26px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "14px",
                marginBottom: "16px",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: PD,
                    fontSize: "12px",
                    color: "#8A7A62",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}
                >
                  Presupuesto base de la película
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: PD,
                      fontSize: "42px",
                      color: "#F8F4EC",
                      lineHeight: 1,
                    }}
                  >
                    {presupuesto.toLocaleString("es-CO")}
                  </span>
                  <span
                    style={{
                      fontFamily: SS,
                      fontSize: "18px",
                      color: "#B0A080",
                    }}
                  >
                    $M COP
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {[
                  {
                    label: "Gross / Presup.",
                    val: `${roiRatio.toFixed(2)}x`,
                    color: roiColor,
                  },
                  {
                    label: "Break-even",
                    val: R.afterRetMin >= 0 ? "✓ Sí" : "✗ No",
                    color: R.afterRetMin >= 0 ? "#70C070" : "#E07070",
                  },
                  {
                    label: "TIR estimada",
                    val: tir !== null ? `${(tir * 100).toFixed(1)}%` : "—",
                    color:
                      tir !== null
                        ? tir > 0.1
                          ? "#70C070"
                          : "#C8A060"
                        : "#8A7A62",
                  },
                  {
                    label: "Años a recoup.",
                    val:
                      anosHastaRecoup !== null ? `~${anosHastaRecoup}a` : "—",
                    color: "#B0C8F0",
                  },
                  {
                    label: "Prod. Pool",
                    val: R.producerPool > 0 ? fmt(R.producerPool) : "—",
                    color: "#70C070",
                  },
                ].map((k, i) => (
                  <div
                    key={i}
                    style={{ textAlign: "center", minWidth: "72px" }}
                  >
                    <div
                      style={{
                        fontFamily: PD,
                        fontSize: "11px",
                        color: "#8A7A62",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        marginBottom: "2px",
                      }}
                    >
                      {k.label}
                    </div>
                    <div
                      style={{
                        fontFamily: PD,
                        fontSize: "22px",
                        color: k.color,
                        fontWeight: "700",
                      }}
                    >
                      {k.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <input
              type="range"
              min={100}
              max={30000}
              step={100}
              value={presupuesto}
              onChange={(e) => setPresupuesto(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#C8A060" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "4px",
              }}
            >
              <span
                style={{ fontFamily: SS, fontSize: "13px", color: "#6A5F4E" }}
              >
                $100M (corto)
              </span>
              <span
                style={{ fontFamily: SS, fontSize: "13px", color: "#6A5F4E" }}
              >
                $30.000M (largo mayor)
              </span>
            </div>

            {/* Desglose presupuesto */}
            <button
              onClick={() => setShowDesglose((d) => !d)}
              style={{
                marginTop: "14px",
                background: "none",
                border: "1px solid #6A5F4E",
                borderRadius: "4px",
                color: "#B0A080",
                fontFamily: PD,
                fontSize: "13px",
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              {showDesglose ? "▲ Ocultar desglose" : "▼ Desglosar presupuesto"}
            </button>
            {showDesglose && (
              <div
                style={{
                  marginTop: "14px",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: "10px",
                }}
              >
                {[
                  { key: "desarrollo", label: "Desarrollo (%)" },
                  { key: "produccion", label: "Producción (%)" },
                  { key: "post", label: "Post-producción (%)" },
                  { key: "contingencia", label: "Contingencia (%)" },
                  { key: "producerFee", label: "Producer fee (%)" },
                ].map(({ key, label }) => (
                  <div
                    key={key}
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: "4px",
                      padding: "10px 12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: SS,
                          fontSize: "14px",
                          color: "#B0A080",
                        }}
                      >
                        {label}
                      </span>
                      <span
                        style={{
                          fontFamily: PD,
                          fontSize: "14px",
                          color: "#C8A060",
                        }}
                      >
                        {desglose[key]}%
                      </span>
                    </div>
                    <div
                      style={{
                        fontFamily: PD,
                        fontSize: "16px",
                        color: "#F8F4EC",
                        marginBottom: "6px",
                      }}
                    >
                      {fmt((presupuesto * desglose[key]) / 100)}
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={80}
                      value={desglose[key]}
                      onChange={(e) =>
                        updateDesglose(key, Number(e.target.value))
                      }
                      style={{ width: "100%", accentColor: "#C8A060" }}
                    />
                  </div>
                ))}
                <div
                  style={{
                    background:
                      totalDesglose === 100
                        ? "rgba(44,107,44,0.3)"
                        : "rgba(140,58,44,0.3)",
                    borderRadius: "4px",
                    padding: "10px 12px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: PD,
                      fontSize: "12px",
                      color: "#B0A080",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Total asignado
                  </div>
                  <div
                    style={{
                      fontFamily: PD,
                      fontSize: "32px",
                      color: totalDesglose === 100 ? "#70C070" : "#E07070",
                      fontWeight: "700",
                    }}
                  >
                    {totalDesglose}%
                  </div>
                  {totalDesglose !== 100 && (
                    <div
                      style={{
                        fontFamily: SS,
                        fontSize: "13px",
                        color: "#E07070",
                      }}
                    >
                      Debe sumar 100%
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── CALCULADORA DE ESPECTADORES ── */}
          <div
            style={{
              border: "2px solid #2C4A8C",
              borderRadius: "8px",
              overflow: "hidden",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                background: "#2C4A8C",
                padding: "14px 20px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span style={{ fontSize: "24px" }}>🎬</span>
              <div>
                <div
                  style={{
                    fontFamily: PD,
                    fontSize: "18px",
                    color: "#F8F4EC",
                    fontWeight: "700",
                  }}
                >
                  Calculadora de Espectadores
                </div>
                <div
                  style={{
                    fontFamily: SS,
                    fontSize: "14px",
                    color: "#B0C8F0",
                    fontStyle: "italic",
                  }}
                >
                  1 espectador = $10.000 COP taquilla bruta · ¿Cuántos se
                  necesitan solo con taquilla local para llegar al break-even?
                </div>
              </div>
            </div>
            <div style={{ background: "#FDFAF5", padding: "18px 20px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginBottom: "14px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: PD,
                      fontSize: "12px",
                      color: "#6A5F4E",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    Espectadores estimados
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "6px",
                      marginBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: PD,
                        fontSize: "32px",
                        color: "#2C4A8C",
                        lineHeight: 1,
                      }}
                    >
                      {espectadores.toLocaleString("es-CO")}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={5000000}
                    step={1000}
                    value={espectadores}
                    onChange={(e) => setEsp(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#2C4A8C" }}
                  />
                  <div
                    style={{
                      fontFamily: SS,
                      fontStyle: "italic",
                      fontSize: "14px",
                      color: "#6A5F4E",
                      marginTop: "6px",
                    }}
                  >
                    ={" "}
                    <strong style={{ color: "#2C4A8C" }}>
                      {fmt(taquilla)}
                    </strong>{" "}
                    taquilla bruta — vinculado con el slider de ingresos
                  </div>
                </div>
                <div
                  style={{
                    background: pctBE >= 100 ? "#EEF8EE" : "#FFF8EE",
                    border: `2px solid ${pctBE >= 100 ? "#2C6B2C" : "#B05C18"}`,
                    borderRadius: "6px",
                    padding: "16px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: PD,
                      fontSize: "12px",
                      color: "#6A5F4E",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    Break-even solo con taquilla local
                  </div>
                  <div
                    style={{
                      fontFamily: PD,
                      fontSize: "24px",
                      color: pctBE >= 100 ? "#2C6B2C" : "#8C3A2C",
                      fontWeight: "700",
                      lineHeight: 1,
                      marginBottom: "6px",
                    }}
                  >
                    {fmtEsp(espBE)}
                  </div>
                  <div
                    style={{
                      fontFamily: SS,
                      fontSize: "16px",
                      color: "#3D3220",
                      marginBottom: "12px",
                    }}
                  >
                    {pctBE >= 100 ? (
                      "✓ Break-even alcanzado"
                    ) : (
                      <>
                        Faltan{" "}
                        <strong style={{ color: "#8C3A2C" }}>
                          {fmtEsp(Math.max(0, espBE - espectadores))}
                        </strong>
                      </>
                    )}
                  </div>
                  <div
                    style={{
                      height: "8px",
                      background: "#E8E2D8",
                      borderRadius: "4px",
                      overflow: "hidden",
                      marginBottom: "4px",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        background:
                          pctBE >= 100
                            ? "#2C6B2C"
                            : pctBE >= 60
                            ? "#C8A060"
                            : "#8C3A2C",
                        width: `${pctBE}%`,
                        transition: "width 0.4s ease",
                        borderRadius: "4px",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontFamily: PD,
                      fontSize: "14px",
                      color: "#6A5F4E",
                    }}
                  >
                    {pctBE}% cubierto
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "8px",
                }}
              >
                {[
                  {
                    label: "Taquilla bruta / esp.",
                    value: "$10.000",
                    note: "Precio promedio boleta Colombia",
                  },
                  {
                    label: "Neto al productor / esp.",
                    value: `$${Math.round(netPorEsp).toLocaleString("es-CO")}`,
                    note: `Exhibidor ${exhibitorSplit}% + dist. ${distFeeLocal}%${
                      paMode === "dist" ? ` + P&A ${paDistPct}%` : ""
                    }`,
                  },
                  {
                    label: "Total que debe recuperar",
                    value: fmt(totalNecBE),
                    note: "Deuda + equity + deferments + ret. mín.",
                  },
                ].map((k, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#F0EAE0",
                      borderRadius: "4px",
                      padding: "10px 12px",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: PD,
                        fontSize: "11px",
                        color: "#8A7A62",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        marginBottom: "4px",
                      }}
                    >
                      {k.label}
                    </div>
                    <div
                      style={{
                        fontFamily: PD,
                        fontSize: "20px",
                        color: "#2C4A8C",
                        fontWeight: "700",
                      }}
                    >
                      {k.value}
                    </div>
                    <div
                      style={{
                        fontFamily: SS,
                        fontSize: "13px",
                        color: "#8A7A62",
                        marginTop: "2px",
                      }}
                    >
                      {k.note}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── PARÁMETROS VERTICALES ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0",
              marginBottom: "20px",
            }}
          >
            {/* INGRESOS */}
            <Panel
              title="I · Fuentes de ingresos — Gross Revenues"
              color="#2C4A8C"
              first
            >
              <SliderRow
                label="Box office bruto ($M)"
                val={taquilla}
                set={setTaq}
                min={0}
                max={20000}
                color="#2C4A8C"
              />
              <div
                style={{
                  background: "#F0EAE0",
                  borderRadius: "4px",
                  padding: "10px 12px",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span
                  style={{ fontFamily: SS, fontSize: "16px", color: "#3D3220" }}
                >
                  = {espectadores.toLocaleString("es-CO")} espectadores
                </span>
                <input
                  type="range"
                  min={0}
                  max={5000000}
                  step={1000}
                  value={espectadores}
                  onChange={(e) => setEsp(Number(e.target.value))}
                  style={{ flex: 1, accentColor: "#2C4A8C" }}
                />
              </div>
              <SliderRow
                label="Ventas int'l — royalties ($M)"
                val={ventasInt}
                set={setVentasInt}
                min={0}
                max={5000}
                color="#3A7A5A"
              />
              <SliderRow
                label="Plataformas SVOD/AVOD ($M)"
                val={plataformas}
                set={setPlat}
                min={0}
                max={5000}
                color="#5C2C8C"
              />
              <SliderRow
                label="TV (abierta + paga) ($M)"
                val={tv}
                set={setTv}
                min={0}
                max={2000}
                color="#8C6A2C"
              />
              {/* MG toggle */}
              <div
                style={{
                  borderTop: "1px solid #E8E2D8",
                  paddingTop: "12px",
                  marginTop: "4px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={mgActivo}
                    onChange={(e) => setMgActivo(e.target.checked)}
                    style={{ marginTop: "3px", accentColor: "#2C6B4A" }}
                  />
                  <div>
                    <span
                      style={{
                        fontFamily: PD,
                        fontSize: "15px",
                        color: "#2C6B4A",
                      }}
                    >
                      Incluir MG internacional <Tip term="MG" />
                    </span>
                    <div
                      style={{
                        fontFamily: SS,
                        fontStyle: "italic",
                        fontSize: "13px",
                        color: "#8A7A62",
                        lineHeight: 1.4,
                        marginTop: "2px",
                      }}
                    >
                      En el mercado actual, los MGs son poco frecuentes en cine
                      independiente.
                    </div>
                  </div>
                </label>
                {mgActivo && (
                  <div style={{ marginTop: "10px" }}>
                    <SliderRow
                      label="MG advance ($M)"
                      val={mgInt}
                      set={setMgInt}
                      min={0}
                      max={10000}
                      color="#2C6B4A"
                      tip="MG"
                    />
                    <div
                      style={{
                        fontFamily: SS,
                        fontStyle: "italic",
                        fontSize: "13px",
                        color: "#B05C18",
                      }}
                    >
                      ⚠ Este advance se descuenta de los royalties futuros del
                      territorio.
                    </div>
                  </div>
                )}
              </div>
            </Panel>

            {/* DISTRIBUCIÓN */}
            <Panel title="II · Distribución — Fees & P&A" color="#8C3A2C">
              <div
                style={{
                  fontFamily: PD,
                  fontSize: "12px",
                  color: "#6A5F4E",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                Local — directo al productor
              </div>
              <SliderRow
                label="Exhibidor retiene (%)"
                val={exhibitorSplit}
                set={setExhibitorSplit}
                min={30}
                max={60}
                unit="%"
                color="#6A5F4E"
              />
              <SliderRow
                label="Comisión distribuidor local (%)"
                val={distFeeLocal}
                set={setDistFeeLocal}
                min={5}
                max={40}
                unit="%"
                color="#8C3A2C"
              />
              <div
                style={{
                  fontFamily: PD,
                  fontSize: "12px",
                  color: "#9A6040",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  margin: "14px 0 10px",
                  borderTop: "1px solid #E8E2D8",
                  paddingTop: "12px",
                }}
              >
                Internacional — cadena combinada <Tip term="Cadena int'l" />
              </div>
              <SliderRow
                label="Cadena int'l combinada (%)"
                val={cadenaIntPct}
                set={setCadenaIntPct}
                min={15}
                max={55}
                unit="%"
                color="#9A6040"
              />
              <div
                style={{
                  fontFamily: SS,
                  fontStyle: "italic",
                  fontSize: "13px",
                  color: "#8A7A62",
                  marginBottom: "12px",
                }}
              >
                Dist. territorial ~20–25% + sales agent ~10–15%.
              </div>
              {/* P&A */}
              <div
                style={{
                  fontFamily: PD,
                  fontSize: "12px",
                  color: "#C05030",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  margin: "14px 0 10px",
                  borderTop: "1px solid #E8E2D8",
                  paddingTop: "12px",
                }}
              >
                Modelo P&A <Tip term="P&A" />
              </div>
              <div
                style={{ display: "flex", gap: "8px", marginBottom: "10px" }}
              >
                {[
                  ["dist", "Adelantado por distribuidor"],
                  ["prod", "Pre-financiado por productor"],
                ].map(([v, l]) => (
                  <button
                    key={v}
                    onClick={() => setPaMode(v)}
                    style={{
                      flex: 1,
                      padding: "7px 6px",
                      fontFamily: SS,
                      fontSize: "14px",
                      cursor: "pointer",
                      borderRadius: "3px",
                      background: paMode === v ? "#8C3A2C" : "#F8F4EC",
                      color: paMode === v ? "#fff" : "#3D3220",
                      border: `1px solid ${
                        paMode === v ? "#8C3A2C" : "#D4C9B4"
                      }`,
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
              {paMode === "dist" ? (
                <SliderRow
                  label={`P&A (% taquilla neta al dist.)`}
                  val={paDistPct}
                  set={setPaDistPct}
                  min={0}
                  max={50}
                  unit="%"
                  color="#C05030"
                />
              ) : (
                <div
                  style={{
                    fontFamily: SS,
                    fontSize: "15px",
                    color: "#8A7A62",
                    fontStyle: "italic",
                    background: "#FFF4EC",
                    padding: "10px",
                    borderRadius: "4px",
                    borderLeft: "3px solid #C05030",
                  }}
                >
                  P&A de {fmt(paProdM)} incluido en el presupuesto del
                  inversionista. No genera deducción adicional en el waterfall.
                </div>
              )}
            </Panel>

            {/* RECOUPMENT */}
            <Panel
              title="IV–VI · Recoupment, Deferments y Back End"
              color="#5C2C8C"
            >
              <SliderRow
                label="Deuda senior ($M)"
                val={sDebt}
                set={setSDebt}
                min={0}
                max={5000}
                color="#5C2C8C"
              />
              <SliderRow
                label={`Deferments ($M)`}
                val={deferments}
                set={setDeferments}
                min={0}
                max={1000}
                color="#2C6B6B"
                tip="Deferments"
              />
              <SliderRow
                label="Retorno mínimo garantizado (%)"
                val={retornoMin}
                set={setRetornoMin}
                min={100}
                max={150}
                unit="%"
                color="#8C2C5C"
              />
              <div
                style={{
                  borderTop: "1px solid #E8E2D8",
                  paddingTop: "12px",
                  marginTop: "4px",
                }}
              >
                <SliderRow
                  label="Split al inversionista en back end (%)"
                  val={investorSplitPct}
                  set={setInvestorSplitPct}
                  min={30}
                  max={70}
                  unit="%"
                  color="#5C2C8C"
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    background: "#F5F0FB",
                    padding: "8px 12px",
                    borderRadius: "4px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: SS,
                      fontSize: "15px",
                      color: "#5C2C8C",
                    }}
                  >
                    Split inv. {investorSplitPct}% / prod.{" "}
                    {100 - investorSplitPct}%
                  </span>
                </div>
              </div>
              {/* ── BACK END — TERCEROS ── */}
              <div
                style={{
                  borderTop: "2px solid #E0D8C8",
                  paddingTop: "14px",
                  marginTop: "14px",
                }}
              >
                <div
                  style={{
                    fontFamily: PD,
                    fontSize: "12px",
                    color: "#2C6B2C",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Back End — Participantes de terceros
                </div>
                <div
                  style={{
                    fontFamily: SS,
                    fontSize: "13px",
                    color: "#6A5F4E",
                    fontStyle: "italic",
                    marginBottom: "10px",
                    lineHeight: 1.5,
                  }}
                >
                  Actores, director, escritor u otros que negociaron "puntos"
                  sobre el back end. Se descuentan del excedente <em>antes</em>{" "}
                  del profit split productor / inversionista. Elige la base:{" "}
                  <strong>sobre el excedente total</strong> (antes del split) o{" "}
                  <strong>sobre el pool del productor</strong> (acuerdo
                  bilateral que no afecta al inversionista).
                </div>
                {backEndParticipantes.map((p3, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "#F0F8F0",
                      border: "1px solid #2C6B2C44",
                      borderRadius: "4px",
                      padding: "10px 12px",
                      marginBottom: "8px",
                      borderLeft: "3px solid #2C6B2C",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "6px",
                      }}
                    >
                      <input
                        value={p3.nombre}
                        onChange={(e) =>
                          setBackEndParticipantes((p) =>
                            p.map((x, i) =>
                              i === idx ? { ...x, nombre: e.target.value } : x
                            )
                          )
                        }
                        style={{
                          fontFamily: PD,
                          fontSize: "15px",
                          border: "none",
                          background: "transparent",
                          color: "#2C4A2C",
                          flex: 1,
                          outline: "none",
                        }}
                      />
                      <button
                        onClick={() =>
                          setBackEndParticipantes((p) =>
                            p.filter((_, i) => i !== idx)
                          )
                        }
                        style={{
                          background: "none",
                          border: "none",
                          color: "#8C3A2C",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        ✕
                      </button>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "8px",
                        marginBottom: "6px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontFamily: SS,
                            fontSize: "12px",
                            color: "#6A5F4E",
                            marginBottom: "2px",
                          }}
                        >
                          % del back end
                        </div>
                        <input
                          type="range"
                          min={0.5}
                          max={25}
                          step={0.5}
                          value={p3.pct}
                          onChange={(e) =>
                            setBackEndParticipantes((p) =>
                              p.map((x, i) =>
                                i === idx
                                  ? { ...x, pct: Number(e.target.value) }
                                  : x
                              )
                            )
                          }
                          style={{ width: "100%", accentColor: "#2C6B2C" }}
                        />
                        <div
                          style={{
                            fontFamily: PD,
                            fontSize: "15px",
                            color: "#2C6B2C",
                            fontWeight: "700",
                          }}
                        >
                          {p3.pct}%
                          <span
                            style={{
                              fontFamily: SS,
                              fontSize: "12px",
                              color: "#6A5F4E",
                              marginLeft: "6px",
                            }}
                          >
                            ≈{" "}
                            {fmt(
                              R.afterRetMin > 0
                                ? ((p3.base === "total"
                                    ? R.afterRetMin
                                    : R.producerPoolBruto) *
                                    p3.pct) /
                                    100
                                : 0
                            )}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontFamily: SS,
                            fontSize: "12px",
                            color: "#6A5F4E",
                            marginBottom: "2px",
                          }}
                        >
                          Base del cálculo
                        </div>
                        <select
                          value={p3.base}
                          onChange={(e) =>
                            setBackEndParticipantes((p) =>
                              p.map((x, i) =>
                                i === idx ? { ...x, base: e.target.value } : x
                              )
                            )
                          }
                          style={{
                            fontFamily: SS,
                            fontSize: "13px",
                            border: "1px solid #BFB49C",
                            borderRadius: "3px",
                            padding: "4px 7px",
                            background: "#fff",
                            width: "100%",
                          }}
                        >
                          <option value="total">% del excedente total</option>
                          <option value="productor">
                            % del pool del productor
                          </option>
                        </select>
                        <div
                          style={{
                            fontFamily: SS,
                            fontSize: "11px",
                            color: "#6A5F4E",
                            marginTop: "3px",
                            fontStyle: "italic",
                          }}
                        >
                          {p3.base === "total"
                            ? "Sale antes del split prod./inv."
                            : "Solo afecta al productor"}
                        </div>
                      </div>
                    </div>
                    <select
                      value={p3.tipo}
                      onChange={(e) =>
                        setBackEndParticipantes((p) =>
                          p.map((x, i) =>
                            i === idx ? { ...x, tipo: e.target.value } : x
                          )
                        )
                      }
                      style={{
                        fontFamily: SS,
                        fontSize: "13px",
                        border: "1px solid #BFB49C",
                        borderRadius: "3px",
                        padding: "4px 7px",
                        background: "#fff",
                        width: "100%",
                      }}
                    >
                      <option value="actor">Actor / Actriz principal</option>
                      <option value="director">Director</option>
                      <option value="escritor">Escritor / Guionista</option>
                      <option value="productor_ejecutivo">
                        Productor ejecutivo
                      </option>
                      <option value="compositor">
                        Compositor / Música original
                      </option>
                      <option value="otro">Otro participante</option>
                    </select>
                  </div>
                ))}
                <button
                  onClick={() =>
                    setBackEndParticipantes((p) => [
                      ...p,
                      {
                        nombre: "Actor principal",
                        pct: 5,
                        base: "total",
                        tipo: "actor",
                      },
                    ])
                  }
                  style={{
                    fontFamily: PD,
                    fontSize: "13px",
                    background: "#2C6B2C",
                    color: "#fff",
                    border: "none",
                    borderRadius: "3px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  + Agregar participante en back end
                </button>
              </div>
            </Panel>

            {/* INVERSIONISTAS */}
            <Panel title="V · Inversionistas — Equity" color="#8C6A2C" last>
              {/* ── RESUMEN FINANCIAMIENTO ── */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #2C1A08 0%, #3D2810 100%)",
                  borderRadius: "6px",
                  padding: "14px 16px",
                  marginBottom: "14px",
                }}
              >
                <div
                  style={{
                    fontFamily: PD,
                    fontSize: "11px",
                    color: "#8A7A62",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                  }}
                >
                  Estructura de financiamiento
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0",
                    height: "28px",
                    borderRadius: "4px",
                    overflow: "hidden",
                    marginBottom: "8px",
                  }}
                >
                  {totalSoftMoney > 0 && (
                    <div
                      title={`Soft money: $${totalSoftMoney.toLocaleString(
                        "es-CO"
                      )}M`}
                      style={{
                        width: `${Math.round(
                          (totalSoftMoney / presupuesto) * 100
                        )}%`,
                        background: "#2C6B6B",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: "2px",
                      }}
                    >
                      {totalSoftMoney / presupuesto > 0.08 && (
                        <span
                          style={{
                            fontFamily: PD,
                            fontSize: "12px",
                            color: "#fff",
                            fontWeight: "700",
                          }}
                        >
                          {Math.round((totalSoftMoney / presupuesto) * 100)}%
                        </span>
                      )}
                    </div>
                  )}
                  {coProd && coProdTipo === "equity" && coProdMonto > 0 && (
                    <div
                      title={`${coProdNombre} (coproductor equity): $${coProdMonto.toLocaleString(
                        "es-CO"
                      )}M`}
                      style={{
                        width: `${Math.round(
                          (coProdMonto / presupuesto) * 100
                        )}%`,
                        background: "#1A7A6A",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: "2px",
                      }}
                    >
                      {coProdMonto / presupuesto > 0.08 && (
                        <span
                          style={{
                            fontFamily: PD,
                            fontSize: "12px",
                            color: "#fff",
                            fontWeight: "700",
                          }}
                        >
                          {Math.round((coProdMonto / presupuesto) * 100)}%
                        </span>
                      )}
                    </div>
                  )}
                  {inversionistasConMonto.map((inv, i) => (
                    <div
                      key={i}
                      title={`${inv.nombre}: $${inv.monto.toLocaleString(
                        "es-CO"
                      )}M`}
                      style={{
                        width: `${Math.round(
                          (inv.monto / presupuesto) * 100
                        )}%`,
                        background: [
                          "#8C6A2C",
                          "#2C4A8C",
                          "#5C2C8C",
                          "#2C6B4A",
                          "#8C3A2C",
                        ][i % 5],
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: "2px",
                      }}
                    >
                      {inv.monto / presupuesto > 0.08 && (
                        <span
                          style={{
                            fontFamily: PD,
                            fontSize: "12px",
                            color: "#fff",
                            fontWeight: "700",
                          }}
                        >
                          {Math.round((inv.monto / presupuesto) * 100)}%
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${
                      coProd && coProdTipo === "equity" ? 4 : 3
                    }, 1fr)`,
                    gap: "8px",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontFamily: SS,
                        fontSize: "12px",
                        color: "#8A7A62",
                      }}
                    >
                      Presupuesto
                    </div>
                    <div
                      style={{
                        fontFamily: PD,
                        fontSize: "20px",
                        color: "#F8F4EC",
                        fontWeight: "700",
                      }}
                    >
                      {fmt(presupuesto)}
                    </div>
                  </div>
                  {totalSoftMoney > 0 && (
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontFamily: SS,
                          fontSize: "12px",
                          color: "#2C9B9B",
                        }}
                      >
                        Soft money
                      </div>
                      <div
                        style={{
                          fontFamily: PD,
                          fontSize: "20px",
                          color: "#4CC8C8",
                          fontWeight: "700",
                        }}
                      >
                        {fmt(totalSoftMoney)}
                      </div>
                    </div>
                  )}
                  {coProd && coProdTipo === "equity" && (
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontFamily: SS,
                          fontSize: "12px",
                          color: "#4CC8A8",
                        }}
                      >
                        {coProdNombre}
                      </div>
                      <div
                        style={{
                          fontFamily: PD,
                          fontSize: "20px",
                          color: "#70E8C8",
                          fontWeight: "700",
                        }}
                      >
                        {fmt(coProdMonto)}
                      </div>
                    </div>
                  )}
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontFamily: SS,
                        fontSize: "12px",
                        color: "#C8A060",
                      }}
                    >
                      Equity Colombia
                    </div>
                    <div
                      style={{
                        fontFamily: PD,
                        fontSize: "20px",
                        color: "#E8C070",
                        fontWeight: "700",
                      }}
                    >
                      {fmt(equityPrivado)}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── SOFT MONEY ── */}
              <div style={{ marginBottom: "14px" }}>
                <div
                  style={{
                    fontFamily: PD,
                    fontSize: "12px",
                    color: "#2C6B6B",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  Soft money — recursos no reembolsables
                </div>
                {softMoney.map((sm, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "#EEF8F8",
                      border: "1px solid #2C6B6B44",
                      borderRadius: "4px",
                      padding: "10px 12px",
                      marginBottom: "6px",
                      borderLeft: "3px solid #2C6B6B",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "6px",
                      }}
                    >
                      <input
                        value={sm.nombre}
                        onChange={(e) =>
                          setSoftMoney((p) =>
                            p.map((x, i) =>
                              i === idx ? { ...x, nombre: e.target.value } : x
                            )
                          )
                        }
                        style={{
                          fontFamily: PD,
                          fontSize: "15px",
                          border: "none",
                          background: "transparent",
                          color: "#2C4A2C",
                          flex: 1,
                          outline: "none",
                        }}
                      />
                      <button
                        onClick={() =>
                          setSoftMoney((p) => p.filter((_, i) => i !== idx))
                        }
                        style={{
                          background: "none",
                          border: "none",
                          color: "#8C3A2C",
                          cursor: "pointer",
                          fontSize: "14px",
                          padding: "0 4px",
                        }}
                      >
                        ✕
                      </button>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <input
                          type="range"
                          min={10}
                          max={Math.max(presupuesto - 100, 100)}
                          step={10}
                          value={sm.monto}
                          onChange={(e) =>
                            setSoftMoney((p) =>
                              p.map((x, i) =>
                                i === idx
                                  ? { ...x, monto: Number(e.target.value) }
                                  : x
                              )
                            )
                          }
                          style={{ width: "100%", accentColor: "#2C6B6B" }}
                        />
                      </div>
                      <div
                        style={{
                          fontFamily: PD,
                          fontSize: "16px",
                          color: "#2C6B6B",
                          fontWeight: "700",
                          textAlign: "right",
                        }}
                      >
                        {fmt(sm.monto)}
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() =>
                    setSoftMoney((p) => [
                      ...p,
                      {
                        nombre: "Soft money",
                        monto: Math.min(
                          300,
                          Math.max(10, Math.round(presupuesto * 0.1))
                        ),
                      },
                    ])
                  }
                  style={{
                    fontFamily: PD,
                    fontSize: "13px",
                    background: "#2C6B6B",
                    color: "#fff",
                    border: "none",
                    borderRadius: "3px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  + Agregar soft money
                </button>
              </div>

              {/* ── INVERSIONISTAS EQUITY ── */}
              <div
                style={{ borderTop: "2px solid #E0D8C8", paddingTop: "12px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: PD,
                      fontSize: "12px",
                      color: "#8C6A2C",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                    }}
                  >
                    Inversionistas privados — {fmt(equityTotal)}
                  </div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={useCIC}
                      onChange={(e) => setUseCIC(e.target.checked)}
                      style={{
                        accentColor: "#2C4A8C",
                        width: "14px",
                        height: "14px",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: SS,
                        fontSize: "14px",
                        color: "#2C4A8C",
                      }}
                    >
                      CIC activo <Tip term="CIC" />
                    </span>
                  </label>
                </div>
                {inversionistas.map((inv, idx) => {
                  const montoAbs = inversionistasConMonto[idx].monto;
                  return (
                    <div
                      key={idx}
                      style={{
                        background: "#F8F4EC",
                        borderRadius: "4px",
                        padding: "10px 12px",
                        marginBottom: "8px",
                        border: "1px solid #E0D8C8",
                        borderLeft: `3px solid ${
                          [
                            "#8C6A2C",
                            "#2C4A8C",
                            "#5C2C8C",
                            "#2C6B4A",
                            "#8C3A2C",
                          ][idx % 5]
                        }`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "6px",
                        }}
                      >
                        <input
                          value={inv.nombre}
                          onChange={(e) =>
                            setInversionistas((p) =>
                              p.map((x, i) =>
                                i === idx ? { ...x, nombre: e.target.value } : x
                              )
                            )
                          }
                          style={{
                            fontFamily: PD,
                            fontSize: "16px",
                            border: "none",
                            background: "transparent",
                            color: "#1A1410",
                            flex: 1,
                            outline: "none",
                          }}
                        />
                        {inversionistas.length > 1 && (
                          <button
                            onClick={() => eliminarInversionista(idx)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#8C3A2C",
                              cursor: "pointer",
                              fontSize: "14px",
                            }}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      {/* Porcentaje del equity — el slider principal */}
                      <div style={{ marginBottom: "6px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "3px",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: SS,
                              fontSize: "13px",
                              color: "#6A5F4E",
                            }}
                          >
                            % del equity
                          </span>
                          <span
                            style={{
                              fontFamily: PD,
                              fontSize: "15px",
                              color: "#8C6A2C",
                              fontWeight: "700",
                            }}
                          >
                            {inv.pct}% = {fmt(montoAbs)}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={99}
                          value={inv.pct}
                          onChange={(e) =>
                            setInversionistas((p) =>
                              redistribuir(p, idx, Number(e.target.value))
                            )
                          }
                          style={{ width: "100%", accentColor: "#8C6A2C" }}
                        />
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "8px",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontFamily: SS,
                              fontSize: "12px",
                              color: "#6A5F4E",
                              marginBottom: "2px",
                            }}
                          >
                            Prioridad de recoupment
                          </div>
                          <input
                            type="range"
                            min={1}
                            max={5}
                            value={inv.prioridad}
                            onChange={(e) =>
                              setInversionistas((p) =>
                                p.map((x, i) =>
                                  i === idx
                                    ? {
                                        ...x,
                                        prioridad: Number(e.target.value),
                                      }
                                    : x
                                )
                              )
                            }
                            style={{ width: "100%", accentColor: "#5C2C8C" }}
                          />
                          <div
                            style={{
                              fontFamily: PD,
                              fontSize: "14px",
                              color: "#5C2C8C",
                              textAlign: "right",
                            }}
                          >
                            #{inv.prioridad}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontFamily: SS,
                                fontSize: "12px",
                                color: "#6A5F4E",
                                marginBottom: "3px",
                              }}
                            >
                              Incentivo tributario
                            </div>
                            <select
                              value={inv.incentivo || "ninguno"}
                              onChange={(e) =>
                                setInversionistas((p) =>
                                  p.map((x, i) =>
                                    i === idx
                                      ? { ...x, incentivo: e.target.value }
                                      : x
                                  )
                                )
                              }
                              style={{
                                fontFamily: SS,
                                fontSize: "13px",
                                border: "1px solid #BFB49C",
                                borderRadius: "3px",
                                padding: "4px 7px",
                                background: "#fff",
                                color: "#2C4A2C",
                                width: "100%",
                              }}
                            >
                              <option value="ninguno">Sin incentivo</option>
                              <option value="CIC">CIC — Ley 814/2003</option>
                              <option value="CoCrea">
                                CoCrea — Ley 1955/2019
                              </option>
                            </select>
                            {inv.incentivo &&
                              inv.incentivo !== "ninguno" &&
                              useCIC && (
                                <div
                                  style={{
                                    fontFamily: SS,
                                    fontSize: "12px",
                                    color: "#2C4A8C",
                                    marginTop: "4px",
                                    background: "#EEF2FB",
                                    padding: "4px 7px",
                                    borderRadius: "3px",
                                  }}
                                >
                                  {inv.incentivo}: DIAN{" "}
                                  {fmt(Math.floor(montoAbs * 0.5775))} · Por
                                  explot. {fmt(Math.ceil(montoAbs * 0.4225))}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <button
                  onClick={agregarInversionista}
                  style={{
                    fontFamily: PD,
                    fontSize: "13px",
                    background: "#8C6A2C",
                    color: "#fff",
                    border: "none",
                    borderRadius: "3px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  + Agregar inversionista
                </button>
              </div>
              {/* Co-producción */}
              <div
                style={{
                  borderTop: "1px solid #E8E2D8",
                  paddingTop: "12px",
                  marginTop: "12px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    marginBottom: "10px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={coProd}
                    onChange={(e) => setCoProd(e.target.checked)}
                    style={{
                      accentColor: "#2C6B6B",
                      width: "15px",
                      height: "15px",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: PD,
                      fontSize: "14px",
                      color: "#2C6B6B",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    Co-producción internacional
                  </span>
                </label>
                {coProd && (
                  <div
                    style={{
                      background: "#EEF8F8",
                      borderRadius: "6px",
                      padding: "14px",
                      border: "1px solid #2C6B6B33",
                    }}
                  >
                    {/* Nombre y aporte */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px",
                        marginBottom: "12px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontFamily: SS,
                            fontSize: "13px",
                            color: "#2C6B6B",
                            marginBottom: "4px",
                          }}
                        >
                          País / empresa co-productora
                        </div>
                        <input
                          value={coProdNombre}
                          onChange={(e) => setCoProdNombre(e.target.value)}
                          style={{
                            fontFamily: PD,
                            fontSize: "15px",
                            border: "1px solid #BFB49C",
                            borderRadius: "3px",
                            padding: "5px 8px",
                            width: "100%",
                            background: "#fff",
                          }}
                        />
                      </div>
                      <div>
                        <div
                          style={{
                            fontFamily: SS,
                            fontSize: "13px",
                            color: "#2C6B6B",
                            marginBottom: "4px",
                          }}
                        >
                          Aporte — % del presupuesto total
                        </div>
                        <input
                          type="range"
                          min={5}
                          max={90}
                          value={coProdPct}
                          onChange={(e) => setCoProdPct(Number(e.target.value))}
                          style={{ width: "100%", accentColor: "#2C6B6B" }}
                        />
                        <div
                          style={{
                            fontFamily: PD,
                            fontSize: "16px",
                            color: "#2C6B6B",
                            textAlign: "right",
                            fontWeight: "700",
                          }}
                        >
                          {coProdPct}% = {fmt(coProdMonto)}
                        </div>
                      </div>
                    </div>

                    {/* Tipo de aporte */}
                    <div style={{ marginBottom: "12px" }}>
                      <div
                        style={{
                          fontFamily: SS,
                          fontSize: "13px",
                          color: "#2C6B6B",
                          marginBottom: "6px",
                        }}
                      >
                        ¿Cómo entra este aporte al waterfall?
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        {[
                          [
                            "equity",
                            "Equity — inversionistas del coproductor con recoupment",
                            "Los inversionistas del coproductor recuperan su capital en el waterfall según la prioridad acordada",
                          ],
                          [
                            "soft_money",
                            "Soft money / subsidio",
                            "Subsidio no reembolsable (grant, FDC extranjero, Ibermedia). Reduce el equity privado pero no genera derecho de recoupment. CoCrea no es soft money — es un mecanismo de inversión con beneficio tributario, análogo al CIC.",
                          ],
                        ].map(([val, lbl, desc]) => (
                          <label
                            key={val}
                            style={{
                              flex: 1,
                              cursor: "pointer",
                              background:
                                coProdTipo === val ? "#fff" : "#F5F0E8",
                              border: `2px solid ${
                                coProdTipo === val ? "#2C6B6B" : "#BFB49C"
                              }`,
                              borderRadius: "4px",
                              padding: "8px 10px",
                            }}
                          >
                            <input
                              type="radio"
                              name="coProdTipo"
                              value={val}
                              checked={coProdTipo === val}
                              onChange={() => setCoProdTipo(val)}
                              style={{
                                accentColor: "#2C6B6B",
                                marginRight: "6px",
                              }}
                            />
                            <span
                              style={{
                                fontFamily: PD,
                                fontSize: "14px",
                                color: "#2C6B6B",
                                fontWeight: "700",
                              }}
                            >
                              {lbl}
                            </span>
                            <div
                              style={{
                                fontFamily: SS,
                                fontSize: "12px",
                                color: "#6A5F4E",
                                marginTop: "3px",
                                lineHeight: 1.4,
                              }}
                            >
                              {desc}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Si es equity: prioridad de recoupment */}
                    {coProdTipo === "equity" && (
                      <div
                        style={{
                          marginBottom: "12px",
                          background: "#fff",
                          borderRadius: "4px",
                          padding: "10px 12px",
                          border: "1px solid #2C6B6B33",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: SS,
                            fontSize: "13px",
                            color: "#2C6B6B",
                            marginBottom: "6px",
                            fontWeight: "600",
                          }}
                        >
                          Prioridad de recoupment
                        </div>
                        <select
                          value={coProdModo}
                          onChange={(e) => setCoProdModo(e.target.value)}
                          style={{
                            fontFamily: SS,
                            fontSize: "14px",
                            border: "1px solid #BFB49C",
                            borderRadius: "3px",
                            padding: "5px 8px",
                            width: "100%",
                            background: "#fff",
                            marginBottom: "8px",
                          }}
                        >
                          <option value="prioridad">
                            Primera prioridad — recupera antes que todos los
                            demás
                          </option>
                          <option value="pari_passu">
                            Pari passu — comparte tramo con inversionistas
                            colombianos
                          </option>
                          <option value="subordinado">
                            Subordinado — recupera después de todos los
                            inversionistas colombianos
                          </option>
                        </select>
                        {coProdModo === "pari_passu" && (
                          <div>
                            <div
                              style={{
                                fontFamily: SS,
                                fontSize: "12px",
                                color: "#6A5F4E",
                                marginBottom: "4px",
                              }}
                            >
                              Comparte tramo con inversionistas en prioridad n°:
                            </div>
                            <input
                              type="range"
                              min={1}
                              max={Math.max(1, inversionistas.length)}
                              step={1}
                              value={coProdPrioridad}
                              onChange={(e) =>
                                setCoProdPrioridad(Number(e.target.value))
                              }
                              style={{ width: "100%", accentColor: "#2C6B6B" }}
                            />
                            <div
                              style={{
                                fontFamily: PD,
                                fontSize: "14px",
                                color: "#2C6B6B",
                                textAlign: "right",
                              }}
                            >
                              Prioridad {coProdPrioridad} — pari passu con:{" "}
                              {inversionistas
                                .filter((i) => i.prioridad === coProdPrioridad)
                                .map((i) => i.nombre)
                                .join(", ") || "(ninguno en esa posición)"}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Incentivo del país coproductor — solo cuando hay equity */}
                    {coProdTipo === "equity" && (
                      <div style={{ marginBottom: "10px" }}>
                        <div
                          style={{
                            fontFamily: SS,
                            fontSize: "13px",
                            color: "#2C6B6B",
                            marginBottom: "4px",
                          }}
                        >
                          Incentivo del país co-productor
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            marginBottom: "8px",
                          }}
                        >
                          {[
                            ["none", "Sin incentivo"],
                            ["incentivo", "Con incentivo"],
                          ].map(([val, lbl]) => (
                            <button
                              key={val}
                              onClick={() => setCoProdIncentivo(val)}
                              style={{
                                flex: 1,
                                fontFamily: PD,
                                fontSize: "13px",
                                padding: "7px 0",
                                background:
                                  coProdIncentivo === val
                                    ? "#2C6B6B"
                                    : "#F5FAFA",
                                color:
                                  coProdIncentivo === val ? "#fff" : "#2C6B6B",
                                border: "1.5px solid #2C6B6B",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontWeight:
                                  coProdIncentivo === val ? "700" : "normal",
                              }}
                            >
                              {lbl}
                            </button>
                          ))}
                        </div>
                        {coProdIncentivo === "incentivo" && (
                          <div
                            style={{
                              background: "#fff",
                              borderRadius: "4px",
                              padding: "10px 12px",
                              border: "1px solid #2C6B6B33",
                            }}
                          >
                            <div
                              style={{
                                fontFamily: SS,
                                fontSize: "12px",
                                color: "#3D3220",
                                marginBottom: "8px",
                                lineHeight: 1.5,
                              }}
                            >
                              El incentivo del país coproductor (rebate, tax
                              credit, EFICINE, etc.) reduce el monto que sus
                              inversionistas deben recuperar por explotación en
                              el waterfall — funcionalmente idéntico al CIC para
                              el lado colombiano.
                            </div>
                            <div style={{ marginBottom: "6px" }}>
                              <div
                                style={{
                                  fontFamily: SS,
                                  fontSize: "12px",
                                  color: "#6A5F4E",
                                  marginBottom: "3px",
                                }}
                              >
                                Nombre del incentivo (ej. EFICINE México, Tax
                                credit Francia)
                              </div>
                              <input
                                value={coProdIncentivoNombre}
                                onChange={(e) =>
                                  setCoProdIncentivoNombre(e.target.value)
                                }
                                placeholder="ej. EFICINE México"
                                style={{
                                  fontFamily: SS,
                                  fontSize: "13px",
                                  border: "1px solid #BFB49C",
                                  borderRadius: "3px",
                                  padding: "5px 8px",
                                  width: "100%",
                                  background: "#FAFAF8",
                                  boxSizing: "border-box",
                                }}
                              />
                            </div>
                            <div
                              style={{
                                fontFamily: SS,
                                fontSize: "12px",
                                color: "#6A5F4E",
                                marginBottom: "4px",
                              }}
                            >
                              % del incentivo (sobre el aporte del coproductor)
                            </div>
                            <input
                              type="range"
                              min={5}
                              max={100}
                              step={1}
                              value={coProdIncentivoPct}
                              onChange={(e) =>
                                setCoProdIncentivoPct(Number(e.target.value))
                              }
                              style={{ width: "100%", accentColor: "#2C6B6B" }}
                            />
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "baseline",
                                marginTop: "4px",
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: SS,
                                  fontSize: "12px",
                                  color: "#6A5F4E",
                                }}
                              >
                                {coProdIncentivoNombre && (
                                  <strong>{coProdIncentivoNombre}: </strong>
                                )}
                                {fmt(coProdMonto)} → incentivo{" "}
                                {coProdIncentivoPct}%:{" "}
                                {fmt(coProdIncentivoMonto)} → recoupment
                                waterfall:{" "}
                                {fmt(
                                  Math.max(
                                    0,
                                    coProdMonto - coProdIncentivoMonto
                                  )
                                )}
                              </span>
                              <span
                                style={{
                                  fontFamily: PD,
                                  fontSize: "18px",
                                  color: "#2C6B6B",
                                  fontWeight: "700",
                                }}
                              >
                                {coProdIncentivoPct}%
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Resumen */}
                    <div
                      style={{
                        background: "#2C6B6B",
                        borderRadius: "4px",
                        padding: "10px 14px",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: PD,
                          fontSize: "14px",
                          color: "#fff",
                          fontWeight: "700",
                          marginBottom: "4px",
                        }}
                      >
                        {coProdNombre} — {coProdPct}% del presupuesto (
                        {fmt(coProdMonto)})
                      </div>
                      <div
                        style={{
                          fontFamily: SS,
                          fontSize: "13px",
                          color: "#B0E8E8",
                          lineHeight: 1.6,
                        }}
                      >
                        {coProdTipo === "soft_money"
                          ? `Soft money (subsidio / grant): no genera recoupment en el waterfall. Reduce el equity privado colombiano en ${fmt(
                              coProdMonto
                            )}. Aplica para FDC extranjero, Ibermedia u otros grants — no para CoCrea.`
                          : `Inversionistas del coproductor con recoupment — ${
                              coProdModo === "prioridad"
                                ? "primera prioridad (antes de todos)"
                                : coProdModo === "subordinado"
                                ? "subordinados al recoupment colombiano"
                                : `pari passu prioridad ${coProdPrioridad}`
                            }. Recoupment en waterfall: ${fmt(
                              Math.max(0, coProdMonto - coProdIncentivoMonto)
                            )}.`}
                        {coProdTipo === "equity" &&
                        coProdIncentivo === "incentivo" &&
                        coProdIncentivoMonto > 0
                          ? ` ${
                              coProdIncentivoNombre ||
                              "Incentivo del país coproductor"
                            }: ${coProdIncentivoPct}% (${fmt(
                              coProdIncentivoMonto
                            )}) ya recuperado — reduce el toRecover en el waterfall.`
                          : ""}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Panel>
          </div>

          {/* ── WATERFALL TABLE ── */}
          {(() => {
            const gb = R.grossBruto || 1;
            const AZUL = "#2C4A8C";
            const CAFE = "#9A6040";
            const VERDE = "#2C6B4A";
            const MORADO = "#5C2C8C";
            const DORADO = "#8C6A2C";
            const TEAL = "#2C6B6B";
            const ROJO = "#8C3A2C";
            const NARANJA = "#C05030";
            const GRIS = "#6A5F4E";
            const HDR_BG = "#2C3E6B"; // azul noche — sin negro

            const fmtPct = (v) =>
              gb > 0 ? ((Math.abs(v) / gb) * 100).toFixed(1) + "%" : "—";
            // "% de cascada restante": de cada $100 del bruto inicial, ¿cuántos siguen bajando?
            const fmtCasc = (v) =>
              gb > 0 ? ((Math.max(0, v) / gb) * 100).toFixed(1) + "%" : "—";

            const boxBruto = taquilla;
            const exhibidorAmt = (boxBruto * exhibitorSplit) / 100;
            const distLocalAmt = R.distFeeLocalAmt;
            const paraProductorLocal = R.taquillaNet - distLocalAmt;
            const cadenaMgAmt = mgActivo ? (R.mgBruto * cadenaIntPct) / 100 : 0;
            const cadenaVentasAmt = (R.ventasIntBruto * cadenaIntPct) / 100;
            const cadenaIntTotal = cadenaMgAmt + cadenaVentasAmt;
            const netoIntl = R.mgNeto + R.ventasIntNeto;
            const otrasFuentes = R.plataformasNet + R.tvNet;

            // ── Sub-componentes ─────────────────────────────────────────────

            // Cabecera colapsable de sección
            const Section = ({
              title,
              subtitle,
              color,
              cascAfter,
              children,
              defaultOpen = true,
            }) => {
              const [open, setOpen] = useState(defaultOpen);
              return (
                <div>
                  <div
                    onClick={() => setOpen((o) => !o)}
                    style={{
                      padding: "10px 20px",
                      background: `${color}18`,
                      borderTop: `2px solid ${color}`,
                      borderBottom: "1px solid #D4C9B4",
                      borderLeft: `5px solid ${color}`,
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: "4px",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontFamily: PD,
                            fontSize: "13px",
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                            color,
                            fontWeight: "700",
                          }}
                        >
                          <span style={{ marginRight: "7px", opacity: 0.7 }}>
                            {open ? "▼" : "▶"}
                          </span>
                          {title}
                        </span>
                        {subtitle && (
                          <div
                            style={{
                              fontFamily: SS,
                              fontSize: "13px",
                              color: GRIS,
                              marginTop: "2px",
                              fontStyle: "italic",
                              paddingLeft: "20px",
                            }}
                          >
                            {subtitle}
                          </div>
                        )}
                      </div>
                      {cascAfter !== undefined && (
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div
                            style={{
                              fontFamily: SS,
                              fontSize: "11px",
                              color: GRIS,
                              letterSpacing: "0.06em",
                            }}
                          >
                            FLUYE A LA SIGUIENTE ETAPA
                          </div>
                          <div
                            style={{
                              fontFamily: PD,
                              fontSize: "17px",
                              color,
                              fontWeight: "700",
                            }}
                          >
                            {fmt(Math.max(0, cascAfter))}
                            <span
                              style={{
                                fontFamily: SS,
                                fontSize: "13px",
                                color: GRIS,
                                marginLeft: "6px",
                              }}
                            >
                              ({fmtCasc(cascAfter)} del bruto)
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {open && children}
                </div>
              );
            };

            // Fila detalle
            const Row = ({
              label,
              sublabel,
              value,
              color,
              indent,
              bold,
              note,
            }) => (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto",
                  gap: "0 14px",
                  padding: indent ? "9px 20px 9px 38px" : "11px 20px",
                  borderBottom: "1px solid #EDE8DF",
                  borderLeft: `4px solid ${color}`,
                  background: bold ? "#F5F0E8" : "transparent",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: bold ? PD : SS,
                      fontSize: bold ? "17px" : "16px",
                      color: "#3D3220",
                      fontWeight: bold ? "700" : "normal",
                    }}
                  >
                    {label}
                  </div>
                  {sublabel && (
                    <div
                      style={{
                        fontFamily: SS,
                        fontSize: "13px",
                        color: GRIS,
                        marginTop: "2px",
                        fontStyle: "italic",
                      }}
                    >
                      {sublabel}
                    </div>
                  )}
                  {note && (
                    <div
                      style={{
                        fontFamily: SS,
                        fontSize: "13px",
                        color: "#B05C18",
                        marginTop: "3px",
                        background: "#FFF4EC",
                        padding: "3px 8px",
                        borderRadius: "3px",
                        borderLeft: `3px solid ${NARANJA}`,
                      }}
                    >
                      {note}
                    </div>
                  )}
                </div>
                <span
                  style={{
                    fontFamily: PD,
                    fontSize: bold ? "17px" : "16px",
                    fontWeight: bold ? "700" : "600",
                    color: value >= 0 ? color : ROJO,
                    textAlign: "right",
                    whiteSpace: "nowrap",
                    alignSelf: "center",
                  }}
                >
                  {value !== undefined ? fmt(value) : "—"}
                </span>
                <span
                  style={{
                    fontFamily: SS,
                    fontSize: "13px",
                    color: GRIS,
                    textAlign: "right",
                    whiteSpace: "nowrap",
                    alignSelf: "center",
                  }}
                >
                  {value !== undefined && Math.abs(value) > 0
                    ? fmtPct(value)
                    : ""}
                </span>
              </div>
            );

            // Banda de subtotales con reparto por actor
            const Subtotal = ({ items, cascAfter, color, nota }) => (
              <div
                style={{
                  background: `${color}0D`,
                  borderLeft: `5px solid ${color}`,
                  borderBottom: `2px solid ${color}33`,
                  borderTop: "1px dashed #D4C9B4",
                  padding: "10px 20px",
                }}
              >
                {nota && (
                  <div
                    style={{
                      fontFamily: SS,
                      fontSize: "13px",
                      color: GRIS,
                      fontStyle: "italic",
                      marginBottom: "8px",
                    }}
                  >
                    {nota}
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px 24px",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px 24px",
                    }}
                  >
                    {items.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "7px",
                        }}
                      >
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: item.color,
                            flexShrink: 0,
                          }}
                        />
                        <div>
                          <div
                            style={{
                              fontFamily: SS,
                              fontSize: "13px",
                              color: GRIS,
                            }}
                          >
                            {item.actor}
                          </div>
                          <div
                            style={{
                              fontFamily: PD,
                              fontSize: "16px",
                              color: item.color,
                              fontWeight: "700",
                              lineHeight: 1.1,
                            }}
                          >
                            {fmt(Math.abs(item.value))}
                            <span
                              style={{
                                fontFamily: SS,
                                fontSize: "12px",
                                color: GRIS,
                                marginLeft: "5px",
                              }}
                            >
                              ({((Math.abs(item.value) / gb) * 100).toFixed(1)}%
                              del bruto)
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {cascAfter !== undefined && (
                    <div
                      style={{
                        textAlign: "right",
                        borderLeft: `1px solid ${color}44`,
                        paddingLeft: "16px",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: SS,
                          fontSize: "11px",
                          color: GRIS,
                          letterSpacing: "0.08em",
                        }}
                      >
                        DISPONIBLE PARA ETAPA SIGUIENTE
                      </div>
                      <div
                        style={{
                          fontFamily: PD,
                          fontSize: "18px",
                          color,
                          fontWeight: "700",
                        }}
                      >
                        {fmt(Math.max(0, cascAfter))}
                      </div>
                      <div
                        style={{
                          fontFamily: SS,
                          fontSize: "12px",
                          color: GRIS,
                        }}
                      >
                        = {fmtCasc(cascAfter)} del total bruto inicial
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );

            // Fila divisoria (totales de etapa)
            const Divisor = ({ label, sublabel, value, color }) => (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto",
                  gap: "0 14px",
                  padding: "13px 20px",
                  borderBottom: "1px solid #D4C9B4",
                  borderTop: `3px solid ${color}`,
                  background: "#F0EAE0",
                  borderLeft: `6px solid ${color}`,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: PD,
                      fontSize: "19px",
                      color: "#3D3220",
                      fontWeight: "700",
                    }}
                  >
                    {label}
                  </div>
                  {sublabel && (
                    <div
                      style={{
                        fontFamily: SS,
                        fontSize: "13px",
                        color: GRIS,
                        marginTop: "2px",
                        fontStyle: "italic",
                      }}
                    >
                      {sublabel}
                    </div>
                  )}
                </div>
                <span
                  style={{
                    fontFamily: PD,
                    fontSize: "20px",
                    fontWeight: "700",
                    color: value >= 0 ? color : ROJO,
                    textAlign: "right",
                    whiteSpace: "nowrap",
                    alignSelf: "center",
                  }}
                >
                  {fmt(value)}
                </span>
                <span
                  style={{
                    fontFamily: SS,
                    fontSize: "14px",
                    color: GRIS,
                    textAlign: "right",
                    whiteSpace: "nowrap",
                    alignSelf: "center",
                  }}
                >
                  {fmtPct(value)}
                </span>
              </div>
            );

            return (
              <div
                style={{
                  border: `2px solid #D4C9B4`,
                  borderRadius: "8px",
                  overflow: "hidden",
                  marginBottom: "18px",
                }}
              >
                {/* ── HEADER ── */}
                <div style={{ background: HDR_BG, padding: "12px 20px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: PD,
                          fontSize: "14px",
                          color: "#F8F4EC",
                          fontWeight: "700",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        Waterfall de Ingresos
                      </div>
                      <div
                        style={{
                          fontFamily: SS,
                          fontSize: "13px",
                          color: "#B0C8F0",
                          marginTop: "2px",
                        }}
                      >
                        Gross bruto total: <strong>{fmt(gb)}</strong> · Montos
                        absolutos · % en columna derecha = % del gross total (no
                        de cada fuente)
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "16px" }}>
                      {[
                        {
                          label: "Gross bruto",
                          val: fmt(gb),
                          color: "#B0C8F0",
                        },
                        {
                          label: "Net revenues",
                          val: fmt(R.netRevenues),
                          color: "#70C8A0",
                        },
                        {
                          label: "Break-even",
                          val: R.afterRetMin >= 0 ? "✓" : "✗",
                          color: R.afterRetMin >= 0 ? "#70C070" : "#E07070",
                        },
                      ].map((k, i) => (
                        <div key={i} style={{ textAlign: "center" }}>
                          <div
                            style={{
                              fontFamily: SS,
                              fontSize: "11px",
                              color: "#8A9ABE",
                              letterSpacing: "0.1em",
                            }}
                          >
                            {k.label}
                          </div>
                          <div
                            style={{
                              fontFamily: PD,
                              fontSize: "18px",
                              color: k.color,
                              fontWeight: "700",
                            }}
                          >
                            {k.val}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── LEYENDA COLUMNAS ── */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto auto",
                    gap: "0 14px",
                    padding: "6px 20px",
                    background: "#EAE4D8",
                    borderBottom: "2px solid #D4C9B4",
                  }}
                >
                  <span
                    style={{
                      fontFamily: SS,
                      fontSize: "11px",
                      color: GRIS,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    Nivel / Actor / Descripción
                  </span>
                  <span
                    style={{
                      fontFamily: SS,
                      fontSize: "11px",
                      color: GRIS,
                      textAlign: "right",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Monto ($M COP)
                  </span>
                  <span
                    style={{
                      fontFamily: SS,
                      fontSize: "11px",
                      color: GRIS,
                      textAlign: "right",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    % del bruto
                  </span>
                </div>

                {/* ══════════════════════════════════════════════════
                  I · DISTRIBUCIÓN LOCAL — TAQUILLA
              ══════════════════════════════════════════════════ */}
                <Section
                  title="I · Distribución Local — Taquilla"
                  subtitle="Cadena: Productor → Distribuidor local → Exhibidor (cine). Solo aplica a ingresos de taquilla nacional."
                  color={AZUL}
                  cascAfter={R.taquillaAlProductor}
                >
                  <Row
                    label="Box office bruto (taquilla total)"
                    sublabel={`${espectadores.toLocaleString(
                      "es-CO"
                    )} espectadores × $10.000 COP promedio`}
                    value={boxBruto}
                    color={AZUL}
                  />
                  <Row
                    label={`− Exhibidor retiene (${exhibitorSplit}% del box office bruto)`}
                    sublabel={`El cine cobra directamente en taquilla antes de transferir al distribuidor. Base: ${fmt(
                      boxBruto
                    )} bruto × ${exhibitorSplit}% = ${fmt(
                      Math.round(exhibidorAmt)
                    )}.`}
                    value={-exhibidorAmt}
                    color={GRIS}
                    indent
                  />
                  <Row
                    label={`− Comisión del distribuidor local (${distFeeLocal}% sobre taquilla neta)`}
                    sublabel={`Base: taquilla neta = ${fmt(
                      Math.round(R.taquillaNet)
                    )} (box office ${fmt(boxBruto)} − exhibidor ${fmt(
                      Math.round(exhibidorAmt)
                    )}). Fee = ${fmt(
                      Math.round(R.taquillaNet)
                    )} × ${distFeeLocal}% = ${fmt(
                      Math.round(distLocalAmt)
                    )}. Incluye gastos de lanzamiento, prints y administración del distribuidor local.`}
                    value={-distLocalAmt}
                    color={ROJO}
                    indent
                  />
                  <Subtotal
                    color={AZUL}
                    cascAfter={R.taquillaAlProductor}
                    nota={`Cadena de cálculo: Box office ${fmt(
                      boxBruto
                    )} − exhibidor ${exhibitorSplit}% (${fmt(
                      Math.round(exhibidorAmt)
                    )}) = taquilla neta ${fmt(
                      Math.round(R.taquillaNet)
                    )} − fee dist. local ${distFeeLocal}% (${fmt(
                      Math.round(distLocalAmt)
                    )}) = ${fmt(
                      Math.round(R.taquillaAlProductor)
                    )} al productor. De cada $100 de box office, el productor recibe $${(
                      (R.taquillaAlProductor / boxBruto) *
                      100
                    ).toFixed(0)}.`}
                    items={[
                      {
                        actor: "Exhibidor (cine / sala)",
                        value: exhibidorAmt,
                        color: GRIS,
                      },
                      {
                        actor: "Distribuidor local (fee)",
                        value: distLocalAmt,
                        color: ROJO,
                      },
                      {
                        actor: "Al productor desde taquilla",
                        value: paraProductorLocal,
                        color: AZUL,
                      },
                    ]}
                  />
                </Section>

                {/* ══════════════════════════════════════════════════
                  II · DISTRIBUCIÓN INTERNACIONAL
              ══════════════════════════════════════════════════ */}
                <Section
                  title="II · Distribución Internacional"
                  subtitle="Ingresos de ventas territoriales. Pasan primero por el sales agent (agente de ventas) y el distribuidor territorial antes de llegar al productor."
                  color={CAFE}
                  cascAfter={R.taquillaAlProductor + netoIntl}
                >
                  {mgActivo ? (
                    <>
                      <Row
                        label="MG — Minimum Guarantee (advance bruto)"
                        sublabel="Pago anticipado del distribuidor territorial contra los ingresos futuros del territorio. Cuando el territorio 'earn out', el MG se descuenta de royalties futuros."
                        value={R.mgBruto}
                        color="#2C6B4A"
                        indent
                      />
                      <Row
                        label={`− Cadena int'l (${cadenaIntPct}% del MG bruto): sales agent + dist. territorial`}
                        sublabel={`Base: MG bruto ${fmt(
                          Math.round(R.mgBruto)
                        )} × ${cadenaIntPct}% = ${fmt(
                          Math.round(cadenaMgAmt)
                        )}. Sales agent ~${Math.round(
                          cadenaIntPct * 0.35
                        )}% + dist. territorial ~${Math.round(
                          cadenaIntPct * 0.65
                        )}% (aproximado).`}
                        value={-cadenaMgAmt}
                        color={CAFE}
                        indent
                      />
                    </>
                  ) : (
                    <Row
                      label="Sin MG activo"
                      sublabel="Los MGs anticipados son poco frecuentes en cine latinoamericano independiente. El productor solo recibe royalties post-earned out."
                      value={0}
                      color={GRIS}
                      indent
                    />
                  )}
                  <Row
                    label="Royalties / ventas territoriales (bruto post-MG)"
                    sublabel="Ingresos de explotación territorial una vez el MG está amortizado, o ventas directas sin MG previo. Incluye todos los territorios."
                    value={R.ventasIntBruto}
                    color="#3A7A5A"
                    indent
                  />
                  <Row
                    label={`− Cadena int'l (${cadenaIntPct}% sobre ventas brutas)`}
                    sublabel={`Base: ventas int'l brutas ${fmt(
                      Math.round(R.ventasIntBruto)
                    )} × ${cadenaIntPct}% = ${fmt(
                      Math.round(cadenaVentasAmt)
                    )}. Misma estructura: sales agent + distribuidor territorial.`}
                    value={-cadenaVentasAmt}
                    color={CAFE}
                    indent
                  />
                  <Subtotal
                    color={CAFE}
                    cascAfter={R.taquillaAlProductor + netoIntl}
                    nota="La cadena internacional (sales agent + distribuidores territoriales) generalmente retiene entre el 30% y 55% de los ingresos brutos internacionales."
                    items={[
                      {
                        actor: "Sales agent + dist. territoriales",
                        value: cadenaIntTotal,
                        color: CAFE,
                      },
                      {
                        actor: "Neto al productor (int'l)",
                        value: netoIntl,
                        color: "#3A7A5A",
                      },
                    ]}
                  />
                </Section>

                {/* ══════════════════════════════════════════════════
                  III · OTRAS FUENTES
              ══════════════════════════════════════════════════ */}
                <Section
                  title="III · Otras Ventanas — Directo al Productor"
                  subtitle="Ingresos de plataformas y televisión. No pasan por distribuidor local ni cadena internacional — llegan directamente al productor (o a través de un agregador con fee mínimo)."
                  color={MORADO}
                  cascAfter={R.netAlProductorTotal}
                >
                  <Row
                    label="Plataformas SVOD / AVOD"
                    sublabel="Netflix, Amazon, MUBI, Filmin, etc. Licencias de ventana digital, generalmente negociadas por territorio o globalmente."
                    value={R.plataformasNet}
                    color={MORADO}
                    indent
                  />
                  <Row
                    label="TV abierta y TV paga"
                    sublabel="Licencias de broadcast y cable. Suelen llegar después de la ventana de plataformas (habitualmente 12–24 meses post-estreno)."
                    value={R.tvNet}
                    color={DORADO}
                    indent
                  />
                  <Subtotal
                    color={MORADO}
                    cascAfter={R.netAlProductorTotal}
                    nota="Estas ventanas complementan la taquilla y son cada vez más relevantes para el recoupment en cine independiente."
                    items={[
                      {
                        actor: "Plataformas digitales",
                        value: R.plataformasNet,
                        color: MORADO,
                      },
                      { actor: "Televisión", value: R.tvNet, color: DORADO },
                    ]}
                  />
                </Section>

                {/* ══ DIVISOR: NETO AL PRODUCTOR ══ */}
                <Divisor
                  label="Nivel III — Neto al Productor"
                  sublabel="Suma de todas las fuentes de ingreso ya descontadas sus respectivas cadenas de distribución. Este es el monto que el productor controla y que alimenta el recoupment."
                  value={R.netAlProductorTotal}
                  color={VERDE}
                />

                {paMode === "dist" && R.paDistAmt > 0 && (
                  <Row
                    label={`− P&A adelantado por el distribuidor (${paDistPct}% sobre taquilla al productor)`}
                    sublabel={`Base: taquilla al productor = ${fmt(
                      Math.round(R.taquillaAlProductor)
                    )} (ya sin exhibidor y sin fee dist. local). P&A = ${fmt(
                      Math.round(R.taquillaAlProductor)
                    )} × ${paDistPct}% = ${fmt(
                      Math.round(R.paDistAmt)
                    )}. El distribuidor adelanta este costo al estreno y lo recupera antes de que los Net Revenues fluyan al productor.`}
                    value={-R.paDistAmt}
                    color={NARANJA}
                    indent
                  />
                )}

                {/* ══ DIVISOR: NET REVENUES ══ */}
                <Divisor
                  label="Net Revenues — Base del Recoupment"
                  sublabel="Ingresos netos sobre los que se aplica el waterfall de recoupment. A partir de aquí empieza el pago de acreedores en orden de prioridad pactado."
                  value={R.netRevenues}
                  color={VERDE}
                />

                {/* ══════════════════════════════════════════════════
                  IV–VI · RECOUPMENT
              ══════════════════════════════════════════════════ */}
                <Section
                  title="IV–VI · Recoupment — Pago de Acreedores en Orden de Prioridad"
                  subtitle="Los acreedores cobran en el orden pactado contractualmente. Solo cuando todos están pagados —incluido el retorno mínimo garantizado— existe excedente para el back end."
                  color={MORADO}
                  cascAfter={R.afterRetMin}
                >
                  {sDebt > 0 && (
                    <Row
                      label="IV · Deuda senior / gap lending"
                      sublabel="Primera prioridad. Banco o gap lender que financió contra contratos de pre-venta. Sin margen: cobra primero, sin participación en back end."
                      value={-sDebt}
                      color={MORADO}
                      indent
                    />
                  )}
                  {R.equityRecoupRows.map((r, i) => {
                    const esCop = r.esCoproductor;
                    const col = esCop ? TEAL : DORADO;
                    const lbl = esCop
                      ? `V · Recoupment inversionistas de ${r.nombre}`
                      : `V · Recoupment equity — ${r.nombre}${
                          r.incentivo && r.incentivo !== "ninguno" && useCIC
                            ? ` [${r.incentivo} — 57.75% ya recuperado vía DIAN]`
                            : ""
                        }`;
                    const sub = esCop
                      ? r.incentivoMonto > 0
                        ? `Aporte bruto: ${fmt(r.monto)} → ${
                            r.incentivoNombre ||
                            "incentivo del país coproductor"
                          } (${
                            r.incentivoTipo === "incentivo"
                              ? "rebate/tax credit"
                              : r.incentivoTipo
                          }): ${fmt(
                            r.incentivoMonto
                          )} ya recuperado → recoupment en waterfall: ${fmt(
                            r.toRecover
                          )}. Prioridad: ${
                            r.prioridad === 0
                              ? "PRIMERA"
                              : r.prioridad === 999
                              ? "ÚLTIMA (subordinado)"
                              : "#" + r.prioridad
                          }.`
                        : `Aporte: ${fmt(
                            r.monto
                          )}. Sin incentivo local. Prioridad: ${
                            r.prioridad === 0
                              ? "PRIMERA"
                              : r.prioridad === 999
                              ? "ÚLTIMA (subordinado)"
                              : "#" + r.prioridad
                          }.`
                      : r.incentivo && r.incentivo !== "ninguno" && useCIC
                      ? `${r.nombre} invirtió ${fmt(r.monto)}. De esos, ${fmt(
                          Math.floor(r.monto * 0.5775)
                        )} ya los recuperó vía beneficio tributario ${
                          r.incentivo
                        } (Ley 814/CoCrea) — ese dinero viene de su declaración de renta ante la DIAN, no de los ingresos de la película. En este waterfall solo aparecen los ${fmt(
                          r.toRecover
                        )} restantes: lo único que depende de que la película genere ingresos.`
                      : `${r.nombre} invirtió ${fmt(
                          r.monto
                        )} como capital de riesgo. Se recupera en orden de prioridad #${
                          r.prioridad
                        } antes de que exista back end. Si los ingresos no alcanzan, pierde parcialmente su capital.`;
                    return (
                      <Row
                        key={i}
                        label={lbl}
                        sublabel={sub}
                        value={-r.toRecover}
                        color={col}
                        indent
                        note={
                          r.shortfall > 0
                            ? `⚠ Shortfall de ${fmt(
                                r.shortfall
                              )}: los ingresos no alcanzan para recuperar este tramo.`
                            : null
                        }
                      />
                    );
                  })}
                  {deferments > 0 && (
                    <Row
                      label="VI · Deferments"
                      sublabel="Pagos diferidos pactados con equipo creativo o técnico (director, actores, crew). Se pagan antes del profit split pero después del recoupment de capital."
                      value={-deferments}
                      color={TEAL}
                      indent
                    />
                  )}
                  {retornoMin > 100 && (
                    <Row
                      label={`Retorno mínimo garantizado (+${
                        retornoMin - 100
                      }% sobre capital)`}
                      sublabel={`El inversionista exige recuperar su capital más un ${
                        retornoMin - 100
                      }% adicional antes de abrir el profit split. Esto actúa como un hurdle rate contractual.`}
                      value={
                        -(
                          R.totalInversion * (retornoMin / 100) -
                          R.totalInversion
                        )
                      }
                      color="#8C2C5C"
                      indent
                    />
                  )}
                  {totalSoftMoney > 0 && (
                    <div
                      style={{
                        background: "#EEF8F8",
                        borderLeft: `4px solid ${TEAL}`,
                        padding: "10px 20px 10px 38px",
                        borderBottom: "1px solid #EDE8DF",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: SS,
                          fontSize: "14px",
                          color: TEAL,
                        }}
                      >
                        ℹ{" "}
                        <strong>
                          Soft money ({fmt(totalSoftMoney)}) — no aparece en el
                          recoupment
                        </strong>
                      </div>
                      <div
                        style={{
                          fontFamily: SS,
                          fontSize: "13px",
                          color: GRIS,
                          marginTop: "3px",
                        }}
                      >
                        FDC, Ibermedia y demás subsidios son recursos no
                        reembolsables: reducen el equity que deben poner los
                        inversionistas privados, pero no generan ningún derecho
                        de recoupment en el waterfall. CoCrea (Ley 1955/2019) no
                        es un subsidio — es un mecanismo de inversión con
                        beneficio tributario análogo al CIC/Ley 814: el
                        inversionista aporta capital en riesgo y recupera vía
                        deducción del 165% ante la DIAN.
                      </div>
                    </div>
                  )}
                  <Subtotal
                    color={MORADO}
                    cascAfter={R.afterRetMin}
                    nota="El orden de prioridad es contractual. El CIC y CoCrea reducen el riesgo del inversionista porque más de la mitad de su dinero vuelve vía impuestos — no depende de la taquilla. El waterfall solo carga con el resto."
                    items={[
                      ...(sDebt > 0
                        ? [
                            {
                              actor: "Deuda senior / banco",
                              value: sDebt,
                              color: MORADO,
                            },
                          ]
                        : []),
                      ...R.equityRecoupRows.map((r) => ({
                        actor:
                          r.nombre +
                          (r.esCoproductor
                            ? " (inv. coproductor)"
                            : " (equity)"),
                        value: r.toRecover,
                        color: r.esCoproductor ? TEAL : DORADO,
                      })),
                      ...(deferments > 0
                        ? [
                            {
                              actor: "Deferments (crew/cast)",
                              value: deferments,
                              color: TEAL,
                            },
                          ]
                        : []),
                      ...(retornoMin > 100
                        ? [
                            {
                              actor: `Retorno mín. +${retornoMin - 100}%`,
                              value:
                                R.totalInversion * (retornoMin / 100) -
                                R.totalInversion,
                              color: "#8C2C5C",
                            },
                          ]
                        : []),
                    ].filter((x) => x.value > 0)}
                  />
                </Section>

                {/* ══ BREAK-EVEN ══ */}
                <div
                  style={{
                    padding: "16px 20px",
                    borderTop: `4px solid ${R.afterRetMin >= 0 ? VERDE : ROJO}`,
                    borderBottom: `2px solid ${
                      R.afterRetMin >= 0 ? VERDE : ROJO
                    }`,
                    background: R.afterRetMin >= 0 ? "#EEF8EE" : "#FFF0F0",
                    borderLeft: `6px solid ${
                      R.afterRetMin >= 0 ? VERDE : ROJO
                    }`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: PD,
                          fontSize: "20px",
                          color: R.afterRetMin >= 0 ? VERDE : ROJO,
                          fontWeight: "700",
                        }}
                      >
                        ◆ BREAK-EVEN —{" "}
                        {R.afterRetMin >= 0
                          ? "✓ Todos los acreedores han sido pagados"
                          : "✗ Los ingresos no cubren todos los compromisos"}
                      </div>
                      <div
                        style={{
                          fontFamily: SS,
                          fontSize: "14px",
                          color: GRIS,
                          marginTop: "4px",
                        }}
                      >
                        {R.afterRetMin >= 0
                          ? "A partir de aquí comienza el profit split (back end). El excedente se reparte entre productor e inversionista según los porcentajes acordados."
                          : `Déficit de ${fmt(
                              Math.abs(R.afterRetMin)
                            )}. No hay back end disponible. El productor no recibe profit split y algunos inversionistas pueden tener shortfall en su recoupment.`}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div
                        style={{
                          fontFamily: SS,
                          fontSize: "11px",
                          color: GRIS,
                          letterSpacing: "0.1em",
                        }}
                      >
                        EXCEDENTE / DÉFICIT
                      </div>
                      <div
                        style={{
                          fontFamily: PD,
                          fontSize: "28px",
                          color: R.afterRetMin >= 0 ? VERDE : ROJO,
                          fontWeight: "700",
                          lineHeight: 1,
                        }}
                      >
                        {fmt(R.afterRetMin)}
                      </div>
                      <div
                        style={{
                          fontFamily: SS,
                          fontSize: "13px",
                          color: GRIS,
                        }}
                      >
                        {fmtCasc(R.afterRetMin)} del bruto inicial
                      </div>
                    </div>
                  </div>
                </div>

                {/* ══════════════════════════════════════════════════
                  VII–VIII · BACK END
              ══════════════════════════════════════════════════ */}
                {R.afterRetMin > 0 ? (
                  <Section
                    title="VII–VIII · Back End — Profit Split"
                    subtitle="El excedente tras el break-even se reparte primero entre terceros con puntos negociados, y luego entre productor e inversionista. Este es el verdadero upside del proyecto."
                    color={VERDE}
                    defaultOpen={true}
                  >
                    {/* Terceros con puntos sobre el excedente total */}
                    {R.backEndRows
                      .filter((p3) => p3.base === "total")
                      .map((p3, i) => (
                        <Row
                          key={"t" + i}
                          label={`Participación: ${p3.nombre} (${p3.pct}% del excedente)`}
                          sublabel={`${
                            p3.tipo === "actor"
                              ? "Actor/Actriz"
                              : p3.tipo === "director"
                              ? "Director"
                              : p3.tipo === "escritor"
                              ? "Guionista"
                              : p3.tipo === "productor_ejecutivo"
                              ? "Prod. Ejecutivo"
                              : "Participante"
                          } — puntos sobre el excedente total antes del split productor/inversionista.`}
                          value={p3.amt}
                          color="#4A8C4A"
                          indent
                        />
                      ))}

                    {R.backEndRows.filter((p3) => p3.base === "total").length >
                      0 && (
                      <Divisor
                        label="Excedente tras terceros — base del split"
                        sublabel="Sobre este monto se aplica el split productor / inversionista."
                        value={R.afterTerceros}
                        color={VERDE}
                      />
                    )}

                    <Row
                      label={`VII · Pool del Productor (${
                        100 - investorSplitPct
                      }%${
                        R.backEndRows.filter((p3) => p3.base === "productor")
                          .length > 0
                          ? " — antes de puntos bilaterales"
                          : ""
                      })`}
                      sublabel="Remunera al productor por su trabajo creativo, gestión del proyecto y riesgo asumido. Sujeto a los puntos bilaterales negociados directamente con el equipo."
                      value={R.producerPoolBruto}
                      color={VERDE}
                      indent
                    />

                    {/* Terceros con puntos sobre el pool del productor */}
                    {R.backEndRows
                      .filter((p3) => p3.base === "productor")
                      .map((p3, i) => (
                        <Row
                          key={"tp" + i}
                          label={`  Participación: ${p3.nombre} (${p3.pct}% del pool del productor)`}
                          sublabel={`Acuerdo bilateral con el productor. No afecta al inversionista.`}
                          value={-p3.amt}
                          color="#4A8C4A"
                          indent
                        />
                      ))}

                    <Row
                      label={`VII · Pool neto del Productor`}
                      sublabel="Lo que efectivamente recibe el productor tras descontar sus compromisos de puntos bilaterales."
                      value={R.producerPool}
                      color={VERDE}
                      bold
                      indent
                    />

                    <Row
                      label={`VIII · Pool del Inversionista (${investorSplitPct}%)`}
                      sublabel="Retorno adicional sobre el capital ya recuperado. No se ve afectado por los puntos bilaterales del productor."
                      value={R.investorPool}
                      color={AZUL}
                      indent
                    />

                    <Subtotal
                      color={VERDE}
                      cascAfter={0}
                      nota="El profit split se negocia en el contrato de inversión. Los puntos de actores y directores se pactan separadamente con el productor o sobre el excedente total."
                      items={[
                        ...R.backEndRows
                          .filter((p3) => p3.base === "total")
                          .map((p3) => ({
                            actor: p3.nombre,
                            value: p3.amt,
                            color: "#4A8C4A",
                          })),
                        {
                          actor: "Productor (neto)",
                          value: R.producerPool,
                          color: VERDE,
                        },
                        {
                          actor: "Inversionista",
                          value: R.investorPool,
                          color: AZUL,
                        },
                      ]}
                    />
                  </Section>
                ) : (
                  <div
                    style={{
                      padding: "14px 20px",
                      background: "#FFF8F0",
                      borderLeft: `5px solid ${ROJO}`,
                      borderTop: "1px solid #E8DDD0",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: PD,
                        fontSize: "15px",
                        color: ROJO,
                        fontWeight: "700",
                      }}
                    >
                      VII–VIII · Back End — No disponible
                    </div>
                    <div
                      style={{
                        fontFamily: SS,
                        fontSize: "14px",
                        color: GRIS,
                        marginTop: "4px",
                      }}
                    >
                      Para que exista profit split, los ingresos deben superar
                      todos los compromisos de recoupment. Ajusta los ingresos o
                      reduce los costos de distribución.
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── CIC PANEL ── */}
          {useCIC && R.cicTotal > 0 && (
            <div
              style={{
                background: "#EEF2FB",
                border: "2px solid #2C4A8C55",
                borderRadius: "6px",
                padding: "16px 20px",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  fontFamily: PD,
                  fontSize: "17px",
                  color: "#2C4A8C",
                  fontWeight: "700",
                  marginBottom: "4px",
                }}
              >
                CIC / CoCrea — Recuperación vía beneficio tributario{" "}
                <Tip term="CIC" />
              </div>
              <div
                style={{
                  fontFamily: SS,
                  fontSize: "13px",
                  color: "#6A5F4E",
                  marginBottom: "12px",
                  fontStyle: "italic",
                }}
              >
                El CIC se expide al finalizar la post-producción sobre la
                totalidad del presupuesto ejecutado. En ese momento el
                inversionista obtiene el beneficio tributario del 165% ante la
                DIAN, recuperando el 57.75% de su capital — independientemente
                de si la película genera ingresos. El 42.25% restante se
                recupera mediante el waterfall de explotación.
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "10px",
                }}
              >
                {inversionistasConMonto
                  .filter((i) => i.incentivo && i.incentivo !== "ninguno")
                  .map((inv, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "#fff",
                        borderRadius: "4px",
                        padding: "12px 14px",
                        border: "1px solid #2C4A8C33",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: PD,
                          fontSize: "15px",
                          color: "#2C4A8C",
                          marginBottom: "6px",
                          fontWeight: "700",
                        }}
                      >
                        {inv.nombre}
                      </div>
                      <div
                        style={{
                          fontFamily: SS,
                          fontSize: "12px",
                          color: "#6A5F4E",
                          marginBottom: "2px",
                        }}
                      >
                        Capital invertido
                      </div>
                      <div
                        style={{
                          fontFamily: PD,
                          fontSize: "17px",
                          color: "#3D3220",
                          fontWeight: "700",
                          marginBottom: "8px",
                        }}
                      >
                        {fmt(inv.monto)}
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "6px",
                        }}
                      >
                        <div
                          style={{
                            background: "#EEF2FB",
                            borderRadius: "3px",
                            padding: "6px 8px",
                          }}
                        >
                          <div
                            style={{
                              fontFamily: SS,
                              fontSize: "11px",
                              color: "#6A5F4E",
                              marginBottom: "2px",
                            }}
                          >
                            Vía DIAN (57.75%)
                          </div>
                          <div
                            style={{
                              fontFamily: PD,
                              fontSize: "15px",
                              color: "#2C4A8C",
                              fontWeight: "700",
                            }}
                          >
                            {fmt(Math.floor(inv.monto * 0.5775))}
                          </div>
                          <div
                            style={{
                              fontFamily: SS,
                              fontSize: "11px",
                              color: "#8A9ABE",
                              fontStyle: "italic",
                            }}
                          >
                            al expedir el CIC
                          </div>
                        </div>
                        <div
                          style={{
                            background: "#F5F0E8",
                            borderRadius: "3px",
                            padding: "6px 8px",
                          }}
                        >
                          <div
                            style={{
                              fontFamily: SS,
                              fontSize: "11px",
                              color: "#6A5F4E",
                              marginBottom: "2px",
                            }}
                          >
                            Vía explotación (42.25%)
                          </div>
                          <div
                            style={{
                              fontFamily: PD,
                              fontSize: "15px",
                              color: "#8C6A2C",
                              fontWeight: "700",
                            }}
                          >
                            {fmt(inv.monto * 0.4225)}
                          </div>
                          <div
                            style={{
                              fontFamily: SS,
                              fontSize: "11px",
                              color: "#A08050",
                              fontStyle: "italic",
                            }}
                          >
                            en el waterfall
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                <div
                  style={{
                    background: "#2C4A8C",
                    borderRadius: "4px",
                    padding: "14px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: SS,
                      fontSize: "12px",
                      color: "#B0C8F0",
                      marginBottom: "4px",
                    }}
                  >
                    Total recuperado vía DIAN
                  </div>
                  <div
                    style={{
                      fontFamily: PD,
                      fontSize: "26px",
                      color: "#fff",
                      fontWeight: "700",
                    }}
                  >
                    {fmt(R.cicTotal)}
                  </div>
                  <div
                    style={{
                      fontFamily: SS,
                      fontSize: "12px",
                      color: "#8AB0E0",
                      marginTop: "4px",
                      fontStyle: "italic",
                    }}
                  >
                    No compite con el waterfall
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TABLA CASCADA — nivel por nivel ── */}
          {(() => {
            const gb = R.grossBruto || 1;
            const CAZUL = "#2C4A8C",
              CCAFE = "#9A6040",
              CVERDE = "#2C6B4A",
              CMORADO = "#5C2C8C",
              CDORADO = "#8C6A2C",
              CTEAL = "#2C6B6B",
              CROJO = "#8C3A2C",
              CNARANJA = "#C05030",
              CGRIS = "#6A5F4E";
            const steps = [
              {
                label: "Gross bruto",
                desc: "Suma de todas las fuentes de ingreso antes de cualquier deducción",
                value: gb,
                color: CAZUL,
                type: "start",
              },
              {
                label: "Exhibidor",
                desc: `Split exhibidor ${exhibitorSplit}% sobre taquilla`,
                value: -((taquilla * exhibitorSplit) / 100),
                color: CGRIS,
              },
              {
                label: "Dist. local",
                desc: `Comisión distribuidor local ${distFeeLocal}% sobre taquilla neta`,
                value: -R.distFeeLocalAmt,
                color: CROJO,
              },
              ...(R.mgBruto > 0 || R.ventasIntBruto > 0
                ? [
                    {
                      label: "Cadena int'l",
                      desc: `Sales agent + dist. territorial ${cadenaIntPct}% sobre ingresos int'l brutos`,
                      value: -(
                        ((R.mgBruto + R.ventasIntBruto) * cadenaIntPct) /
                        100
                      ),
                      color: CCAFE,
                    },
                  ]
                : []),
              ...(R.plataformasNet + R.tvNet > 0
                ? [
                    {
                      label: "Plat. + TV",
                      desc: "Licencias digitales y TV — ingreso directo al productor",
                      value: R.plataformasNet + R.tvNet,
                      color: CMORADO,
                    },
                  ]
                : []),
              ...(R.paDistAmt > 0
                ? [
                    {
                      label: "P&A dist.",
                      desc: `P&A adelantado por distribuidor ${paDistPct}% sobre taquilla al productor`,
                      value: -R.paDistAmt,
                      color: CNARANJA,
                    },
                  ]
                : []),
              {
                label: "Net Revenues",
                desc: "Base contractual del recoupment — ingresos que alimentan el waterfall",
                value: null,
                color: CVERDE,
                type: "subtotal",
              },
              ...(sDebt > 0
                ? [
                    {
                      label: "Deuda senior",
                      desc: "Deuda de primer rango — crédito o gap financing",
                      value: -sDebt,
                      color: CMORADO,
                    },
                  ]
                : []),
              ...R.equityRecoupRows.map((r) => ({
                label:
                  r.nombre.length > 18 ? r.nombre.slice(0, 17) + "…" : r.nombre,
                desc: `Recoupment ${
                  r.esCoproductor ? "coproductor" : "equity"
                } — prioridad #${
                  r.prioridad === 0
                    ? "1ª"
                    : r.prioridad === 999
                    ? "última"
                    : r.prioridad
                }`,
                value: -r.toRecover,
                color: CDORADO,
              })),
              ...(deferments > 0
                ? [
                    {
                      label: "Deferments",
                      desc: "Pagos diferidos pactados contractualmente",
                      value: -deferments,
                      color: CTEAL,
                    },
                  ]
                : []),
              ...(retornoMin > 100
                ? [
                    {
                      label: "Ret. mín.",
                      desc: `Retorno mínimo garantizado ${retornoMin}% — prima sobre el capital invertido`,
                      value: -(
                        R.totalInversion * (retornoMin / 100) -
                        R.totalInversion
                      ),
                      color: "#8C2C5C",
                    },
                  ]
                : []),
              {
                label: "Break-even",
                desc: "Nivel a partir del cual existe excedente para el back end",
                value: null,
                color: R.afterRetMin >= 0 ? CVERDE : CROJO,
                type: "subtotal",
              },
              ...(R.producerPool > 0
                ? [
                    {
                      label: "Pool Productor",
                      desc: `Back end — split ${
                        100 - investorSplitPct
                      }% para el productor`,
                      value: R.producerPool,
                      color: CVERDE,
                    },
                  ]
                : []),
              ...(R.investorPool > 0
                ? [
                    {
                      label: "Pool Inv.",
                      desc: `Back end — split ${investorSplitPct}% para inversionistas`,
                      value: R.investorPool,
                      color: CAZUL,
                    },
                  ]
                : []),
            ];

            let running = 0;
            const computed = steps.map((s) => {
              if (s.type === "start") {
                running = s.value;
                return { ...s, remaining: s.value };
              }
              if (s.type === "subtotal") {
                return { ...s, remaining: running };
              }
              running = Math.max(0, running + s.value);
              return { ...s, remaining: running };
            });

            const BAR_MAX = 200; // px — ancho máximo de la barra

            return (
              <div
                style={{
                  background: "#FDFAF5",
                  border: "1px solid #D4C9B4",
                  borderRadius: "8px",
                  overflow: "hidden",
                  marginBottom: "18px",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    background: "#2C3E6B",
                    padding: "12px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: PD,
                        fontSize: "15px",
                        color: "#F8F4EC",
                        fontWeight: "700",
                      }}
                    >
                      Cascada de ingresos — nivel por nivel
                    </div>
                    <div
                      style={{
                        fontFamily: SS,
                        fontSize: "12px",
                        color: "#B0C8F0",
                        marginTop: "2px",
                      }}
                    >
                      La barra muestra cuánto queda fluyendo hacia abajo en la
                      cascada tras cada deducción
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontFamily: SS,
                        fontSize: "11px",
                        color: "#8A9ABE",
                        letterSpacing: "0.1em",
                      }}
                    >
                      GROSS BRUTO
                    </div>
                    <div
                      style={{
                        fontFamily: PD,
                        fontSize: "18px",
                        color: "#B0C8F0",
                        fontWeight: "700",
                      }}
                    >
                      {fmt(gb)}
                    </div>
                  </div>
                </div>

                {/* Tabla */}
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr
                      style={{
                        background: "#EAE4D8",
                        borderBottom: "2px solid #D4C9B4",
                      }}
                    >
                      <th
                        style={{
                          fontFamily: SS,
                          fontSize: "11px",
                          color: CGRIS,
                          padding: "7px 16px",
                          textAlign: "left",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          width: "22%",
                        }}
                      >
                        Nivel / Actor
                      </th>
                      <th
                        style={{
                          fontFamily: SS,
                          fontSize: "11px",
                          color: CGRIS,
                          padding: "7px 8px",
                          textAlign: "left",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          width: "30%",
                        }}
                      >
                        Descripción
                      </th>
                      <th
                        style={{
                          fontFamily: SS,
                          fontSize: "11px",
                          color: CGRIS,
                          padding: "7px 8px",
                          textAlign: "right",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          width: "12%",
                        }}
                      >
                        Monto
                      </th>
                      <th
                        style={{
                          fontFamily: SS,
                          fontSize: "11px",
                          color: CGRIS,
                          padding: "7px 8px",
                          textAlign: "right",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          width: "8%",
                        }}
                      >
                        % bruto
                      </th>
                      <th
                        style={{
                          fontFamily: SS,
                          fontSize: "11px",
                          color: CGRIS,
                          padding: "7px 16px",
                          textAlign: "left",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          width: "28%",
                        }}
                      >
                        Queda en cascada →
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {computed.map((s, i) => {
                      const isSubtotal =
                        s.type === "subtotal" || s.type === "start";
                      const isNeg = s.value !== null && s.value < 0;
                      const isPos =
                        s.value !== null && s.value > 0 && s.type !== "start";
                      const barW = Math.round((s.remaining / gb) * BAR_MAX);
                      const pctBruto =
                        s.value !== null
                          ? ((Math.abs(s.value) / gb) * 100).toFixed(1) + "%"
                          : "";
                      const rowBg = isSubtotal
                        ? s.color + "18"
                        : i % 2 === 0
                        ? "#FDFAF5"
                        : "#F8F3EC";
                      return (
                        <tr
                          key={i}
                          style={{
                            background: rowBg,
                            borderTop: isSubtotal
                              ? `2px solid ${s.color}`
                              : "1px solid #EAE4D8",
                            borderBottom: isSubtotal
                              ? `2px solid ${s.color}`
                              : "none",
                          }}
                        >
                          {/* Label */}
                          <td
                            style={{
                              padding: isSubtotal ? "10px 16px" : "8px 16px",
                              verticalAlign: "middle",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: isSubtotal ? PD : SS,
                                fontSize: isSubtotal ? "14px" : "13px",
                                color: s.color,
                                fontWeight: isSubtotal ? "700" : "600",
                                paddingLeft: isSubtotal ? "0" : "10px",
                              }}
                            >
                              {isSubtotal ? "" : "−  "}
                              {isPos ? "+  " : ""}
                              {s.label}
                            </span>
                          </td>

                          {/* Descripción */}
                          <td
                            style={{
                              padding: "8px 8px",
                              verticalAlign: "middle",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: SS,
                                fontSize: "12px",
                                color: "#6A5F4E",
                                fontStyle: isSubtotal ? "normal" : "italic",
                                lineHeight: 1.4,
                              }}
                            >
                              {s.desc}
                            </span>
                          </td>

                          {/* Monto */}
                          <td
                            style={{
                              padding: "8px 8px",
                              textAlign: "right",
                              verticalAlign: "middle",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: PD,
                                fontSize: isSubtotal ? "15px" : "14px",
                                fontWeight: isSubtotal ? "700" : "600",
                                color: isNeg ? CROJO : s.color,
                              }}
                            >
                              {s.value !== null
                                ? (isNeg ? "−" : isPos ? "+" : "") +
                                  fmt(
                                    Math.abs(
                                      s.value !== null ? s.value : s.remaining
                                    )
                                  )
                                : fmt(s.remaining)}
                            </span>
                          </td>

                          {/* % bruto */}
                          <td
                            style={{
                              padding: "8px 8px",
                              textAlign: "right",
                              verticalAlign: "middle",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: SS,
                                fontSize: "12px",
                                color: "#8A7A62",
                              }}
                            >
                              {pctBruto}
                            </span>
                          </td>

                          {/* Barra mini */}
                          <td
                            style={{
                              padding: "8px 16px 8px 8px",
                              verticalAlign: "middle",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <div
                                style={{
                                  flex: "0 0 200px",
                                  height: isSubtotal ? "14px" : "10px",
                                  background: "#E8E2D8",
                                  borderRadius: "5px",
                                  overflow: "hidden",
                                  border: isSubtotal
                                    ? `1.5px solid ${s.color}44`
                                    : "none",
                                }}
                              >
                                <div
                                  style={{
                                    width: `${barW}px`,
                                    height: "100%",
                                    background: isSubtotal
                                      ? `linear-gradient(90deg, ${s.color}CC, ${s.color}88)`
                                      : `${s.color}99`,
                                    borderRadius: "5px",
                                    transition: "width 0.3s ease",
                                  }}
                                />
                              </div>
                              <span
                                style={{
                                  fontFamily: PD,
                                  fontSize: "12px",
                                  color: s.color,
                                  fontWeight: isSubtotal ? "700" : "normal",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {fmt(Math.round(s.remaining))}
                                <span
                                  style={{
                                    fontFamily: SS,
                                    fontSize: "10px",
                                    color: "#8A7A62",
                                    marginLeft: "3px",
                                  }}
                                >
                                  ({((s.remaining / gb) * 100).toFixed(0)}%)
                                </span>
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })()}

          {/* ══ TIR PEDAGÓGICA — al final, colapsable ══ */}
          {
            <div
              style={{
                border: "2px solid #5C2C8C44",
                borderRadius: "8px",
                overflow: "hidden",
                marginBottom: "18px",
              }}
            >
              <div
                onClick={() => setTirOpen((o) => !o)}
                style={{
                  background: tirOpen ? "#5C2C8C" : "#F5F0FB",
                  padding: "14px 20px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: tirOpen ? "2px solid #5C2C8C88" : "none",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: PD,
                      fontSize: "15px",
                      color: tirOpen ? "#fff" : "#5C2C8C",
                      fontWeight: "700",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    {tirOpen ? "▼" : "▶"} TIR — Tasa Interna de Retorno{" "}
                    <Tip term="TIR" />
                  </div>
                  {!tirOpen && (
                    <div
                      style={{
                        fontFamily: SS,
                        fontSize: "12px",
                        color: "#8A6ABE",
                        marginTop: "3px",
                      }}
                    >
                      Análisis de retorno por inversionista · Con y sin CIC ·
                      Distribución temporal por ventana
                    </div>
                  )}
                </div>
                <span
                  style={{
                    fontFamily: PD,
                    fontSize: "22px",
                    color: tirOpen ? "#fff" : "#5C2C8C",
                  }}
                >
                  {tirOpen ? "−" : "+"}
                </span>
              </div>

              {tirOpen && (
                <div style={{ padding: "16px 20px" }}>
                  <TirExplicacion
                    PD={PD}
                    SS={SS}
                    inversionistas={inversionistasConMonto}
                    cicTotal={R.cicTotal}
                    netRevYear={netRevYear}
                    anosExplot={anosExplot}
                    fmt={fmt}
                    useCIC={useCIC}
                  />

                  <div style={{ marginBottom: "14px" }}>
                    <div
                      style={{
                        fontFamily: SS,
                        fontSize: "13px",
                        color: "#6A5F4E",
                        marginBottom: "8px",
                      }}
                    >
                      Horizonte temporal del contrato de inversión
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[
                        [1, "1 año"],
                        [2, "2 años"],
                        [5, "5 años"],
                        [10, "10 años"],
                      ].map(([v, lbl]) => (
                        <button
                          key={v}
                          onClick={(e) => {
                            e.stopPropagation();
                            setAnosExplot(v);
                          }}
                          style={{
                            flex: 1,
                            fontFamily: PD,
                            fontSize: "14px",
                            padding: "8px 0",
                            background:
                              anosExplot === v ? "#5C2C8C" : "#F5F0FB",
                            color: anosExplot === v ? "#fff" : "#5C2C8C",
                            border: "1.5px solid #5C2C8C",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontWeight: anosExplot === v ? "700" : "normal",
                          }}
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                    <div
                      style={{
                        fontFamily: SS,
                        fontSize: "12px",
                        color: "#8A7A62",
                        marginTop: "6px",
                        lineHeight: 1.6,
                      }}
                    >
                      Cada ventana tiene su propio calendario:{" "}
                      <strong style={{ color: "#2C4A8C" }}>taquilla</strong> año
                      1 (95%) ·{" "}
                      <strong style={{ color: "#5C2C8C" }}>plataformas</strong>{" "}
                      años 2–3 ·{" "}
                      <strong style={{ color: "#8C6A2C" }}>TV</strong> años 3–5
                      ·{" "}
                      <strong style={{ color: "#2C6B4A" }}>ventas int'l</strong>{" "}
                      años 1–4. El CIC siempre año 1.
                    </div>
                  </div>

                  <DistribucionPersonalizada
                    distMode={distMode}
                    setDistMode={setDistMode}
                    distPersonalizada={distPersonalizada}
                    setDistCell={setDistCell}
                    anosExplot={anosExplot}
                    srcTaq={srcTaq}
                    srcVen={srcVen}
                    srcPlat={srcPlat}
                    srcTv={srcTv}
                    exhibitorSplit={exhibitorSplit}
                    distFeeLocal={distFeeLocal}
                    cadenaIntPct={cadenaIntPct}
                    paMode={paMode}
                    paDistPct={paDistPct}
                    taquillaNet={R.taquillaNet}
                    distFeeLocalAmt={R.distFeeLocalAmt}
                    paDistAmt={R.paDistAmt}
                    mgActivo={mgActivo}
                    fmt={fmt}
                    PD={PD}
                    SS={SS}
                  />

                  {totalNetRev > 0 && (
                    <TirCalendario
                      desglosePorAno={desglosePorAno}
                      totalNetRev={totalNetRev}
                      fmt={fmt}
                      PD={PD}
                      SS={SS}
                    />
                  )}

                  {tirPorInversionista.map((inv, idx) => (
                    <TirInvCard
                      key={idx}
                      inv={inv}
                      anosExplot={anosExplot}
                      fmt={fmt}
                      PD={PD}
                      SS={SS}
                    />
                  ))}

                  {tirCoprod && (
                    <div
                      style={{
                        background: "#EEF8F8",
                        borderRadius: "6px",
                        padding: "12px 16px",
                        border: "1px solid #2C6B6B33",
                        marginBottom: "10px",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: PD,
                          fontSize: "14px",
                          color: "#2C6B6B",
                          fontWeight: "700",
                          marginBottom: "8px",
                        }}
                      >
                        Inversionistas de {tirCoprod.nombre} (coproductor)
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(120px, 1fr))",
                          gap: "8px",
                        }}
                      >
                        {[
                          ["Inversión", `–${fmt(tirCoprod.monto)}`, "#8C3A2C"],
                          ...(tirCoprod.incentivo > 0
                            ? [
                                [
                                  "Incentivo (año 1)",
                                  fmt(tirCoprod.incentivo),
                                  "#2C6B4A",
                                ],
                              ]
                            : []),
                          [
                            "Vía waterfall",
                            fmt(Math.round(tirCoprod.viaExplot)),
                            "#2C4A8C",
                          ],
                          [
                            "Múltiplo",
                            `${tirCoprod.multiplo.toFixed(2)}x`,
                            "#8C6A2C",
                          ],
                          [
                            "TIR",
                            tirCoprod.tirV !== null
                              ? `${(tirCoprod.tirV * 100).toFixed(1)}%`
                              : "N/A",
                            tirCoprod.tirV > 0 ? "#2C6B4A" : "#8C3A2C",
                          ],
                        ].map(([lbl, val, col], i) => (
                          <div
                            key={i}
                            style={{
                              background: "#fff",
                              borderRadius: "4px",
                              padding: "8px 10px",
                              border: "1px solid #2C6B6B22",
                            }}
                          >
                            <div
                              style={{
                                fontFamily: SS,
                                fontSize: "11px",
                                color: "#6A5F4E",
                              }}
                            >
                              {lbl}
                            </div>
                            <div
                              style={{
                                fontFamily: PD,
                                fontSize: "15px",
                                color: col,
                                fontWeight: "700",
                              }}
                            >
                              {val}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          }
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB: COMPARADOR 3 ESCENARIOS
      ══════════════════════════════════════════════════════════════════════ */}
      {simTab === "negociacion" && (
        <NegociacionTab
          distFeeLocal={distFeeLocal}
          paMode={paMode}
          paDistPct={paDistPct}
          investorSplitPct={investorSplitPct}
          retornoMin={retornoMin}
        />
      )}

      {/* Print styles */}
      <style>{`@media print { button { display: none !important; } }`}</style>
    </div>
  );
}
function ComparadorIncentivos() {
  const fields = [
    { key: "ley", label: "Ley" },
    { key: "entidad", label: "Entidad" },
    { key: "beneficiario", label: "¿Quién se beneficia?" },
    { key: "mecanismo", label: "Mecanismo" },
    { key: "porcentaje", label: "% de recuperación efectiva" },
    { key: "quien_recibe", label: "¿Quién recibe el beneficio?" },
    { key: "obligacion_productor", label: "Obligación del productor" },
    { key: "reconocimiento", label: "Requisito de reconocimiento" },
    { key: "limitaciones", label: "Limitaciones clave" },
    { key: "nota", label: "Nota crítica" },
  ];
  return (
    <div>
      <p
        style={{
          fontFamily: SS,
          fontSize: "22px",
          color: "#3D3220",
          lineHeight: 1.7,
          marginBottom: "28px",
        }}
      >
        Los tres mecanismos colombianos de incentivo cinematográfico son
        completamente distintos en su naturaleza, beneficiario y operación.
        Confundirlos es el error más común en la estructuración de proyectos.
      </p>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "700px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  background: "#F0EAE0",
                  padding: "12px 16px",
                  fontFamily: PD,
                  fontSize: "14px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#6A5F4E",
                  textAlign: "left",
                  borderBottom: "2px solid #BFB49C",
                  width: "180px",
                }}
              >
                Aspecto
              </th>
              {incentivos.map((inc) => (
                <th
                  key={inc.name}
                  style={{
                    background: inc.light,
                    padding: "12px 16px",
                    fontFamily: PD,
                    fontSize: "22px",
                    color: inc.color,
                    textAlign: "center",
                    borderBottom: `3px solid ${inc.color}`,
                    borderLeft: "1px solid #BFB49C",
                  }}
                >
                  {inc.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map((f, fi) => (
              <tr
                key={f.key}
                style={{ background: fi % 2 === 0 ? "#FDFAF5" : "#F8F4EC" }}
              >
                <td
                  style={{
                    padding: "12px 16px",
                    fontFamily: PD,
                    fontSize: "15px",
                    color: "#6A5F4E",
                    letterSpacing: "0.05em",
                    borderBottom: "1px solid #E8E2D8",
                    verticalAlign: "top",
                    fontWeight: "600",
                  }}
                >
                  {f.label}
                </td>
                {incentivos.map((inc) => (
                  <td
                    key={inc.name}
                    style={{
                      padding: "12px 16px",
                      fontFamily: SS,
                      fontSize: "19px",
                      color: f.key === "nota" ? inc.color : "#221C12",
                      lineHeight: 1.6,
                      borderBottom: "1px solid #E8E2D8",
                      borderLeft: "1px solid #E8E2D8",
                      verticalAlign: "top",
                      fontWeight: f.key === "nota" ? "600" : "normal",
                      fontStyle: f.key === "nota" ? "italic" : "normal",
                    }}
                  >
                    {inc[f.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FlujoDinero() {
  const nodes = [
    {
      id: "gross",
      label: "GROSS REVENUES",
      sub: "100% de ingresos",
      x: 50,
      y: 4,
      color: "#2C4A8C",
      w: 300,
    },
    {
      id: "dist",
      label: "DISTRIBUTOR'S FEE + P&A",
      sub: "–40 a 60% (sale del sistema)",
      x: 50,
      y: 20,
      color: "#8C3A2C",
      w: 300,
    },
    {
      id: "net",
      label: "NET REVENUES",
      sub: "Fluye hacia el productor",
      x: 50,
      y: 36,
      color: "#2C6B4A",
      w: 300,
    },
    {
      id: "senior",
      label: "SENIOR DEBT",
      sub: "Capital + intereses (primero)",
      x: 50,
      y: 50,
      color: "#5C2C8C",
      w: 300,
    },
    {
      id: "equity",
      label: "EQUITY RECOUPMENT",
      sub: "1x o 1.2x inversión",
      x: 50,
      y: 64,
      color: "#8C6A2C",
      w: 300,
    },
    {
      id: "defer",
      label: "DEFERMENTS",
      sub: "Obligaciones contractuales",
      x: 50,
      y: 76,
      color: "#2C6B6B",
      w: 300,
    },
    {
      id: "be",
      label: "◆ BREAK-EVEN",
      sub: "Frontera del back end",
      x: 50,
      y: 86,
      color: "#1A1A1A",
      w: 300,
      bold: true,
    },
    {
      id: "split",
      label: "PROFIT SPLIT 50 / 50",
      sub: "Back end amplio",
      x: 50,
      y: 93,
      color: "#8C2C5C",
      w: 300,
    },
  ];

  const cic = {
    x: 420,
    y: 64,
    label: "CIC (Ley 814)",
    sub: "57.75% ya recuperado\nvía DIAN",
    color: "#2C4A8C",
  };

  return (
    <div>
      <p
        style={{
          fontFamily: SS,
          fontSize: "22px",
          color: "#3D3220",
          lineHeight: 1.7,
          marginBottom: "28px",
        }}
      >
        Recorrido del dinero desde los ingresos brutos hasta el Producers Pool.
        Cada bloque representa un nivel del waterfall. El dinero "cae" de arriba
        hacia abajo — solo llega al siguiente nivel lo que sobra del anterior.
      </p>
      <div
        style={{
          display: "flex",
          gap: "32px",
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        {/* Main waterfall */}
        <div style={{ flex: "1", minWidth: "280px" }}>
          {nodes.map((n, i) => (
            <div key={n.id} style={{ position: "relative" }}>
              <div
                style={{
                  background: n.bold ? n.color : n.color + "18",
                  border: `2px solid ${n.color}`,
                  borderRadius: "4px",
                  padding: "12px 18px",
                  marginBottom: "4px",
                  borderLeft: `6px solid ${n.color}`,
                }}
              >
                <div
                  style={{
                    fontFamily: PD,
                    fontSize: "18px",
                    color: n.bold ? "#fff" : n.color,
                    fontWeight: n.bold ? "700" : "600",
                  }}
                >
                  {n.label}
                </div>
                <div
                  style={{
                    fontFamily: SS,
                    fontSize: "16px",
                    color: n.bold ? "#ddd" : "#4A3C2C",
                    marginTop: "2px",
                  }}
                >
                  {n.sub}
                </div>
              </div>
              {i < nodes.length - 1 && (
                <div
                  style={{
                    textAlign: "center",
                    lineHeight: "20px",
                    color: "#B0A080",
                    fontSize: "20px",
                    margin: "-2px 0",
                  }}
                >
                  ▼
                </div>
              )}
            </div>
          ))}
          {/* Final split */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
              marginTop: "4px",
            }}
          >
            {[
              { label: "PRODUCERS POOL", color: "#2C6B2C" },
              { label: "INVESTORS POOL", color: "#5C2C8C" },
            ].map((b) => (
              <div
                key={b.label}
                style={{
                  background: b.color + "18",
                  border: `2px solid ${b.color}`,
                  borderRadius: "4px",
                  padding: "12px 14px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: PD,
                    fontSize: "16px",
                    color: b.color,
                    fontWeight: "700",
                  }}
                >
                  {b.label}
                </div>
                <div
                  style={{ fontFamily: SS, fontSize: "15px", color: "#4A3C2C" }}
                >
                  50% del excedente
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CIC sidebar */}
        <div style={{ width: "220px", minWidth: "200px" }}>
          <div
            style={{
              background: "#EEF2FB",
              border: "2px solid #2C4A8C",
              borderRadius: "4px",
              padding: "16px",
              marginTop: "calc(64% - 20px)",
            }}
          >
            <div
              style={{
                fontFamily: PD,
                fontSize: "16px",
                color: "#2C4A8C",
                fontWeight: "700",
                marginBottom: "8px",
              }}
            >
              CIC — Ley 814
            </div>
            <div
              style={{
                fontFamily: SS,
                fontSize: "17px",
                color: "#1A1410",
                lineHeight: 1.6,
              }}
            >
              57.75% del equity ya fue recuperado por el inversionista{" "}
              <strong>vía DIAN</strong>, antes de que la película genere un solo
              peso.
            </div>
            <div
              style={{
                marginTop: "10px",
                padding: "8px 10px",
                background: "#2C4A8C22",
                borderRadius: "3px",
              }}
            >
              <div
                style={{ fontFamily: SS, fontSize: "15px", color: "#2C4A8C" }}
              >
                Solo el <strong>42.25%</strong> restante debe recuperarse por
                explotación comercial.
              </div>
            </div>
          </div>
          <div
            style={{
              background: "#FBF0EE",
              border: "2px solid #8C3A2C",
              borderRadius: "4px",
              padding: "16px",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                fontFamily: PD,
                fontSize: "16px",
                color: "#8C3A2C",
                fontWeight: "700",
                marginBottom: "8px",
              }}
            >
              CINA — Ley 1556
            </div>
            <div
              style={{
                fontFamily: SS,
                fontSize: "17px",
                color: "#1A1410",
                lineHeight: 1.6,
              }}
            >
              Cash rebate del ~30% para <strong>productores extranjeros</strong>{" "}
              que filman en Colombia. No es un mecanismo de inversión doméstica.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Timeline() {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <p
        style={{
          fontFamily: SS,
          fontSize: "22px",
          color: "#3D3220",
          lineHeight: 1.7,
          marginBottom: "28px",
        }}
      >
        El waterfall no es un evento único sino un proceso que se desarrolla a
        lo largo de años. Cada nivel del waterfall ocurre en un momento distinto
        de la vida del proyecto. Haga clic en cada fase para ver el detalle.
      </p>
      <div style={{ position: "relative" }}>
        {/* Vertical line */}
        <div
          style={{
            position: "absolute",
            left: "28px",
            top: "0",
            bottom: "0",
            width: "2px",
            background: "linear-gradient(to bottom, #2C4A8C, #2C6B2C)",
            zIndex: 0,
          }}
        />
        {timelineEvents.map((ev, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "24px",
              marginBottom: "8px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Dot */}
            <div
              style={{
                width: "58px",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "14px",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: ev.color,
                  border: "3px solid #F8F4EC",
                  flexShrink: 0,
                }}
              />
            </div>
            {/* Card */}
            <div
              style={{
                flex: 1,
                background: "#FDFAF5",
                border: `1px solid ${ev.color}44`,
                borderLeft: `4px solid ${ev.color}`,
                borderRadius: "4px",
                marginBottom: "8px",
                cursor: "pointer",
              }}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 18px",
                }}
              >
                <div>
                  <span
                    style={{
                      fontFamily: PD,
                      fontSize: "22px",
                      color: ev.color,
                      fontWeight: "700",
                    }}
                  >
                    {ev.phase}
                  </span>
                  <span
                    style={{
                      fontFamily: SS,
                      fontStyle: "italic",
                      fontSize: "18px",
                      color: "#8A7A62",
                      marginLeft: "14px",
                    }}
                  >
                    {ev.time}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#8A7A62",
                    transition: "transform 0.2s",
                    display: "inline-block",
                    transform: open === i ? "rotate(90deg)" : "none",
                  }}
                >
                  ▶
                </span>
              </div>
              {open === i && (
                <div style={{ padding: "0 18px 16px" }}>
                  {ev.items.map((item, j) => (
                    <div
                      key={j}
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "flex-start",
                        marginBottom: "8px",
                      }}
                    >
                      <span
                        style={{
                          color: ev.color,
                          fontSize: "18px",
                          marginTop: "2px",
                          flexShrink: 0,
                        }}
                      >
                        ◦
                      </span>
                      <span
                        style={{
                          fontFamily: SS,
                          fontSize: "20px",
                          color: "#221C12",
                          lineHeight: 1.6,
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Checklist() {
  const [checked, setChecked] = useState({});
  const toggle = (key) => setChecked((p) => ({ ...p, [key]: !p[key] }));
  const total = checklist.reduce((s, c) => s + c.items.length, 0);
  const done = Object.values(checked).filter(Boolean).length;
  return (
    <div>
      <p
        style={{
          fontFamily: SS,
          fontSize: "22px",
          color: "#3D3220",
          lineHeight: 1.7,
          marginBottom: "12px",
        }}
      >
        Puntos que el productor colombiano debe verificar antes de firmar. Úsela
        como guía de negociación y due diligence contractual.
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <div
          style={{
            flex: 1,
            height: "8px",
            background: "#E8E2D8",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "#2C6B2C",
              width: `${(done / total) * 100}%`,
              transition: "width 0.3s ease",
              borderRadius: "4px",
            }}
          />
        </div>
        <span
          style={{
            fontFamily: PD,
            fontSize: "18px",
            color: "#2C6B2C",
            whiteSpace: "nowrap",
          }}
        >
          {done} / {total} verificados
        </span>
      </div>
      {checklist.map((cat, ci) => (
        <div key={ci} style={{ marginBottom: "24px" }}>
          <div
            style={{
              fontFamily: PD,
              fontSize: "20px",
              color: "#1A1410",
              fontWeight: "700",
              padding: "10px 16px",
              background: "#F0EAE0",
              borderRadius: "4px",
              marginBottom: "8px",
              letterSpacing: "0.02em",
            }}
          >
            {cat.cat}
          </div>
          {cat.items.map((item, ii) => {
            const key = `${ci}-${ii}`;
            const done = checked[key];
            return (
              <div
                key={ii}
                onClick={() => toggle(key)}
                style={{
                  display: "flex",
                  gap: "14px",
                  alignItems: "flex-start",
                  padding: "12px 16px",
                  cursor: "pointer",
                  borderRadius: "4px",
                  background: done ? "#EEF8EE" : "transparent",
                  marginBottom: "4px",
                  border: done
                    ? "1px solid #2C6B2C44"
                    : "1px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    border: `2px solid ${done ? "#2C6B2C" : "#BFB49C"}`,
                    borderRadius: "3px",
                    background: done ? "#2C6B2C" : "transparent",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "2px",
                    transition: "all 0.15s",
                  }}
                >
                  {done && (
                    <span
                      style={{ color: "#fff", fontSize: "14px", lineHeight: 1 }}
                    >
                      ✓
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontFamily: SS,
                    fontSize: "20px",
                    color: done ? "#2C6B2C" : "#221C12",
                    lineHeight: 1.6,
                    textDecoration: done ? "line-through" : "none",
                    opacity: done ? 0.75 : 1,
                  }}
                >
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function Glosario() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(null);
  const filtered = glossary.filter((g) => {
    const t = (g.term || g.label || "").toLowerCase();
    return (
      t.includes(search.toLowerCase()) ||
      g.def.toLowerCase().includes(search.toLowerCase())
    );
  });
  return (
    <div>
      <p
        style={{
          fontFamily: SS,
          fontSize: "22px",
          color: "#3D3220",
          lineHeight: 1.7,
          marginBottom: "20px",
        }}
      >
        Definiciones de los términos técnicos utilizados en el waterfall y en
        los contratos de producción cinematográfica.
      </p>
      <div style={{ position: "relative", marginBottom: "24px" }}>
        <input
          type="text"
          placeholder="Buscar término..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px 12px 44px",
            fontFamily: SS,
            fontSize: "20px",
            border: "1px solid #BFB49C",
            borderRadius: "4px",
            background: "#FDFAF5",
            color: "#1A1410",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        <span
          style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "18px",
            color: "#8A7A62",
          }}
        >
          🔍
        </span>
      </div>
      <div
        style={{
          border: "1px solid #BFB49C",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        {filtered.map((g, i) => {
          const term = g.term || g.label || "";
          const isOpen = open === i;
          return (
            <div
              key={i}
              style={{ borderBottom: "1px solid #E8E2D8", cursor: "pointer" }}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 18px",
                  background: isOpen
                    ? "#F0EAE0"
                    : i % 2 === 0
                    ? "#FDFAF5"
                    : "#F8F4EC",
                }}
              >
                <span
                  style={{
                    fontFamily: PD,
                    fontSize: "22px",
                    color: "#1A1410",
                    fontWeight: "600",
                  }}
                >
                  {term}
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#8A7A62",
                    transition: "transform 0.2s",
                    display: "inline-block",
                    transform: isOpen ? "rotate(90deg)" : "none",
                  }}
                >
                  ▶
                </span>
              </div>
              {isOpen && (
                <div
                  style={{
                    padding: "14px 18px 18px",
                    background: "#fff",
                    borderTop: "1px solid #E8E2D8",
                  }}
                >
                  <p
                    style={{
                      fontFamily: SS,
                      fontSize: "21px",
                      color: "#221C12",
                      lineHeight: 1.75,
                      margin: 0,
                    }}
                  >
                    {g.def}
                  </p>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div
            style={{
              padding: "32px",
              textAlign: "center",
              fontFamily: SS,
              fontSize: "20px",
              color: "#8A7A62",
              fontStyle: "italic",
            }}
          >
            No se encontraron términos que coincidan con la búsqueda.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const tabs = [
  { id: "waterfall", label: "Waterfall", icon: "≋" },
  { id: "simulador", label: "Simulador", icon: "◎" },
  { id: "flujo", label: "Flujo de dinero", icon: "↓" },
  { id: "incentivos", label: "CIC / CINA / CoCrea", icon: "⊕" },
  { id: "timeline", label: "Línea de tiempo", icon: "◷" },
  { id: "checklist", label: "Checklist", icon: "✓" },
  { id: "glosario", label: "Glosario", icon: "A→" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("waterfall");

  return (
    <div
      style={{
        fontFamily: SS,
        background: "linear-gradient(160deg, #F8F4EC 0%, #F2EDE3 100%)",
        minHeight: "100vh",
        padding: "0 0 80px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,300;1,8..60,400&display=swap');
        * { box-sizing: border-box; }
        .wf-row { border-bottom: 1px solid #BFB49C; transition: background 0.2s ease; cursor: pointer; }
        .wf-row:hover { background: rgba(255,255,255,0.7); }
        .wf-row.active { background: #fff; }
        .wf-special-row { background: linear-gradient(135deg, #F0E8D4 0%, #E5DCC8 100%); border-top: 2px solid #B09A60; border-bottom: 2px solid #B09A60; }
        .wf-special-row:hover { background: linear-gradient(135deg, #F7F0E2 0%, #EDE5D2 100%) !important; }
        .wf-chevron { font-size: 14px; color: #8A7A62; transition: transform 0.25s ease; flex-shrink: 0; }
        .wf-chevron.open { transform: rotate(90deg); }
        .wf-stream-item { display: flex; gap: 0; margin-bottom: 9px; border-radius: 3px; border-left: 4px solid; overflow: hidden; }
        .wf-stream-label { font-family: 'Playfair Display', Georgia, serif; font-size: 20px; color: inherit; min-width: 220px; flex-shrink: 0; padding: 14px 16px; border-right: 1px solid #C8C0B0; line-height: 1.5; background: rgba(255,255,255,0.55); }
        .wf-stream-detail { font-family: 'Source Serif 4', Georgia, serif; font-size: 22px; color: #221C12; line-height: 1.75; padding: 14px 18px; background: #FDFAF5; }
        @media (max-width: 600px) {
          .wf-stream-item { flex-direction: column; }
          .wf-stream-label { min-width: unset; border-right: none; border-bottom: 1px solid #C8C0B0; }
          .tab-label { display: none; }
        }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .wf-animate { animation: slideDown 0.22s ease forwards; }
        input[type=range] { height: 6px; }
        input[type=text]:focus { border-color: #2C4A8C; box-shadow: 0 0 0 3px #2C4A8C22; }
      `}</style>

      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1A1410 0%, #2C1F14 100%)",
          padding: "40px 24px 32px",
          marginBottom: "0",
        }}
      >
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div
            style={{
              fontFamily: PD,
              fontSize: "12px",
              letterSpacing: "0.3em",
              color: "#8A7A62",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            Derecho del Entretenimiento · Financiación Cinematográfica · JGA
            Abogados
          </div>
          <h1
            style={{
              fontFamily: PD,
              fontSize: "clamp(28px, 5vw, 50px)",
              fontWeight: "normal",
              color: "#F8F4EC",
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
              margin: "0 0 12px",
            }}
          >
            El <em>Waterfall</em> de Ingresos
            <br />
            en la Producción Cinematográfica
          </h1>
          <p
            style={{
              fontFamily: SS,
              fontSize: "20px",
              color: "#B0A080",
              lineHeight: 1.6,
              margin: 0,
              maxWidth: "560px",
            }}
          >
            Estructura de distribución de ingresos, incentivos colombianos,
            simulador interactivo y herramientas para clase.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          background: "#221C12",
          borderBottom: "1px solid #3D3220",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            display: "flex",
            overflowX: "auto",
            gap: "0",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? "#F8F4EC" : "transparent",
                color: activeTab === tab.id ? "#1A1410" : "#B0A080",
                border: "none",
                cursor: "pointer",
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: "7px",
                fontFamily: PD,
                fontSize: "16px",
                whiteSpace: "nowrap",
                borderBottom:
                  activeTab === tab.id
                    ? "3px solid #2C4A8C"
                    : "3px solid transparent",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: "16px" }}>{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        style={{ maxWidth: "960px", margin: "0 auto", padding: "36px 20px 0" }}
      >
        {activeTab === "waterfall" && (
          <div>
            <div
              style={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
                marginBottom: "28px",
              }}
            >
              {[
                { label: "Ingresos Brutos", color: "#2C4A8C" },
                { label: "Distribución", color: "#8C3A2C" },
                { label: "Recoupment", color: "#5C2C8C" },
                { label: "Deferments", color: "#2C6B6B" },
                { label: "Break-Even", color: "#1A1A1A" },
                { label: "Back End / Pool", color: "#2C6B2C" },
              ].map((l) => (
                <div
                  key={l.label}
                  style={{ display: "flex", alignItems: "center", gap: "7px" }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: l.color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: PD,
                      fontSize: "14px",
                      letterSpacing: "0.1em",
                      color: "#5A5040",
                      textTransform: "uppercase",
                    }}
                  >
                    {l.label}
                  </span>
                </div>
              ))}
            </div>
            <WaterfallTable />
          </div>
        )}
        {activeTab === "simulador" && <Simulador />}
        {activeTab === "flujo" && <FlujoDinero />}
        {activeTab === "incentivos" && <ComparadorIncentivos />}
        {activeTab === "timeline" && <Timeline />}
        {activeTab === "checklist" && <Checklist />}
        {activeTab === "glosario" && <Glosario />}
      </div>

      {/* Footer */}
      <div
        style={{
          maxWidth: "960px",
          margin: "48px auto 0",
          padding: "0 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "16px",
          borderTop: "1px solid #BFB49C",
          paddingTop: "24px",
        }}
      >
        <p
          style={{
            fontFamily: SS,
            fontStyle: "italic",
            fontSize: "17px",
            color: "#7A6E5C",
            lineHeight: 1.65,
            maxWidth: "520px",
            margin: 0,
          }}
        >
          * La estructura exacta del waterfall varía según el tipo de proyecto,
          territorio y acuerdos de co-producción. En proyectos colombianos con
          CIC (Ley 814) o CoCrea, el orden y los montos de cada tramo pueden
          modificarse contractualmente.
        </p>
        <span
          style={{
            fontFamily: PD,
            fontSize: "16px",
            letterSpacing: "0.18em",
            color: "#8A7A62",
            textTransform: "uppercase",
          }}
        >
          JGA Abogados
        </span>
      </div>
    </div>
  );
}
