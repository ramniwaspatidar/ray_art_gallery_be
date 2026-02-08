# Ray Gallery Backend API

A NestJS backend API service for the Ray Gallery application with file upload capabilities using AWS S3.

## Project Structure

```
src/
├── modules/
│   └── upload/            # File upload module
│       ├── dto/           # Upload DTOs
│       │   └── upload.dto.ts
│       ├── upload.controller.ts
│       ├── upload.service.ts
│       ├── s3.service.ts
│       └── upload.module.ts
├── app.controller.ts      # Main app controller
├── app.service.ts         # Main app service
├── app.module.ts          # Main app module
└── main.ts               # Application entry point
```

## Features

- **File Upload**: Single and multiple file upload to AWS S3
- **File Management**: Delete files, generate signed URLs, list files
- **Validation**: File type and size validation
- **CORS Support**: Configured for frontend integration
- **Environment Configuration**: Flexible configuration using environment variables

## API Endpoints

### Upload Module (`/api/upload`)

- `POST /api/upload/file` - Upload a single file
- `POST /api/upload/multiple` - Upload multiple files (up to 10)
- `DELETE /api/upload/file/:key` - Delete a file by key
- `GET /api/upload/signed-url/:key` - Get signed URL for a file
- `GET /api/upload/files?category=<category>` - List files (optionally by category)
- `GET /api/upload/health` - Health check endpoint

## Setup Instructions

### 1. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Update the `.env` file with your AWS credentials and other configuration:

```env
# Application Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=ray-gallery-bucket
```

### 2. Install Dependencies

```bash
npm install
```

### 3. AWS S3 Setup

1. Create an AWS S3 bucket
2. Configure bucket permissions for public read access (if needed)
3. Create IAM user with S3 permissions
4. Update environment variables with your AWS credentials

### 4. Run the Application

#### Development Mode
```bash
npm run start:dev
```

#### Production Mode
```bash
npm run build
npm run start:prod
```

The API will be available at: `http://localhost:3001/api`

## File Upload Usage

### Single File Upload

```bash
curl -X POST \
  http://localhost:3001/api/upload/file \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@/path/to/your/file.jpg' \
  -F 'filename=my-image' \
  -F 'category=gallery' \
  -F 'description=A beautiful image'
```

### Multiple File Upload

```bash
curl -X POST \
  http://localhost:3001/api/upload/multiple \
  -H 'Content-Type: multipart/form-data' \
  -F 'files=@/path/to/file1.jpg' \
  -F 'files=@/path/to/file2.jpg' \
  -F 'filename=batch-upload' \
  -F 'category=gallery'
```

## File Validation

- **Maximum file size**: 10MB
- **Allowed file types**:
  - Images: JPEG, PNG, GIF, WebP, SVG
  - Documents: PDF, Plain text
  - Videos: MP4, WebM

## Development

### Available Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode
- `npm run build` - Build the application
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Adding New Modules

To add new modules to the application:

1. Create a new directory under `src/modules/`
2. Follow the same structure as the upload module
3. Import and register the module in `app.module.ts`

## Security Considerations

- Configure proper CORS settings for production
- Use environment variables for sensitive configuration
- Implement authentication and authorization as needed
- Configure S3 bucket policies appropriately
- Validate and sanitize all user inputs

## Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Configure production database
3. Set up proper logging
4. Configure reverse proxy (nginx)
5. Set up SSL certificates
6. Configure monitoring and health checks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
