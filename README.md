# PDF Collaborator

A modern web application for uploading, sharing, and collaborating on PDF documents. Users can securely upload PDFs, share them with others, and engage in real-time discussions through comments.


## Features
### User Authentication
- User registration and login
- Secure authentication using JWT tokens
- Protected routes for authenticated users

### PDF Management
- Upload PDF files (up to 10MB)
- View list of uploaded PDFs in dashboard
- Secure storage using AWS S3
- View PDFs directly in the browser

### Sharing & Collaboration
- Generate unique shareable links for PDFs
- Share PDFs with multiple users via email
- Real-time commenting system
- View comments from all collaborators
- Anonymous commenting support for shared links


## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Axios, React Router, React-PDF
- **Backend:** Node.js, Express, MongoDB (Mongoose), AWS S3 (for file storage), JWT Auth, Multer, Nodemailer
- **Deployment:** Vercel, Render


## Usage
1. **Register** for a new account or **log in**.
2. **Upload** a PDF from the dashboard.
3. **Share** your PDF with others by entering their email addresses.
4. **View** and **comment** on PDFs you have access to.
5. **Log out** securely when done.
