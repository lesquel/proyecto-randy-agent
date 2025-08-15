from fastapi.middleware.cors import CORSMiddleware
from agno.agent import Agent
from agno.models.groq import Groq
from agno.playground import Playground
from agno.storage.sqlite import SqliteStorage
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.tools.yfinance import YFinanceTools

# Shared model id to avoid duplication
GROQ_MODEL_ID = "llama-3.3-70b-versatile"

agent_storage: str = "tmp/agents.db"

web_agent = Agent(
    name="Web Agent",
    model=Groq(id=GROQ_MODEL_ID),
    tools=[DuckDuckGoTools()],
    instructions=["Always include sources"],
    storage=SqliteStorage(table_name="web_agent", db_file=agent_storage),
    add_datetime_to_instructions=True,
    add_history_to_messages=True,
    num_history_responses=5,
    markdown=True,
)

finance_agent = Agent(
    name="Finance Agent",
    model=Groq(id=GROQ_MODEL_ID),
    tools=[YFinanceTools(
        stock_price=True,
        analyst_recommendations=True,
        company_info=True,
        company_news=True
    )],
    instructions=["Always use tables to display data"],
    storage=SqliteStorage(table_name="finance_agent", db_file=agent_storage),
    add_datetime_to_instructions=True,
    add_history_to_messages=True,
    num_history_responses=5,
    markdown=True,
)

# --- New specialist agents ---

medical_agent = Agent(
    name="Agente Médico",
    model=Groq(id=GROQ_MODEL_ID),
    tools=[DuckDuckGoTools()],
    instructions=[
        # Safety and scope
        "Responde en español con información médica educativa y general.",
        "No realices diagnósticos ni prescribas tratamientos. Agrega siempre una advertencia de que no sustituyes a un profesional de la salud.",
        "Cuando sea relevante, indica signos de alarma que requieren atención médica inmediata.",
        "Incluye fuentes confiables y recientes (OMS/WHO, CDC, revistas revisadas por pares).",
    ],
    storage=SqliteStorage(table_name="medical_agent", db_file=agent_storage),
    add_datetime_to_instructions=True,
    add_history_to_messages=True,
    num_history_responses=5,
    markdown=True,
)

psychology_agent = Agent(
    name="Agente Psicología",
    model=Groq(id=GROQ_MODEL_ID),
    tools=[DuckDuckGoTools()],
    instructions=[
        "Responde en español con psicoeducación basada en evidencia.",
        "No realices diagnósticos ni reemplaces terapia. Indica claramente que no es asesoramiento clínico.",
        "Si detectas riesgo (p. ej., ideación suicida), sugiere contactar líneas de ayuda locales o servicios de emergencia.",
        "Incluye fuentes fiables (APA, OMS, NICE, artículos revisados por pares).",
    ],
    storage=SqliteStorage(table_name="psychology_agent", db_file=agent_storage),
    add_datetime_to_instructions=True,
    add_history_to_messages=True,
    num_history_responses=5,
    markdown=True,
)

architecture_agent = Agent(
    name="Agente Arquitectura",
    model=Groq(id=GROQ_MODEL_ID),
    tools=[DuckDuckGoTools()],
    instructions=[
        "Responde en español con recomendaciones de diseño arquitectónico, materiales y normativas de forma general.",
        "Aclara que los códigos de construcción varían por país/ciudad y se requiere un profesional colegiado para planos y permisos.",
        "Incluye referencias y fuentes cuando menciones estándares o normativas.",
    ],
    storage=SqliteStorage(table_name="architecture_agent", db_file=agent_storage),
    add_datetime_to_instructions=True,
    add_history_to_messages=True,
    num_history_responses=5,
    markdown=True,
)

legal_agent = Agent(
    name="Agente Legal",
    model=Groq(id=GROQ_MODEL_ID),
    tools=[DuckDuckGoTools()],
    instructions=[
        "Responde en español con información legal general y educativa.",
        "No brindes asesoría legal. Indica que las leyes varían por jurisdicción y se debe consultar a un abogado colegiado.",
        "Incluye fuentes y referencias legales públicas cuando sea posible.",
    ],
    storage=SqliteStorage(table_name="legal_agent", db_file=agent_storage),
    add_datetime_to_instructions=True,
    add_history_to_messages=True,
    num_history_responses=5,
    markdown=True,
)

webdev_agent = Agent(
    name="Agente Programación Web",
    model=Groq(id=GROQ_MODEL_ID),
    tools=[DuckDuckGoTools()],
    instructions=[
        "Responde en español con ejemplos de código claros y listos para ejecutar.",
        "Prefiere soluciones modernas (TypeScript, React/Next.js, Node) y explica paso a paso cuando corresponda.",
        "Incluye enlaces a documentación oficial y mejores prácticas.",
        "Cuando muestres código, usa bloques separados por secciones y agrega notas de instalación si aplica.",
    ],
    storage=SqliteStorage(table_name="webdev_agent", db_file=agent_storage),
    add_datetime_to_instructions=True,
    add_history_to_messages=True,
    num_history_responses=5,
    markdown=True,
)

playground_app = Playground(
    agents=[
        web_agent,
        finance_agent,
        medical_agent,
        psychology_agent,
        architecture_agent,
        legal_agent,
        webdev_agent,
    ]
)
app = playground_app.get_app()

# ✅ Permitir cualquier origen CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ En producción, es recomendable restringir esto
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    playground_app.serve("main:app", reload=True)
