#!/bin/bash

# Wait for n8n to be ready
echo "Waiting for n8n to be ready..."
sleep 30

# Import the workflow
echo "Importing workflow to n8n..."
curl -X POST \
  -H "Content-Type: application/json" \
  -u admin:admin \
  -d @workflow.json \
  http://n8n:5678/rest/workflows/import

echo "Workflow import completed!"
