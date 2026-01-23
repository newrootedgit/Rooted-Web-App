import json
import os
import boto3
from awscrt import io, mqtt
from awsiot import mqtt_connection_builder

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DEVICE_FILE = os.path.join(SCRIPT_DIR, 'device_config.json')
CERTS_DIR = os.path.join(SCRIPT_DIR, 'certs')

def get_device_id():
    """Load device_id from config"""
    with open(DEVICE_FILE, 'r') as f:
        config = json.load(f)
    return config['device_id']

def register_with_aws_iot():
    """Auto-register device with AWS IoT Core"""
    device_id = get_device_id()
    thing_name = device_id
    
    # Check if already registered
    cert_path = os.path.join(CERTS_DIR, 'certificate.pem.crt')
    if os.path.exists(cert_path):
        print(f"Device {device_id} already registered")
        return thing_name
    
    # Create Thing and certificates
    iot_client = boto3.client('iot', region_name=os.getenv('AWS_REGION', 'us-west-2'))
    
    try:
        # Create Thing
        iot_client.create_thing(thingName=thing_name)
        print(f"Created Thing: {thing_name}")
        
        # Create certificates
        cert_response = iot_client.create_keys_and_certificate(setAsActive=True)
        
        # Save certificates
        os.makedirs(CERTS_DIR, exist_ok=True)
        
        with open(os.path.join(CERTS_DIR, 'certificate.pem.crt'), 'w') as f:
            f.write(cert_response['certificatePem'])
        
        with open(os.path.join(CERTS_DIR, 'private.pem.key'), 'w') as f:
            f.write(cert_response['keyPair']['PrivateKey'])
        
        # Set proper permissions
        os.chmod(os.path.join(CERTS_DIR, 'private.pem.key'), 0o600)
        
        # Attach policy
        policy_name = os.getenv('AWS_IOT_POLICY_NAME')
        iot_client.attach_policy(
            policyName=policy_name,
            target=cert_response['certificateArn']
        )
        
        # Attach certificate to Thing
        iot_client.attach_thing_principal(
            thingName=thing_name,
            principal=cert_response['certificateArn']
        )
        
        print(f"Successfully registered {thing_name} with AWS IoT")
        return thing_name
        
    except Exception as e:
        print(f"Error registering with AWS IoT: {e}")
        raise

def connect_to_aws_iot():
    """Establish persistent MQTT connection to AWS IoT"""
    device_id = get_device_id()
    endpoint = os.getenv('AWS_IOT_ENDPOINT')
    cert_path = os.path.join(CERTS_DIR, 'certificate.pem.crt')
    key_path = os.path.join(CERTS_DIR, 'private.pem.key')
    ca_path = os.path.join(CERTS_DIR, 'AmazonRootCA1.pem')
    
    # Build MQTT connection
    mqtt_connection = mqtt_connection_builder.mtls_from_path(
        endpoint=endpoint,
        cert_filepath=cert_path,
        pri_key_filepath=key_path,
        ca_filepath=ca_path,
        client_id=device_id,
        clean_session=False,
        keep_alive_secs=60,
    )
    
    # Connect
    print(f"Connecting to AWS IoT as {device_id}...")
    connect_future = mqtt_connection.connect()
    connect_future.result()
    print(f"Connected to AWS IoT!")
    
    return mqtt_connection
