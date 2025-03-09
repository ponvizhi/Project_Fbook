# 📘 FBOOK - Angular Social Media App  

## 🌟 Project Overview  
FBOOK is a **social media application** built using **Angular**, where users can connect, post content, and manage their accounts. The app includes **admin and user roles**, allowing for different levels of access and functionalities.  

## 🛠️ Tech Stack  
- **Angular Version:** 16.2.14  
- **TypeScript Version:** 5.x.x (Check using `tsc -v`)  
- **Frontend:** Angular, TypeScript, HTML, CSS  
- **Backend:** JSON Server (For Local Development)  
- **Database:** JSON File (`db.json`)  
- **Authentication:** JSON Web Token (JWT) (To be implemented)  

## ✨ Features  
### ✅ Admin Functionalities  
- Reset/change passwords  
- Post advertisements  
- Manage user profiles  
- Hide user posts  

### ✅ User Functionalities  
- Register and log in  
- Reset/change passwords  
- Post messages, articles, and upload images  
- Send, accept, and reject friend requests  
- Manage personal profile  
- View posts from other users  

## 📂 Folder Structure  
```plaintext
Project_Fbook/
│-- src/
│   ├── app/
│   │   ├── components/   (UI Components)
│   │   ├── services/     (API Services)
│   │   ├── models/       (Interfaces & Data Models)
│   │   ├── pages/        (Feature Pages)
│-- assets/               (Static Files)
│-- environments/         (Configuration Files)
│-- db.json               (Local Database)
│-- README.md

🚀 Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/ponvizhi/Project_Fbook.git
cd Project_Fbook

2️⃣ Install Dependencies
npm install

3️⃣ Run JSON Server for Local Database
npx json-server --watch db.json --port 3000

4️⃣ Start the Angular App
ng serve