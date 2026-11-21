# The Python AI gateway. It belongs on the private network only: give this service no public domain. Build from the repository root.
FROM python:3.12-slim
WORKDIR /app
COPY backend/python/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/python ./
# "::" listens on IPv6 and IPv4, which covers the host's private network either way.
ENV AI_HOST=:: AI_PORT=8010
USER nobody
CMD ["python", "main.py"]
