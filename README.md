# Auto-Scaling with Load Balancing on AWS

I am creating this repository to help you understand how to set up Auto Scaling with Load Balancing and their important components. This guide will walk you through all the steps, including creating an EC2 instance, setting up load balancing, and configuring auto-scaling for your AWS environment.


## EC2 Instance Setup


### Step 1: Create an EC2 Instance

Create an EC2 instance in AWS. Once the instance is created, follow these steps to set up the server:

1. **Update the server:**
   ```bash
   sudo apt update -y  # For Ubuntu/Debian-based systems
   sudo yum update -y  # For RHEL/CentOS-based systems

2. **Clone this repository:**
   ```bash
   git clone https://github.com/rohankamble103/Auto-scalling-.git
   
3. **Install Node.js, NPM, and PM2:**
* For Node.js and NPM:
   ```bash
   sudo apt install nodejs -y  # Ubuntu/Debian
   sudo yum install nodejs -y  # RHEL/CentOS
   sudo apt install npm -y     # Ubuntu/Debian
   sudo yum install npm -y     # RHEL/CentOS
* Install PM2 globally:
   ```bash
   npm install pm2 -g

4. **Install required dependencies:**
* Run the following command to install project dependencies:
  ```bash
  npm i

5. **Install Nginx:**
* Install Nginx using:
  ```bash
  sudo apt install nginx -y  # Ubuntu/Debian
  sudo yum install nginx -y  # RHEL/CentOS

6. **Verify Nginx is running:**
   ```bash
   sudo systemctl status nginx

7. **Enable Nginx to start on boot:**
   ```bash
   sudo systemctl enable nginx


### Step 2: Setup PM2 to Run on Reboot

To make sure your application runs automatically after a reboot, use PM2:

1. **Run the following command:**
   ```bash
   pm2 startup

PM2 will provide a command to execute, similar to:

   ```bash
   sudo env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
   ```
2. **Start the app using PM2:**
   ```bash
   pm2 start server.js


### Step 3: Configure Nginx to Serve Your Application

Now, configure Nginx to serve your Node.js backend running on port 3000. Modify the location / block in the Nginx configuration file:

1. **Open the Nginx configuration file:**
   ```bash
   sudo nano /etc/nginx/sites-available/default

2. **Replace the existing location / block with:**
   ```bash
   location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    }


### Step 4: Verify Setup

To verify everything is set up correctly, try accessing the public IP address of the EC2 instance. You should see your application output.

![Screenshot 2025-04-03 161654](https://github.com/user-attachments/assets/e498b83f-8ff5-45e9-be66-87317d7c048b)


## Create an AMI (Amazon Machine Image)


Once you’ve configured the EC2 instance, create an AMI to use for scaling. Follow these steps:
  1. Go to the AWS Console, select your EC2 instance.
  2. Click on Actions > Image & Templates > Create Image.
  3. Wait until the image is created and saved, then verify the creation in the AMI section.

![Screenshot 2025-04-03 162148](https://github.com/user-attachments/assets/35590ba3-6178-4daf-8737-621911736f3e)

Once the image is ready, you can terminate the instance.

![Screenshot 2025-04-03 162303](https://github.com/user-attachments/assets/44aa7c7f-e7df-4933-980c-151ec3feb012)


## Target Group Configuration


  1. Go to the Target Groups section in the AWS Console and create a new target group.
  2. Enter the port (e.g., 80) and select the VPC where the instances will be launched.
  3. Do not register any targets at this point, then click Create Target Group.

![Screenshot 2025-04-03 163004](https://github.com/user-attachments/assets/4baee2d3-c18d-451e-b0bd-48dd1779f515)


## Load Balancer Setup

  
  1. Go to the Load Balancers section in the AWS Console and click Create Load Balancer.
  2. Choose Application Load Balancer and select the public subnets in your VPC.
  3. Choose a security group with port 80 allowed in the inbound rule.
  4. Select the target group you created earlier and specify port 80.
  5. Make sure to choose an "Internet-facing" load balancer, then click Create Load Balancer.


## Launch Template Configuration

  
  1. Go to the Launch Templates section and create a new launch template using the AMI you created earlier.
  2. Customize the security group, key pair, and other settings.
  3. Click Create Launch Template.


## Auto Scaling Group

  
  1. Go to the Auto Scaling Groups section and click Create Auto Scaling Group.
  2. Enter a name and select the launch template you created.
  3. Choose the VPC and availability zones where the instances will be deployed.
  4. Under Load Balancing, select the load balancer and target group you configured earlier.
  5. Set the Desired, Minimum, and Maximum instance counts.
  6. Configure automatic scaling using the Target Tracking Scaling Policy, where you can set the CPU utilization limit to scale up the infrastructure.

![Screenshot 2025-04-03 165346](https://github.com/user-attachments/assets/dc274f72-c5c4-4823-94ab-0664da63714a)

Once the auto-scaling group is created, the load balancer will automatically register the instances. To verify, go to the Load Balancer DNS name and try accessing the application.

![Screenshot 2025-04-03 161654](https://github.com/user-attachments/assets/7c2663d2-e52d-4eed-bf7e-19749bb64965)


## Stress Test the Setup


To verify the auto-scaling works, perform a stress test on the application:
  1. Install a stress tool like ab (Apache Bench).
  2. Run the following command to simulate a heavy load:
     ```bash
     ab -n 100000 -c 700 custom-430046237.us-east-1.elb.amazonaws.com

  This will generate traffic to the URL, increasing CPU utilization, and causing the auto-scaling group to scale the instances. After a while, check the number of instances in the target group, and you should see more instances.


## Final Test


After the scaling is triggered, reload the load balancer's DNS name. Each time you refresh, you'll see the output from different instances, confirming that auto-scaling and load balancing are functioning properly.

![Screenshot 2025-04-03 161654](https://github.com/user-attachments/assets/55dcd5b8-a31d-4fc6-835b-c668e88b3528)
