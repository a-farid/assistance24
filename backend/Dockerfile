FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# SYSTEM LAYER: Install compilation tools required for building C/Rust wheels
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# DEPENDENCY LAYER: Upgrade pip and compile requirements
RUN pip install --no-cache-dir --upgrade pip
COPY ./requirements.txt /app
RUN pip install --no-cache-dir -r requirements.txt

# APPLICATION LAYER: Copy source code
COPY . /app

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]