# Use a slim Python image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONUNBUFFERED True

# Set the working directory
WORKDIR /app

# Copy the dependency file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code and the model files
COPY app.py .
COPY model_files ./model_files

# Expose the port FastAPI runs on
ENV PORT 8080
EXPOSE 8080

# Command to run the application using Uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]