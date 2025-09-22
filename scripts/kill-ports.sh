#!/bin/bash

# Function to safely terminate processes on a port
kill_port() {
    local port=$1
    local pids=$(lsof -ti :$port)
    
    if [ -n "$pids" ]; then
        echo "Found processes running on port $port: $pids"
        
        # Try SIGTERM first
        echo "$pids" | xargs kill -TERM 2>/dev/null
        
        # Wait 2 seconds, then use SIGKILL if still running
        sleep 2
        local remaining_pids=$(lsof -ti :$port)
        if [ -n "$remaining_pids" ]; then
            echo "Force killing: $remaining_pids"
            echo "$remaining_pids" | xargs kill -KILL 2>/dev/null
        fi
        
        echo "Port $port cleaned up"
    else
        echo "Port $port is not in use"
    fi
}

# Check usage
if [ $# -eq 0 ]; then
    echo "Usage: $0 <port_number> [port_number2] [port_number3] ..."
    echo "Example: $0 3000 4000"
    exit 1
fi

# Clean up all ports provided as arguments
for port in "$@"; do
    if [[ "$port" =~ ^[0-9]+$ ]]; then
        kill_port "$port"
    else
        echo "Warning: '$port' is not a valid port number."
    fi
done

echo "Port cleanup completed"