FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy FastAPI backend
COPY backend/app app/
COPY backend/main.py main.py

# Expose port
EXPOSE 8000

# Run the application
CMD ["python", "main.py"]
