#!/bin/bash

# Fix line endings for Windows compatibility
find . -name "*.sh" -exec sed -i 's/\r$//' {} \;

# Ask user for Raspberry Pi IP address and login username
read -p "Enter the Raspberry Pi IP address or hostname (default: 192.168.10.1): " PI_IP_ADDRESS
PI_IP_ADDRESS=${PI_IP_ADDRESS:-192.168.10.1}

# Test connectivity
echo "Testing connectivity to $PI_IP_ADDRESS..."
ping -c 2 "$PI_IP_ADDRESS"
if [ $? -ne 0 ]; then
    echo "Unable to reach $PI_IP_ADDRESS. Please check the connection and try again."
    exit 1
fi

read -p "Enter the Raspberry Pi login username (default: rooted): " PI_LOGIN_USERNAME
PI_LOGIN_USERNAME=${PI_LOGIN_USERNAME:-rooted}

# Ask for password
read -s -p "Enter the Raspberry Pi login password: " PI_LOGIN_PASSWORD
echo


# Execute setup-nm and setup-captive-portal scripts on Raspberry Pi
echo "Executing setup scripts on Raspberry Pi..."
sshpass -p "$PI_LOGIN_PASSWORD" ssh -o StrictHostKeyChecking=no "${PI_LOGIN_USERNAME}@${PI_IP_ADDRESS}" "
    echo 'Running NetworkManager setup...'
    echo '$PI_LOGIN_PASSWORD' | sudo -S bash /opt/rootedpi/wifi-setup/setup-nm.sh
    if [ \$? -ne 0 ]; then
        echo 'NetworkManager setup failed!'
        exit 1
    fi
"

if [ $? -eq 0 ]; then
    echo "======================================"
    echo "  Deploy to Raspberry Pi Two Complete!"
    echo "======================================"
    echo "Next Steps:"
    echo "  1. Connect to the Captive Portal WiFi SSID: Rooted-Robotics-Setup"
    echo "  2. Open a web browser and you should be redirected to the captive portal login page"
    echo "  3. Use the WiFi Manager to connect to your desired WiFi"
    echo "======================================"
else
    echo "Deployment failed! Check the error messages above."
    exit 1
fi