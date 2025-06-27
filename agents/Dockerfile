# Usa una imagen base oficial de Python
FROM python:3.11-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de requerimientos
COPY requirements.txt .

# Instala las dependencias necesarias
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código fuente
COPY . .

# Crea el directorio para almacenar la base de datos SQLite
RUN mkdir -p tmp

# Expone el puerto 7777
EXPOSE 7777

# Comando para iniciar la app en el puerto 7777
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7777", "--reload"]
