# 🚀 DevOps Microservices Deployment on AWS EKS

This project demonstrates a **complete production-style DevOps deployment** of a microservices application using:

* **AWS EKS (Kubernetes)**
* **Helm Charts**
* **kubectl manifests**
* **AWS Application Load Balancer (ALB Ingress)**
* **Amazon EBS Persistent Storage**
* **Horizontal Pod Autoscaling (HPA)**
* **Amazon ECR**
* **GitHub Actions CI/CD**

The goal of this project is to demonstrate **real-world DevOps practices for deploying scalable microservices on Kubernetes.**

---

# 🏗 Architecture Overview

```
Users
   │
   ▼
AWS Application Load Balancer
   │
   ▼
Kubernetes Ingress Controller
   │
   ▼
Kubernetes Services
   │
   ├── Frontend Service
   ├── User Service
   ├── Order Service
   │
   ▼
MySQL Database
   │
   ▼
Amazon EBS Persistent Volume
```

---

# 📦 Microservices

| Service       | Description        |
| ------------- | ------------------ |
| Frontend      | Web UI             |
| User Service  | Handles user APIs  |
| Order Service | Handles order APIs |
| MySQL         | Database           |

---

# 📁 Project Structure

```
devops-k8s-microservice

.github/workflows
   deploy.yml               # CI/CD Pipeline

infrastructure
   eks-cluster.yaml         # EKS cluster configuration

k8s
 ├── base
 │    ├── frontend
 │    ├── user-service
 │    ├── order-service
 │    └── mysql
 │
 └── eks
      ingress-alb.yaml

microservices                # Helm Chart
 ├── templates
 ├── values.yaml
 └── Chart.yaml

iam-policy.json
ebs-iam-policy.json
```

---

# ⚙️ Prerequisites

Install required tools:

```
awscli
kubectl
helm
eksctl
docker
```

Verify installation:

```
aws --version
kubectl version --client
helm version
eksctl version
docker --version
```

---

# ☁️ Configure AWS

```
aws configure
```

Enter:

```
AWS Access Key
AWS Secret Key
Region: ap-south-1
```

---

# 🚀 Create EKS Cluster

Cluster configuration file:

```
infrastructure/eks-cluster.yaml
```

Create cluster:

```
eksctl create cluster -f infrastructure/eks-cluster.yaml
```

Verify nodes:

```
kubectl get nodes
```

---

# 🔐 Enable IAM OIDC Provider

Required for ALB and EBS controllers.

```
eksctl utils associate-iam-oidc-provider \
--region ap-south-1 \
--cluster devops-microservices \
--approve
```

---

# 💾 Install EBS CSI Driver (Persistent Storage)

Required for MySQL persistent storage.

```
eksctl create addon \
--name aws-ebs-csi-driver \
--cluster devops-microservices \
--region ap-south-1
```

Verify:

```
kubectl get pods -n kube-system | grep ebs
```

---

# 🌐 Install AWS Load Balancer Controller

### Create IAM Policy

```
aws iam create-policy \
--policy-name AWSLoadBalancerControllerIAMPolicy \
--policy-document file://iam-policy.json
```

---

### Create IAM Service Account

```
eksctl create iamserviceaccount \
--cluster devops-microservices \
--namespace kube-system \
--name aws-load-balancer-controller \
--attach-policy-arn arn:aws:iam::<ACCOUNT_ID>:policy/AWSLoadBalancerControllerIAMPolicy \
--approve
```

---

### Install Controller

Add Helm repo:

```
helm repo add eks https://aws.github.io/eks-charts
helm repo update
```

Install controller:

```
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
-n kube-system \
--set clusterName=devops-microservices \
--set serviceAccount.create=false \
--set serviceAccount.name=aws-load-balancer-controller
```

Verify:

```
kubectl get pods -n kube-system
```

---

# 📊 Install Metrics Server (Required for HPA)

Horizontal Pod Autoscaling requires Metrics Server.

```
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

Verify:

```
kubectl get pods -n kube-system | grep metrics
```

---

# 🚀 Deployment Method 1 — Using kubectl

Deploy Kubernetes manifests:

```
kubectl apply -k k8s/base
kubectl apply -k k8s/eks
```

Verify deployment:

```
kubectl get pods
kubectl get svc
kubectl get ingress
```

---

# 🚀 Deployment Method 2 — Using Helm (Recommended)

Deploy using Helm:

```
helm upgrade --install microservices ./microservices
```

Verify:

```
kubectl get pods
kubectl get svc
kubectl get ingress
```

---

# 📈 Horizontal Pod Autoscaling

This project includes **HPA for the user-service**.

File locations:

```
k8s/base/user-service/hpa.yaml
microservices/templates/user-hpa.yaml
```

HPA automatically scales pods based on **CPU usage**.

Check autoscaler:

```
kubectl get hpa
```

Example output:

```
NAME            REFERENCE                     TARGETS   MINPODS   MAXPODS
user-service    Deployment/user-service       30%/70%   2         10
```

---

# 🐳 Build and Push Docker Images

Login to ECR:

```
aws ecr get-login-password \
--region ap-south-1 | docker login \
--username AWS \
--password-stdin <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com
```

Build images:

```
docker build -t frontend ./frontend
docker build -t user-service ./user-service
docker build -t order-service ./order-service
```

Push to ECR.

---

# 🔄 CI/CD Pipeline

GitHub Actions automatically:

1️⃣ Build Docker images
2️⃣ Push images to Amazon ECR
3️⃣ Deploy to EKS using Helm
4️⃣ Rollback automatically if deployment fails

Pipeline file:

```
.github/workflows/deploy.yml
```

Trigger deployment:

```
git push origin main
```

---

# 📊 Verify Deployment

Check pods:

```
kubectl get pods
```

Check services:

```
kubectl get svc
```

Check ingress:

```
kubectl get ingress
```

Open the **ALB DNS address** in the browser.

---

# 💾 Persistent Storage

MySQL uses **Amazon EBS Persistent Volumes**.

Check storage:

```
kubectl get pvc
kubectl get pv
```

---

# 🛠 Useful Commands

Check logs:

```
kubectl logs <pod-name>
```

Restart deployment:

```
kubectl rollout restart deployment/frontend
```

Check autoscaling:

```
kubectl get hpa
```

---

# 🧩 Troubleshooting

### ALB not created

```
kubectl describe ingress
```

### PVC pending

```
kubectl describe pvc
```

### Pods failing

```
kubectl logs <pod>
```

---

# 📈 Future Improvements

Possible enhancements:

* Prometheus Monitoring
* Grafana Dashboards
* ArgoCD GitOps
* Canary Deployments
* Blue/Green Deployments

---

# 👨‍💻 Author

DevOps Kubernetes Microservices Project

Built to demonstrate **production-ready DevOps architecture using AWS EKS, Helm, ALB Ingress, and CI/CD automation.**
