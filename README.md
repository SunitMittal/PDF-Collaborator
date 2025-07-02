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


## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)
- AWS S3 bucket and credentials


### 1. Clone the Repository

```bash
git clone https://github.com/your-username/pdf-collaborator.git
cd pdf-collaborator
```

---

### 2. Backend Setup
```bash
cd backend
npm install
```

#### Create a `.env` file in the `backend/` directory with the following:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET_NAME=your_s3_bucket_name
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

#### Start the backend server
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

#### Start the frontend development server
```bash
npm run dev
```

## Usage

1. **Register** for a new account or **log in**.
2. **Upload** a PDF from the dashboard.
3. **Share** your PDF with others by entering their email addresses.
4. **View** and **comment** on PDFs you have access to.
5. **Log out** securely when done.


## Project Structure

```
pdf-collaborator/
  backend/      # Express API, MongoDB models, AWS S3 integration
  frontend/     # React app, Tailwind CSS, PDF viewer, API integration
```


## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change. After that:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the [MIT](LICENSE) - see the LICENSE file for details